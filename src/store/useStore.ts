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

export type UserNote = {
  id: string;
  workId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
};

export type CustomTag = {
  id: string;
  label: string;
  color: string; // hex color
  workIds: string[];
  createdAt: number;
};

export type VisitRecord = {
  id: string;
  workId: string;
  timestamp: number;
  context: {
    realm: string;
    filters: FilterState;
    centuryFilter: number | null;
    fromJourney?: string;
  };
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
  comparisonWorkIds: string[]; // Works selected for comparison (max 2)
  
  // Collection Management
  bookmarked: Set<string>;
  customJourneys: CustomJourney[];
  
  // Insight History
  insightHistory: SavedInsight[];
  bookmarkedInsights: Set<string>;
  
  // Personal Layer
  userNotes: UserNote[];
  customTags: CustomTag[];
  visitHistory: VisitRecord[];
  
  setSelectedId: (id: string | null) => void;
  markVisited: (id: string) => void;
  setRealm: (r: State["realm"]) => void;
  setFilters: (f: Partial<FilterState>) => void;
  togglePin: (id: string) => void;
  setPinned: (pinned: Set<string>) => void;
  setCenturyFilter: (c: 19 | 20 | null) => void;
  setJourney: (j: string | null) => void;
  toggleComparisonMode: () => void;
  addToComparison: (id: string) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  
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
  
  // Personal Layer actions
  addNote: (workId: string, content: string) => void;
  updateNote: (noteId: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  getNoteForWork: (workId: string) => UserNote | undefined;
  
  addCustomTag: (label: string, color: string) => void;
  updateCustomTag: (tagId: string, updates: Partial<Omit<CustomTag, "id" | "createdAt">>) => void;
  deleteCustomTag: (tagId: string) => void;
  addWorkToTag: (tagId: string, workId: string) => void;
  removeWorkFromTag: (tagId: string, workId: string) => void;
  
  recordVisit: (workId: string) => void;
  clearVisitHistory: () => void;
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      realm: "human",
      filters: { types: [], categories: [], emotions: [], yearRange: null, search: "", realmFilter: "tous", centuryFilter: "tous" },
      pinned: new Set(),
      selectedId: null,
      visitedIds: new Set(),
      
      centuryFilter: null,
      selectedJourney: null,
      comparisonMode: false,
      comparisonWorkIds: [],
      
      bookmarked: new Set(),
      customJourneys: [],
      
      insightHistory: [],
      bookmarkedInsights: new Set(),
      
      userNotes: [],
      customTags: [],
      visitHistory: [],

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
        get().recordVisit(id); // Also record to visit history
      },
      
      setCenturyFilter: (c) => set({ centuryFilter: c }),
      setJourney: (j) => set({ selectedJourney: j }),
      toggleComparisonMode: () => set({ comparisonMode: !get().comparisonMode }),
      
      addToComparison: (id) => {
        const current = get().comparisonWorkIds;
        if (current.includes(id)) return;
        if (current.length >= 2) {
          // Replace oldest (first item)
          set({ comparisonWorkIds: [current[1], id] });
        } else {
          set({ comparisonWorkIds: [...current, id] });
        }
      },
      
      removeFromComparison: (id) => {
        set({ comparisonWorkIds: get().comparisonWorkIds.filter(wid => wid !== id) });
      },
      
      clearComparison: () => {
        set({ comparisonWorkIds: [] });
      },
      
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
      
      // Personal Layer implementations
      addNote: (workId, content) => {
        const existingNote = get().userNotes.find(n => n.workId === workId);
        if (existingNote) {
          // Update existing note
          set({
            userNotes: get().userNotes.map(n =>
              n.workId === workId ? { ...n, content, updatedAt: Date.now() } : n
            ),
          });
        } else {
          // Create new note
          const newNote: UserNote = {
            id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            workId,
            content,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          set({ userNotes: [...get().userNotes, newNote] });
        }
      },
      
      updateNote: (noteId, content) => {
        set({
          userNotes: get().userNotes.map(n =>
            n.id === noteId ? { ...n, content, updatedAt: Date.now() } : n
          ),
        });
      },
      
      deleteNote: (noteId) => {
        set({ userNotes: get().userNotes.filter(n => n.id !== noteId) });
      },
      
      getNoteForWork: (workId) => {
        return get().userNotes.find(n => n.workId === workId);
      },
      
      addCustomTag: (label, color) => {
        const newTag: CustomTag = {
          id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          label,
          color,
          workIds: [],
          createdAt: Date.now(),
        };
        set({ customTags: [...get().customTags, newTag] });
      },
      
      updateCustomTag: (tagId, updates) => {
        set({
          customTags: get().customTags.map(t =>
            t.id === tagId ? { ...t, ...updates } : t
          ),
        });
      },
      
      deleteCustomTag: (tagId) => {
        set({ customTags: get().customTags.filter(t => t.id !== tagId) });
      },
      
      addWorkToTag: (tagId, workId) => {
        set({
          customTags: get().customTags.map(t =>
            t.id === tagId && !t.workIds.includes(workId)
              ? { ...t, workIds: [...t.workIds, workId] }
              : t
          ),
        });
      },
      
      removeWorkFromTag: (tagId, workId) => {
        set({
          customTags: get().customTags.map(t =>
            t.id === tagId ? { ...t, workIds: t.workIds.filter(id => id !== workId) } : t
          ),
        });
      },
      
      recordVisit: (workId) => {
        const state = get();
        const newVisit: VisitRecord = {
          id: `visit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          workId,
          timestamp: Date.now(),
          context: {
            realm: state.realm,
            filters: state.filters,
            centuryFilter: state.centuryFilter,
            fromJourney: state.selectedJourney || undefined,
          },
        };
        set({ visitHistory: [newVisit, ...state.visitHistory].slice(0, 200) }); // Keep last 200 visits
      },
      
      clearVisitHistory: () => {
        set({ visitHistory: [] });
      },
    }),
    {
      name: "playtime-collection",
      partialize: (state) => ({
        bookmarked: Array.from(state.bookmarked),
        customJourneys: state.customJourneys,
        insightHistory: state.insightHistory,
        bookmarkedInsights: Array.from(state.bookmarkedInsights),
        userNotes: state.userNotes,
        customTags: state.customTags,
        visitHistory: state.visitHistory,
      }),
      merge: (persisted: any, current) => ({
        ...current,
        bookmarked: new Set(persisted?.bookmarked || []),
        customJourneys: persisted?.customJourneys || [],
        insightHistory: persisted?.insightHistory || [],
        bookmarkedInsights: new Set(persisted?.bookmarkedInsights || []),
        userNotes: persisted?.userNotes || [],
        customTags: persisted?.customTags || [],
        visitHistory: persisted?.visitHistory || [],
      }),
    }
  )
);