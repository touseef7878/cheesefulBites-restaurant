/**
 * Cheeseful Bites visual system: a dense Cheesy Maximalism menu, rooted in the supplied
 * menu board and transformed into outlined desktop cards and mobile ordering slats.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Flame, Plus, Search, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { StorefrontLayout, reveal } from "@/components/Storefront";
import { ASSETS, categories, formatPKR, menuItems, type MenuCategory, type MenuItem } from "@/data/menu";
import { useCart } from "@/contexts/CartContext";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import { FavoriteButton } from "@/components/FavoriteButton";

function AddButton({ item }: { item: MenuItem }) {
  const { add } = useCart();
  return <button className="circle-add" onClick={() => add(item)} aria-label={`Add ${item.title}`}><Plus size={23} /></button>;
}

function MenuSlat({ item }: { item: MenuItem }) {
  const { add } = useCart();
  return (
    <article className="menu-slat">
      <div>
        <div className="menu-slat__title-row"><h3>{item.title}</h3><FavoriteButton menuItemId={item.id} title={item.title} className="favorite-button favorite-button--slat" />{item.badge && <span className="mini-badge">{item.badge}</span>}</div>
        <p>{item.description}</p>
        <div className="slat-options">
          {(item.variants ?? [{ label: "Regular", price: item.price }]).map((variant) => (
            <button key={variant.label} onClick={() => { add({ ...item, price: variant.price }); }}>
              {variant.label} <b>{variant.price}</b>
            </button>
          ))}
        </div>
      </div>
      <AddButton item={item} />
    </article>
  );
}

function WideAddButton({ item }: { item: MenuItem }) {
  const { add } = useCart();
  return <button className="wide-add" onClick={() => add(item)}>Add to Cart</button>;
}

export default function Menu() {
  const [active, setActive] = useState<MenuCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [location] = useLocation();
  const { items: liveItems } = useRestaurantMenu();
  useEffect(() => {
    const incomingQuery = new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
    setQuery(incomingQuery);
    if (incomingQuery) setActive("All");
  }, [location]);
  const filtered = useMemo(
    () => {
      const normalizedQuery = query.trim().toLowerCase();
      return liveItems.filter((item) => {
        const matchesCategory = active === "All" || item.category === active;
        const matchesQuery = !normalizedQuery || [item.title, item.description, item.category, item.badge ?? ""].some((value) => value.toLowerCase().includes(normalizedQuery));
        return matchesCategory && matchesQuery;
      });
    },
    [active, query, liveItems],
  );
  const crispy = liveItems.filter((item) => item.category === "Crispy Clock");
  const rolls = liveItems.filter((item) => item.category === "Paratha Roll");

  return (
    <StorefrontLayout active="menu">
      <section className="menu-page content-wrap">
        <motion.div className="menu-heading" {...reveal}>
          <div><p className="eyebrow">Cheese overhead. Hunger handled.</p><h1>THE MENU</h1></div>
          <div className="filter-strip desktop-filters">
            <button className={active === "All" ? "is-active" : ""} onClick={() => setActive("All")}>All</button>
            {categories.slice(0, 4).map((category) => <button key={category} className={active === category ? "is-active" : ""} onClick={() => setActive(category)}>{category}</button>)}
          </div>
        </motion.div>

        <div className="mobile-menu-tools">
          <label className="large-search"><Search size={22} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the cheese..." /></label>
          <div className="filter-strip">
            <button className={active === "All" ? "is-active" : ""} onClick={() => setActive("All")}>All Items</button>
            {categories.slice(1, 5).map((category) => <button key={category} className={active === category ? "is-active" : ""} onClick={() => setActive(category)}>{category}</button>)}
          </div>
        </div>

        {active === "All" && !query && (
          <motion.section className="desktop-menu-feature" {...reveal}>
            <div className="featured-board">
              <img src={ASSETS.board} alt="Cheeseful Bites original menu board" loading="lazy" decoding="async" />
              <div className="featured-board__copy">
                <span className="sticker red">New Arrival</span>
                <h2>The Ultimate Cheese Stack</h2>
                <p>Our signature crispy clock burger overloaded with triple cheese layers and spicy crunch.</p>
                <Link href="/product/zinger-roll-paratha" className="btn btn-orange">Order Now · Rs. 300</Link>
              </div>
            </div>
            <div className="featured-stack">
              {liveItems.filter((item) => ["zinger-roll-paratha", "zinger-shawarma"].includes(item.id)).map((item) => (
                <article className="side-menu-card" key={item.id}>
                  <div className="side-menu-card__image"><img src={item.image} alt="" loading="lazy" decoding="async" /> <span>{formatPKR(item.price)}</span></div>
                  <h3>{item.title}</h3><p>{item.description}</p>
                  <WideAddButton item={item} />
                  <Link className="screen-reader-only" href={`/product/${item.id}`}>View {item.title}</Link>
                </article>
              ))}
            </div>
          </motion.section>
        )}

        {active === "All" && !query && (
          <section className="mobile-menu-groups">
            <div className="category-group">
              <h2 className="category-sticker yellow">Crispy Clock</h2>
              {crispy.map((item) => <MenuSlat key={item.id} item={item} />)}
            </div>
            <div className="category-group paratha-group">
              <h2 className="category-sticker orange">Paratha Roll</h2>
              <div className="paratha-roll-list">{rolls.map((item) => <MenuSlat key={item.id} item={item} />)}</div>
            </div>
            <Link href="/contact" className="delivery-banner"><ShoppingBag /><span><b>Home Delivery<br />Available</b><small>Order now and get it hot!</small></span><em>ORDER NOW</em></Link>
          </section>
        )}

        <motion.section className="product-grid-section" {...reveal}>
          <div className="section-title-row"><h2>{query ? `Search results for “${query}”` : active === "All" ? "Full Menu" : active}</h2><span>{filtered.length} bites</span></div>
          <div className="menu-product-grid">
            {filtered.map((item) => <MenuCard item={item} key={item.id} />)}
          </div>
          {filtered.length === 0 && <div className="empty-bites">No matching bites yet. Try another search.</div>}
        </motion.section>
      </section>
    </StorefrontLayout>
  );
}

function MenuCard({ item }: { item: MenuItem }) {
  const { add } = useCart();
  return (
    <article className="menu-product-card">
      <Link href={`/product/${item.id}`} className="menu-product-card__image">
        <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
        <span>{formatPKR(item.price)}</span>
      </Link>
      <div className="menu-product-card__copy"><FavoriteButton menuItemId={item.id} title={item.title} className="favorite-button favorite-button--inline" /><h3>{item.title}</h3><p>{item.description}</p></div>
      <button className="wide-add" onClick={() => add(item)}>Add to Cart</button>
    </article>
  );
}
