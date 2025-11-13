"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Map as MapIcon, List } from "lucide-react";
import { HeroSection } from "@/components/timeline/HeroSection";
import { MacroSection } from "@/components/timeline/MacroSection";
import { SearchBar } from "@/components/timeline/SearchBar";
import { FilterPanel, type FilterOptions, type SortOption } from "@/components/timeline/FilterPanel";
import { TimelineOverview } from "@/components/timeline/TimelineOverview";
import { MapView } from "@/components/timeline/MapView";
import { MACRO_PALETTES } from "@/components/timeline/palettes";
import { getChronoStart } from "@/components/timeline/utils";
import { useTimelineData } from "../hooks/useTimelineData";
import type { ChildMovement, MacroMovement } from "../lib/timelineData";

export default function Home() {
  const { data, loading, error } = useTimelineData();

  const macros = useMemo<MacroMovement[]>(() => {
    return Array.isArray(data?.macros) ? (data.macros as MacroMovement[]) : [];
  }, [data?.macros]);

  const movements = useMemo<ChildMovement[]>(() => {
    return Array.isArray(data?.children) ? (data.children as ChildMovement[]) : [];
  }, [data?.children]);

  const movementById = useMemo(() => {
    return Object.fromEntries(movements.map((movement) => [movement.id, movement]));
  }, [movements]);

  const sortedMacros = useMemo(() => {
    return [...macros].sort((a, b) => getChronoStart(a) - getChronoStart(b));
  }, [macros]);

  const [activeMacroId, setActiveMacroId] = useState<string | null>(null);
  const [activeMovementId, setActiveMovementId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [matchingIds, setMatchingIds] = useState<Set<string>>(new Set());
  const macroRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  const [filters, setFilters] = useState<FilterOptions>({
    regions: [],
    timePeriods: [],
    materials: [],
    functionTypes: [],
    hasBuildings: null,
    hasFigures: null,
  });
  
  const [sort, setSort] = useState<SortOption>({
    field: 'chronological',
    direction: 'asc',
  });

  // View state (timeline or map)
  const [viewMode, setViewMode] = useState<'timeline' | 'map'>('timeline');

  // Extract available filter options from data
  const availableOptions = useMemo(() => {
    const regions = new Set<string>();
    const materials = new Set<string>();
    const functions = new Set<string>();

    movements.forEach((movement) => {
      // Regions
      if (movement.geography) {
        movement.geography.split(/[,;]/).forEach(r => regions.add(r.trim()));
      }
      if (movement.region) {
        regions.add(movement.region.trim());
      }

      // Materials and functions from buildings
      const works = Array.isArray(movement.works) ? movement.works : [];
      works.forEach((work) => {
        if (work.materials) {
          const mats = Array.isArray(work.materials) ? work.materials : [];
          mats.forEach(m => materials.add(m.trim()));
        }
        if (work.functionType) {
          functions.add(work.functionType.trim());
        }
      });
    });

    return {
      regions: Array.from(regions).filter(Boolean).sort(),
      materials: Array.from(materials).filter(Boolean).sort(),
      functions: Array.from(functions).filter(Boolean).sort(),
    };
  }, [movements]);

  // Apply filters and sort
  const filteredAndSortedMacros = useMemo(() => {
    let filtered = [...sortedMacros];

    // Apply filters
    if (filters.regions.length > 0 || filters.timePeriods.length > 0 || 
        filters.materials.length > 0 || filters.functionTypes.length > 0 ||
        filters.hasBuildings !== null || filters.hasFigures !== null) {
      
      filtered = filtered.filter((macro) => {
        const childIds = Array.isArray(macro.children) ? macro.children : [];
        const childMovements = childIds
          .map(id => movementById[id])
          .filter((m): m is ChildMovement => Boolean(m));

        // If no movements match, filter out this macro
        if (childMovements.length === 0) return false;

        // Check if any child movement matches filters
        return childMovements.some((movement) => {
          // Time period filter
          if (filters.timePeriods.length > 0) {
            const start = movement.start || 0;
            const matchesPeriod = filters.timePeriods.some((period) => {
              switch (period) {
                case 'ancient': return start < 0;
                case 'classical': return start >= 0 && start < 500;
                case 'medieval': return start >= 500 && start < 1500;
                case 'renaissance': return start >= 1400 && start < 1600;
                case 'early-modern': return start >= 1600 && start < 1800;
                case 'industrial': return start >= 1800 && start < 1900;
                case 'modern': return start >= 1900 && start < 1980;
                case 'contemporary': return start >= 1980;
                default: return false;
              }
            });
            if (!matchesPeriod) return false;
          }

          // Region filter
          if (filters.regions.length > 0) {
            const movementRegions = [
              movement.geography,
              movement.region,
            ].filter(Boolean).join(' ').toLowerCase();
            
            const matchesRegion = filters.regions.some((region) =>
              movementRegions.includes(region.toLowerCase())
            );
            if (!matchesRegion) return false;
          }

          // Materials filter
          if (filters.materials.length > 0) {
            const works = Array.isArray(movement.works) ? movement.works : [];
            const hasMaterial = works.some((work) => {
              const workMaterials = Array.isArray(work.materials) ? work.materials : [];
              return filters.materials.some((mat) =>
                workMaterials.some((wm) => wm.toLowerCase().includes(mat.toLowerCase()))
              );
            });
            if (!hasMaterial) return false;
          }

          // Function type filter
          if (filters.functionTypes.length > 0) {
            const works = Array.isArray(movement.works) ? movement.works : [];
            const hasFunction = works.some((work) =>
              filters.functionTypes.some((func) =>
                work.functionType?.toLowerCase().includes(func.toLowerCase())
              )
            );
            if (!hasFunction) return false;
          }

          // Has buildings filter
          if (filters.hasBuildings === true) {
            const works = Array.isArray(movement.works) ? movement.works : [];
            if (works.length === 0) return false;
          }

          // Has figures filter
          if (filters.hasFigures === true) {
            const figures = Array.isArray(movement.figures) ? movement.figures : [];
            if (figures.length === 0) return false;
          }

          return true;
        });
      });
    }

    // Apply sorting
    if (sort.field === 'chronological') {
      filtered.sort((a, b) => {
        const diff = getChronoStart(a) - getChronoStart(b);
        return sort.direction === 'asc' ? diff : -diff;
      });
    } else if (sort.field === 'alphabetical') {
      filtered.sort((a, b) => {
        const comp = a.name.localeCompare(b.name);
        return sort.direction === 'asc' ? comp : -comp;
      });
    } else if (sort.field === 'workCount') {
      filtered.sort((a, b) => {
        const aCount = (a.children || []).reduce((sum, childId) => {
          const movement = movementById[childId];
          const works = movement && Array.isArray(movement.works) ? movement.works.length : 0;
          return sum + works;
        }, 0);
        const bCount = (b.children || []).reduce((sum, childId) => {
          const movement = movementById[childId];
          const works = movement && Array.isArray(movement.works) ? movement.works.length : 0;
          return sum + works;
        }, 0);
        return sort.direction === 'desc' ? bCount - aCount : aCount - bCount;
      });
    } else if (sort.field === 'figureCount') {
      filtered.sort((a, b) => {
        const aCount = (a.children || []).reduce((sum, childId) => {
          const movement = movementById[childId];
          const figures = movement && Array.isArray(movement.figures) ? movement.figures.length : 0;
          return sum + figures;
        }, 0);
        const bCount = (b.children || []).reduce((sum, childId) => {
          const movement = movementById[childId];
          const figures = movement && Array.isArray(movement.figures) ? movement.figures.length : 0;
          return sum + figures;
        }, 0);
        return sort.direction === 'desc' ? bCount - aCount : aCount - bCount;
      });
    }

    return filtered;
  }, [sortedMacros, filters, sort, movementById]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.regions.length > 0) count += filters.regions.length;
    if (filters.timePeriods.length > 0) count += filters.timePeriods.length;
    if (filters.materials.length > 0) count += filters.materials.length;
    if (filters.functionTypes.length > 0) count += filters.functionTypes.length;
    if (filters.hasBuildings) count += 1;
    if (filters.hasFigures) count += 1;
    if (sort.field !== 'chronological' || sort.direction !== 'asc') count += 1;
    return count;
  }, [filters, sort]);

  const handleClearFilters = () => {
    setFilters({
      regions: [],
      timePeriods: [],
      materials: [],
      functionTypes: [],
      hasBuildings: null,
      hasFigures: null,
    });
    setSort({ field: 'chronological', direction: 'asc' });
  };

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setMatchingIds(new Set());
      return;
    }

    const query = searchQuery.toLowerCase();
    const matches = new Set<string>();

    // Search through all content
    filteredAndSortedMacros.forEach((macro) => {
      // Check macro name and description
      if (macro.name.toLowerCase().includes(query) || 
          macro.description?.toLowerCase().includes(query)) {
        matches.add(`macro-${macro.id}`);
      }

      // Get child movements for this macro
      const childIds = Array.isArray(macro.children) ? macro.children : [];
      childIds.forEach((childId) => {
        const movement = movementById[childId];
        if (!movement) return;

        // Check movement name, overview, description
        if (movement.name.toLowerCase().includes(query) ||
            movement.overview?.toLowerCase().includes(query) ||
            movement.description?.toLowerCase().includes(query)) {
          matches.add(`movement-${movement.id}`);
          matches.add(`macro-${macro.id}`); // Also highlight parent macro
        }

        // Check buildings/works
        const works = Array.isArray(movement.works) ? movement.works : [];
        works.forEach((work) => {
          if (work.name.toLowerCase().includes(query) ||
              work.description?.toLowerCase().includes(query) ||
              work.architects?.toLowerCase().includes(query)) {
            matches.add(`work-${work.id}`);
            matches.add(`movement-${movement.id}`);
            matches.add(`macro-${macro.id}`);
          }
        });

        // Check figures
        const figures = Array.isArray(movement.figures) ? movement.figures : [];
        figures.forEach((figure) => {
          if (figure.name.toLowerCase().includes(query) ||
              figure.description?.toLowerCase().includes(query) ||
              figure.philosophy?.toLowerCase().includes(query)) {
            matches.add(`figure-${figure.id}`);
            matches.add(`movement-${movement.id}`);
            matches.add(`macro-${macro.id}`);
          }
        });
      });
    });

    setMatchingIds(matches);

    // Auto-expand first matching macro and movement
    if (matches.size > 0) {
      const firstMacroMatch = Array.from(matches).find(id => id.startsWith('macro-'));
      if (firstMacroMatch) {
        const macroId = firstMacroMatch.replace('macro-', '');
        setActiveMacroId(macroId);
        
        // Find first matching movement in this macro
        const firstMovementMatch = Array.from(matches).find(id => 
          id.startsWith('movement-') && 
          movementById[id.replace('movement-', '')]?.parent?.toLowerCase() === 
            macros.find(m => m.id === macroId)?.name?.toLowerCase()
        );
        if (firstMovementMatch) {
          setActiveMovementId(firstMovementMatch.replace('movement-', ''));
        }
      }
    }
  }, [searchQuery, sortedMacros, movementById, macros]);

  const handleMacroToggle = (macro: MacroMovement) => {
    setActiveMacroId((previous) => (previous === macro.id ? null : macro.id));
    setActiveMovementId(null);
  };

  const handleMovementToggle = (movement: ChildMovement) => {
    setActiveMovementId((previous) => (previous === movement.id ? null : movement.id));
  };

  const clearHighlights = () => {
    setActiveMacroId(null);
    setActiveMovementId(null);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setMatchingIds(new Set());
  };

  const handleMinimapClick = (macroId: string) => {
    const element = macroRefs.current.get(macroId);
    if (element) {
      const yOffset = -100; // Offset for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveMacroId(macroId);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page-surface">
        <div className="glass-panel space-y-4 rounded-3xl border border-white/40 bg-white/60 p-8 text-center shadow-soft">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
          <p className="text-sm font-semibold text-slate-500">Loading the lineage…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page-surface">
        <div className="glass-panel space-y-4 rounded-3xl border border-red-200/50 bg-white/70 p-8 text-center shadow-soft">
          <h2 className="text-xl font-bold text-red-600">Timeline data failed to load</h2>
          <p className="text-sm text-slate-600">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="glass-button inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-red-600 shadow-soft transition hover:bg-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-page-surface">
      <HeroSection hasHighlights={Boolean(activeMacroId || activeMovementId)} onClear={clearHighlights} />
      
      {/* Timeline minimap navigation */}
      <TimelineOverview
        macros={sortedMacros}
        activeMacroId={activeMacroId}
        onMacroClick={handleMinimapClick}
      />
      
      {/* Timeline with integrated dots that move with cards */}
      <main className="relative pb-24 overflow-x-hidden">
        {/* Continuous vertical timeline line */}
        <div className="absolute left-[calc(50%-550px+2rem)] top-0 hidden h-full w-0.5 bg-gradient-to-b from-sky-300/50 via-emerald-300/50 to-indigo-300/50 md:block lg:left-[calc(50%-550px+3rem)]" />
        
        {/* Timeline arrow at bottom */}
        <div className="absolute left-[calc(50%-550px+2rem)] bottom-8 hidden -translate-x-1/2 md:block lg:left-[calc(50%-550px+3rem)]">
          <div className="flex flex-col items-center gap-1">
            <div className="h-8 w-0.5 bg-gradient-to-b from-indigo-300/50 to-transparent" />
            <svg width="16" height="16" viewBox="0 0 16 16" className="text-indigo-400">
              <path d="M8 14L4 10h8l-4 4z" fill="currentColor" />
            </svg>
            <span className="text-xs font-semibold text-slate-400">Time</span>
          </div>
        </div>

        <div className="section-container space-y-8 pt-8 sm:space-y-12 lg:space-y-16">
          {/* Search, Filter, and View Controls - Redesigned */}
          <div className="sticky top-4 z-[1100] space-y-3">
            {/* Top Row: Search Bar (full width) */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={handleSearchClear}
              matchCount={matchingIds.size}
            />
            
            {/* Bottom Row: Filter + View Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <FilterPanel
                  filters={filters}
                  sort={sort}
                  onFilterChange={setFilters}
                  onSortChange={setSort}
                  onClearAll={handleClearFilters}
                  activeFilterCount={activeFilterCount}
                  availableRegions={availableOptions.regions}
                  availableMaterials={availableOptions.materials}
                  availableFunctions={availableOptions.functions}
                />
              </div>
              
              {/* View Toggle - Compact and Clear */}
              <div className="flex shrink-0 rounded-xl border border-white/20 bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all ${
                    viewMode === 'timeline'
                      ? 'bg-slate-900 text-white'
                      : 'bg-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span>Timeline</span>
                </button>
                <div className="w-px bg-slate-200" />
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all ${
                    viewMode === 'map'
                      ? 'bg-slate-900 text-white'
                      : 'bg-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MapIcon className="h-4 w-4" />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Conditional rendering based on view mode */}
          {viewMode === 'map' ? (
            <MapView
              buildings={movements.flatMap(m => m.works || [])}
              movements={movements}
              macros={macros}
            />
          ) : (
            <>
          {filteredAndSortedMacros.map((macro, index) => {
            const palette = MACRO_PALETTES[index % MACRO_PALETTES.length];
            const childIds = Array.isArray(macro.children) ? macro.children : [];
            const childrenMovements = childIds
              .map((id) => movementById[id])
              .filter((movement): movement is ChildMovement => Boolean(movement))
              .sort((a, b) => getChronoStart(a) - getChronoStart(b));

            return (
              <div
                key={macro.id}
                className="relative"
                ref={(el) => {
                  if (el) macroRefs.current.set(macro.id, el);
                }}
              >
                {/* Timeline marker that moves with the card */}
                <div className="absolute -left-[calc(1.5rem+96px)] top-8 hidden items-center gap-4 md:flex lg:-left-[calc(1.5rem+120px)]">
                  {/* Year label */}
                  <div className="flex min-w-[64px] flex-col items-end text-right">
                    {macro.start ? (
                      <>
                        <span className="text-xl font-black text-slate-800">{macro.start}</span>
                        {macro.end && macro.end !== macro.start ? (
                          <span className="text-xs font-medium text-slate-500">to {macro.end}</span>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-slate-400">Era {index + 1}</span>
                    )}
                  </div>
                  
                  {/* Timeline dot */}
                  <div className={`relative z-10 h-4 w-4 rounded-full border-4 border-white bg-gradient-to-br ${palette.surface} shadow-lg`} />
                  
                  {/* Horizontal connector line to card */}
                  <div className="h-0.5 w-8 bg-gradient-to-r from-slate-300/60 to-transparent lg:w-12" />
                </div>
                
                <MacroSection
                  macro={macro}
                  order={index}
                  palette={palette}
                  isActive={activeMacroId === macro.id}
                  onToggle={() => handleMacroToggle(macro)}
                  movements={childrenMovements}
                  activeMovementId={activeMovementId}
                  onMovementToggle={handleMovementToggle}
                  isHighlighted={matchingIds.has(`macro-${macro.id}`)}
                  hasSearch={searchQuery.trim().length > 0}
                  allMovements={movements}
                />
              </div>
            );
          })}

          {!filteredAndSortedMacros.length ? (
            <div className="glass-panel rounded-4xl border border-dashed border-white/60 bg-white/70 p-12 text-center text-slate-600">
              No timeline data found yet. Connect the Google Sheet to populate your architectural family tree.
            </div>
          ) : null}
          </>
          )}
        </div>
      </main>
    </div>
  );
}
