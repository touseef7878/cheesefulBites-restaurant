/**
 * Cheeseful Bites visual system: immersive cheddar hero, sticker-contained category imagery,
 * and scroll-led restaurant storytelling derived from the supplied references.
 */
import { ArrowRight, ChefHat, Flame, HeartHandshake, MapPin, Plus, Route, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { StorefrontLayout, revealCompact, revealLeft, revealRight } from "@/components/Storefront";
import { ASSETS, formatPKR, type MenuItem } from "@/data/menu";
import { LOCAL_ASSETS } from "@/lib/assets";
import { useCart } from "@/contexts/CartContext";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import { FavoriteButton } from "@/components/FavoriteButton";

const categoryCards = [
  { title: "Paratha Rolls", image: ASSETS.paratha, href: "/menu" },
  { title: "Shawarma", image: ASSETS.shawarma, href: "/menu" },
  { title: "Wraps", image: ASSETS.wrap, href: "/menu" },
];

const cheesefulWay = [
  { number: "01", icon: ChefHat, title: "Crisp first", copy: "Golden, craggy crunch is the starting point for every comfort-food craving." },
  { number: "02", icon: Sparkles, title: "Melt louder", copy: "Our signature cheese layer makes every bite indulgent, warm, and unapologetic." },
  { number: "03", icon: HeartHandshake, title: "Pack it hot", copy: "From Wah Model Town to your table, the goal is a satisfying, shareable moment." },
];

const STORY_ASSETS = {
  founder: LOCAL_ASSETS.founder,
  team: LOCAL_ASSETS.kitchenTeam,
  prep: LOCAL_ASSETS.prepDetail,
} as const;

const CLEAN_HERO_IMAGE = LOCAL_ASSETS.singleHero;

function useCompactMotion() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return compact;
}

