import type { Session } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type CheesefulUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: "customer" | "admin";
};

type SignUpInput = { name: string; email: string; password: string };
type SignInInput = { email: string; password: string };
type AuthResult = { user: CheesefulUser | null; error: Error | null };

type SupabaseAuthState = {
  user: CheesefulUser | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  signIn: (input: SignInInput) => Promise<AuthResult>;
  signUp: (input: SignUpInput) => Promise<{ user: CheesefulUser | null; confirmationRequired: boolean; error: Error | null }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const SupabaseAuthContext = createContext<SupabaseAuthState | null>(null);

function fallbackName(email: string | null | undefined) {
  return email?.split("@")[0] || "Cheeseful guest";
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<CheesefulUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProfile = useCallback(async (activeSession: Session | null): Promise<CheesefulUser | null> => {
    if (!activeSession?.user) {
      setUser(null);
      return null;
    }

    const authUser = activeSession.user;
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, display_name, role")
      .eq("id", authUser.id)
      .maybeSingle();

    if (profileError) {
      setError(profileError);
      const fallbackUser = {
        id: authUser.id,
        email: authUser.email ?? null,
        name: (authUser.user_metadata.full_name as string | undefined) ?? fallbackName(authUser.email),
        role: "customer",
      } satisfies CheesefulUser;
      setUser(fallbackUser);
      return fallbackUser;
    }

    setError(null);
    const normalizedUser = {
      id: authUser.id,
      email: data?.email ?? authUser.email ?? null,
      name: data?.display_name ?? (authUser.user_metadata.full_name as string | undefined) ?? fallbackName(authUser.email),
      role: data?.role === "admin" ? "admin" : "customer",
    } satisfies CheesefulUser;
    setUser(normalizedUser);
    return normalizedUser;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) setError(sessionError);
    setSession(data.session);
    await loadProfile(data.session);
    setLoading(false);
  }, [loadProfile]);

  useEffect(() => {
    void refresh();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void loadProfile(nextSession).finally(() => setLoading(false));
    });
    return () => listener.subscription.unsubscribe();
  }, [loadProfile, refresh]);

  const signIn = useCallback(async ({ email, password }: SignInInput) => {
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) return { user: null, error: signInError };
    setSession(data.session);
    const signedInUser = await loadProfile(data.session);
    return { user: signedInUser, error: null };
  }, [loadProfile]);

  const signUp = useCallback(async ({ name, email, password }: SignUpInput) => {
    const emailRedirectTo = typeof window === "undefined" ? undefined : window.location.origin;
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo,
      },
    });
    if (signUpError) return { user: null, confirmationRequired: false, error: signUpError };
    setSession(data.session);
    const signedUpUser = await loadProfile(data.session);
    return { user: signedUpUser, confirmationRequired: !data.session, error: null };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
    setSession(null);
    setUser(null);
  }, []);

  const value = useMemo<SupabaseAuthState>(() => ({
    user,
    session,
    loading,
    error,
    isAuthenticated: Boolean(session && user),
    signIn,
    signUp,
    signOut,
    refresh,
  }), [error, loading, refresh, session, signIn, signOut, signUp, user]);

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>;
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (!context) throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider");
  return context;
}
