'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, Search, Filter, ZoomIn, ZoomOut, X, Image as ImageIcon } from 'lucide-react';
import { useTimelineData } from '../hooks/useTimelineData';

// Image component with error handling and fallback
const ArchImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}> = ({ src, alt, className = "", fallbackClassName = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <>
      {!imageError ? (
        <img
          src={src}
          alt={alt}
          className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
          loading="lazy"
        />
      ) : (
        <div className={`${fallbackClassName} bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center`}>
          <ImageIcon className="w-4 h-4 text-slate-400" />
        </div>
      )}
      {imageLoading && !imageError && (
        <div className={`${fallbackClassName} bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse`} />
      )}
    </>
  );
};

// Types
// ...existing type definitions from your old code...

const INITIAL_PIXELS_PER_YEAR = 2;
const TIME_RANGE = { start: -3000, end: 2025 };
const YEAR_MIN = TIME_RANGE.start;
const YEAR_MAX = TIME_RANGE.end;

const fmtYear = (year: number) => {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
};

export default function ArchitectureTimeline() {
  const { data, loading, error } = useTimelineData();

  // All state hooks first
  const [scale, setScale] = useState(INITIAL_PIXELS_PER_YEAR);
  const [offsetX, setOffsetX] = useState(0);
  const [activeMacro, setActiveMacro] = useState<string | null>(null);
  const [activeChild, setActiveChild] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterMacro, setFilterMacro] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [originalScale, setOriginalScale] = useState(INITIAL_PIXELS_PER_YEAR);
  const [originalOffsetX, setOriginalOffsetX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredMacro, setHoveredMacro] = useState<string | null>(null);
  const [hoveredChild, setHoveredChild] = useState<string | null>(null);
  const [hoveredSubchild, setHoveredSubchild] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panStart = useRef<{ x: number; offsetX: number } | null>(null);

  // Data conversion for timeline
  const timelineData = data || { macros: [], children: [], subchildren: [] };
  const { macros: MACROS = [], children: CHILDREN = [], subchildren: SUBCHILDREN = [] } = timelineData || {};

  // Quick lookup objects
  const CHILD_BY_ID: Record<string, any> = useMemo(() =>
    Object.fromEntries((CHILDREN || []).map((c: any) => [c.id, c])), [CHILDREN]
  );
  const SUBCHILD_BY_ID: Record<string, any> = useMemo(() =>
    Object.fromEntries((SUBCHILDREN || []).map((s: any) => [s.id, s])), [SUBCHILDREN]
  );

  // Click handlers
  const handleMacroClick = (macro: any) => {
    if (activeMacro === macro.id) {
      setActiveMacro(null);
      setActiveChild(null);
      setDetail(null);
    } else {
      setActiveMacro(macro.id);
      setActiveChild(null);
      setDetail(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading timeline data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Timeline Load Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const yearsSpan = YEAR_MAX - YEAR_MIN;
  const totalWidth = Math.max(1200, yearsSpan * scale);
  const yearToX = (year: number) => (year - YEAR_MIN) * scale + offsetX;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Search and Controls */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-4 p-4 max-w-full overflow-x-auto">
          <input
            type="text"
            placeholder="Search movements, regions, traits, figures..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 backdrop-blur-sm min-w-80"
          />
          <div className="text-sm text-gray-300 space-x-4">
            <span>Status: {loading ? 'Loading...' : data ? 'Loaded' : 'No data'}</span>
            <span>Data: {MACROS.length} macros, {CHILDREN.length} children</span>
            {activeMacro && <span className="text-blue-300">Active: {activeMacro}</span>}
          </div>
          {activeMacro && (
            <button
              onClick={() => {
                setActiveMacro(null);
                setActiveChild(null);
                setDetail(null);
              }}
              className="px-3 py-2 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 hover:bg-red-500/30 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
      {/* Timeline Container */}
      <div className="pt-20 h-screen overflow-hidden">
        <div className="h-full w-full overflow-auto relative">
          <div 
            className="relative bg-gradient-to-r from-slate-800/30 to-slate-700/30 min-h-full"
            style={{ 
              width: Math.max(totalWidth, 2000),
              minHeight: '100vh'
            }}
          >
            {/* Year Markers */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/40 to-transparent">
              {Array.from({ length: Math.floor(yearsSpan / 100) + 1 }, (_, i) => {
                const year = YEAR_MIN + i * 100;
                const x = yearToX(year);
                return (
                  <div
                    key={`year-${year}`}
                    className="absolute top-0 bottom-0 border-l border-white/20"
                    style={{ left: x }}
                  >
                    <span className="absolute top-2 -translate-x-1/2 text-xs text-white/70 font-mono">
                      {fmtYear(year)}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Macro Movement Bands */}
            <div className="pt-16">
              {MACROS.map((macro: any, macroIndex: number) => {
                const startX = yearToX(macro.start);
                const endX = yearToX(macro.end);
                const width = endX - startX;
                const isActive = activeMacro === macro.id;
                return (
                  <motion.div
                    key={String(macro.id)}
                    className="relative mb-4"
                    style={{ height: isActive ? 300 : 80 }}
                    initial={false}
                    animate={{ height: isActive ? 300 : 80 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {/* Macro Band */}
                    <motion.div
                      className={`absolute top-0 h-16 rounded-lg border-2 cursor-pointer transition-all duration-200 ${macro.colorClass} ${
                        isActive 
                          ? 'border-white/60 shadow-lg shadow-white/20' 
                          : 'border-white/30 hover:border-white/50'
                      }`}
                      style={{
                        left: startX,
                        width: Math.max(width, 120),
                        zIndex: 10
                      }}
                      onClick={() => handleMacroClick(macro)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center h-full px-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">
                            {macro.name}
                          </div>
                          <div className="text-xs opacity-80">
                            {fmtYear(macro.start)} - {fmtYear(macro.end)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    {/* Child Movements */}
                    <AnimatePresence>
                      {isActive && macro.children.map((childId: string, index: number) => {
                        const child = CHILD_BY_ID[childId];
                        if (!child) return null;
                        const childStartX = yearToX(child.start);
                        const childEndX = yearToX(child.end);
                        const childWidth = childEndX - childStartX;
                        const childY = 70 + index * 40;
                        return (
                          <motion.div
                            key={String(childId)}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="absolute"
                            style={{
                              left: childStartX,
                              top: childY,
                              width: Math.max(childWidth, 100),
                              zIndex: 15
                            }}
                          >
                            <motion.div
                              className="h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded cursor-pointer transition-all duration-200 hover:bg-white/30"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="flex items-center h-full px-2">
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-xs truncate">
                                    {child.name}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
