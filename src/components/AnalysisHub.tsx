import { useState, useMemo } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";
import { buildPredicateWithCentury } from "../lib/filters";

type Tab = "medium" | "realm" | "emotion-matrix";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnalysisHub({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("medium");
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const setSelectedId = useStore(s => s.setSelectedId);

  const all = data as any[];
  const filtered = useMemo(
    () => all.filter(buildPredicateWithCentury(filters, centuryFilter)),
    [all, filters, centuryFilter]
  );

  // Medium analysis
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

  // Realm analysis
  const realmStats = useMemo(() => {
    const categorizeRealm = (work: any): string => {
      const cats = work.categories || [];
      if (cats.some((c: string) => c.includes("temps cosmique") || c.includes("nature du temps") || c.includes("temps et espace"))) {
        return "cosmic";
      }
      if (cats.some((c: string) => c.includes("manipulations du temps") || c.includes("temps et rêve"))) {
        return "disrupted";
      }
      return "human";
    };

    const realms = ["cosmic", "human", "disrupted"];
    const realmLabels = { cosmic: "🌌 Cosmique", human: "👤 Humain", disrupted: "⚡ Dérangé" };
    
    return realms.map(realmName => {
      const realmWorks = filtered.filter(w => categorizeRealm(w) === realmName);
      
      const emotionCounts: Record<string, number> = {};
      realmWorks.forEach(w => {
        w.emotions?.forEach((e: string) => {
          emotionCounts[e] = (emotionCounts[e] || 0) + 1;
        });
      });
      
      const topEmotions = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      return {
        realm: realmName,
        label: realmLabels[realmName as keyof typeof realmLabels],
        count: realmWorks.length,
        topEmotions,
      };
    }).filter(r => r.count > 0);
  }, [filtered]);

  // Emotion-medium matrix
  const matrixData = useMemo(() => {
    const mediaTypes = Array.from(new Set(filtered.map(w => w.type))).sort();
    const emotions = ["tristesse", "nostalgie", "fascination", "sérénité", "peur", "joie", "vigilance", "tension"];

    const matrix = emotions.map(emotion => {
      return mediaTypes.map(medium => {
        const count = filtered.filter(w => 
          w.type === medium && w.emotions?.includes(emotion)
        ).length;
        return { emotion, medium, count };
      });
    });

    return { matrix, mediaTypes, emotions };
  }, [filtered]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              📊 Analyse du corpus
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              Patterns émotionnels et thématiques
            </p>
          </div>
          <button
            onClick={() => onClose()}
            className="text-white hover:text-blue-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b bg-slate-50 px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("medium")}
              className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
                activeTab === "medium"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Par médium
            </button>
            <button
              onClick={() => setActiveTab("realm")}
              className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
                activeTab === "realm"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Par royaume
            </button>
            <button
              onClick={() => setActiveTab("emotion-matrix")}
              className={`px-4 py-3 text-sm font-medium transition border-b-2 ${
                activeTab === "emotion-matrix"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Matrice émotions × médiums
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "medium" && (
            <div>
              <p className="text-sm text-slate-600 mb-6">
                Comment chaque médium exprime-t-il les thèmes temporels ? Voici les patterns dominants.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediumStats.map(medium => (
                  <div key={medium.type} className="border rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-slate-900">{medium.type}</h3>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-900 text-sm rounded font-medium">
                        {medium.count}
                      </span>
                    </div>

                    {medium.topEmotions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-slate-700 mb-1.5">
                          Émotions dominantes :
                        </p>
                        <div className="space-y-1">
                          {medium.topEmotions.map(([emotion, count]) => (
                            <div key={emotion} className="flex items-center justify-between text-xs">
                              <span className="text-slate-700 capitalize">{emotion}</span>
                              <span className="text-slate-500">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {medium.topCategories.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-1.5">
                          Thèmes récurrents :
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {medium.topCategories.slice(0, 2).map(([category]) => (
                            <span key={category} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "realm" && (
            <div>
              <p className="text-sm text-slate-600 mb-6">
                Les trois "mondes du temps" et leurs signatures émotionnelles dans votre sélection.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {realmStats.map(realm => (
                  <div key={realm.realm} className="border-2 rounded-lg p-5 bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-lg transition">
                    <h3 className="font-bold text-xl mb-3 text-slate-900">{realm.label}</h3>
                    <div className="text-3xl font-bold text-indigo-600 mb-4">{realm.count}</div>
                    
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-2">
                        Émotions dominantes :
                      </p>
                      <div className="space-y-1.5">
                        {realm.topEmotions.map(([emotion, count]) => (
                          <div key={emotion} className="flex items-center justify-between">
                            <span className="text-sm text-slate-700 capitalize">{emotion}</span>
                            <span className="text-sm font-medium text-slate-600">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "emotion-matrix" && (
            <div>
              <p className="text-sm text-slate-600 mb-6">
                Chaque médium a son propre "dialecte émotionnel". Découvrez comment ils varient.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-slate-100 text-xs font-semibold text-left sticky left-0 z-10">Émotion</th>
                      {matrixData.mediaTypes.map(medium => (
                        <th key={medium} className="border p-2 bg-slate-100 text-xs font-semibold">
                          {medium}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrixData.matrix.map((row, idx) => (
                      <tr key={matrixData.emotions[idx]}>
                        <td className="border p-2 font-medium text-xs capitalize sticky left-0 bg-white z-10">
                          {matrixData.emotions[idx]}
                        </td>
                        {row.map((cell, cellIdx) => {
                          const maxInRow = Math.max(...row.map(c => c.count));
                          const intensity = maxInRow > 0 ? cell.count / maxInRow : 0;
                          return (
                            <td
                              key={cellIdx}
                              className="border p-2 text-center text-xs cursor-pointer hover:bg-blue-50 transition"
                              style={{
                                backgroundColor: cell.count > 0 
                                  ? `rgba(79, 70, 229, ${0.1 + intensity * 0.6})`
                                  : "transparent"
                              }}
                            >
                              {cell.count > 0 ? cell.count : "·"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
