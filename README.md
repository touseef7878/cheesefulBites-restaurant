# 🧀 Cheeseful Bites

> A full-stack, production-ready restaurant storefront built with React 19, Vite, TypeScript, Supabase, and a Groq-powered AI assistant — designed for fast customization and clean client handoffs.

---

## Overview

Cheeseful Bites is a modern restaurant web application featuring a customer-facing storefront, a real-time ordering system, an owner admin panel, and an AI chat assistant scoped exclusively to restaurant content. The codebase follows a "Cheesy Maximalism" visual system with fluid motion, responsive layouts, and a dark/light theme foundation ready to adapt to any brand identity.

The project is structured for handoff — every credential is externalized, every asset is swappable, and the database schema is version-controlled through Supabase migrations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 |
| Component Library | Radix UI primitives + shadcn/ui |
| Animation | Framer Motion |
| Routing | Wouter |
| Backend / Auth / DB | Supabase (Postgres + RLS + Auth) |
| AI Assistant | Groq API via OpenAI-compatible client |
| Server | Express (local dev + production static server) |
| Package Manager | pnpm |

---

## Features

- **Storefront & Menu** — Live menu pulled from Supabase with local fallback, product detail pages, category filtering, and optimized WebP food photography
- **Cart & Checkout** — Persistent cart state with order submission and WhatsApp order formatting
- **Customer Profile** — Supabase Auth (email/password), profile management, and order history
- **Favourites** — Saved menu items synced per user via Supabase
- **Owner Admin Panel** — Menu management, order queue, and review moderation behind a role-gated `/admin` route
- **AI Restaurant Assistant** — Groq-powered chat assistant limited to Cheeseful Bites content; runs server-side so the API key never reaches the browser
- **Theme System** — Light/dark mode via `next-themes`, fully controlled through CSS custom properties in `index.css`
- **Accessibility** — Radix UI primitives, reduced-motion support via `MotionConfig`, and semantic HTML throughout

---

## Project Structure

```text
cheeseful-bites/
├── public/
│   ├── assets/          # 14 optimized WebP images (logo, hero, menu, story, map)
│   └── favicon.svg
├── src/
│   ├── components/      # Storefront UI, AI assistant, cart controls, UI primitives
│   ├── contexts/        # Auth, cart, favourites, and theme providers
│   ├── data/menu.ts     # Local fallback menu and asset references
│   ├── hooks/           # Supabase menu hook, responsive helpers
│   ├── lib/             # Supabase client, asset map, WhatsApp formatter
│   ├── pages/           # Home, Menu, Product, Checkout, Orders, Profile, Favorites, Admin, Contact
│   ├── App.tsx          # Providers, motion config, and routes
│   └── index.css        # Global visual system and design tokens
├── server/index.mjs     # Groq assistant endpoint + production static file server
├── supabase/migrations/ # Versioned schema, RLS policies, roles, storage, and favourites
├── docs/                # Setup guides for Supabase, assistant, assets, and project structure
├── api/                 # Vercel serverless function variant of the assistant endpoint
├── env.template         # All required variable keys — no values or credentials
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- A Supabase project (free tier works fine)
- A Groq API key for the AI assistant

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment template
cp env.template .env.local

# 3. Fill in your credentials in .env.local
#    VITE_SUPABASE_URL
#    VITE_SUPABASE_PUBLISHABLE_KEY
#    GROQ_API_KEY

# 4. Run database migrations
#    Apply files in supabase/migrations/ via the Supabase dashboard or CLI

# 5. Start the dev server (client + Express assistant server, concurrently)
pnpm dev
```

Open the local URL printed by Vite. Sign-in, favourites, reviews, and the AI assistant all require the environment values above to be present.

### Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start client and Express server concurrently with hot reload |
| `pnpm build` | Production build output to `dist/` |
| `pnpm start` | Run production Express server serving the built `dist/` |
| `pnpm preview` | Preview the production build locally via Vite |
| `pnpm check` | TypeScript type-check without emitting |

---

## Environment Variables

| Variable | Where it lives | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env.local` | Supabase project URL (public, safe in browser) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env.local` | Supabase anon/publishable key (public, safe in browser) |
| `GROQ_API_KEY` | `.env.local` / server env | Groq API key — **server-side only, never expose to client** |

Never commit `.env.local`. The `.gitignore` already excludes it. For production, set these as environment variables in your hosting platform (Vercel, Railway, Render, etc.).

---

## Customization Guide

### Replacing Content & Images

Swap any file in `public/assets/` while keeping the same filename, or rename files and update the path references in `src/lib/assets.ts`. The asset map is the single source of truth for all image references across the app.

### Updating the Menu

Menu items are stored in Supabase (`restaurant_menu_items`). For local development without a database, edit `src/data/menu.ts` directly — the app falls back to this file automatically.

### Changing the Visual Theme

All design tokens (colors, radii, spacing) live in `src/index.css` as CSS custom properties. Change the palette there and it propagates to every component. Toggle between light and dark defaults in `src/App.tsx` via the `defaultTheme` prop on `ThemeProvider`.

### Tuning the AI Assistant

The assistant prompt and model are configured in `server/index.mjs`. It is scoped to Cheeseful Bites content by design — update the system prompt there to reflect any menu or policy changes.

---

## Deployment

1. Run `pnpm build` to generate the `dist/` folder
2. Set the three environment variables in your hosting platform
3. Add your production domain to the Supabase Auth redirect URL list
4. Run `pnpm start` (or let your platform serve `dist/` + the Express server)

For Vercel deployments, the `api/restaurant-assistant.js` serverless function is included as an alternative to the Express server.

---

## Security Notes

- Use only the **publishable/anon** Supabase key in any `VITE_*` variable — never a service-role key
- `GROQ_API_KEY` must stay in server-only environment settings
- Row-Level Security (RLS) is enabled on all tables — review `supabase/migrations/` before modifying policies
- Customer roles are set to `customer` by default; promote to `admin` only from a trusted Supabase dashboard session
- Do not seed or fabricate reviews — the review queue is intentionally empty until real customers submit feedback

---

## Documentation

| Guide | Description |
|---|---|
| [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) | Database setup, migrations, RLS, and storage configuration |
| [`docs/ASSISTANT_SETUP.md`](docs/ASSISTANT_SETUP.md) | Groq API integration and assistant configuration |
| [`docs/ASSET_MANIFEST.md`](docs/ASSET_MANIFEST.md) | Full list of bundled assets and replacement instructions |
| [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md) | Detailed source-tree walkthrough |

---

## Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home / Storefront | Public |
| `/menu` | Full Menu | Public |
| `/product/:id` | Product Detail | Public |
| `/checkout` | Cart & Checkout | Public |
| `/orders` | Order History | Authenticated |
| `/profile` | Customer Profile | Authenticated |
| `/favorites` | Saved Items | Authenticated |
| `/contact` | Contact Page | Public |
| `/admin` | Owner Dashboard | Admin role only |

---

*Built with React + Supabase + Groq. Ready to deploy.*
