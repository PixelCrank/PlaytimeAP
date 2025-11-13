import { useStore } from "../store/useStore";
import data from "../data/works.json";
import { useMemo } from "react";
import { buildPredicateWithCentury } from "../lib/filters";

interface TimelineEvent {
  decade: string;
  count: number;
  topEmotions: [string, number][];
  topCategories: [string, number][];
  works: any[];
}

export default function TemporalEvolutionPanel() {
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);

  const all = data as any[];
  const filtered = useMemo(
    () => all.filter(buildPredicateWithCentury(filters, centuryFilter)),
    [all, filters, centuryFilter]
  );

  const timeline = useMemo(() => {
    // Group by century
    const centuries = new Map<number, any[]>();
    
    filtered.forEach(work => {
      const century = work.anneeNum;
      if (century === 19 || century === 20) {
        if (!centuries.has(century)) centuries.set(century, []);
        centuries.get(century)!.push(work);
      }
    });

    return Array.from(centuries.entries()).map(([century, works]) => {
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
        century: century === 19 ? "XIXe" : "XXe-XXIe",
        count: works.length,
        topEmotions,
        topCategories,
        works,
      };
    }).sort((a, b) => a.century.localeCompare(b.century));
  }, [filtered]);

  if (timeline.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">📜</span>
        <div>
          <h3 className="text-sm font-bold text-amber-900">
            Évolution temporelle
          </h3>
          <p className="text-xs text-amber-700">
            Comment les thèmes et émotions se déplacent entre les siècles
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {timeline.map((period) => (
          <div key={period.century} className="bg-white rounded-lg p-3 border border-amber-200">
            <div className="flex items-baseline gap-2 mb-2">
              <h4 className="text-lg font-bold text-amber-900">{period.century}</h4>
              <span className="text-sm text-amber-700">{period.count} œuvres</span>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold text-amber-800 mb-1">
                  Émotions dominantes :
                </p>
                <div className="space-y-1">
                  {period.topEmotions.map(([emotion, count]) => (
                    <div key={emotion} className="flex items-center gap-2">
                      <div className="flex-1 bg-amber-100 rounded-full h-1.5">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: `${(count / period.count) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-amber-700 min-w-[80px]">
                        {emotion}
                      </span>
                      <span className="text-xs font-medium text-amber-900 min-w-[30px] text-right">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-amber-800 mb-1">
                  Thèmes récurrents :
                </p>
                <div className="space-y-0.5">
                  {period.topCategories.map(([cat, count]) => (
                    <div key={cat} className="text-xs text-amber-700">
                      • {cat} <span className="font-medium">({count})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {timeline.length === 2 && (
        <div className="mt-3 pt-3 border-t border-amber-200">
          <p className="text-xs text-amber-700 italic">
            💡 Insight : Comparez les émotions et thèmes entre époques pour voir comment 
            la perception culturelle du temps a évolué.
          </p>
        </div>
      )}
    </div>
  );
}
