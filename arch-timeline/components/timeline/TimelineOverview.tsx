"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { MacroMovement } from "../../lib/timelineData";

export function TimelineOverview({
  macros,
  activeMacroId,
  onMacroClick,
}: {
  macros: MacroMovement[];
  activeMacroId: string | null;
  onMacroClick: (macroId: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show minimap after scrolling past hero section
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!macros.length || !isVisible) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-20 left-1/2 z-[1200] hidden -translate-x-1/2 md:block"
    >
      <div className="glass-surface overflow-visible rounded-2xl border border-white/50 p-3 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="px-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            Timeline
          </span>
          <div className="flex items-center gap-1.5">
            {macros.map((macro, index) => {
              const isActive = activeMacroId === macro.id;
              const startYear = macro.start || 0;
              const displayYear = startYear > 0 ? startYear : `${Math.abs(startYear)} BCE`;

              return (
                <motion.button
                  key={macro.id}
                  onClick={() => onMacroClick(macro.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                  title={`${macro.name} (${displayYear})`}
                >
                  {/* Dot */}
                  <div
                    className={`h-3 w-3 rounded-full border-2 border-white transition-all ${
                      isActive
                        ? "scale-125 bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/50"
                        : "bg-gradient-to-br from-slate-300 to-slate-400 hover:from-slate-400 hover:to-slate-500"
                    }`}
                  />

                  {/* Tooltip */}
                  <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                    {macro.name}
                    <div className="text-[10px] font-normal text-slate-300">{displayYear}</div>
                    {/* Arrow */}
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
                  </div>

                  {/* Connecting line */}
                  {index < macros.length - 1 && (
                    <div className="absolute left-full top-1/2 h-0.5 w-1.5 -translate-y-1/2 bg-slate-300" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
