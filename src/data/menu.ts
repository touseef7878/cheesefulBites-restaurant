import { LOCAL_ASSETS } from "@/lib/assets";

/**
 * Cheeseful Bites visual system: Cheesy Maximalism — real menu-board data, PKR pricing,
 * bold outlined food UI, and a playful high-contrast ordering flow.
 */
export type MenuCategory =
  | "Crispy Clock"
  | "Paratha Roll"
  | "Shawarma"
  | "Wraps"
  | "Sides"
  | "Drinks";

export type MenuItem = {
  id: string;
  category: MenuCategory;
  title: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  variants?: { label: string; price: number }[];
  available?: boolean;
  sortOrder?: number;
};

export const ASSETS = {
  logo: LOCAL_ASSETS.logo,
  brandArt: LOCAL_ASSETS.brandArt,
  board: LOCAL_ASSETS.board,
  hero: LOCAL_ASSETS.hero,
  paratha: LOCAL_ASSETS.paratha,
  shawarma: LOCAL_ASSETS.shawarma,
  wrap: LOCAL_ASSETS.wrap,
};

export const menuItems: MenuItem[] = [
  {
    id: "zinger-roll-paratha",
    category: "Paratha Roll",
    title: "Zinger Roll Paratha",
    description:
      "Crispy golden zinger chicken with crunchy salad, spicy mayo, and an unapologetic cheese pull.",
    price: 300,
    image: ASSETS.hero,
    badge: "Best Seller",
  },
  {
    id: "bbq-roll-paratha",
    category: "Paratha Roll",
    title: "BBQ Roll Paratha",
    description: "Smoky BBQ chicken, fresh salad, and house sauce wrapped in flaky paratha.",
    price: 350,
    image: ASSETS.paratha,
  },
  {
    id: "cheesy-roll-paratha",
    category: "Paratha Roll",
    title: "Cheesy Roll Paratha",
    description: "Chicken, herbs, and extra cheddar tucked into a golden grilled paratha.",
    price: 350,
    image: ASSETS.paratha,
    badge: "Cheesy",
  },
  {
    id: "chicken-shawarma",
    category: "Shawarma",
    title: "Chicken Shawarma",
    description: "Classic grilled chicken with fresh onions, pickles, and a generous garlic swirl.",
    price: 200,
    image: ASSETS.shawarma,
  },
  {
    id: "zinger-shawarma",
    category: "Shawarma",
    title: "Zinger Shawarma",
    description: "Crispy zinger pieces, chilli crunch, and cool garlic mayo in soft flatbread.",
    price: 250,
    image: ASSETS.shawarma,
    badge: "Hot",
  },
  {
    id: "cheese-shawarma",
    category: "Shawarma",
    title: "Cheese Shawarma",
    description: "Chicken shawarma made extra with a melted cheese layer and tangy house sauce.",
    price: 300,
    image: ASSETS.shawarma,
  },
  {
    id: "chicken-wrap",
    category: "Wraps",
    title: "Chicken Wrap",
    description: "Juicy chicken, crunchy salad, and sauce in a toasted wrap.",
    price: 350,
    image: ASSETS.wrap,
  },
  {
    id: "zinger-wrap",
    category: "Wraps",
    title: "Zinger Wrap",
    description: "A crunchy zinger fillet, salad, and cheese folded into a warm toasted wrap.",
    price: 350,
    image: ASSETS.wrap,
    badge: "Spicy",
  },
  {
    id: "tandoori-wrap",
    category: "Wraps",
    title: "Tandoori Wrap",
    description: "Tandoori-seasoned chicken with a bright, creamy, cheesy finish.",
    price: 400,
    image: ASSETS.wrap,
  },
  {
    id: "chicken-wings",
    category: "Crispy Clock",
    title: "Chicken Wings",
    description: "Crispy, juicy chicken wings straight from the Crispy Clock.",
    price: 350,
    image: ASSETS.hero,
    badge: "Hot",
    variants: [
      { label: "5 Pcs", price: 350 },
      { label: "10 Pcs", price: 650 },
    ],
  },
  {
    id: "chicken-strips",
    category: "Crispy Clock",
    title: "Chicken Strips",
    description: "Golden chicken strips for dipping, sharing, and satisfying a big crunch craving.",
    price: 300,
    image: ASSETS.hero,
    variants: [
      { label: "5 Pcs", price: 300 },
      { label: "10 Pcs", price: 550 },
    ],
  },
  {
    id: "golden-onion-rings",
    category: "Sides",
    title: "Golden Onion Rings",
    description: "Thick-cut onion rings battered and fried to a perfect golden crisp.",
    price: 450,
    image: ASSETS.brandArt,
  },
  {
    id: "fizzy-cola",
    category: "Drinks",
    title: "Fizzy Cola",
    description: "Ice-cold cola to balance the cheese and heat.",
    price: 80,
    image: ASSETS.brandArt,
    variants: [
      { label: "Can", price: 80 },
      { label: "1 Ltr", price: 170 },
    ],
  },
];

export const categories: MenuCategory[] = [
  "Crispy Clock",
  "Paratha Roll",
  "Shawarma",
  "Wraps",
  "Sides",
  "Drinks",
];

export const findMenuItem = (id: string) =>
  menuItems.find((item) => item.id === id) ?? menuItems[0];

export const formatPKR = (amount: number) => `Rs. ${amount.toLocaleString("en-PK")}`;
