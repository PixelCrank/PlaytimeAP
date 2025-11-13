import { useStore } from "../store/useStore";
import data from "../data/works.json";
import { useMemo } from "react";
import { buildPredicateWithCentury } from "../lib/filters";

export default function MediumComparisonPanel() {
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const comparisonMode = useStore(s => s.comparisonMode);
  const toggleComparisonMode = useStore(s => s.toggleComparisonMode);

  const all = data as any[];
  const filtered = useMemo(
    () => all.filter(buildPredicateWithCentury(filters, centuryFilter)),
    [all, filters, centuryFilter]
  );

  const mediumStats = useMemo(() => {
    const mediaTypes = ["Art", "Cinéma", "Littérature", "Jeux vidéo", "BD", "Music"];
    
    return mediaTypes.map(type => {
      const works = filtered.filter(w => w.type === type);
      
      const emotions: Record<string, number> = {};
      const categories: Record<string, number> = {};
      
      works.forEach(work => {
        work.emotions?.forEach((e: string) => {
          emotions[e] = (emotions[e] || 0) + 1;
        });
        work.categories?.forEach((c: string) => {
          categories[c] = (categories[c] || 0) + 1;
        });
      });

      const topEmotions = Object.entries(emotions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      
      const topCategories = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      return {
        type,
        count: works.length,
        topEmotions,
        topCategories,
      };
    }).filter(m => m.count > 0);
  }, [filtered]);

  if (!comparisonMode) {
    return (
      <button
        onClick={toggleComparisonMode}
        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
      >
        Comparer les médiums
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Comparaison par médium</h2>
          <button
            onClick={toggleComparisonMode}
            className="text-gray-500 hover:text-gray-900 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Comment chaque médium exprime-t-il les thèmes temporels ? Voici les patterns dominants dans votre sélection actuelle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediumStats.map(medium => (
              <div key={medium.type} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg">{medium.type}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-900 text-sm rounded font-medium">
                    {medium.count}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1.5">
                      Émotions dominantes :
                    </p>
                    <div className="space-y-1">
                      {medium.topEmotions.map(([emotion, count]) => (
                        <div key={emotion} className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${(count / medium.count) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 min-w-[60px]">
                            {emotion}
                          </span>
                          <span className="text-xs font-medium text-gray-900 min-w-[30px] text-right">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1.5">
                      Thèmes récurrents :
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {medium.topCategories.map(([cat, count]) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 bg-white border text-xs rounded"
                          title={`${count} œuvres`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {mediumStats.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Aucun médium ne correspond aux filtres actuels.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
