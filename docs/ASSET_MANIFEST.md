# Editable Asset Manifest

All artwork in `public/assets/` is WebP and is included in the handoff ZIP. The public app resolves these local files through `src/lib/assets.ts`.

| File | Primary use | Recommended editing approach |
| --- | --- | --- |
| `cheeseful-badge.webp` | Brand lockup logo | Replace with a square brand mark; keep transparent or simple background. |
| `cheeseful-assistant-chef.webp` | Restaurant assistant icon | Replace with a square assistant illustration; keep the subject centered for circular crops. |
| `cheeseful-single-zinger-hero.webp` | Homepage LCP hero | Keep a 16:9 composition with food right-weighted for the homepage copy. |
| `cheeseful-zinger-roll-live.webp` | Zinger Roll Paratha product image | Keep a 16:9 food crop. |
| `cheeseful-hero-zinger.webp` | Crispy Clock menu imagery | Keep a high-contrast food crop. |
| `cheeseful-paratha-roll.webp` | Paratha Roll cards | Keep square. |
| `cheeseful-shawarma.webp` | Shawarma cards | Keep square. |
| `cheeseful-cheese-wrap.webp` | Wrap cards | Keep square. |
| `cheeseful-real-menu-board.webp` | Desktop menu feature | Keep portrait. |
| `cheeseful-founder-kitchen.webp` | Founder story | Keep landscape. |
| `cheeseful-kitchen-team.webp` | Kitchen story | Keep landscape. |
| `cheeseful-prep-detail.webp` | Kitchen preparation detail | Keep landscape. |
| `cheeseful-location-map.webp` | Contact and location sections | Replace only with an accurate business map image. |
| `cheeseful-brand-art.webp` | Side and drinks fallback art | Keep square. |

> Keep filenames stable for the fastest customization workflow. If you rename a file, update the matching entry in `src/lib/assets.ts` and re-run `pnpm build`.
