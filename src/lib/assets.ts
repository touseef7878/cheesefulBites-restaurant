/**
 * Portable asset helper for the IDE handoff. Every bundled image is editable
 * under public/assets and is served locally from /assets in development and production.
 */
export const LOCAL_ASSETS = {
  logo: "/assets/cheeseful-badge.webp",
  brandArt: "/assets/cheeseful-brand-art.webp",
  board: "/assets/cheeseful-real-menu-board.webp",
  hero: "/assets/cheeseful-hero-zinger.webp",
  paratha: "/assets/cheeseful-paratha-roll.webp",
  shawarma: "/assets/cheeseful-shawarma.webp",
  wrap: "/assets/cheeseful-cheese-wrap.webp",
  founder: "/assets/cheeseful-founder-kitchen.webp",
  kitchenTeam: "/assets/cheeseful-kitchen-team.webp",
  prepDetail: "/assets/cheeseful-prep-detail.webp",
  locationMap: "/assets/cheeseful-location-map.webp",
  singleHero: "/assets/cheeseful-single-zinger-hero.webp",
  liveZinger: "/assets/cheeseful-zinger-roll-live.webp",
  assistantChef: "/assets/cheeseful-assistant-chef.webp",
} as const;

const managedAssetAliases: Record<string, string> = {
  "cheeseful-badge_8a998851.webp": LOCAL_ASSETS.logo,
  "cheeseful-brand-art_56301053.webp": LOCAL_ASSETS.brandArt,
  "cheeseful-real-menu-board_e1536c5d.webp": LOCAL_ASSETS.board,
  "cheeseful-hero-zinger_40246876.webp": LOCAL_ASSETS.hero,
  "cheeseful-paratha-roll_1d56acb9.webp": LOCAL_ASSETS.paratha,
  "cheeseful-shawarma_b3cfe191.webp": LOCAL_ASSETS.shawarma,
  "cheeseful-cheese-wrap_8053b8dc.webp": LOCAL_ASSETS.wrap,
  "cheeseful-founder-kitchen_9067b843.webp": LOCAL_ASSETS.founder,
  "cheeseful-kitchen-team_74952bd4.webp": LOCAL_ASSETS.kitchenTeam,
  "cheeseful-prep-detail_ec52e312.webp": LOCAL_ASSETS.prepDetail,
  "cheeseful-location-map_d7b44798.webp": LOCAL_ASSETS.locationMap,
  "cheeseful-single-zinger-hero_6e081628.webp": LOCAL_ASSETS.singleHero,
  "cheeseful-zinger-roll-live_4961f93f.webp": LOCAL_ASSETS.liveZinger,
  "cheeseful-badge_4cab5941.png": LOCAL_ASSETS.logo,
  "cheeseful-brand-art_1f23a701.png": LOCAL_ASSETS.brandArt,
  "cheeseful-real-menu-board_e6817a13.png": LOCAL_ASSETS.board,
  "cheeseful-hero-zinger_193e0b69.jpg": LOCAL_ASSETS.hero,
  "cheeseful-paratha-roll_2fc017ce.jpg": LOCAL_ASSETS.paratha,
  "cheeseful-shawarma_6657dea6.jpg": LOCAL_ASSETS.shawarma,
  "cheeseful-cheese-wrap_bc5d98c0.jpg": LOCAL_ASSETS.wrap,
  "cheeseful-founder-kitchen_2d771f15.jpg": LOCAL_ASSETS.founder,
  "cheeseful-kitchen-team_fb54969a.jpg": LOCAL_ASSETS.kitchenTeam,
  "cheeseful-prep-detail_be523130.jpg": LOCAL_ASSETS.prepDetail,
  "cheeseful-location-map_8202289a.png": LOCAL_ASSETS.locationMap,
  "cheeseful-single-zinger-hero_c7ca559d.jpg": LOCAL_ASSETS.singleHero,
};

export function resolvePortableImage(image: string): string {
  const fileName = image.split("/").pop() ?? "";
  return managedAssetAliases[fileName] ?? image;
}
