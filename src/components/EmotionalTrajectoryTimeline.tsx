import { useState, useMemo } from "react";
import data from "../data/works.json";

interface DecadeData {
  decade: string;
  total: number;
  emotions: Record<string, number>;
}

export default function EmotionalTrajectoryTimeline() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredDecade, setHoveredDecade] = useState<string | null>(null);

  const all = data as any[];

  const trajectoryData = useMemo(() => {
    const decades: Record<string, DecadeData> = {};

    all.forEach(work => {
      // Extract decade from year string
      let decade = "Unknown";
      
      const yearMatch = work.annee?.match(/\d{4}/);
      if (yearMatch) {
        const year = parseInt(yearMatch[0]);
        
        if (year >= 1800 && year < 1900) {
          decade = "XIXe";
        } else if (year >= 1900 && year < 1950) {
          decade = "1900-1949";
        } else if (year >= 1950 && year < 1970) {
          decade = "1950s-60s";
        } else if (year >= 1970 && year < 1990) {
          decade = "1970s-80s";
        } else if (year >= 1990 && year < 2000) {
          decade = "1990s";
        } else if (year >= 2000 && year < 2010) {
          decade = "2000s";
        } else if (year >= 2010 && year < 2020) {
          decade = "2010s";
        } else if (year >= 2020) {
          decade = "2020s";
        }
      }

      if (!decades[decade]) {
        decades[decade] = {
          decade,
          total: 0,
          emotions: {},
        };
      }

      decades[decade].total++;
      work.emotions?.forEach((e: string) => {
        decades[decade].emotions[e] = (decades[decade].emotions[e] || 0) + 1;
      });
    });

    // Sort decades chronologically
    const decadeOrder = ["XIXe", "1900-1949", "1950s-60s", "1970s-80s", "1990s", "2000s", "2010s", "2020s", "Unknown"];
    const sorted = Object.values(decades).sort((a, b) => {
      const indexA = decadeOrder.indexOf(a.decade);
      const indexB = decadeOrder.indexOf(b.decade);
      return indexA - indexB;
    });

    return sorted;
  }, [all]);

  const allEmotions = useMemo(() => {
    const emotions = new Set<string>();
    trajectoryData.forEach(d => {
      Object.keys(d.emotions).forEach(e => emotions.add(e));
    });
    return Array.from(emotions).sort((a, b) => {
      // Sort by total frequency
      const totalA = trajectoryData.reduce((sum, d) => sum + (d.emotions[a] || 0), 0);
      const totalB = trajectoryData.reduce((sum, d) => sum + (d.emotions[b] || 0), 0);
      return totalB - totalA;
    }).slice(0, 8); // Top 8 emotions
  }, [trajectoryData]);

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
    };
    return colors[emotion] || "#64748b";
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition text-sm font-medium shadow-md"
      >
        <span className="text-lg">📈</span>
        <span>Trajectoire émotionnelle</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              📈 Trajectoire émotionnelle à travers le temps
            </h2>
            <p className="text-sm text-violet-100 mt-1">
              Comment les émotions liées au temps ont évolué culturellement
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-violet-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <p className="text-sm text-slate-600 mb-4">
              Ce graphique révèle comment certaines émotions émergent, dominent ou disparaissent à travers les époques.
            </p>
          </div>

          {/* Timeline visualization */}
          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 mb-2">Évolution par période</h3>
              <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
                {allEmotions.map(emotion => (
                  <div key={emotion} className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getEmotionColor(emotion) }}
                    />
                    <span>{emotion}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {trajectoryData.map((decade) => {
                const maxCount = Math.max(...Object.values(decade.emotions));
                const isHovered = hoveredDecade === decade.decade;

                return (
                  <div
                    key={decade.decade}
                    className="transition-all"
                    onMouseEnter={() => setHoveredDecade(decade.decade)}
                    onMouseLeave={() => setHoveredDecade(null)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-20 text-sm font-bold text-slate-900">
                        {decade.decade}
                      </div>
                      <div className="flex-1 bg-white rounded-lg p-2 border-2 transition-all" style={{
                        borderColor: isHovered ? "#8b5cf6" : "#e2e8f0",
                      }}>
                        <div className="flex items-center gap-1 h-6">
                          {allEmotions.map(emotion => {
                            const count = decade.emotions[emotion] || 0;
                            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                            
                            return (
                              <div
                                key={emotion}
                                className="h-full rounded transition-all"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: getEmotionColor(emotion),
                                  opacity: count > 0 ? (isHovered ? 1 : 0.7) : 0,
                                }}
                                title={`${emotion}: ${count}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <div className="w-16 text-xs text-slate-600">
                        {decade.total} œuvres
                      </div>
                    </div>

                    {isHovered && (
                      <div className="ml-24 mb-2 p-3 bg-violet-50 border border-violet-200 rounded-lg">
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          {Object.entries(decade.emotions)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 8)
                            .map(([emotion, count]) => (
                              <div key={emotion} className="flex items-center gap-1">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: getEmotionColor(emotion) }}
                                />
                                <span className="text-slate-700">
                                  {emotion}: <span className="font-medium">{count}</span>
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">📊 Observations</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Tristesse et nostalgie dominent le XIXe siècle</li>
                <li>• Émergence de la vigilance et tension au XXe</li>
                <li>• La fascination reste constante à travers les époques</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-purple-900 mb-2">💡 Interprétation</h3>
              <p className="text-sm text-purple-800">
                L'évolution reflète les transformations culturelles : du romantisme mélancolique 
                du XIXe à l'anxiété technologique contemporaine face aux manipulations temporelles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
