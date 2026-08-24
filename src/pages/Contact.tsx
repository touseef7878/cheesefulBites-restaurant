/**
 * Cheeseful Bites visual system: real Wah location information, an interactive map, and
 * high-contrast contact cards that preserve the reference site’s thick outlined character.
 */
import { Clock3, MapPin, Phone, Route, Store } from "lucide-react";
import { motion } from "framer-motion";
import { StorefrontLayout, reveal } from "@/components/Storefront";
import { LOCAL_ASSETS } from "@/lib/assets";

const address = "QP8J+V6R, Lane 21, Phase-II Wah Model Town, Wah, 47010, Pakistan";

export default function Contact() {
  const embedQuery = encodeURIComponent(address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${embedQuery}`;
  const staticMap = LOCAL_ASSETS.locationMap;
  return <StorefrontLayout active="contact"><section className="contact-page content-wrap"><motion.div className="contact-heading" {...reveal}><p className="eyebrow">Come hungry. Leave cheeseful.</p><h1>Find the cheese.</h1><p>Cheeseful Bites is ready in Wah Model Town for dine-in, pickup, and home delivery.</p></motion.div><div className="contact-grid"><motion.article className="contact-details" {...reveal}><div className="contact-detail"><Store /><div><span>Restaurant</span><b>Cheeseful Bites</b><p>Owned by Abdul Ahad</p></div></div><div className="contact-detail"><MapPin /><div><span>Address</span><b>{address}</b></div></div><div className="contact-detail"><Phone /><div><span>Business Number</span><a href="tel:+923288681123">+92 328 8681123</a></div></div><div className="contact-detail"><Clock3 /><div><span>Restaurant Timing</span><b>Daily · 03:00 PM – 03:00 AM</b></div></div><a className="btn btn-red" href={mapsUrl} target="_blank" rel="noreferrer"><Route />Get Directions</a></motion.article><motion.article className="map-card" {...reveal}><a className="static-map-link" href={mapsUrl} target="_blank" rel="noreferrer"><img src={staticMap} alt="Map centered on Cheeseful Bites in Phase-II Wah Model Town" loading="lazy" decoding="async" /><span><MapPin /> Cheeseful Bites · Open directions</span></a></motion.article></div></section></StorefrontLayout>;
}
