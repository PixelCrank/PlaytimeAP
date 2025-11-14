import { useMemo } from "react";
import type { WorkNode } from "../lib/types";

interface Props {
  work: WorkNode;
  size?: number;
  showLabels?: boolean;
}

export default function TemporalDNAFingerprint({ work, size = 200, showLabels = true }: Props) {
  const fingerprint = useMemo(() => {
    // Define the dimensions we'll visualize
    const dimensions = [
      { 
        key: 'emotions', 
        label: 'Émotions',
        value: (work.emotions?.length || 0) / 5, // Normalize to 0-1 (max 5 emotions)
        color: '#3b82f6'
      },
      { 
        key: 'categories', 
        label: 'Catégories',
        value: (work.categories?.length || 0) / 4, // Normalize to 0-1 (max 4 categories)
        color: '#8b5cf6'
      },
      { 
        key: 'complexity', 
        label: 'Complexité',
        value: Math.min(((work.emotions?.length || 0) + (work.categories?.length || 0)) / 8, 1), // Emotional + thematic complexity
        color: '#ec4899'
      },
      { 
        key: 'temporal', 
        label: 'Temporalité',
        value: work.annee ? Math.min((2024 - Number(work.annee)) / 200, 1) : 0.5, // Age factor
        color: '#f59e0b'
      },
      { 
        key: 'identity', 
        label: 'Identité',
        value: work.categories?.some(c => c.toLowerCase().includes('identité')) ? 1 : 0,
        color: '#10b981'
      },
      { 
        key: 'media', 
        label: 'Média',
        value: work.lien ? 1 : 0,
        color: '#06b6d4'
      },
    ];

    return dimensions;
  }, [work]);

  const center = size / 2;
  const maxRadius = (size / 2) - 20;
  const numDimensions = fingerprint.length;
  const angleStep = (2 * Math.PI) / numDimensions;

  // Generate path for the filled polygon
  const points = fingerprint.map((dim, i) => {
    const angle = (i * angleStep) - (Math.PI / 2); // Start from top
    const radius = dim.value * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background circles for scale */}
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <circle
            key={scale}
            cx={center}
            cy={center}
            r={maxRadius * scale}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray={scale === 1 ? "none" : "2,2"}
          />
        ))}

        {/* Dimension axes */}
        {fingerprint.map((dim, i) => {
          const angle = (i * angleStep) - (Math.PI / 2);
          const endX = center + maxRadius * Math.cos(angle);
          const endY = center + maxRadius * Math.sin(angle);
          
          return (
            <g key={dim.key}>
              {/* Axis line */}
              <line
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              
              {/* Labels */}
              {showLabels && (
                <>
                  {/* Label background */}
                  <circle
                    cx={endX}
                    cy={endY}
                    r="18"
                    fill="white"
                    stroke={dim.color}
                    strokeWidth="2"
                  />
                  
                  {/* Label text */}
                  <text
                    x={endX}
                    y={endY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[8px] font-semibold"
                    fill={dim.color}
                  >
                    {dim.label.slice(0, 3)}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Data polygon */}
        <polygon
          points={points}
          fill="url(#gradient)"
          fillOpacity="0.3"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {fingerprint.map((dim, i) => {
          const angle = (i * angleStep) - (Math.PI / 2);
          const radius = dim.value * maxRadius;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          
          return (
            <circle
              key={`${dim.key}-point`}
              cx={x}
              cy={y}
              r="4"
              fill={dim.color}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

        {/* Gradient definition */}
        <defs>
          <radialGradient id="gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>

      {showLabels && (
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          {fingerprint.map((dim) => (
            <div key={dim.key} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: dim.color }}
              />
              <span className="text-slate-700">{dim.label}</span>
              <span className="text-slate-400 ml-auto">{Math.round(dim.value * 100)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
