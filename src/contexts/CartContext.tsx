/**
 * Cheeseful Bites visual system: tactile, transparent local cart behavior for the
 * playful Cheesy Maximalism ordering interface; no checkout is processed online.
 * Cart lines are persisted to localStorage keyed by user ID so they survive a refresh.
 */
import { createContext, useContext, useEffect, useMemo, useState, useRef, type ReactNode } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import type { MenuItem } from "@/data/menu";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

export type CartLine = MenuItem & { quantity: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (item: MenuItem) => void;
  changeQuantity: (id: string, delta: number) => void;
  remove: (id: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function storageKey(userId: string) {
  return `cheeseful-cart-${userId}`;
}

function loadCart(userId: string): CartLine[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as CartLine[];
  } catch {
    return [];
  }
}

function saveCart(userId: string, lines: CartLine[]) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(lines));
  } catch {
    // localStorage quota exceeded — silent fail
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useSupabaseAuth();
  const [, setLocation] = useLocation();

  // Start with empty cart; we'll load from localStorage once we know the user
  const [lines, setLines] = useState<CartLine[]>([]);

  // Track previous user ID so we can detect user switches
  const prevUserIdRef = useRef<string | null>(null);

  // Load persisted cart whenever the logged-in user changes
  useEffect(() => {
    const userId = user?.id ?? null;
    if (userId === prevUserIdRef.current) return; // same user, no reload needed
    prevUserIdRef.current = userId;

    if (userId) {
      setLines(loadCart(userId));
    } else {
      // User signed out — clear in-memory cart
      setLines([]);
    }
  }, [user?.id]);

  // Persist to localStorage on every change (only when a user is signed in)
  useEffect(() => {
    if (user?.id) {
      saveCart(user.id, lines);
    }
  }, [lines, user?.id]);

  const add = (item: MenuItem) => {
    if (!user) {
      toast.error("Sign in to add items to your order.");
      const returnTo = typeof window !== "undefined" ? window.location.pathname + window.location.search : "";
      setLocation(returnTo ? `/profile?returnTo=${encodeURIComponent(returnTo)}` : "/profile");
      return;
    }
    setLines((current) => {
      const existing = current.find((line) => line.id === item.id);
      if (existing) {
        return current.map((line) =>
          line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
    toast.success(`${item.title} added to your order`);
  };

  const changeQuantity = (id: string, delta: number) => {
    setLines((current) =>
      current
        .map((line) => (line.id === id ? { ...line, quantity: line.quantity + delta } : line))
        .filter((line) => line.quantity > 0),
    );
  };

  const remove = (id: string) => setLines((current) => current.filter((line) => line.id !== id));

  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
      add,
      changeQuantity,
      remove,
    }),
    [lines],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
