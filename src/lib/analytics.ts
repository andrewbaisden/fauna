export function isPostHogEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);
}

export const ANALYTICS_EVENTS = {
  speciesViewed: "species_viewed",
  speciesSearched: "species_searched",
  filterApplied: "filter_applied",
  viewerOpened: "3d_viewer_opened",
  modelLoaded: "3d_model_loaded",
  modelFailed: "3d_model_failed",
  speciesCompared: "species_compared",
  favouriteAdded: "favourite_added",
  favouriteRemoved: "favourite_removed",
  randomOpened: "random_species_opened",
  habitatViewed: "habitat_viewed",
  taxonomyNavigated: "taxonomy_navigated",
} as const;
