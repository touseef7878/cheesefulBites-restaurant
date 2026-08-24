# Project Structure Guide

```text
cheeseful-bites-react-handoff/
├── public/
│   ├── assets/                  # Editable WebP logo, chef, hero, menu, story, and map images
│   └── favicon.svg              # Browser icon
├── src/
│   ├── components/              # Shared storefront UI, chef assistant, controls, and UI primitives
│   ├── contexts/                # Supabase auth, cart, favourites, and theme state
│   ├── data/menu.ts             # Fallback menu data and local asset references
│   ├── hooks/                   # Live Supabase menu hook and responsive helpers
│   ├── lib/                     # Supabase client, portable image map, WhatsApp order formatting
│   ├── pages/                   # Home, menu, product, checkout, profile, admin, and contact screens
│   ├── App.tsx                  # Providers and routes
│   └── index.css                # Global visual system and responsive styles
├── server/index.mjs             # Groq restaurant-assistant endpoint and production static server
├── supabase/migrations/         # Database schema, RLS, favourites, storage, and role migrations
├── docs/                        # Setup, security, asset, assistant, and structure guides
├── env.template                 # Placeholder variables only; contains no credentials
├── package.json                 # `pnpm dev`, `pnpm build`, and `pnpm start` commands
└── vite.config.ts               # React build settings and local `/api` proxy
```

> Begin customization with `src/pages/`, `src/data/menu.ts`, `public/assets/`, and `src/index.css`. Keep the Supabase browser values and `GROQ_API_KEY` outside source control.
