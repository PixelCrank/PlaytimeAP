import { useState, useMemo } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";
import { buildPredicateWithCentury } from "../lib/filters";

interface KeywordData {
  keyword: string;
  count: number;
  works: any[];
  dominantEmotion: string;
}

export default function KeywordCloud() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const setFilters = useStore(s => s.setFilters);
  const setSelectedId = useStore(s => s.setSelectedId);

  const all = data as any[];

  const keywordData = useMemo(() => {
    const predicate = buildPredicateWithCentury(filters, centuryFilter);
    const filtered = all.filter(predicate);

    const keywordMap = new Map<string, any[]>();

    filtered.forEach(work => {
      const keywords = work.motsCles || [];
      keywords.forEach((kw: string) => {
        if (!kw) return;
        const normalized = kw.toLowerCase().trim();
        if (!keywordMap.has(normalized)) {
          keywordMap.set(normalized, []);
        }
        keywordMap.get(normalized)!.push(work);
      });
    });

    const keywords: KeywordData[] = Array.from(keywordMap.entries())
      .map(([keyword, works]) => {
        // Find dominant emotion across these works
        const emotionCounts: Record<string, number> = {};
        works.forEach(w => {
          w.emotions?.forEach((e: string) => {
            emotionCounts[e] = (emotionCounts[e] || 0) + 1;
          });
        });
        
        const dominantEmotion = Object.entries(emotionCounts)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";

        return {
          keyword,
          count: works.length,
          works,
          dominantEmotion,
        };
      })
      .sort((a, b) => b.count - a.count);

    return keywords;
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
    return colors[emotion] || "#64748b";
  };

  const handleKeywordClick = (kw: KeywordData) => {
    setSelectedKeyword(kw.keyword);
  };

  const getFontSize = (count: number, maxCount: number) => {
    const minSize = 12;
    const maxSize = 48;
    const ratio = count / maxCount;
    return minSize + (maxSize - minSize) * Math.sqrt(ratio);
  };

  const maxCount = keywordData[0]?.count || 1;
  const displayedKeywords = keywordData.slice(0, 80); // Top 80 keywords

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg hover:from-sky-600 hover:to-indigo-700 transition text-sm font-medium shadow-md"
      >
        <span className="text-lg">☁️</span>
        <span>Nuage de mots-clés</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              ☁️ Paysage sémantique du temps
            </h2>
            <p className="text-sm text-sky-100 mt-1">
              {displayedKeywords.length} concepts les plus fréquents • Taille = fréquence • Couleur = émotion dominante
            </p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              setSelectedKeyword(null);
            }}
            className="text-white hover:text-sky-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!selectedKeyword ? (
            <>
              {/* Keyword Cloud */}
              <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="flex flex-wrap items-center justify-center gap-3 leading-relaxed">
                  {displayedKeywords.map((kw) => {
                    const fontSize = getFontSize(kw.count, maxCount);
                    return (
                      <button
                        key={kw.keyword}
                        onClick={() => handleKeywordClick(kw)}
                        className="hover:opacity-70 transition cursor-pointer font-medium px-2 py-1 rounded hover:scale-110"
                        style={{
                          fontSize: `${fontSize}px`,
                          color: getEmotionColor(kw.dominantEmotion),
                          lineHeight: 1.4,
                        }}
                        title={`${kw.keyword} (${kw.count} œuvres • ${kw.dominantEmotion})`}
                      >
                        {kw.keyword}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="border-t p-6 bg-white">
                <div className="max-w-4xl mx-auto">
                  <h3 className="font-bold text-slate-900 mb-3">💡 Comment lire ce nuage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="font-semibold text-blue-900 mb-1">Taille des mots</p>
                      <p className="text-blue-800">
                        Plus un mot est grand, plus il apparaît fréquemment dans le corpus. 
                        Les concepts dominants révèlent les obsessions temporelles de la culture.
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <p className="font-semibold text-purple-900 mb-1">Couleur des mots</p>
                      <p className="text-purple-800">
                        Chaque couleur représente l'émotion dominante associée au mot-clé.
                        Cliquez sur un mot pour explorer les œuvres liées.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-slate-700">
                      <strong>Top 5:</strong> {keywordData.slice(0, 5).map(k => k.keyword).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Selected Keyword Detail */}
              <div className="p-6">
                <button
                  onClick={() => setSelectedKeyword(null)}
                  className="text-sm text-sky-600 hover:text-sky-800 mb-4"
                >
                  ← Retour au nuage
                </button>

                {(() => {
                  const kw = keywordData.find(k => k.keyword === selectedKeyword)!;
                  return (
                    <>
                      <div className="mb-6">
                        <div className="bg-gradient-to-br from-sky-50 to-indigo-50 border-2 border-sky-300 rounded-lg p-6">
                          <div className="flex items-center gap-4 mb-3">
                            <h3
                              className="text-4xl font-bold"
                              style={{ color: getEmotionColor(kw.dominantEmotion) }}
                            >
                              {kw.keyword}
                            </h3>
                            <div className="flex-1">
                              <div className="text-2xl font-bold text-slate-900">{kw.count}</div>
                              <div className="text-sm text-slate-600">œuvres</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="px-3 py-1 rounded-full text-white font-medium" style={{
                              backgroundColor: getEmotionColor(kw.dominantEmotion)
                            }}>
                              Émotion dominante: {kw.dominantEmotion}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-bold text-slate-900 mb-3">
                          Œuvres associées ({kw.works.length})
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                        {kw.works.map((work) => (
                          <div
                            key={work.id}
                            className="p-3 border-2 border-slate-200 rounded-lg hover:border-sky-400 hover:shadow-sm transition cursor-pointer"
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
                              {work.emotions?.slice(0, 3).map((e: string) => (
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
                  );
                })()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
