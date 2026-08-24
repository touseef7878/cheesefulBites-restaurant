import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { StorefrontLayout, reveal } from "@/components/Storefront";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import { formatPKR } from "@/data/menu";
import { motion } from "framer-motion";

export default function Favorites() {
  const { favoriteIds, loading } = useFavorites();
  const { items } = useRestaurantMenu();
  const savedItems = items.filter((item) => favoriteIds.includes(item.id));

  return <StorefrontLayout active="profile"><section className="favorites-page content-wrap">
    <motion.div className="favorites-page__intro" {...reveal}><p className="eyebrow">Your saved cravings</p><h1><Heart fill="currentColor" /> Favourites</h1><p>Keep the bites you want to come back to in one place. Your saved items follow your Cheeseful account.</p></motion.div>
    {loading ? <p className="favorites-empty">Loading your favourites…</p> : savedItems.length ? <motion.div className="menu-product-grid" {...reveal}>{savedItems.map((item) => <article className="menu-product-card" key={item.id}><Link href={`/product/${item.id}`} className="menu-product-card__image"><img src={item.image} alt={item.title} /><span>{formatPKR(item.price)}</span></Link><div className="menu-product-card__copy"><FavoriteButton menuItemId={item.id} title={item.title} className="favorite-button favorite-button--inline" /><h3>{item.title}</h3><p>{item.description}</p></div><Link href={`/product/${item.id}`} className="wide-add">View bite</Link></article>)}</motion.div> : <div className="favorites-empty"><Heart /><h2>No saved bites yet.</h2><p>Tap the heart on any menu item to save it here.</p><Link className="btn btn-orange" href="/menu"><ShoppingBag />Browse the menu</Link></div>}
  </section></StorefrontLayout>;
}
