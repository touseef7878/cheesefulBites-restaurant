/**
 * Cheeseful Bites visual system: shared sticker-stacked navigation, hard ink outlines,
 * mustard-and-cheddar surfaces, and compact mobile ordering controls.
 */
import {
  ChefHat,
  CircleUserRound,
  ClipboardList,
  Home,
  Menu as MenuIcon,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ASSETS } from "@/data/menu";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { RestaurantAssistant } from "@/components/RestaurantAssistant";

type ActivePage = "home" | "menu" | "orders" | "contact" | "checkout" | "product" | "profile";

const navigation = [
  { label: "Home", href: "/", active: "home" },
  { label: "Menu", href: "/menu", active: "menu" },
  { label: "Orders", href: "/orders", active: "orders" },
] as const;

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={`brand-lockup ${compact ? "brand-lockup--compact" : ""}`}>
      <img src={ASSETS.logo} alt="Cheeseful Bites logo" width={512} height={512} decoding="async" />
      <span>Cheeseful Bites</span>
    </Link>
  );
}

export function CartTrigger({ light = false }: { light?: boolean }) {
  const { count } = useCart();
  return (
    <Link href="/checkout" className={`cart-trigger ${light ? "cart-trigger--light" : ""}`} aria-label="Open your cart">
      <ShoppingBag size={24} strokeWidth={2.5} />
      {count > 0 && <b>{count}</b>}
    </Link>
  );
}

