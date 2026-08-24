# Cheeseful Bites — React Client Handoff

This folder is the portable **React + Vite + TypeScript** version of the live Cheeseful Bites storefront. It is designed to open cleanly in VS Code or another IDE, be customized locally, and then be handed to a client or deployment team.

## Start locally

Install Node.js 20+ and pnpm, then run:

```bash
pnpm install
cp env.template .env.local
pnpm dev
```

Open the local URL printed by Vite. Before testing sign-in, menu management, favourites, reviews, or the restaurant assistant, add the public Supabase values and a server-only `GROQ_API_KEY` to `.env.local`. The archive intentionally excludes all credentials, email transport details, session values, and private service keys.

## What is included

| Location | Purpose |
| --- | --- |
| `src/` | Complete editable React application: storefront, customer profile, owner panel, Supabase hooks, cart, favourites, menu, reviews, motion, and styling. |
| `public/assets/` | Fourteen optimized editable WebP assets: logo, chef assistant, hero, menu images, story photography, menu board, and location map. |
| `server/index.mjs` | Local/production Express endpoint for the Groq-powered, restaurant-only assistant. |
| `public/favicon.svg` | Editable browser favicon. |
| `src/lib/assets.ts` | Portable asset map. Change this file when renaming/replacing a bundled image. |
| `supabase/migrations/` | Versioned database and RLS migration history for the restaurant data model. |
| `docs/` | Setup and asset guidance for a client handoff. |

## Important handoff rules

The React app uses Supabase directly in the browser. Keep the following safety boundaries when you hand this project over:

1. Use only a **publishable** browser key in `VITE_SUPABASE_PUBLISHABLE_KEY`; never put a service-role key or SMTP credential in a Vite environment file.
2. Add the client deployment domain to Supabase Auth redirect URLs before enabling email confirmation in that deployment.
3. Every new profile is designed to be a customer. Change `public.profiles.role` to `admin` only from a trusted Supabase dashboard session.
4. Do not seed or fabricate reviews. The review queue is intentionally empty until genuine customers submit feedback.
5. Keep `GROQ_API_KEY` in server environment settings only. The assistant is intentionally limited to Cheeseful Bites information and uses `openai/gpt-oss-20b` through Groq’s Responses API.

## Customizing content and images

Replace WebP files in `public/assets/` while preserving their filenames, or rename them and update `src/lib/assets.ts`. Menu items retrieved from Supabase are normalized through the same asset map, so the handoff still renders locally while you migrate restaurant media to your own Supabase Storage bucket.

For a new production project, upload the corresponding assets to your Supabase Storage bucket, update the menu image URLs in `restaurant_menu_items`, and then deploy using `pnpm build` plus `pnpm start` with the same environment values. Detailed setup is in [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md), [`docs/ASSISTANT_SETUP.md`](docs/ASSISTANT_SETUP.md), the full asset list is in [`docs/ASSET_MANIFEST.md`](docs/ASSET_MANIFEST.md), and the source-tree guide is in [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md).
