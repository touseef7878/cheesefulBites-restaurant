/**
 * Cheeseful Bites visual system: a clear, non-fabricated orders handoff that keeps the
 * mobile navigation flow complete while directing guests to real restaurant contact channels.
 */
import { ClipboardList, MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { StorefrontLayout, reveal } from "@/components/Storefront";
import { useCart } from "@/contexts/CartContext";

export default function Orders() {
  const { count } = useCart();
  return <StorefrontLayout active="orders"><section className="orders-page content-wrap"><motion.div className="orders-card" {...reveal}><div className="orders-sticker"><ClipboardList /></div><p className="eyebrow">Your crispy clock</p><h1>Orders, made simple.</h1><p>Cheeseful Bites confirms orders directly with you, so nothing gets lost between the cheese and the delivery rider.</p><div className="orders-actions"><Link href={count ? "/checkout" : "/menu"} className="btn btn-orange"><ShoppingBag />{count ? `Review ${count} cart item${count > 1 ? "s" : ""}` : "Build an order"}</Link><a className="btn btn-outline" href="https://wa.me/923288681123" target="_blank" rel="noreferrer"><MessageCircle />WhatsApp us</a><a className="call-link" href="tel:+923288681123"><Phone />+92 328 8681123</a></div></motion.div></section></StorefrontLayout>;
}

