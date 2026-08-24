import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

type FavoriteResult = "added" | "removed" | "auth-required" | "error";

type FavoritesContextValue = {
  favoriteIds: string[];
  loading: boolean;
  isFavorite: (menuItemId: string) => boolean;
  toggleFavorite: (menuItemId: string) => Promise<FavoriteResult>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useSupabaseAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setFavoriteIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("customer_favourites")
      .select("menu_item_id")
      .eq("user_id", user.id);

    if (!error) setFavoriteIds((data ?? []).map((favorite) => String(favorite.menu_item_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => { void refresh(); }, [refresh]);

  const isFavorite = useCallback((menuItemId: string) => favoriteIds.includes(menuItemId), [favoriteIds]);

  const toggleFavorite = useCallback(async (menuItemId: string): Promise<FavoriteResult> => {
    if (!user) return "auth-required";

    const wasFavorite = favoriteIds.includes(menuItemId);
    setFavoriteIds((current) => wasFavorite ? current.filter((id) => id !== menuItemId) : [...current, menuItemId]);

    const request = wasFavorite
      ? supabase.from("customer_favourites").delete().eq("user_id", user.id).eq("menu_item_id", menuItemId)
      : supabase.from("customer_favourites").insert({ user_id: user.id, menu_item_id: menuItemId });
    const { error } = await request;

    if (error) {
      setFavoriteIds((current) => wasFavorite ? [...current, menuItemId] : current.filter((id) => id !== menuItemId));
      return "error";
    }

    return wasFavorite ? "removed" : "added";
  }, [favoriteIds, user]);

  const value = useMemo<FavoritesContextValue>(() => ({
    favoriteIds,
    loading,
    isFavorite,
    toggleFavorite,
  }), [favoriteIds, isFavorite, loading, toggleFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}
