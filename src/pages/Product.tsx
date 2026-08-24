/**
 * Cheeseful Bites visual system: expressive product detail card, cheese-yellow ordering controls,
 * real Wah location details, and the supplied reference’s outlined operational-information cards.
 */
import { useCallback, useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Clock3, MapPin, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StorefrontLayout, reveal } from "@/components/Storefront";
import { findMenuItem, formatPKR } from "@/data/menu";
import { useCart } from "@/contexts/CartContext";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import { useAuth } from "@/_core/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { FavoriteButton } from "@/components/FavoriteButton";

const hours = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Product() {
  const [, params] = useRoute("/product/:id");
  const { items } = useRestaurantMenu();
  const item = items.find((menuItem) => menuItem.id === (params?.id ?? "zinger-roll-paratha")) ?? findMenuItem(params?.id ?? "zinger-roll-paratha");
  const { add } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [extraCheese, setExtraCheese] = useState(false);
  const [spicyDip, setSpicyDip] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<Array<{ id: number; rating: number; comment: string; author_name: string }>>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const loadReviews = useCallback(async () => {
    setReviewsLoading(true);
    const { data, error } = await supabase
      .from("menu_reviews")
      .select("id, rating, comment, author_name")
      .eq("menu_item_id", item.id)
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (error) toast.error("Customer reviews could not be loaded right now.");
    else setReviews(data ?? []);
    setReviewsLoading(false);
  }, [item.id]);
  useEffect(() => { void loadReviews(); }, [loadReviews]);
  const total = item.price * quantity + (extraCheese ? 50 * quantity : 0) + (spicyDip ? 30 * quantity : 0);
  const addToOrder = () => { for (let i = 0; i < quantity; i += 1) add({ ...item, price: item.price + (extraCheese ? 50 : 0) + (spicyDip ? 30 : 0) }); };
  const sendReview = async () => {
    if (!user) { window.location.assign("/profile"); return; }
    if (comment.trim().length < 12) { toast.error("Please write at least 12 characters about your order."); return; }
    setSubmittingReview(true);
    const { error } = await supabase.from("menu_reviews").upsert({
      menu_item_id: item.id,
      user_id: user.id,
      rating,
      comment: comment.trim(),
      status: "pending",
    }, { onConflict: "menu_item_id,user_id" });
    setSubmittingReview(false);
    if (error) { toast.error(error.message); return; }
    setComment("");
    await loadReviews();
    toast.success("Thanks — your review is now waiting for owner approval.");
  };
  return (
    <StorefrontLayout active="product">
      <section className="product-page content-wrap">
        <Link href="/menu" className="back-link"><ArrowLeft /> Back to Menu</Link>
        <motion.div className="product-layout" {...reveal}>
          <div className="product-visual"><img src={item.image} alt={item.title} fetchPriority="high" decoding="async" />{item.badge && <span className="sticker red">{item.badge}</span>}</div>
          <article className="product-info">
            <div className="product-title-row"><div><p className="eyebrow">Made extra for Wah</p><h1>{item.title}</h1></div><div className="product-title-actions"><FavoriteButton menuItemId={item.id} title={item.title} className="favorite-button favorite-button--product" /><b>{formatPKR(item.price)}</b></div></div>
            <p className="product-description">{item.description} Wrapped tight, toasted hot, and ready for your next full-cheese moment.</p>
            <fieldset className="addon-fieldset"><legend>Make it louder</legend><label><input type="checkbox" checked={extraCheese} onChange={(event) => setExtraCheese(event.target.checked)} />Extra Cheese <span>+ Rs. 50</span></label><label><input type="checkbox" checked={spicyDip} onChange={(event) => setSpicyDip(event.target.checked)} />Spicy Dip <span>+ Rs. 30</span></label></fieldset>
            <div className="purchase-row"><div className="quantity-control"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus /></button><b>{quantity}</b><button onClick={() => setQuantity((value) => value + 1)}><Plus /></button></div><button className="btn btn-red product-add" onClick={addToOrder}><ShoppingCart /> Add to Order · {formatPKR(total)}</button></div>
          </article>
        </motion.div>
        <motion.div className="info-panels" {...reveal}>
          <article className="info-panel"><h2><Clock3 />Operating Hours</h2><div className="hour-table">{hours.map((day) => <p key={day}><b>{day}</b><span>03:00 PM – 03:00 AM</span></p>)}</div></article>
          <article className="info-panel"><h2><MapPin />Find Us</h2><p><b>Cheeseful Bites · Abdul Ahad</b><br />QP8J+V6R, Lane 21, Phase-II Wah Model Town, Wah, 47010, Pakistan</p><a className="small-cta" href="https://www.google.com/maps/search/?api=1&query=QP8J%2BV6R%2C%20Lane%2021%2C%20Phase-II%20Wah%20Model%20Town%2C%20Wah%2C%20Pakistan" target="_blank" rel="noreferrer">Get Directions</a></article>
        </motion.div>
        <motion.section className="reviews-section" {...reveal}>
          <div className="reviews-section__heading"><div><p className="eyebrow">Authentic customer feedback</p><h2>Reviews for {item.title}</h2></div><span>Only owner-approved customer submissions appear here.</span></div>
          <div className="reviews-layout"><div className="review-list">{reviewsLoading ? <p className="review-empty">Loading customer feedback…</p> : reviews.length ? reviews.map((review) => <article key={review.id} className="review-card"><div><b>{review.author_name || "Cheeseful customer"}</b><span>{Array.from({ length: review.rating }).map((_, index) => <Star key={index} fill="currentColor" />)}</span></div><p>{review.comment}</p></article>) : <p className="review-empty">No customer reviews have been published for this item yet.</p>}</div><aside className="review-form"><h3>Share your experience</h3>{user ? <><div className="star-picker" aria-label="Choose your rating">{[1,2,3,4,5].map((value) => <button key={value} onClick={() => setRating(value)} aria-label={`${value} stars`} className={value <= rating ? "is-selected" : ""}><Star fill="currentColor" /></button>)}</div><textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Tell other customers what you liked about this bite…" /><button className="btn btn-red" onClick={sendReview} disabled={submittingReview}>Submit for approval</button><small>Your review will be visible only after approval by the restaurant owner.</small></> : <><p>Sign in to submit a genuine rating and review for this item.</p><button className="btn btn-orange" onClick={() => window.location.assign("/profile")}>Sign in to review</button></>}</aside></div>
        </motion.section>
      </section>
    </StorefrontLayout>
  );
}
