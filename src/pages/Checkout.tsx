/**
 * Cheeseful Bites visual system: bright checkout stickers, outlined delivery cards, and a
 * transparent cash-on-delivery order handoff inspired by the supplied checkout screens.
 */
import { useState } from "react";
import { Link } from "wouter";
import { ClipboardList, CreditCard, MapPin, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StorefrontLayout, reveal } from "@/components/Storefront";
import { formatPKR } from "@/data/menu";
import { useCart } from "@/contexts/CartContext";
import { buildWhatsAppOrderMessage, getWhatsAppOrderUrl } from "@/lib/whatsapp";

export default function Checkout() {
  const { lines, subtotal, changeQuantity } = useCart();
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [instructions, setInstructions] = useState("");
  const deliveryFee = lines.length ? 99 : 0;
  const total = subtotal + deliveryFee;
  const placeOrder = () => {
    if (!lines.length) return;
    const message = buildWhatsAppOrderMessage({
      lines: lines.map((line) => ({ quantity: line.quantity, title: line.title, total: formatPKR(line.price * line.quantity) })),
      subtotal: formatPKR(subtotal), deliveryFee: formatPKR(deliveryFee), total: formatPKR(total), streetAddress, city, postalCode,
      payment: "Cash on Delivery", instructions,
    });
    window.open(getWhatsAppOrderUrl(message), "_blank", "noopener,noreferrer");
    toast.success("Your complete cart has been prepared for WhatsApp confirmation.");
  };
  return (
    <StorefrontLayout active="checkout">
      <section className="checkout-page content-wrap">
        <motion.h1 {...reveal}>Secure Checkout</motion.h1>
        <div className="checkout-layout">
          <div className="checkout-main">
            <motion.article className="delivery-card" {...reveal}><div className="delivery-card__heading"><h2><Truck />Delivery Details</h2></div><div className="address-surface"><span><MapPin /></span><div><b>Your Delivery Address</b><p>Fill in your street, city, and postal code below so we can deliver to you.</p></div></div><div className="delivery-inputs"><label>Street address<input value={streetAddress} onChange={(event) => setStreetAddress(event.target.value)} placeholder="e.g. House 5, Street 3, Phase-II" /></label><label>City<input value={city} onChange={(event) => setCity(event.target.value)} placeholder="e.g. Wah Cantt" /></label><label>Postal Code<input value={postalCode} onChange={(event) => setPostalCode(event.target.value)} placeholder="e.g. 47010" /></label><label className="full">Delivery instructions<textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="Leave notes for your order here..." /></label></div></motion.article>
            <motion.article className="order-card" {...reveal}><h2>Your Order</h2>{lines.length ? lines.map((line) => <div className="checkout-line" key={line.id}><img src={line.image} alt="" /><div><h3>{line.title}</h3><p>{line.description}</p></div><div className="line-actions"><b>{formatPKR(line.price * line.quantity)}</b><div className="quantity-control compact"><button onClick={() => changeQuantity(line.id, -1)}><Minus /></button><span>{line.quantity}</span><button onClick={() => changeQuantity(line.id, 1)}><Plus /></button></div></div></div>) : <div className="checkout-empty"><ShoppingBag /><p>Your cart is empty.</p><Link className="btn btn-orange" href="/menu">Pick your bites</Link></div>}</motion.article>
            <motion.article className="payment-card" {...reveal}><h2><CreditCard />Payment Method</h2><div className="payment-cash-only"><span>●</span>Cash on Delivery <CreditCard /></div></motion.article>
          </div>
          <motion.aside className="order-summary" {...reveal}><h2><ClipboardList />Order Summary</h2><div><p><span>Subtotal</span><b>{formatPKR(subtotal)}</b></p><p><span>Delivery Fee</span><b>{formatPKR(deliveryFee)}</b></p><p><span>Taxes</span><b>Included</b></p></div><hr /><strong><span>Total</span><b>{formatPKR(total)}</b></strong><button className="btn btn-red" disabled={!lines.length} onClick={placeOrder}>Confirm on WhatsApp <ShoppingBag /></button><small>Your cart and delivery notes are copied into a WhatsApp message for Cheeseful Bites.</small></motion.aside>
        </div>
      </section>
    </StorefrontLayout>
  );
}
