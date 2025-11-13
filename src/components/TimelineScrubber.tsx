import { useState, useMemo, useEffect } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";
import type { WorkNode } from "../lib/types";

export default function TimelineScrubber() {
  const setFilters = useStore(s => s.setFilters);
  const filters = useStore(s => s.filters);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentYear, setCurrentYear] = useState(2025);
  const [rangeStart, setRangeStart] = useState(1800);
  
  const allWorks = data as WorkNode[];
  
  // Extract year range from corpus
  const { minYear, maxYear, yearDistribution } = useMemo(() => {
    const years: number[] = [];
    const distribution: { [key: number]: number } = {};
    
    allWorks.forEach(work => {
      const yearMatch = work.annee?.match(/\d{4}/);
      if (yearMatch) {
        const year = parseInt(yearMatch[0]);
        if (year >= 1800 && year <= 2025) {
          years.push(year);
          distribution[year] = (distribution[year] || 0) + 1;
        }
      }
    });
    
    return {
      minYear: Math.min(...years, 1800),
      maxYear: Math.max(...years, 2025),
      yearDistribution: distribution
    };
  }, [allWorks]);
  
  // Count works visible at current year
  const visibleWorksCount = useMemo(() => {
    return allWorks.filter(work => {
      const yearMatch = work.annee?.match(/\d{4}/);
      if (!yearMatch) return false;
      const year = parseInt(yearMatch[0]);
      return year >= rangeStart && year <= currentYear;
    }).length;
  }, [allWorks, rangeStart, currentYear]);
  
  // Auto-play animation
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentYear(prev => {
        if (prev >= maxYear) {
          setIsPlaying(false);
          return maxYear;
        }
        return prev + 5; // Advance by 5 years
      });
    }, 200); // Update every 200ms
    
    return () => clearInterval(interval);
  }, [isPlaying, maxYear]);
  
  // Apply filter when year changes
  useEffect(() => {
    if (isExpanded) {
      setFilters({ yearRange: [rangeStart, currentYear] });
    }
  }, [rangeStart, currentYear, isExpanded, setFilters]);
  
  const handleReset = () => {
    setRangeStart(minYear);
    setCurrentYear(maxYear);
    setFilters({ yearRange: null });
    setIsPlaying(false);
  };
  
  const handlePlay = () => {
    if (currentYear >= maxYear) {
      setCurrentYear(rangeStart);
    }
    setIsPlaying(!isPlaying);
  };
  
  // Collapsed button state
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full px-3 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 shadow-md"
      >
        <span>⏳</span>
        <span>Explorer la chronologie</span>
      </button>
    );
  }
  
  // Expanded timeline scrubber
  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-300 rounded-xl p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⏳</span>
          <h3 className="text-sm font-bold text-teal-900">Voyageur temporel</h3>
        </div>
        <button
          onClick={() => {
            setIsExpanded(false);
            handleReset();
          }}
          className="text-teal-600 hover:text-teal-800 text-sm"
        >
          ✕
        </button>
      </div>
      
      {/* Current year display */}
      <div className="text-center mb-3">
        <div className="text-3xl font-bold text-teal-900">{currentYear}</div>
        <div className="text-xs text-teal-700 mt-1">
          {visibleWorksCount} œuvre{visibleWorksCount > 1 ? 's' : ''} visible{visibleWorksCount > 1 ? 's' : ''}
        </div>
      </div>
      
      {/* Timeline visualization */}
      <div className="mb-3 px-2">
        <div className="relative h-12 bg-white rounded-lg border border-teal-200 overflow-hidden">
          {/* Work density bars */}
          {Object.entries(yearDistribution).map(([year, count]) => {
            const yearNum = parseInt(year);
            const position = ((yearNum - minYear) / (maxYear - minYear)) * 100;
            const isVisible = yearNum >= rangeStart && yearNum <= currentYear;
            
            return (
              <div
                key={year}
                className="absolute bottom-0"
                style={{
                  left: `${position}%`,
                  width: '2px',
                  height: `${Math.min((count / 20) * 100, 100)}%`,
                  backgroundColor: isVisible ? '#14b8a6' : '#d1d5db',
                  transition: 'background-color 0.3s'
                }}
              />
            );
          })}
          
          {/* Current year indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-teal-600 z-10 transition-all duration-200"
            style={{
              left: `${((currentYear - minYear) / (maxYear - minYear)) * 100}%`
            }}
          >
            <div className="absolute -top-1 -left-1.5 w-3 h-3 rounded-full bg-teal-600 border-2 border-white shadow"></div>
          </div>
        </div>
        
        {/* Year labels */}
        <div className="flex justify-between text-[10px] text-teal-700 mt-1">
          <span>{minYear}</span>
          <span>1900</span>
          <span>2000</span>
          <span>{maxYear}</span>
        </div>
      </div>
      
      {/* Range start slider */}
      <div className="mb-3">
        <label className="text-xs font-medium text-teal-800 mb-1 block">
          Début de la période: {rangeStart}
        </label>
        <input
          type="range"
          min={minYear}
          max={currentYear - 10}
          value={rangeStart}
          onChange={(e) => setRangeStart(parseInt(e.target.value))}
          className="w-full h-1.5 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
        />
      </div>
      
      {/* Current year slider */}
      <div className="mb-3">
        <label className="text-xs font-medium text-teal-800 mb-1 block">
          Année actuelle: {currentYear}
        </label>
        <input
          type="range"
          min={rangeStart + 10}
          max={maxYear}
          value={currentYear}
          onChange={(e) => {
            setCurrentYear(parseInt(e.target.value));
            setIsPlaying(false);
          }}
          className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          disabled={isPlaying}
        />
      </div>
      
      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handlePlay}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
            isPlaying
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
        >
          {isPlaying ? '⏸ Pause' : '▶ Animer'}
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2 bg-white border border-teal-300 rounded-lg text-sm text-teal-700 hover:bg-teal-50 transition"
        >
          ↻ Réinitialiser
        </button>
      </div>
      
      {/* Decade markers */}
      <div className="mt-3 pt-3 border-t border-teal-200">
        <div className="text-xs text-teal-700 mb-2 font-medium">Sauts rapides</div>
        <div className="grid grid-cols-5 gap-1">
          {[1850, 1900, 1950, 2000, 2025].map(year => (
            <button
              key={year}
              onClick={() => {
                setCurrentYear(year);
                setIsPlaying(false);
              }}
              className="px-2 py-1 bg-white border border-teal-200 rounded text-xs text-teal-700 hover:bg-teal-100 transition"
            >
              {year}
            </button>
          ))}
        </div>
      </div>
      
      {/* Info */}
      <div className="mt-3 pt-3 border-t border-teal-200 text-xs text-teal-700">
        <div className="flex items-start gap-2">
          <span className="text-teal-500">ℹ️</span>
          <span>
            Faites glisser le curseur ou lancez l'animation pour voir comment les œuvres du corpus apparaissent au fil du temps.
          </span>
        </div>
      </div>
    </div>
  );
}
