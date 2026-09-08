import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UnitSystem } from "@/domain/units";

interface PreferencesState {
  unitSystem: UnitSystem;
  setUnitSystem: (unitSystem: UnitSystem) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      unitSystem: "METRIC",
      setUnitSystem: (unitSystem) => set({ unitSystem }),
    }),
    { name: "fauna-preferences" },
  ),
);

interface RecentsState {
  slugs: string[];
  push: (slug: string) => void;
}

export const useRecentsStore = create<RecentsState>()(
  persist(
    (set, get) => ({
      slugs: [],
      push: (slug) => {
        const next = [
          slug,
          ...get().slugs.filter((item) => item !== slug),
        ].slice(0, 12);
        set({ slugs: next });
      },
    }),
    { name: "fauna-recents" },
  ),
);

interface ViewerState {
  preset: "front" | "side" | "rear";
  showScale: boolean;
  setPreset: (preset: "front" | "side" | "rear") => void;
  toggleScale: () => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  preset: "front",
  showScale: false,
  setPreset: (preset) => set({ preset }),
  toggleScale: () => set((state) => ({ showScale: !state.showScale })),
}));
