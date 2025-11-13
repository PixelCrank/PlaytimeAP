import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FilterState } from "../lib/filters";

export type CustomJourney = {
  id: string;
  title: string;
  description: string;
  workIds: string[];
  transitions: { [key: string]: string }; // workId -> transition note
  createdAt: number;
  updatedAt: number;
};

export type SavedInsight = {
  id: string;
  type: 'discovery' | 'comparison' | 'anomaly' | 'pattern';
  message: string;
  icon: string;
  timestamp: number;
  filterState: {
    realm: string;
    filters: FilterState;
    centuryFilter: number | null;
    totalWorks: number;
  };
  bookmarked: boolean;
};

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
  
  // Collection Management
  bookmarked: Set<string>;
  customJourneys: CustomJourney[];
  
  // Insight History
  insightHistory: SavedInsight[];
  bookmarkedInsights: Set<string>;
  
  setSelectedId: (id: string | null) => void;
  markVisited: (id: string) => void;
  setRealm: (r: State["realm"]) => void;
  setFilters: (f: Partial<FilterState>) => void;
  togglePin: (id: string) => void;
  setPinned: (pinned: Set<string>) => void;
  setCenturyFilter: (c: 19 | 20 | null) => void;
  setJourney: (j: string | null) => void;
  toggleComparisonMode: () => void;
  
  // Collection actions
  toggleBookmark: (id: string) => void;
  addCustomJourney: (journey: Omit<CustomJourney, "id" | "createdAt" | "updatedAt">) => void;
  updateCustomJourney: (id: string, updates: Partial<Omit<CustomJourney, "id" | "createdAt">>) => void;
  deleteCustomJourney: (id: string) => void;
  
  // Insight actions
  saveInsight: (insight: Omit<SavedInsight, "id" | "timestamp" | "bookmarked">) => void;
  toggleInsightBookmark: (id: string) => void;
  deleteInsight: (id: string) => void;
  clearInsightHistory: () => void;
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      realm: "human",
      filters: { types: [], categories: [], emotions: [], yearRange: null, search: "" },
      pinned: new Set(),
      selectedId: null,
      visitedIds: new Set(),
      
      centuryFilter: null,
      selectedJourney: null,
      comparisonMode: false,
      
      bookmarked: new Set(),
      customJourneys: [],
      
      insightHistory: [],
      bookmarkedInsights: new Set(),

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
      
      toggleBookmark: (id) => {
        const b = new Set(get().bookmarked);
        b.has(id) ? b.delete(id) : b.add(id);
        set({ bookmarked: b });
      },
      
      addCustomJourney: (journey) => {
        const newJourney: CustomJourney = {
          ...journey,
          id: `journey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({ customJourneys: [...get().customJourneys, newJourney] });
      },
      
      updateCustomJourney: (id, updates) => {
        set({
          customJourneys: get().customJourneys.map((j) =>
            j.id === id ? { ...j, ...updates, updatedAt: Date.now() } : j
          ),
        });
      },
      
      deleteCustomJourney: (id) => {
        set({ customJourneys: get().customJourneys.filter((j) => j.id !== id) });
      },
      
      saveInsight: (insight) => {
        const newInsight: SavedInsight = {
          ...insight,
          id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          bookmarked: false,
        };
        // Prevent duplicates (same message within 1 minute)
        const recentDuplicate = get().insightHistory.find(
          i => i.message === insight.message && Date.now() - i.timestamp < 60000
        );
        if (recentDuplicate) return;
        
        set({ insightHistory: [newInsight, ...get().insightHistory].slice(0, 100) }); // Keep last 100
      },
      
      toggleInsightBookmark: (id) => {
        const b = new Set(get().bookmarkedInsights);
        b.has(id) ? b.delete(id) : b.add(id);
        set({ bookmarkedInsights: b });
      },
      
      deleteInsight: (id) => {
        set({ 
          insightHistory: get().insightHistory.filter((i) => i.id !== id),
          bookmarkedInsights: (() => {
            const b = new Set(get().bookmarkedInsights);
            b.delete(id);
            return b;
          })()
        });
      },
      
      clearInsightHistory: () => {
        set({ 
          insightHistory: get().insightHistory.filter(i => get().bookmarkedInsights.has(i.id)),
        });
      },
    }),
    {
      name: "playtime-collection",
      partialize: (state) => ({
        bookmarked: Array.from(state.bookmarked),
        customJourneys: state.customJourneys,
        insightHistory: state.insightHistory,
        bookmarkedInsights: Array.from(state.bookmarkedInsights),
      }),
      merge: (persisted: any, current) => ({
        ...current,
        bookmarked: new Set(persisted?.bookmarked || []),
        customJourneys: persisted?.customJourneys || [],
        insightHistory: persisted?.insightHistory || [],
        bookmarkedInsights: new Set(persisted?.bookmarkedInsights || []),
      }),
    }
  )
);