export function Header({ active }: { active: ActivePage }) {
  const [open, setOpen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const profileHref = user?.role === "admin" ? "/admin" : "/profile";
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    setOpen(false);
    setLocation(query ? `/menu?q=${encodeURIComponent(query)}` : "/menu");
  };

  useEffect(() => {
    const collapseKey = "cheeseful-nav-collapsed";
    if (window.sessionStorage.getItem(collapseKey) === "true") {
      setIsCondensed(true);
      return;
    }
    const onScroll = () => {
      if (window.scrollY < 180) return;
      window.sessionStorage.setItem(collapseKey, "true");
      setIsCondensed(true);
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`site-header ${isCondensed ? "is-condensed" : ""}`}>
        <div className="desktop-header">
          <BrandLockup />
          <nav aria-label="Primary navigation">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className={active === item.active ? "is-active" : ""}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <form className="search-pill" role="search" onSubmit={submitSearch}>
              <label className="screen-reader-only" htmlFor="site-menu-search">Search the menu</label>
              <input id="site-menu-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search menu..." />
              <button type="submit" aria-label="Search menu"><Search size={19} /></button>
            </form>
            <Link href={profileHref} className="header-profile" aria-label={user?.role === "admin" ? "Open owner panel" : "Open profile"}><CircleUserRound size={21} /><span>{user?.role === "admin" ? "Owner" : user ? "Profile" : "Sign in"}</span></Link>
            <CartTrigger light />
          </div>
        </div>
        <div className="mobile-header">
          <button className="icon-only" onClick={() => setOpen(true)} aria-label="Open navigation"><MenuIcon /></button>
          <BrandLockup compact />
          <CartTrigger />
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.aside
            className="mobile-menu-panel"
            initial={{ x: "-104%" }}
            animate={{ x: 0 }}
            exit={{ x: "-104%" }}
            transition={{ type: "spring", stiffness: 330, damping: 30 }}
          >
            <div className="mobile-menu-panel__top">
              <BrandLockup compact />
              <button className="icon-only" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button>
            </div>
            <nav>
              <form className="mobile-menu-search" role="search" onSubmit={submitSearch}>
                <label className="screen-reader-only" htmlFor="mobile-menu-search">Search the menu</label>
                <Search size={19} aria-hidden="true" />
                <input id="mobile-menu-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search menu..." />
                <button type="submit">Search</button>
              </form>
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={location === item.href ? "is-active" : ""}>
                  {item.label}
                </Link>
              ))}
              <Link href="/contact" onClick={() => setOpen(false)} className={location === "/contact" ? "is-active" : ""}>Find Us</Link>
              <Link href={profileHref} onClick={() => setOpen(false)} className={location === profileHref ? "is-active" : ""}>{user?.role === "admin" ? "Owner panel" : user ? "My profile" : "Sign in"}</Link>
            </nav>
            <a className="menu-phone" href="tel:+923288681123">Call +92 328 8681123</a>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export function BottomNav({ active }: { active: ActivePage }) {
  const { user } = useAuth();
  const entries = [
    { label: "Home", href: "/", icon: Home, active: "home" },
    { label: "Menu", href: "/menu", icon: ChefHat, active: "menu" },
    { label: "Orders", href: "/orders", icon: ClipboardList, active: "orders" },
    { label: user?.role === "admin" ? "Admin" : "Profile", href: user?.role === "admin" ? "/admin" : "/profile", icon: CircleUserRound, active: "profile" },
  ] as const;
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {entries.map((entry) => {
        const Icon = entry.icon;
        return (
          <Link key={entry.label} href={entry.href} className={active === entry.active ? "is-active" : ""}>
            <Icon size={21} strokeWidth={2.6} />
            <span>{entry.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <BrandLockup />
      <nav>
        <Link href="/contact">Locations</Link>
        <Link href="/contact">Contact Us</Link>
        <a href="tel:+923288681123">Call to Order</a>
        <Link href="/menu">Menu</Link>
      </nav>
      <p>© 2026 Cheeseful Bites · Owned by Abdul Ahad</p>
    </footer>
  );
}

export function StorefrontLayout({ active, children }: { active: ActivePage; children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, loading } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  useEffect(() => {
    const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: (() => void)[] = [];
    if (hoverCapable) {
      document.querySelectorAll<HTMLElement>(".hero-card, .popular-card, .category-card, .experience-card, .home-location__map").forEach((element) => {
        const move = (event: PointerEvent) => {
          const bounds = element.getBoundingClientRect();
          const rotateY = ((event.clientX - bounds.left) / bounds.width - .5) * 5;
          const rotateX = -((event.clientY - bounds.top) / bounds.height - .5) * 5;
          element.style.setProperty("--tilt-x", `${rotateX}deg`);
          element.style.setProperty("--tilt-y", `${rotateY}deg`);
        };
        const leave = () => { element.style.removeProperty("--tilt-x"); element.style.removeProperty("--tilt-y"); };
        element.addEventListener("pointermove", move); element.addEventListener("pointerleave", leave);
        cleanups.push(() => { element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave); });
      });
      document.querySelectorAll<HTMLElement>(".btn, .circle-add, .cart-trigger, .icon-only, .mobile-order-cta").forEach((element) => {
        const move = (event: PointerEvent) => {
          const bounds = element.getBoundingClientRect();
          element.style.setProperty("--magnet-x", `${((event.clientX - bounds.left) / bounds.width - .5) * 2.5}px`);
          element.style.setProperty("--magnet-y", `${((event.clientY - bounds.top) / bounds.height - .5) * 2}px`);
        };
        const leave = () => { element.style.removeProperty("--magnet-x"); element.style.removeProperty("--magnet-y"); };
        element.addEventListener("pointermove", move); element.addEventListener("pointerleave", leave);
        cleanups.push(() => { element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave); });
      });
    }
    const ripple = (event: MouseEvent) => {
      const element = event.currentTarget as HTMLElement;
      const bounds = element.getBoundingClientRect();
      const dot = document.createElement("span");
      dot.className = "motion-ripple";
      dot.style.left = `${event.clientX - bounds.left}px`;
      dot.style.top = `${event.clientY - bounds.top}px`;
      element.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove());
    };
    document.querySelectorAll<HTMLElement>(".btn, .circle-add, .cart-trigger, .icon-only, .mobile-order-cta").forEach((element) => {
      element.addEventListener("click", ripple);
      cleanups.push(() => element.removeEventListener("click", ripple));
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [location]);
  useEffect(() => {
    if (!loading && user?.role === "admin" && location !== "/admin") setLocation("/admin");
  }, [loading, location, setLocation, user?.role]);

  if (!loading && user?.role === "admin") {
    return <main className="admin-gate" aria-live="polite"><p className="eyebrow">Owner session detected</p><h1>Opening your owner panel…</h1><p>Restaurant management is kept separate from customer ordering tools.</p></main>;
  }

  return (
    <div className="storefront-shell">
      <Header active={active} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main key={location} className="storefront-main" initial={prefersReducedMotion ? false : { opacity: 0, y: 14, scale: .992 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={prefersReducedMotion ? undefined : { opacity: 0, y: -7, scale: 1.008 }} transition={{ duration: prefersReducedMotion ? 0 : .28, ease: [0.23, 1, 0.32, 1] }}>{children}</motion.main>
      </AnimatePresence>
      {!prefersReducedMotion && <motion.div key={`curtain-${location}`} className="route-curtain" initial={{ scaleX: 1, originX: 0 }} animate={{ scaleX: 0, originX: 1 }} transition={{ duration: .52, ease: [0.77, 0, 0.175, 1] }} aria-hidden="true" />}
      <Footer />
      <RestaurantAssistant />
      <BottomNav active={active} />
    </div>
  );
}

export const reveal = {
  initial: { opacity: 0, y: 28, filter: "blur(7px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.66, ease: [0.23, 1, 0.32, 1] as const },
};

export const revealLeft = {
  initial: { opacity: 0, x: -34, filter: "blur(7px)" },
  whileInView: { opacity: 1, x: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.68, ease: [0.23, 1, 0.32, 1] as const },
};

export const revealRight = {
  initial: { opacity: 0, x: 34, filter: "blur(7px)" },
  whileInView: { opacity: 1, x: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.68, ease: [0.23, 1, 0.32, 1] as const },
};

export const revealCompact = {
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.14 },
  transition: { duration: 0.46, ease: [0.23, 1, 0.32, 1] as const },
};
