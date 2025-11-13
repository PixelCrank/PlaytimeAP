import { useState, useMemo } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";
import { buildPredicateWithCentury } from "../lib/filters";

interface CellData {
  medium: string;
  emotion: string;
  count: number;
  intensity: number;
  works: any[];
}

export default function MediumEmotionDialect() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<CellData | null>(null);
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const setSelectedId = useStore(s => s.setSelectedId);

  const all = data as any[];

  const matrixData = useMemo(() => {
    const predicate = buildPredicateWithCentury(filters, centuryFilter);
    const filtered = all.filter(predicate);

    // Get all unique media types and emotions
    const mediaTypes = Array.from(new Set(filtered.map(w => w.type))).sort();
    const emotions = ["tristesse", "nostalgie", "surprise", "sérénité", "confiance", 
                      "excitation", "vigilance", "fascination", "peur", "joie"];

    // Build matrix
    const matrix: CellData[][] = [];
    const maxCounts: Record<string, number> = {};

    // First pass: calculate max count per emotion for normalization
    emotions.forEach(emotion => {
      mediaTypes.forEach(medium => {
        const works = filtered.filter(w => 
          w.type === medium && w.emotions?.includes(emotion)
        );
        const count = works.length;
        if (!maxCounts[emotion] || count > maxCounts[emotion]) {
          maxCounts[emotion] = count;
        }
      });
    });

    // Second pass: build cells with normalized intensity
    emotions.forEach(emotion => {
      const row: CellData[] = [];
      mediaTypes.forEach(medium => {
        const works = filtered.filter(w => 
          w.type === medium && w.emotions?.includes(emotion)
        );
        const count = works.length;
        const intensity = maxCounts[emotion] > 0 ? count / maxCounts[emotion] : 0;
        
        row.push({
          medium,
          emotion,
          count,
          intensity,
          works,
        });
      });
      matrix.push(row);
    });

    return { matrix, mediaTypes, emotions };
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
    };
    return colors[emotion] || "#64748b";
  };

  const getCellColor = (intensity: number, emotion: string) => {
    if (intensity === 0) return "#f1f5f9";
    const baseColor = getEmotionColor(emotion);
    return baseColor;
  };

  const getCellOpacity = (intensity: number) => {
    return Math.max(0.15, intensity);
  };

  const handleCellClick = (cell: CellData) => {
    if (cell.count > 0) {
      setSelectedCell(cell);
    }
  };

  // Find top "owners" - medium with highest intensity per emotion
  const emotionOwners = useMemo(() => {
    return matrixData.emotions.map(emotion => {
      const row = matrixData.matrix.find(r => r[0].emotion === emotion)!;
      const topCell = row.reduce((max, cell) => 
        cell.intensity > max.intensity ? cell : max
      );
      return {
        emotion,
        medium: topCell.medium,
        count: topCell.count,
      };
    });
  }, [matrixData]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-lg hover:from-fuchsia-700 hover:to-pink-700 transition text-sm font-medium shadow-md"
      >
        <span className="text-lg">🎭</span>
        <span>Dialectes émotionnels</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              🎭 Dialectes émotionnels par médium
            </h2>
            <p className="text-sm text-fuchsia-100 mt-1">
              Comment chaque art exprime différemment les mêmes émotions
            </p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              setSelectedCell(null);
            }}
            className="text-white hover:text-fuchsia-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!selectedCell ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-slate-600 mb-4">
                  Matrice révélant quels médiums "possèdent" certaines émotions. Plus la cellule est opaque, plus forte est l'intensité.
                </p>
              </div>

              {/* Matrix */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-xs font-bold text-slate-700 border-b-2">
                        Émotion ↓ / Médium →
                      </th>
                      {matrixData.mediaTypes.map(medium => (
                        <th key={medium} className="p-2 text-center text-xs font-bold text-slate-700 border-b-2">
                          {medium}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrixData.matrix.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td className="p-2 text-xs font-semibold text-slate-700 border-r-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getEmotionColor(row[0].emotion) }}
                            />
                            {row[0].emotion}
                          </div>
                        </td>
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="p-0 border border-slate-200 cursor-pointer hover:ring-2 hover:ring-fuchsia-400 transition"
                            onClick={() => handleCellClick(cell)}
                          >
                            <div
                              className="w-full h-16 flex items-center justify-center"
                              style={{
                                backgroundColor: getCellColor(cell.intensity, cell.emotion),
                                opacity: getCellOpacity(cell.intensity),
                              }}
                            >
                              <span className="text-sm font-bold text-slate-900">
                                {cell.count > 0 ? cell.count : "—"}
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Insights */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h3 className="font-bold text-pink-900 mb-3">👑 Qui "possède" chaque émotion ?</h3>
                  <div className="space-y-1 text-sm">
                    {emotionOwners.slice(0, 6).map(owner => (
                      <div key={owner.emotion} className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getEmotionColor(owner.emotion) }}
                        />
                        <span className="text-slate-700">
                          <strong>{owner.emotion}</strong> → {owner.medium} ({owner.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-bold text-purple-900 mb-2">💡 Observations</h3>
                  <p className="text-sm text-purple-800">
                    Chaque médium développe son propre "accent" émotionnel : 
                    la littérature excelle dans l'introspection (tristesse, nostalgie), 
                    le cinéma dans la tension dramatique, les jeux vidéo dans l'excitation.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Selected Cell Detail */}
              <div className="mb-6">
                <button
                  onClick={() => setSelectedCell(null)}
                  className="text-sm text-fuchsia-600 hover:text-fuchsia-800 mb-4"
                >
                  ← Retour à la matrice
                </button>

                <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-400 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl font-bold text-white"
                      style={{ backgroundColor: getEmotionColor(selectedCell.emotion) }}
                    >
                      {selectedCell.count}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {selectedCell.emotion} × {selectedCell.medium}
                      </h3>
                      <p className="text-sm text-slate-600">
                        Comment {selectedCell.medium} exprime {selectedCell.emotion}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-bold text-slate-900 mb-3">
                  Œuvres exemplaires ({selectedCell.works.length})
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {selectedCell.works.map((work) => (
                  <div
                    key={work.id}
                    className="p-3 border-2 border-slate-200 rounded-lg hover:border-pink-400 hover:shadow-sm transition cursor-pointer"
                    onClick={() => {
                      setSelectedId(work.id);
                      setIsOpen(false);
                    }}
                  >
                    <h5 className="font-semibold text-slate-900 text-sm mb-1">
                      {work.titre}
                    </h5>
                    <p className="text-xs text-slate-600 mb-2">
                      {work.createur} • {work.annee}
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
          )}
        </div>
      </div>
    </div>
  );
}
