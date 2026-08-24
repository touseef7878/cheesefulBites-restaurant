import { Heart } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useFavorites } from "@/contexts/FavoritesContext";

type FavoriteButtonProps = {
  menuItemId: string;
  title: string;
  className?: string;
};

export function FavoriteButton({ menuItemId, title, className = "heart-button" }: FavoriteButtonProps) {
  const [, setLocation] = useLocation();
  const { isFavorite, loading, toggleFavorite } = useFavorites();
  const saved = isFavorite(menuItemId);

  const handleClick = async () => {
    const result = await toggleFavorite(menuItemId);
    if (result === "auth-required") {
      toast.info("Sign in to save your favourite bites.");
      setLocation("/profile");
      return;
    }
    if (result === "error") {
      toast.error("Your favourite could not be updated. Please try again.");
      return;
    }
    toast.success(result === "added" ? `${title} saved to your favourites.` : `${title} removed from your favourites.`);
  };

  return <button
    type="button"
    aria-label={`${saved ? "Remove" : "Save"} ${title}${saved ? " from favourites" : " to favourites"}`}
    aria-pressed={saved}
    className={`${className} ${saved ? "is-saved" : ""}`}
    disabled={loading}
    onClick={() => void handleClick()}
  ><Heart size={23} fill={saved ? "currentColor" : "none"} /></button>;
}
