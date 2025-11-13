import { create } from "zustand";
import type { FilterState } from "../lib/filters";

type State = {
  realm: "cosmic" | "human" | "disrupted";
  filters: FilterState;
  pinned: Set<string>;
  selectedId: string | null;
  visitedIds: Set<string>;
  
  // Timeline & Journey
  centuryFilter: 19 | 20 | null;
  selectedJourney: string | null;
  
  // Comparison mode
  comparisonMode: boolean;
  
  setSelectedId: (id: string | null) => void;
  markVisited: (id: string) => void;
  setRealm: (r: State["realm"]) => void;
  setFilters: (f: Partial<FilterState>) => void;
  togglePin: (id: string) => void;
  setPinned: (pinned: Set<string>) => void;
  setCenturyFilter: (c: 19 | 20 | null) => void;
  setJourney: (j: string | null) => void;
  toggleComparisonMode: () => void;
};

export const useStore = create<State>((set, get) => ({
  realm: "human",
  filters: { types: [], categories: [], emotions: [], yearRange: null, search: "" },
  pinned: new Set(),
  selectedId: null,
  visitedIds: new Set(),
  
  centuryFilter: null,
  selectedJourney: null,
  comparisonMode: false,

  setRealm: (r) => set({ realm: r }),

  setFilters: (f) =>
    set({
      filters: { ...get().filters, ...f },
    }),

  togglePin: (id) => {
    const p = new Set(get().pinned);
    p.has(id) ? p.delete(id) : p.add(id);
    set({ pinned: p });
  },

  setPinned: (pinned) => set({ pinned }),

  setSelectedId: (id) => set({ selectedId: id }),
  markVisited: (id) => {
    const v = new Set(get().visitedIds);
    v.add(id);
    set({ visitedIds: v });
  },
  
  setCenturyFilter: (c) => set({ centuryFilter: c }),
  setJourney: (j) => set({ selectedJourney: j }),
  toggleComparisonMode: () => set({ comparisonMode: !get().comparisonMode }),
}));