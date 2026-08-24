/**
 * Cheeseful Bites visual system: tactile, transparent local cart behavior for the
 * playful Cheesy Maximalism ordering interface; no checkout is processed online.
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const { user } = useSupabaseAuth();
  const [, setLocation] = useLocation();

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

