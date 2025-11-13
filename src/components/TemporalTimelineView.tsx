import { useMemo, useState } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";
import { buildPredicateWithCentury } from "../lib/filters";
import { typeColor, defaultNodeColor } from "../lib/colors";
import type { WorkNode } from "../lib/types";

export default function TemporalTimelineView() {
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const setSelectedId = useStore(s => s.setSelectedId);
  const markVisited = useStore(s => s.markVisited);
  const bookmarked = useStore(s => s.bookmarked);
  const [hoveredWork, setHoveredWork] = useState<WorkNode | null>(null);

  const all = data as any[];
  const filtered = useMemo(
    () => all.filter(buildPredicateWithCentury(filters, centuryFilter)),
    [all, filters, centuryFilter]
  );

  // Group works by year and sort chronologically
  const timelineData = useMemo(() => {
    const grouped = new Map<number, WorkNode[]>();
    
    filtered.forEach((work: any) => {
      const year = work.annee || 0;
      if (!grouped.has(year)) {
        grouped.set(year, []);
      }
      grouped.get(year)!.push(work);
    });

    // Sort by year
    const sorted = Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, works]) => ({
        year,
        works: works.sort((a, b) => a.titre.localeCompare(b.titre))
      }));

    return sorted;
  }, [filtered]);

  const minYear = timelineData.length > 0 ? timelineData[0].year : 1800;
  const maxYear = timelineData.length > 0 ? timelineData[timelineData.length - 1].year : 2024;
  const yearRange = maxYear - minYear || 1;

  // Group by decade for better visualization
  const decades = useMemo(() => {
    const decadeMap = new Map<number, WorkNode[]>();
    
    filtered.forEach((work: any) => {
      const year = work.annee || 0;
      const decade = Math.floor(year / 10) * 10;
      if (!decadeMap.has(decade)) {
        decadeMap.set(decade, []);
      }
      decadeMap.get(decade)!.push(work);
    });

    return Array.from(decadeMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([decade, works]) => ({ decade, works, count: works.length }));
  }, [filtered]);

  const handleWorkClick = (work: WorkNode) => {
    setSelectedId(work.id);
    markVisited(work.id);
  };

  return (
    <div className="w-full h-full overflow-x-auto overflow-y-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header - fixed at top */}
      <div className="sticky left-0 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 px-6 py-3 z-20">
        <h2 className="text-lg font-bold text-slate-900">Chronologie temporelle</h2>
        <p className="text-xs text-slate-600">
          {filtered.length} œuvres · {minYear} à {maxYear}
        </p>
      </div>

      {/* Horizontal timeline */}
      <div className="flex h-[calc(100%-80px)] p-6 gap-8">
        {decades.map(({ decade, works, count }) => (
          <div key={decade} className="flex-shrink-0 flex flex-col" style={{ width: '220px' }}>
            {/* Decade marker */}
            <div className="sticky top-0 bg-slate-900 text-white px-3 py-2 rounded-lg mb-4 shadow-lg z-10">
              <div className="text-xl font-bold">{decade}s</div>
              <div className="text-xs opacity-75">{count} œuvres</div>
            </div>

            {/* Works stack for this decade */}
            <div className="flex-1 overflow-y-auto space-y-3 pb-4">
              {works
                .sort((a: any, b: any) => (a.annee || 0) - (b.annee || 0))
                .map((work: any) => {
                    const isBookmarked = bookmarked.has(work.id);
                    const emotionColors = work.emotions?.slice(0, 2).map((e: string) => {
                      const colorMap: Record<string, string> = {
                        'joie': '#fbbf24',
                        'tristesse': '#3b82f6',
                        'peur': '#8b5cf6',
                        'colère': '#ef4444',
                        'surprise': '#ec4899',
                        'dégoût': '#84cc16',
                        'anticipation': '#f97316',
                        'confiance': '#06b6d4',
                        'nostalgie': '#a855f7',
                        'mélancolie': '#6366f1',
                        'fascination': '#14b8a6',
                        'sérénité': '#10b981',
                        'anxiété': '#f59e0b',
                        'tension': '#dc2626',
                        'vigilance': '#eab308'
                      };
                      return colorMap[e] || '#64748b';
                    }) || [];

                    return (
                      <div
                        key={work.id}
                        className="relative group cursor-pointer bg-white rounded-md shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-slate-200 hover:border-blue-400"
                        onClick={() => handleWorkClick(work)}
                        onMouseEnter={() => setHoveredWork(work)}
                        onMouseLeave={() => setHoveredWork(null)}
                      >
                        {/* Emotion color bar */}
                        <div className="h-1.5 flex">
                          {emotionColors.length > 0 ? (
                            emotionColors.map((color: string, i: number) => (
                              <div
                                key={i}
                                className="flex-1"
                                style={{ backgroundColor: color }}
                              />
                            ))
                          ) : (
                            <div className="w-full bg-slate-200" />
                          )}
                        </div>

                        {/* Compact content */}
                        <div className="p-2">
                          {/* Year and bookmark */}
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-semibold text-slate-500">
                              {work.annee || '?'}
                            </span>
                            {isBookmarked && (
                              <span className="text-amber-500 text-xs">⭐</span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-xs font-semibold text-slate-900 mb-1 line-clamp-2 leading-tight group-hover:text-blue-600 transition">
                            {work.titre}
                          </h3>

                          {/* Type badge */}
                          <div className="mb-1">
                            <span
                              className="px-1.5 py-0.5 text-[9px] font-medium rounded"
                              style={{
                                backgroundColor: typeColor[work.type] || defaultNodeColor,
                                color: 'white'
                              }}
                            >
                              {work.type || 'Autre'}
                            </span>
                          </div>

                          {/* Emotions - compact */}
                          {work.emotions && work.emotions.length > 0 && (
                            <div className="text-[9px] text-slate-500">
                              {work.emotions.slice(0, 2).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {decades.length === 0 && (
          <div className="flex items-center justify-center flex-1">
            <p className="text-slate-500">
              Aucune œuvre ne correspond aux filtres
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
