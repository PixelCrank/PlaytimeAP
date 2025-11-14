import { useMemo } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";

interface Suggestion {
  label: string;
  action: () => void;
  count: number;
  icon: string;
}

export default function EmptyStateWithSuggestions() {
  const filters = useStore(s => s.filters);
  const setFilters = useStore(s => s.setFilters);
  const all = data as any[];

  const suggestions = useMemo((): Suggestion[] => {
    const results: Suggestion[] = [];

    // Strategy 1: Remove most restrictive filter
    if (filters.emotions.length > 0) {
      // Try removing one emotion at a time
      filters.emotions.forEach(emotion => {
        const withoutThisEmotion = {
          ...filters,
          emotions: filters.emotions.filter(e => e !== emotion)
        };
        
        const count = all.filter(work => {
          if (withoutThisEmotion.types.length > 0 && !withoutThisEmotion.types.includes(work.type)) return false;
          if (withoutThisEmotion.categories.length > 0 && !work.categories?.some((c: string) => withoutThisEmotion.categories.includes(c))) return false;
          if (withoutThisEmotion.emotions.length > 0 && !work.emotions?.some((e: string) => withoutThisEmotion.emotions.includes(e))) return false;
          if (withoutThisEmotion.search && !work.titre.toLowerCase().includes(withoutThisEmotion.search.toLowerCase()) && !work.createur?.toLowerCase().includes(withoutThisEmotion.search.toLowerCase())) return false;
          return true;
        }).length;

        if (count > 0) {
          results.push({
            label: `Sans "${emotion}"`,
            action: () => setFilters(withoutThisEmotion),
            count,
            icon: '🎭'
          });
        }
      });
    }

    // Strategy 2: Remove medium filter
    if (filters.types.length > 0) {
      const withoutTypes = { ...filters, types: [] };
      const count = all.filter(work => {
        if (withoutTypes.categories.length > 0 && !work.categories?.some((c: string) => withoutTypes.categories.includes(c))) return false;
        if (withoutTypes.emotions.length > 0 && !work.emotions?.some((e: string) => withoutTypes.emotions.includes(e))) return false;
        if (withoutTypes.search && !work.titre.toLowerCase().includes(withoutTypes.search.toLowerCase()) && !work.createur?.toLowerCase().includes(withoutTypes.search.toLowerCase())) return false;
        return true;
      }).length;

      if (count > 0) {
        results.push({
          label: `Tous les médias`,
          action: () => setFilters(withoutTypes),
          count,
          icon: '🎬'
        });
      }
    }

    // Strategy 3: Remove category filter
    if (filters.categories.length > 0) {
      const withoutCategories = { ...filters, categories: [] };
      const count = all.filter(work => {
        if (withoutCategories.types.length > 0 && !withoutCategories.types.includes(work.type)) return false;
        if (withoutCategories.emotions.length > 0 && !work.emotions?.some((e: string) => withoutCategories.emotions.includes(e))) return false;
        if (withoutCategories.search && !work.titre.toLowerCase().includes(withoutCategories.search.toLowerCase()) && !work.createur?.toLowerCase().includes(withoutCategories.search.toLowerCase())) return false;
        return true;
      }).length;

      if (count > 0) {
        results.push({
          label: `Toutes les catégories`,
          action: () => setFilters(withoutCategories),
          count,
          icon: '📂'
        });
      }
    }

    // Strategy 4: Keep only one filter (the one with most results)
    const singleFilterOptions = [
      ...(filters.emotions.length > 0 ? filters.emotions.map(e => ({
        label: `Seulement "${e}"`,
        filters: { types: [] as string[], categories: [] as string[], emotions: [e], search: '', yearRange: null, realmFilter: 'tous' as const, centuryFilter: 'tous' as const },
        icon: '🎭'
      })) : []),
      ...(filters.types.length > 0 ? filters.types.map(t => ({
        label: `Seulement ${t}`,
        filters: { types: [t], categories: [] as string[], emotions: [] as string[], search: '', yearRange: null, realmFilter: 'tous' as const, centuryFilter: 'tous' as const },
        icon: '🎬'
      })) : []),
      ...(filters.categories.length > 0 ? filters.categories.map(c => ({
        label: `Seulement "${c}"`,
        filters: { types: [] as string[], categories: [c], emotions: [] as string[], search: '', yearRange: null, realmFilter: 'tous' as const, centuryFilter: 'tous' as const },
        icon: '📂'
      })) : [])
    ];

    singleFilterOptions.forEach(option => {
      const count = all.filter(work => {
        if (option.filters.types.length > 0 && !option.filters.types.includes(work.type)) return false;
        if (option.filters.categories.length > 0 && !work.categories?.some((c: string) => option.filters.categories.includes(c))) return false;
        if (option.filters.emotions.length > 0 && !work.emotions?.some((e: string) => option.filters.emotions.includes(e))) return false;
        return true;
      }).length;

      if (count > 0) {
        results.push({
          label: option.label,
          action: () => setFilters(option.filters),
          count,
          icon: option.icon
        });
      }
    });

    // Strategy 5: Clear all filters
    const totalCount = all.length;
    results.push({
      label: `Voir tout le corpus`,
      action: () => setFilters({ types: [], categories: [], emotions: [], search: '', yearRange: null, realmFilter: 'tous' as const, centuryFilter: 'tous' as const }),
      count: totalCount,
      icon: '🌐'
    });

    // Sort by count descending and take top 4
    return results.sort((a, b) => b.count - a.count).slice(0, 4);
  }, [filters, all, setFilters]);

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-slate-900">
          Aucune œuvre ne correspond
        </h3>
        <p className="text-sm text-slate-600">
          Vos critères sont trop restrictifs. Essayez une de ces alternatives :
        </p>
        
        <div className="space-y-2 mt-6">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={suggestion.action}
              className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-300 rounded-lg transition group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{suggestion.icon}</span>
                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-900">
                  {suggestion.label}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-500 group-hover:text-indigo-600">
                {suggestion.count} œuvres
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
