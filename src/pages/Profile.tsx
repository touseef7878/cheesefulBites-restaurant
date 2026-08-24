import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, CircleUserRound, Crown, Heart, LogOut, Mail, ShieldCheck, Store } from "lucide-react";
import { toast } from "sonner";
import { StorefrontLayout } from "@/components/Storefront";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";

type Mode = "sign-in" | "sign-up";

function AuthCard() {
  const { signIn, signUp, signOut } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Read the page the user was on before being redirected here
  const returnTo = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("returnTo") ?? ""
    : "";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    if (mode === "sign-in") {
      const { error, user } = await signIn({ email, password });
      if (error) toast.error(error.message);
      else {
        const ownerSession = user?.role === "admin";
        toast.success(ownerSession ? "Welcome back, owner. Opening your panel." : "Welcome back to Cheeseful Bites.");
        // Send admin to their panel; send regular users back where they came from (or profile)
        setLocation(ownerSession ? "/admin" : (returnTo || "/profile"));
      }
    } else {
      const { error, confirmationRequired, user } = await signUp({ name, email, password });
      if (error) toast.error(error.message);
      else if (confirmationRequired) {
        toast.success("Check your inbox to confirm your Cheeseful Bites account. Returning to home.");
        setLocation("/");
      }
      else {
        await signOut();
        toast.success("Your Cheeseful Bites account is ready. Returning to home.");
        setLocation("/");
      }
    }
    setSubmitting(false);
  };

  return <section className="auth-panel"><div className="auth-panel__intro"><span className="sticker red">Cheeseful account</span><p className="eyebrow">Supabase Auth · Free plan</p><h1>Your cravings,<br /><em>saved.</em></h1><p>Create a Cheeseful account with your email and password to submit genuine reviews and unlock a protected customer profile.</p></div><div className="auth-panel__card auth-panel__card--gateway"><ShieldCheck /><p className="eyebrow">Secure email access</p><h2>{mode === "sign-in" ? "Welcome back." : "Create your account."}</h2><p>{mode === "sign-in" ? "Sign in with your confirmed Cheeseful Bites email." : "We will send a confirmation link before your first sign-in."}</p><div className="auth-tabs" role="tablist"><button type="button" className={mode === "sign-in" ? "is-active" : ""} onClick={() => setMode("sign-in")}>Sign in</button><button type="button" className={mode === "sign-up" ? "is-active" : ""} onClick={() => setMode("sign-up")}>Sign up</button></div><form className="auth-form" onSubmit={submit}>{mode === "sign-up" && <label>Name<input value={name} onChange={(event) => setName(event.target.value)} minLength={2} required placeholder="Your name" /></label>}<label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required placeholder="At least 6 characters" /></label><button className="btn btn-orange" disabled={submitting}>{submitting ? "Please wait…" : mode === "sign-in" ? "Sign in free" : "Create free account"}<ArrowRight /></button></form><small>Email confirmation is required. Confirmation messages use the restaurant’s configured Google SMTP delivery service; Google OAuth remains disabled.</small></div></section>;
}

export default function Profile() {
  const { user, loading, signOut } = useSupabaseAuth();
  const { favoriteIds } = useFavorites();
  const [, setLocation] = useLocation();
  if (loading) return <StorefrontLayout active="profile"><section className="profile-page profile-loading"><CircleUserRound />Loading your Cheeseful account…</section></StorefrontLayout>;
  if (!user) return <StorefrontLayout active="profile"><main className="profile-page content-wrap"><AuthCard /></main></StorefrontLayout>;
  const name = user.name || user.email?.split("@")[0] || "Cheeseful guest";
  return <StorefrontLayout active="profile"><main className="profile-page content-wrap"><section className="profile-hero"><span className="profile-avatar">{name.charAt(0).toUpperCase()}</span><div><p className="eyebrow">Cheeseful account</p><h1>Hey, {name}.</h1><p>{user.email || "Your Cheeseful account is ready."}</p></div><button className="btn btn-outline" onClick={async () => { await signOut(); toast.success("Signed out."); setLocation("/"); }}><LogOut />Sign out</button></section><section className="profile-grid"><article><CircleUserRound /><h2>Customer panel</h2><p>Use your free Supabase account to leave authentic reviews and keep your orders close.</p><Link className="btn btn-orange" href="/orders">View order desk <ArrowRight /></Link></article><article><Mail /><h2>Reviews with your name</h2><p>Every product review is tied to a verified account and stays pending until the owner approves it.</p><Link className="btn btn-outline" href="/menu">Browse the menu <ArrowRight /></Link></article><article className="profile-favourites-card"><Heart fill="currentColor" /><h2>Saved favourites</h2><p>{favoriteIds.length ? `${favoriteIds.length} saved bite${favoriteIds.length === 1 ? "" : "s"} ready for your next order.` : "Tap the heart on any menu item to build your saved list."}</p><Link className="btn btn-outline" href="/favorites">View favourites <ArrowRight /></Link></article>{user.role === "admin" && <article className="profile-admin-card"><Crown /><h2>Owner access</h2><p>Your confirmed owner email is recognized through Supabase. Manage menu items and review approvals from the protected workspace.</p><Link className="btn btn-red" href="/admin"><Store />Open owner panel</Link></article>}</section></main></StorefrontLayout>;
}
