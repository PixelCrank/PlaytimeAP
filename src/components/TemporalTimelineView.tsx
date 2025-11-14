import { useMemo, useState } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";
import { buildPredicateWithCentury } from "../lib/filters";
import { typeColor, defaultNodeColor } from "../lib/colors";
import EmptyStateWithSuggestions from "./EmptyStateWithSuggestions";
import type { WorkNode } from "../lib/types";

export default function TemporalTimelineView() {
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const setSelectedId = useStore(s => s.setSelectedId);
  const markVisited = useStore(s => s.markVisited);
  const bookmarked = useStore(s => s.bookmarked);
  const setFilters = useStore(s => s.setFilters);
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

  // Calculate emotion trends across decades
  const emotionTrends = useMemo(() => {
    const emotionColorMap: Record<string, string> = {
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

    // Count emotions per decade
    const decadeEmotions = new Map<number, Record<string, number>>();
    
    decades.forEach(({ decade, works }) => {
      const emotionCounts: Record<string, number> = {};
      works.forEach((work: any) => {
        work.emotions?.forEach((emotion: string) => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
      });
      decadeEmotions.set(decade, emotionCounts);
    });

    // Get top 6 emotions across all time
    const allEmotionCounts: Record<string, number> = {};
    decadeEmotions.forEach(emotionCounts => {
      Object.entries(emotionCounts).forEach(([emotion, count]) => {
        allEmotionCounts[emotion] = (allEmotionCounts[emotion] || 0) + count;
      });
    });

    const topEmotions = Object.entries(allEmotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([emotion]) => emotion);

    return {
      decadeEmotions,
      topEmotions,
      emotionColorMap
    };
  }, [decades]);

  // Calculate max count for density visualization
  const maxDecadeCount = useMemo(() => {
    return Math.max(...decades.map(d => d.count), 1);
  }, [decades]);

  const handleWorkClick = (work: WorkNode) => {
    setSelectedId(work.id);
    markVisited(work.id);
  };

  const handleDecadeClick = (decade: number) => {
    // Filter to this decade's works
    const startYear = decade;
    const endYear = decade + 9;
    
    setFilters({
      ...filters,
      yearRange: [startYear, endYear]
    });
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

      {/* Emotion Trends Overlay - Horizontal wave above timeline */}
      <div className="sticky left-0 bg-white/90 backdrop-blur-sm border-b border-slate-200 px-6 py-3 z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-slate-700">Tendances émotionnelles</span>
          <span className="text-xs text-slate-500">· Cliquez sur une décennie pour filtrer</span>
        </div>
        <div className="flex gap-4">
          {emotionTrends.topEmotions.map(emotion => (
            <div key={emotion} className="flex items-center gap-1.5">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: emotionTrends.emotionColorMap[emotion] }}
              />
              <span className="text-[10px] text-slate-600 capitalize">{emotion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal timeline */}
      <div className="flex h-[calc(100%-160px)] p-6 gap-8">
        {decades.map(({ decade, works, count }) => {
          const decadeEmotions = emotionTrends.decadeEmotions.get(decade) || {};
          const densityPercent = (count / maxDecadeCount) * 100;

          return (
            <div key={decade} className="flex-shrink-0 flex flex-col" style={{ width: '220px' }}>
              {/* Decade marker with density bar and click interaction */}
              <div 
                className="sticky top-0 bg-slate-900 text-white px-3 py-2 rounded-lg mb-2 shadow-lg z-10 cursor-pointer hover:bg-slate-800 transition-colors group"
                onClick={() => handleDecadeClick(decade)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xl font-bold">{decade}s</div>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                </div>
                <div className="text-xs opacity-75 mb-1">{count} œuvres</div>
                
                {/* Density bar */}
                <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
                    style={{ width: `${densityPercent}%` }}
                  />
                </div>
              </div>

              {/* Emotion wave visualization for this decade */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-2 mb-2 border border-slate-200">
                <div className="flex flex-wrap gap-1">
                  {emotionTrends.topEmotions.map(emotion => {
                    const emotionCount = decadeEmotions[emotion] || 0;
                    const emotionPercent = count > 0 ? (emotionCount / count) * 100 : 0;
                    
                    return (
                      <div 
                        key={emotion}
                        className="group/emotion relative"
                        title={`${emotion}: ${emotionCount} (${emotionPercent.toFixed(0)}%)`}
                      >
                        <div 
                          className="w-6 h-6 rounded-full transition-all duration-200 hover:scale-125"
                          style={{ 
                            backgroundColor: emotionTrends.emotionColorMap[emotion],
                            opacity: emotionPercent > 0 ? 0.3 + (emotionPercent / 100) * 0.7 : 0.1
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
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
          );
        })}

        {/* Empty state */}
        {decades.length === 0 && (
          <EmptyStateWithSuggestions />
        )}
      </div>
    </div>
  );
}
