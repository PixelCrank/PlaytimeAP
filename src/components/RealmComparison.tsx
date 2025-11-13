import { useState, useMemo } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";
import { buildPredicateWithCentury } from "../lib/filters";

type Realm = "cosmic" | "human" | "disrupted";

interface RealmStats {
  realm: Realm;
  total: number;
  topEmotions: Array<{ emotion: string; count: number }>;
  topCategories: Array<{ category: string; count: number }>;
  mediaBreakdown: Record<string, number>;
  centuryBreakdown: Record<string, number>;
}

export default function RealmComparison() {
  const [isOpen, setIsOpen] = useState(false);
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const setRealm = useStore(s => s.setRealm);
  const setSelectedId = useStore(s => s.setSelectedId);

  const all = data as any[];

  const realmStats = useMemo(() => {
    const predicate = buildPredicateWithCentury(filters, centuryFilter);
    const filtered = all.filter(predicate);

    // Categorize works into realms based on their categories
    const categorizeRealm = (work: any): Realm => {
      const cats = work.categories || [];
      
      // Cosmic: temps cosmique, nature du temps, temps et espace
      if (cats.some((c: string) => 
        c.includes("temps cosmique") || 
        c.includes("nature du temps") || 
        c.includes("temps et espace")
      )) {
        return "cosmic";
      }
      
      // Disrupted: manipulations du temps, temps et rêve
      if (cats.some((c: string) => 
        c.includes("manipulations du temps") || 
        c.includes("temps et rêve")
      )) {
        return "disrupted";
      }
      
      // Default to human
      return "human";
    };

    const realms: Realm[] = ["cosmic", "human", "disrupted"];
    
    return realms.map(realmName => {
      const realmWorks = filtered.filter(w => categorizeRealm(w) === realmName);
      
      // Count emotions
      const emotionCounts: Record<string, number> = {};
      realmWorks.forEach(w => {
        w.emotions?.forEach((e: string) => {
          emotionCounts[e] = (emotionCounts[e] || 0) + 1;
        });
      });
      
      // Count categories
      const categoryCounts: Record<string, number> = {};
      realmWorks.forEach(w => {
        w.categories?.forEach((c: string) => {
          categoryCounts[c] = (categoryCounts[c] || 0) + 1;
        });
      });
      
      // Media breakdown
      const mediaBreakdown: Record<string, number> = {};
      realmWorks.forEach(w => {
        mediaBreakdown[w.type] = (mediaBreakdown[w.type] || 0) + 1;
      });
      
      // Century breakdown
      const centuryBreakdown: Record<string, number> = { XIXe: 0, XXe: 0 };
      realmWorks.forEach(w => {
        const yearMatch = w.annee?.match(/\d{4}/);
        if (yearMatch) {
          const year = parseInt(yearMatch[0]);
          if (year < 1900) centuryBreakdown.XIXe++;
          else centuryBreakdown.XXe++;
        }
      });

      return {
        realm: realmName,
        total: realmWorks.length,
        topEmotions: Object.entries(emotionCounts)
          .map(([emotion, count]) => ({ emotion, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        topCategories: Object.entries(categoryCounts)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        mediaBreakdown,
        centuryBreakdown,
      };
    });
  }, [filters, centuryFilter, all]);

  const getRealmColor = (realm: Realm) => {
    return {
      cosmic: "from-indigo-500 to-purple-600",
      human: "from-emerald-500 to-teal-600",
      disrupted: "from-rose-500 to-orange-600",
    }[realm];
  };

  const getRealmIcon = (realm: Realm) => {
    return {
      cosmic: "🌌",
      human: "🧑",
      disrupted: "⚡",
    }[realm];
  };

  const getRealmLabel = (realm: Realm) => {
    return {
      cosmic: "Temps cosmique",
      human: "Temps humain",
      disrupted: "Temps perturbé",
    }[realm];
  };

  const getRealmDescription = (realm: Realm) => {
    return {
      cosmic: "L'échelle de l'univers et l'éternité",
      human: "L'expérience vécue et la mémoire",
      disrupted: "Les manipulations et paradoxes temporels",
    }[realm];
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition text-sm font-medium shadow-md"
      >
        <span className="text-lg">🌍</span>
        <span>Comparaison des royaumes</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-slate-600 to-slate-800 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              🌍 Vue comparative des trois royaumes temporels
            </h2>
            <p className="text-sm text-slate-200 mt-1">
              Comment les mêmes filtres se manifestent différemment selon la vision du temps
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-slate-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {realmStats.map((stats) => (
              <div
                key={stats.realm}
                className="border-2 rounded-xl overflow-hidden hover:shadow-xl transition cursor-pointer"
                onClick={() => {
                  setRealm(stats.realm);
                  setIsOpen(false);
                }}
              >
                {/* Header */}
                <div className={`bg-gradient-to-br ${getRealmColor(stats.realm)} p-4 text-white`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{getRealmIcon(stats.realm)}</span>
                    <div>
                      <h3 className="text-lg font-bold">{getRealmLabel(stats.realm)}</h3>
                      <p className="text-sm opacity-90">{getRealmDescription(stats.realm)}</p>
                    </div>
                  </div>
                  <div className="text-center py-2 bg-white/20 rounded-lg mt-3">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-xs uppercase tracking-wide">œuvres</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 bg-slate-50">
                  {/* Top Emotions */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Émotions dominantes
                    </h4>
                    <div className="space-y-1.5">
                      {stats.topEmotions.length > 0 ? (
                        stats.topEmotions.map((e) => {
                          const percentage = stats.total > 0 ? (e.count / stats.total) * 100 : 0;
                          return (
                            <div key={e.emotion}>
                              <div className="flex justify-between text-xs mb-0.5">
                                <span className="font-medium text-slate-700">{e.emotion}</span>
                                <span className="text-slate-500">{e.count}</span>
                              </div>
                              <div className="h-2 bg-white rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${getRealmColor(stats.realm)} transition-all`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-400 italic">Aucune émotion</p>
                      )}
                    </div>
                  </div>

                  {/* Top Categories */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Thèmes principaux
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {stats.topCategories.length > 0 ? (
                        stats.topCategories.map((c) => (
                          <span
                            key={c.category}
                            className="px-2 py-1 bg-white text-slate-700 text-xs rounded-full border"
                          >
                            {c.category} ({c.count})
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">Aucune catégorie</p>
                      )}
                    </div>
                  </div>

                  {/* Media Breakdown */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Répartition médias
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(stats.mediaBreakdown).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center px-2 py-1 bg-white rounded text-xs">
                          <span className="text-slate-600">{type}</span>
                          <span className="font-bold text-slate-900">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Century Breakdown */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                      Répartition temporelle
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="px-2 py-1 bg-white rounded text-center">
                        <div className="text-lg font-bold text-slate-900">{stats.centuryBreakdown.XIXe}</div>
                        <div className="text-xs text-slate-600">XIXe</div>
                      </div>
                      <div className="px-2 py-1 bg-white rounded text-center">
                        <div className="text-lg font-bold text-slate-900">{stats.centuryBreakdown.XXe}</div>
                        <div className="text-xs text-slate-600">XXe+</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className={`bg-gradient-to-r ${getRealmColor(stats.realm)} p-3 text-center`}>
                  <button className="text-white text-sm font-medium hover:underline">
                    Explorer ce royaume →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Insights Section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span>💡</span>
                <span>Observations comparatives</span>
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Chaque royaume révèle des patterns émotionnels uniques</li>
                <li>• Le cosmique privilégie fascination et contemplation</li>
                <li>• L'humain porte nostalgie et mélancolie vécues</li>
                <li>• Le perturbé amplifie tension et anxiété temporelle</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                <span>🔬</span>
                <span>Usage recherche</span>
              </h3>
              <p className="text-sm text-purple-800">
                Cette vue comparative permet d'identifier si une émotion est universelle 
                (présente dans les 3 royaumes) ou spécifique à une vision particulière du temps. 
                Idéal pour analyser comment un même thème est traité différemment selon l'échelle temporelle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
