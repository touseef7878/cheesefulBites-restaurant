import { useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

/** Compatibility hook for existing storefront components, now backed only by Supabase Auth. */
export function useAuth(options?: UseAuthOptions) {
  const auth = useSupabaseAuth();
  const { redirectOnUnauthenticated = false, redirectPath = "/profile" } = options ?? {};

  useEffect(() => {
    if (!redirectOnUnauthenticated || auth.loading || auth.user || typeof window === "undefined") return;
    if (window.location.pathname !== redirectPath) window.location.assign(redirectPath);
  }, [auth.loading, auth.user, redirectOnUnauthenticated, redirectPath]);

  return {
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    logout: auth.signOut,
    refresh: auth.refresh,
  };
}
