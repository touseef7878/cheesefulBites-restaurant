import { RecaptchaVerifier, onAuthStateChanged, signInWithEmailAndPassword, signInWithPhoneNumber, signInWithPopup, createUserWithEmailAndPassword, signOut, type ConfirmationResult, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { firebaseAuth, firebaseConfigured, googleProvider } from "@/lib/firebase";

export type FirebaseRole = "customer" | "admin";

type FirebaseAuthContextValue = {
  user: User | null;
  role: FirebaseRole;
  loading: boolean;
  configured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
  sendPhoneCode: (phone: string) => Promise<void>;
  confirmPhoneCode: (code: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const FirebaseAuthContext = createContext<FirebaseAuthContextValue | null>(null);
let phoneConfirmation: ConfirmationResult | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<FirebaseRole>("customer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseAuth) { setLoading(false); return; }
    return onAuthStateChanged(firebaseAuth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        const token = await nextUser.getIdTokenResult();
        setRole(token.claims.admin === true ? "admin" : "customer");
      } else {
        setRole("customer");
      }
      setLoading(false);
    });
  }, []);

  const value = useMemo<FirebaseAuthContextValue>(() => ({
    user,
    role,
    loading,
    configured: firebaseConfigured,
    signInWithGoogle: async () => {
      if (!firebaseAuth) throw new Error("Firebase is not configured.");
      await signInWithPopup(firebaseAuth, googleProvider);
    },
    signInWithEmail: async (email, password) => {
      if (!firebaseAuth) throw new Error("Firebase is not configured.");
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    },
    createAccount: async (email, password) => {
      if (!firebaseAuth) throw new Error("Firebase is not configured.");
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
    },
    sendPhoneCode: async (phone) => {
      if (!firebaseAuth) throw new Error("Firebase is not configured.");
      const node = document.getElementById("firebase-phone-recaptcha");
      if (!node) throw new Error("Phone verification is not ready. Please try again.");
      if (!recaptchaVerifier) recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, node, { size: "invisible" });
      phoneConfirmation = await signInWithPhoneNumber(firebaseAuth, phone, recaptchaVerifier);
    },
    confirmPhoneCode: async (code) => {
      if (!phoneConfirmation) throw new Error("Request a phone verification code first.");
      await phoneConfirmation.confirm(code);
      phoneConfirmation = null;
    },
    signOutUser: async () => { if (firebaseAuth) await signOut(firebaseAuth); },
  }), [loading, role, user]);

  return <FirebaseAuthContext.Provider value={value}>{children}</FirebaseAuthContext.Provider>;
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (!context) throw new Error("useFirebaseAuth must be used within FirebaseAuthProvider.");
  return context;
}
