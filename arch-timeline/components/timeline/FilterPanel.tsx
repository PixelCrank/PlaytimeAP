"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, SortAsc } from "lucide-react";
import { useState } from "react";

export interface FilterOptions {
  regions: string[];
  timePeriods: string[];
  materials: string[];
  functionTypes: string[];
  hasBuildings: boolean | null;
  hasFigures: boolean | null;
}

export interface SortOption {
  field: 'chronological' | 'alphabetical' | 'workCount' | 'figureCount';
  direction: 'asc' | 'desc';
}

interface FilterPanelProps {
  filters: FilterOptions;
  sort: SortOption;
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOption) => void;
  onClearAll: () => void;
  availableRegions: string[];
  availableMaterials: string[];
  availableFunctions: string[];
  activeFilterCount: number;
}

export function FilterPanel({
  filters,
  sort,
  onFilterChange,
  onSortChange,
  onClearAll,
  availableRegions,
  availableMaterials,
  availableFunctions,
  activeFilterCount,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const timePeriodOptions = [
    { label: 'Ancient (< 0 CE)', value: 'ancient' },
    { label: 'Classical (0-500)', value: 'classical' },
    { label: 'Medieval (500-1500)', value: 'medieval' },
    { label: 'Renaissance (1400-1600)', value: 'renaissance' },
    { label: 'Early Modern (1600-1800)', value: 'early-modern' },
    { label: 'Industrial (1800-1900)', value: 'industrial' },
    { label: 'Modern (1900-1980)', value: 'modern' },
    { label: 'Contemporary (1980+)', value: 'contemporary' },
  ];

  const sortOptions = [
    { label: 'Chronological (Oldest First)', value: 'chronological-asc' },
    { label: 'Chronological (Newest First)', value: 'chronological-desc' },
    { label: 'Alphabetical (A-Z)', value: 'alphabetical-asc' },
    { label: 'Alphabetical (Z-A)', value: 'alphabetical-desc' },
    { label: 'Most Buildings', value: 'workCount-desc' },
    { label: 'Most Figures', value: 'figureCount-desc' },
  ];

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split('-') as [SortOption['field'], 'asc' | 'desc'];
    onSortChange({ field, direction });
  };

  const toggleRegion = (region: string) => {
    const newRegions = filters.regions.includes(region)
      ? filters.regions.filter(r => r !== region)
      : [...filters.regions, region];
    onFilterChange({ ...filters, regions: newRegions });
  };

  const toggleMaterial = (material: string) => {
    const newMaterials = filters.materials.includes(material)
      ? filters.materials.filter(m => m !== material)
      : [...filters.materials, material];
    onFilterChange({ ...filters, materials: newMaterials });
  };

  const toggleFunction = (func: string) => {
    const newFunctions = filters.functionTypes.includes(func)
      ? filters.functionTypes.filter(f => f !== func)
      : [...filters.functionTypes, func];
    onFilterChange({ ...filters, functionTypes: newFunctions });
  };

  const toggleTimePeriod = (period: string) => {
    const newPeriods = filters.timePeriods.includes(period)
      ? filters.timePeriods.filter(p => p !== period)
      : [...filters.timePeriods, period];
    onFilterChange({ ...filters, timePeriods: newPeriods });
  };

  return (
    <div className="relative">
      {/* Filter button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`glass-surface flex w-full items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-lg transition-all ${
          isOpen
            ? 'border-emerald-400 bg-emerald-50/80 text-emerald-700 shadow-emerald-200/50'
            : 'border-white/50 text-slate-700 hover:bg-white/80 hover:shadow-xl'
        }`}
      >
        <Filter className="h-4 w-4" />
        <span className="flex-1 text-left">Filters & Sort</span>
        {activeFilterCount > 0 && (
          <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-bold text-white">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter panel dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 z-[1100] mt-2 w-[600px] max-w-[90vw]"
          >
            <div className="glass-surface overflow-hidden rounded-2xl border border-white/50 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/50 bg-white/40 p-4">
                <div className="flex items-center gap-2">
                  <SortAsc className="h-5 w-5 text-slate-600" />
                  <h3 className="text-sm font-bold text-slate-900">Filter & Sort Options</h3>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={onClearAll}
                    className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    <X className="h-3 w-3" />
                    Clear All
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="max-h-[70vh] overflow-y-auto p-4">
                <div className="space-y-6">
                  {/* Sort */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Sort By
                    </label>
                    <select
                      value={`${sort.field}-${sort.direction}`}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time Period */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Time Period
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {timePeriodOptions.map((period) => (
                        <button
                          key={period.value}
                          onClick={() => toggleTimePeriod(period.value)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                            filters.timePeriods.includes(period.value)
                              ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {period.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Region */}
                  {availableRegions.length > 0 && (
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Geographic Region
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableRegions.slice(0, 12).map((region) => (
                          <button
                            key={region}
                            onClick={() => toggleRegion(region)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                              filters.regions.includes(region)
                                ? 'border-blue-400 bg-blue-50 text-blue-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {region}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Materials */}
                  {availableMaterials.length > 0 && (
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Materials
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableMaterials.slice(0, 10).map((material) => (
                          <button
                            key={material}
                            onClick={() => toggleMaterial(material)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                              filters.materials.includes(material)
                                ? 'border-amber-400 bg-amber-50 text-amber-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {material}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Function Types */}
                  {availableFunctions.length > 0 && (
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Building Function
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableFunctions.slice(0, 10).map((func) => (
                          <button
                            key={func}
                            onClick={() => toggleFunction(func)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                              filters.functionTypes.includes(func)
                                ? 'border-purple-400 bg-purple-50 text-purple-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {func}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Toggles */}
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Show Only
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={filters.hasBuildings === true}
                          onChange={(e) =>
                            onFilterChange({
                              ...filters,
                              hasBuildings: e.target.checked ? true : null,
                            })
                          }
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-200"
                        />
                        <span className="text-sm text-slate-700">Movements with buildings</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={filters.hasFigures === true}
                          onChange={(e) =>
                            onFilterChange({
                              ...filters,
                              hasFigures: e.target.checked ? true : null,
                            })
                          }
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-200"
                        />
                        <span className="text-sm text-slate-700">Movements with key figures</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
