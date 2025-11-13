"use client";

import { Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  onClear,
  matchCount,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  matchCount: number;
}) {
  return (
    <div className="glass-surface rounded-2xl border border-white/50 p-3 shadow-lg backdrop-blur-xl">
      <div className="relative flex items-center gap-3">
        <Search className="h-5 w-5 flex-shrink-0 text-slate-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search movements, buildings, figures..."
          className="flex-1 bg-transparent py-1 text-sm text-slate-900 placeholder-slate-500 outline-none sm:text-base"
        />
        {value && (
          <div className="flex items-center gap-2">
            {matchCount > 0 ? (
              <div className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                {matchCount} {matchCount === 1 ? 'match' : 'matches'}
              </div>
            ) : (
              <div className="rounded-full bg-slate-300 px-3 py-1 text-xs font-semibold text-slate-600">
                No matches
              </div>
            )}
            <button
              type="button"
              onClick={onClear}
              className="rounded-full p-2 transition hover:bg-white/60"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
