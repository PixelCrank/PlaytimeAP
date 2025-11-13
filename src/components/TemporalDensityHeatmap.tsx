import { useState, useMemo } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";
import { buildPredicateWithCentury } from "../lib/filters";

interface DecadeData {
  decade: string;
  startYear: number;
  total: number;
  dominantEmotion: string;
  emotionCount: number;
  works: any[];
}

export default function TemporalDensityHeatmap() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDecade, setSelectedDecade] = useState<DecadeData | null>(null);
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const setCenturyFilter = useStore(s => s.setCenturyFilter);
  const setSelectedId = useStore(s => s.setSelectedId);

  const all = data as any[];

  const heatmapData = useMemo(() => {
    const predicate = buildPredicateWithCentury(filters, centuryFilter);
    const filtered = all.filter(predicate);

    const decadeMap = new Map<string, any[]>();

    filtered.forEach(work => {
      const yearMatch = work.annee?.match(/\d{4}/);
      if (yearMatch) {
        const year = parseInt(yearMatch[0]);
        const decadeStart = Math.floor(year / 10) * 10;
        const decadeKey = `${decadeStart}`;
        
        if (!decadeMap.has(decadeKey)) {
          decadeMap.set(decadeKey, []);
        }
        decadeMap.get(decadeKey)!.push(work);
      }
    });

    const decades: DecadeData[] = Array.from(decadeMap.entries())
      .map(([decade, works]) => {
        // Find dominant emotion
        const emotionCounts: Record<string, number> = {};
        works.forEach(w => {
          w.emotions?.forEach((e: string) => {
            emotionCounts[e] = (emotionCounts[e] || 0) + 1;
          });
        });

        const dominant = Object.entries(emotionCounts)
          .sort((a, b) => b[1] - a[1])[0];

        return {
          decade,
          startYear: parseInt(decade),
          total: works.length,
          dominantEmotion: dominant?.[0] || "neutral",
          emotionCount: dominant?.[1] || 0,
          works,
        };
      })
      .sort((a, b) => a.startYear - b.startYear);

    return decades;
  }, [all, filters, centuryFilter]);

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      tristesse: "#6366f1",
      nostalgie: "#8b5cf6",
      surprise: "#ec4899",
      sérénité: "#10b981",
      confiance: "#14b8a6",
      excitation: "#f59e0b",
      vigilance: "#ef4444",
      fascination: "#06b6d4",
      peur: "#dc2626",
      joie: "#fbbf24",
      tension: "#f97316",
      colère: "#b91c1c",
      ennui: "#64748b",
      admiration: "#3b82f6",
      dégoût: "#78716c",
    };
    return colors[emotion] || "#94a3b8";
  };

  const maxTotal = Math.max(...heatmapData.map(d => d.total), 1);

  const handleDecadeClick = (decade: DecadeData) => {
    setSelectedDecade(decade);
  };

  const handleFilterToDecade = (decade: DecadeData) => {
    const century = decade.startYear < 1900 ? 19 : 20;
    setCenturyFilter(century);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white rounded-lg hover:from-amber-700 hover:to-red-700 transition text-sm font-medium shadow-md"
      >
        <span className="text-lg">📅</span>
        <span>Densité temporelle</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-amber-600 to-red-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              📅 Carte de densité temporelle
            </h2>
            <p className="text-sm text-amber-100 mt-1">
              Points chauds de la production culturelle sur le temps
            </p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              setSelectedDecade(null);
            }}
            className="text-white hover:text-amber-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!selectedDecade ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-slate-600 mb-4">
                  Chaque barre représente une décennie. La hauteur = nombre d'œuvres, la couleur = émotion dominante.
                </p>
              </div>

              {/* Heatmap */}
              <div className="bg-slate-50 rounded-lg p-6">
                {heatmapData.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-lg mb-2">📊 Aucune donnée temporelle disponible</p>
                    <p className="text-sm">Les œuvres ne contiennent pas d'années valides pour générer la carte.</p>
                  </div>
                ) : (
                  <div className="flex items-end gap-3 justify-start overflow-x-auto pb-8" style={{ minHeight: "400px" }}>
                    {heatmapData.map((decade) => {
                      const heightPx = Math.max((decade.total / maxTotal) * 300, 20);
                    
                    return (
                      <div
                        key={decade.decade}
                        className="flex flex-col items-center cursor-pointer group flex-shrink-0"
                        onClick={() => handleDecadeClick(decade)}
                      >
                        <div className="text-center mb-2 opacity-0 group-hover:opacity-100 transition bg-slate-800 text-white px-2 py-1 rounded text-xs absolute -mt-16">
                          <div className="font-bold">
                            {decade.total} œuvres
                          </div>
                          <div>
                            {decade.dominantEmotion}
                          </div>
                        </div>
                        <div
                          className="w-12 rounded-t-lg transition-all group-hover:scale-105 group-hover:shadow-lg"
                          style={{
                            height: `${heightPx}px`,
                            backgroundColor: getEmotionColor(decade.dominantEmotion),
                          }}
                        />
                        <div className="text-xs font-bold text-slate-700 mt-3 whitespace-nowrap">
                          {decade.decade}s
                        </div>
                      </div>
                    );
                  })}
                  </div>
                )}
              </div>

              {/* Insights */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-bold text-orange-900 mb-2">🔥 Périodes les plus productives</h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    {heatmapData
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 5)
                      .map((d) => (
                        <li key={d.decade}>
                          • <strong>{d.decade}s</strong>: {d.total} œuvres ({d.dominantEmotion})
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-blue-900 mb-2">💭 Évolution émotionnelle</h3>
                  <p className="text-sm text-blue-800">
                    Les émotions dominantes varient selon les époques : 
                    nostalgie/tristesse au XIXe, puis vigilance/tension au XXe avec l'émergence 
                    des technologies et manipulations temporelles.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Selected Decade Detail */}
              <div className="mb-6">
                <button
                  onClick={() => setSelectedDecade(null)}
                  className="text-sm text-amber-600 hover:text-amber-800 mb-4"
                >
                  ← Retour à la carte
                </button>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <h3 className="text-4xl font-bold text-amber-900">
                        {selectedDecade.decade}s
                      </h3>
                      <p className="text-sm text-amber-700">
                        {selectedDecade.startYear}–{selectedDecade.startYear + 9}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-slate-900">{selectedDecade.total}</div>
                      <div className="text-sm text-slate-600">œuvres produites</div>
                    </div>
                    <button
                      onClick={() => handleFilterToDecade(selectedDecade)}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium"
                    >
                      Filtrer cette période
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700">Émotion dominante:</span>
                    <span
                      className="px-3 py-1 rounded-full text-white font-medium text-sm"
                      style={{ backgroundColor: getEmotionColor(selectedDecade.dominantEmotion) }}
                    >
                      {selectedDecade.dominantEmotion} ({selectedDecade.emotionCount})
                    </span>
                  </div>
                </div>
              </div>

              {/* Works in decade */}
              <div className="mb-4">
                <h4 className="font-bold text-slate-900 mb-3">
                  Œuvres de cette décennie ({selectedDecade.works.length})
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {selectedDecade.works.map((work) => (
                  <div
                    key={work.id}
                    className="p-3 border-2 border-slate-200 rounded-lg hover:border-amber-400 hover:shadow-sm transition cursor-pointer"
                    onClick={() => {
                      setSelectedId(work.id);
                      setIsOpen(false);
                    }}
                  >
                    <h5 className="font-semibold text-slate-900 text-sm mb-1">
                      {work.titre}
                    </h5>
                    <p className="text-xs text-slate-600 mb-2">
                      {work.createur} • {work.type} • {work.annee}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {work.emotions?.slice(0, 2).map((e: string) => (
                        <span
                          key={e}
                          className="px-2 py-0.5 text-white text-xs rounded-full"
                          style={{ backgroundColor: getEmotionColor(e) }}
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
