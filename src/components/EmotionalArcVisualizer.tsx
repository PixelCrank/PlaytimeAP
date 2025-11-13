import { useMemo } from "react";
import works from "../data/works.json";
import type { Work } from "../lib/types";

type EmotionalArcVisualizerProps = {
  workIds: string[];
};

// Emotion to valence/arousal mapping (same as WorldCanvas)
const emotionCoords: Record<
  string,
  { valence: number; arousal: number }
> = {
  joie: { valence: 0.8, arousal: 0.7 },
  confiance: { valence: 0.6, arousal: 0.3 },
  peur: { valence: -0.6, arousal: 0.8 },
  surprise: { valence: 0.2, arousal: 0.8 },
  tristesse: { valence: -0.7, arousal: -0.4 },
  dégoût: { valence: -0.8, arousal: 0.2 },
  colère: { valence: -0.6, arousal: 0.7 },
  anticipation: { valence: 0.3, arousal: 0.6 },
  nostalgie: { valence: -0.3, arousal: -0.2 },
  sérénité: { valence: 0.5, arousal: -0.6 },
  admiration: { valence: 0.7, arousal: 0.4 },
  excitation: { valence: 0.6, arousal: 0.8 },
  fascination: { valence: 0.5, arousal: 0.5 },
  tension: { valence: -0.4, arousal: 0.6 },
  vigilance: { valence: -0.2, arousal: 0.5 },
  ennui: { valence: -0.3, arousal: -0.7 },
};

function getEmotionCoords(emotion: string) {
  const key = emotion.toLowerCase();
  return emotionCoords[key] || { valence: 0, arousal: 0 };
}

function getWorkEmotionalCenter(work: Work) {
  if (!work.emotions || work.emotions.length === 0) {
    return { valence: 0, arousal: 0 };
  }

  let totalValence = 0;
  let totalArousal = 0;
  work.emotions.forEach((e: string) => {
    const coords = getEmotionCoords(e);
    totalValence += coords.valence;
    totalArousal += coords.arousal;
  });

  return {
    valence: totalValence / work.emotions.length,
    arousal: totalArousal / work.emotions.length,
  };
}

export default function EmotionalArcVisualizer({
  workIds,
}: EmotionalArcVisualizerProps) {
  const arcData = useMemo(() => {
    return workIds
      .map((id) => works.find((w) => w.id === id))
      .filter(Boolean)
      .map((work, index) => {
        const coords = getWorkEmotionalCenter(work as Work);
        return {
          work: work as Work,
          index,
          valence: coords.valence,
          arousal: coords.arousal,
        };
      });
  }, [workIds]);

  if (arcData.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p className="text-sm">Ajoutez des œuvres pour voir l'arc émotionnel</p>
      </div>
    );
  }

  // Chart dimensions
  const width = 600;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Scale functions
  const xScale = (index: number) =>
    padding + (index / Math.max(arcData.length - 1, 1)) * chartWidth;
  const yValenceScale = (valence: number) =>
    padding + chartHeight / 2 - (valence * chartHeight) / 2;
  const yArousalScale = (arousal: number) =>
    padding + chartHeight / 2 - (arousal * chartHeight) / 2;

  // Generate path data
  const valencePath = arcData
    .map((d, i) => {
      const x = xScale(d.index);
      const y = yValenceScale(d.valence);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");

  const arousalPath = arcData
    .map((d, i) => {
      const x = xScale(d.index);
      const y = yArousalScale(d.arousal);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <h3 className="font-bold text-slate-800 mb-4 text-sm">
        📈 Arc émotionnel du parcours
      </h3>

      <svg width={width} height={height} className="mx-auto">
        {/* Grid lines */}
        <line
          x1={padding}
          y1={padding + chartHeight / 2}
          x2={width - padding}
          y2={padding + chartHeight / 2}
          stroke="#cbd5e1"
          strokeDasharray="4 4"
        />

        {/* Y-axis labels */}
        <text
          x={padding - 10}
          y={padding}
          textAnchor="end"
          fontSize="10"
          fill="#64748b"
        >
          +
        </text>
        <text
          x={padding - 10}
          y={padding + chartHeight / 2}
          textAnchor="end"
          fontSize="10"
          fill="#64748b"
        >
          0
        </text>
        <text
          x={padding - 10}
          y={height - padding}
          textAnchor="end"
          fontSize="10"
          fill="#64748b"
        >
          −
        </text>

        {/* Valence line */}
        <path
          d={valencePath}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Arousal line */}
        <path
          d={arousalPath}
          fill="none"
          stroke="#ec4899"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 3"
        />

        {/* Data points */}
        {arcData.map((d, i) => (
          <g key={i}>
            {/* Valence point */}
            <circle
              cx={xScale(d.index)}
              cy={yValenceScale(d.valence)}
              r="5"
              fill="#8b5cf6"
              stroke="white"
              strokeWidth="2"
            />
            {/* Arousal point */}
            <circle
              cx={xScale(d.index)}
              cy={yArousalScale(d.arousal)}
              r="5"
              fill="#ec4899"
              stroke="white"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* X-axis labels (work numbers) */}
        {arcData.map((d, i) => (
          <text
            key={i}
            x={xScale(d.index)}
            y={height - padding + 20}
            textAnchor="middle"
            fontSize="10"
            fill="#64748b"
          >
            {i + 1}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-purple-600"></div>
          <span className="text-slate-600">Valence (négatif → positif)</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-0.5 bg-pink-600"
            style={{ backgroundImage: "repeating-linear-gradient(to right, #ec4899 0, #ec4899 6px, transparent 6px, transparent 9px)" }}
          ></div>
          <span className="text-slate-600">Arousal (calme → intense)</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-purple-50 border border-purple-200 rounded p-3">
          <div className="text-xs text-purple-600 font-semibold mb-1">
            Valence moyenne
          </div>
          <div className="text-lg font-bold text-purple-900">
            {(
              arcData.reduce((sum, d) => sum + d.valence, 0) / arcData.length
            ).toFixed(2)}
          </div>
          <div className="text-xs text-purple-600 mt-1">
            {arcData.reduce((sum, d) => sum + d.valence, 0) / arcData.length > 0
              ? "Plutôt positif ✨"
              : "Plutôt négatif 🌧️"}
          </div>
        </div>

        <div className="bg-pink-50 border border-pink-200 rounded p-3">
          <div className="text-xs text-pink-600 font-semibold mb-1">
            Intensité moyenne
          </div>
          <div className="text-lg font-bold text-pink-900">
            {(
              arcData.reduce((sum, d) => sum + Math.abs(d.arousal), 0) /
              arcData.length
            ).toFixed(2)}
          </div>
          <div className="text-xs text-pink-600 mt-1">
            {arcData.reduce((sum, d) => sum + Math.abs(d.arousal), 0) /
              arcData.length >
            0.5
              ? "Très intense ⚡"
              : "Plutôt calme 🌊"}
          </div>
        </div>
      </div>
    </div>
  );
}