function JourneySection() {
  const compact = useCompactMotion();
  const journeyRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: journeyRef, offset: ["start end", "end start"] });
  const photoY = useSpring(useTransform(scrollYProgress, [0, 1], compact ? [20, -22] : [55, -58]), { stiffness: 92, damping: 24 });
  const artRotate = useSpring(useTransform(scrollYProgress, [0, 1], compact ? [-2, 3] : [-6, 7]), { stiffness: 88, damping: 24 });
  const copyX = useSpring(useTransform(scrollYProgress, [0, 1], compact ? [-5, 5] : [-16, 13]), { stiffness: 88, damping: 25 });
  return (
    <section className="journey-section" ref={journeyRef}>
      <motion.div className="journey-sticky-art" aria-hidden="true" style={{ y: photoY }} initial={{ opacity: 0, x: -30, filter: "blur(7px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .24 }} transition={{ duration: .72, ease: [0.23, 1, 0.32, 1] }}>
        <motion.div className="journey-orb journey-orb--one" />
        <motion.img src={ASSETS.paratha} alt="" loading="lazy" decoding="async" />
        <motion.img className="journey-brand-art" src={ASSETS.brandArt} alt="" loading="lazy" decoding="async" style={{ rotate: artRotate }} />
      </motion.div>
      <motion.div className="journey-copy" style={{ x: copyX }} initial={{ opacity: 0, x: 30, filter: "blur(7px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .24 }} transition={{ duration: .72, ease: [0.23, 1, 0.32, 1] }}>
        <p className="eyebrow">The Cheeseful way</p><h2>Comfort food<br />with a <em>cheese pull</em><br />worth slowing down for.</h2>
        <p>Cheeseful Bites is built for the moments when you want your meal to feel more generous: crunchy chicken, warm paratha, rich sauces, and a proper layer of melted cheese.</p>
        <div className="journey-steps">{cheesefulWay.map((step, index) => { const Icon = step.icon; return <motion.article key={step.number} initial={{ opacity: 0, x: 20, filter: "blur(5px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .4 }} transition={{ delay: index * .09, duration: .5, ease: [0.23, 1, 0.32, 1] }}><span>{step.number}</span><Icon /><div><h3>{step.title}</h3><p>{step.copy}</p></div></motion.article>; })}</div>
      </motion.div>
    </section>
  );
}

function FounderStory() {
  const compact = useCompactMotion();
  const storyRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ["start end", "end start"] });
  const photoY = useSpring(useTransform(scrollYProgress, [0, 1], compact ? [9, -7] : [22, -15]), { stiffness: 80, damping: 24 });
  const photoX = useSpring(useTransform(scrollYProgress, [0, 1], compact ? [-4, 4] : [-13, 11]), { stiffness: 80, damping: 24 });
  const copyY = useSpring(useTransform(scrollYProgress, [0, 1], compact ? [5, -4] : [15, -9]), { stiffness: 80, damping: 25 });
  return (
    <section className="founder-story" ref={storyRef} aria-labelledby="founder-story-title">
      <motion.div className="founder-story__photo" style={{ x: photoX, y: photoY }} initial={{ opacity: 0, x: -34, filter: "blur(7px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .25 }} transition={{ duration: .7, ease: [0.23, 1, 0.32, 1] }}>
        <img src={STORY_ASSETS.founder} alt="A restaurant owner preparing a fresh paratha roll in the kitchen" loading="lazy" decoding="async" />
        <span className="founder-story__stamp"><ChefHat /> Made in Wah</span>
      </motion.div>
      <motion.div className="founder-story__copy" style={{ y: copyY }} initial={{ opacity: 0, x: 28, filter: "blur(7px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .25 }} transition={{ duration: .7, ease: [0.23, 1, 0.32, 1] }}>
        <p className="eyebrow">The people behind the pull</p>
        <h2 id="founder-story-title" className="scroll-title"><motion.span initial={{ y: "105%" }} whileInView={{ y: 0 }} viewport={{ once: true, amount: .55 }} transition={{ duration: .56, ease: [0.23, 1, 0.32, 1] }}>A small kitchen.</motion.span><motion.span initial={{ y: "105%" }} whileInView={{ y: 0 }} viewport={{ once: true, amount: .55 }} transition={{ duration: .56, delay: .08, ease: [0.23, 1, 0.32, 1] }}>A generous idea.</motion.span></h2>
        <p>Cheeseful Bites was built by <strong>Abdul Ahad</strong> around a simple belief: late-night comfort food should feel freshly made, generously packed, and worth coming back for.</p>
        <p>From the prep counter to the final fold, every order is handled with the kind of care you expect from a neighbourhood spot—not a faceless chain.</p>
        <div className="founder-story__values"><span><Sparkles /> Freshly assembled</span><span><HeartHandshake /> Made for Wah</span></div>
      </motion.div>
    </section>
  );
}

function KitchenStory() {
  const compact = useCompactMotion();
  const storyRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ["start end", "end start"] });
  const teamX = useSpring(useTransform(scrollYProgress, [0, 1], compact ? [6, -5] : [16, -14]), { stiffness: 82, damping: 25 });
  const prepY = useSpring(useTransform(scrollYProgress, [0, 1], compact ? [-5, 6] : [-12, 16]), { stiffness: 82, damping: 25 });
  return (
    <section className="kitchen-story" ref={storyRef} aria-labelledby="kitchen-story-title">
      <motion.div className="kitchen-story__copy" initial={{ opacity: 0, x: -32, filter: "blur(7px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .25 }} transition={{ duration: .7, ease: [0.23, 1, 0.32, 1] }}>
        <p className="eyebrow">A note from Abdul Ahad</p>
        <h2 id="kitchen-story-title" className="scroll-title"><motion.span initial={{ y: "105%" }} whileInView={{ y: 0 }} viewport={{ once: true, amount: .45 }} transition={{ duration: .56, ease: [0.23, 1, 0.32, 1] }}>Good food takes</motion.span><motion.span initial={{ y: "105%" }} whileInView={{ y: 0 }} viewport={{ once: true, amount: .45 }} transition={{ duration: .56, delay: .08, ease: [0.23, 1, 0.32, 1] }}><em> real hands.</em></motion.span></h2>
        <p>“Whether you stop by after class, pick up on the way home, or order for everyone at the table, I want your meal to arrive warm, generous, and worth the craving.”</p>
        <p className="founder-signoff">— Abdul Ahad, owner</p>
        <Link href="/menu" className="btn btn-orange">Choose your bite <ArrowRight /></Link>
      </motion.div>
      <motion.div className="kitchen-story__photos" initial={{ opacity: 0, x: 32, filter: "blur(7px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .25 }} transition={{ duration: .7, ease: [0.23, 1, 0.32, 1] }}>
        <motion.img style={{ x: teamX }} className="kitchen-story__team" src={STORY_ASSETS.team} alt="Restaurant staff preparing paratha rolls together" loading="lazy" decoding="async" />
        <motion.img style={{ y: prepY }} className="kitchen-story__prep" src={STORY_ASSETS.prep} alt="A fresh paratha roll being prepared at the counter" loading="lazy" decoding="async" />
      </motion.div>
    </section>
  );
}

function PopularCard({ item }: { item: MenuItem }) {
  const { add } = useCart();
  return <article className="popular-card"><Link href={`/product/${item.id}`} className="popular-card__image"><img src={item.image} alt={item.title} loading="lazy" decoding="async" />{item.badge && <span className="mini-badge">{item.badge}</span>}</Link><div className="popular-card__copy"><FavoriteButton menuItemId={item.id} title={item.title} /><h3>{item.title}</h3><p>{item.description}</p><div className="popular-card__bottom"><b>{formatPKR(item.price)}</b><button className="circle-add" onClick={() => add(item)} aria-label={`Add ${item.title}`}><Plus size={21} /></button></div></div></article>;
}

export default function Home() {
  const compact = useCompactMotion();
  const { items } = useRestaurantMenu();
  const popular = items.filter((item) => ["zinger-roll-paratha", "chicken-shawarma", "zinger-shawarma", "cheese-shawarma"].includes(item.id));
  const featured = items.find((item) => item.id === "zinger-roll-paratha");
  const featuredTitle = featured?.title ?? "Zinger Roll Paratha";
  const featuredPrice = formatPKR(featured?.price ?? 300);
  return <StorefrontLayout active="home"><section className="home-page content-wrap">
    <motion.section className="hero-card hero-card--burger" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease: [0.23, 1, 0.32, 1] }}>
      <div className="hero-copy">
        <p className="hero-copy__kicker"><span /> Cheeseful Bites · Wah Model Town</p>
        <h1><span>WARM ROLLS.</span><strong>BIG CHEESE.</strong></h1>
        <p className="hero-copy__product">Signature pick · <b>{featuredTitle}</b> · {featuredPrice}</p>
        <p className="hero-copy__lead">Crispy zinger chicken, flaky paratha, and a generous cheese pull—made fresh for Wah’s comfort-food cravings.</p>
        <div className="hero-copy__actions"><Link href="/menu" className="btn btn-orange">Explore menu <ArrowRight /></Link><Link href="/product/zinger-roll-paratha" className="btn hero-order-btn">Order zinger roll</Link></div>
        <div className="hero-promises" aria-label="Cheeseful Bites quality promises"><span><i className="hero-promise-icon"><Sparkles size={16} /></i><b>Made</b> to order</span><span><i className="hero-promise-icon hero-promise-icon--flame"><Flame size={16} /></i><b>Hot</b> from Wah</span></div>
      </div>
      <div className="hero-art" aria-label={`Featured ${featuredTitle}`}>
        <img className="hero-art__photo" src={CLEAN_HERO_IMAGE} alt="A freshly made Cheeseful Bites zinger roll paratha with crispy chicken and melted cheese" width={1600} height={900} fetchPriority="high" decoding="async" />
      </div>
    </motion.section>
    <motion.section className="categories-section" {...(compact ? revealCompact : revealLeft)}><h2>Menu Categories</h2><div className="category-grid">{categoryCards.map((card) => <Link href={card.href} className="category-card" key={card.title}><img src={card.image} alt={card.title} loading="lazy" decoding="async" /><i /><h3>{card.title}</h3></Link>)}</div><div className="mobile-category-strip">{categoryCards.map((card, index) => <Link href={card.href} key={card.title}><span className={`category-orb category-orb--${index}`}><img src={card.image} alt="" loading="lazy" decoding="async" /></span><b>{card.title}</b></Link>)}</div></motion.section>
    <motion.section className="popular-section" {...(compact ? revealCompact : revealRight)}><div className="popular-heading"><h2><Flame />Popular Now</h2><Link href="/menu">See All Menu <ArrowRight /></Link></div><div className="popular-grid">{popular.map((item) => <PopularCard item={item} key={item.id} />)}</div></motion.section>
    <section className="flavor-marquee" aria-label="Cheeseful Bites motto"><div><span>CRUNCH · MELT · REPEAT</span><i>✦</i><span>CRUNCH · MELT · REPEAT</span><i>✦</i><span>CRUNCH · MELT · REPEAT</span><i>✦</i></div></section>
    <JourneySection /><FounderStory />
    <motion.section className="home-location" {...(compact ? revealCompact : revealLeft)}><div className="home-location__copy"><p className="eyebrow">Made in Wah</p><h2>Find your next<br /><em>cheese fix.</em></h2><p>Stop by in Phase-II Wah Model Town for a warm pickup, a quick bite, or a full cheese-loaded order to take home.</p><div className="location-address"><MapPin /><span>QP8J+V6R, Lane 21, Phase-II Wah Model Town, Wah, 47010, Pakistan</span></div><a className="btn btn-red" href="https://www.google.com/maps/search/?api=1&query=QP8J%2BV6R%2C%20Lane%2021%2C%20Phase-II%20Wah%20Model%20Town%2C%20Wah%2C%2047010%2C%20Pakistan" target="_blank" rel="noreferrer"><Route />Get directions</a></div><a className="home-location__map" href="https://www.google.com/maps/search/?api=1&query=QP8J%2BV6R%2C%20Lane%2021%2C%20Phase-II%20Wah%20Model%20Town%2C%20Wah%2C%2047010%2C%20Pakistan" target="_blank" rel="noreferrer"><img src={LOCAL_ASSETS.locationMap} alt="Map centered on Cheeseful Bites in Wah Model Town" loading="lazy" decoding="async" /><span><MapPin /> Tap for live directions</span></a></motion.section>
    <KitchenStory />
  </section></StorefrontLayout>;
}
