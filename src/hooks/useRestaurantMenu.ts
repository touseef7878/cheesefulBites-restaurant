/** Reads the owner-managed menu from Supabase while preserving the supplied design data during first paint. */
import { useCallback, useEffect, useState } from "react";
import { menuItems, type MenuCategory, type MenuItem } from "@/data/menu";
import { resolvePortableImage } from "@/lib/assets";
import { supabase } from "@/lib/supabase";

type Variant = { label: string; price: number };

function asVariants(value: unknown): Variant[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const variants = value.filter((item): item is Variant => Boolean(item) && typeof item === "object" && typeof (item as Variant).label === "string" && typeof (item as Variant).price === "number");
  return variants.length ? variants : undefined;
}

function mapMenuItem(item: Record<string, unknown>): MenuItem {
  return {
    id: String(item.id),
    category: item.category as MenuCategory,
    title: String(item.title),
    description: String(item.description),
    price: Number(item.price),
    image: resolvePortableImage(String(item.image)),
    badge: typeof item.badge === "string" ? item.badge : undefined,
    variants: asVariants(item.variants),
    available: item.available !== false,
    sortOrder: typeof item.sort_order === "number" ? item.sort_order : undefined,
  };
}

export function useRestaurantMenu() {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    const { data, error: menuError } = await supabase
      .from("restaurant_menu_items")
      .select("id, category, title, description, price, image, badge, variants, available, sort_order")
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });
    if (menuError) {
      setError(menuError);
    } else if (data?.length) {
      setError(null);
      setItems(data.map(mapMenuItem));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { void refetch(); }, [refetch]);
  return { items, isLoading, error, refetch };
}
