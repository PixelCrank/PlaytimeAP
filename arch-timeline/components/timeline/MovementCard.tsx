"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building, ChevronDown, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import type { ChildMovement, TimelineBuilding, TimelineFigure } from "../../lib/timelineData";
import { FigureCard } from "./FigureCard";
import { InfoPill } from "./InfoPill";
import { MovementDetails, type MovementPalette } from "./MovementDetails";
import { WorkCard } from "./WorkCard";
import { TimelineDot } from "./TimelineDot";
import { formatMovementYears } from "@/components/timeline/utils";

export function MovementCard({
  movement,
  palette,
  macroName,
  isActive,
  onToggle,
  workPaletteKey,
  figurePaletteKey,
  allMovements = [],
}: {
  movement: ChildMovement;
  palette: MovementPalette;
  macroName: string;
  isActive: boolean;
  onToggle: () => void;
  workPaletteKey: "a" | "b" | "c";
  figurePaletteKey: "a" | "b" | "c";
  allMovements?: ChildMovement[];
}) {
  const years = formatMovementYears(movement);
  const works = Array.isArray(movement.works) ? (movement.works as TimelineBuilding[]) : [];
  const figures = Array.isArray(movement.figures) ? (movement.figures as TimelineFigure[]) : [];

  // Get representative image: movement's image or first building's image
  const thumbnailUrl = movement.imageUrl || (works.length > 0 ? works[0].imageUrl : undefined);

  const [activeWorkId, setActiveWorkId] = useState<string | null>(null);
  const [activeFigureId, setActiveFigureId] = useState<string | null>(null);

  const handleWorkToggle = (workId: string) => {
    setActiveWorkId((prev) => (prev === workId ? null : workId));
  };

  const handleFigureToggle = (figureId: string) => {
    setActiveFigureId((prev) => (prev === figureId ? null : figureId));
  };

  return (
    <div className="group relative space-y-4">
      {/* Timeline year indicator on the left */}
      {movement.start && (
        <div className="absolute -left-24 top-8 z-10 hidden items-center gap-3 md:flex">
          <div className="flex flex-col items-end">
            <div className="rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
              {movement.start > 0 ? `${movement.start} CE` : `${Math.abs(movement.start)} BCE`}
            </div>
          </div>
          <div className="h-0.5 w-16 bg-gradient-to-r from-emerald-300/60 to-transparent" />
        </div>
      )}
      
      <motion.button
        type="button"
        onClick={onToggle}
        layout
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`glass-panel w-full overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br ${palette.cardSurface} text-left shadow-soft transition-all hover:shadow-[0_12px_40px_rgba(15,23,42,0.15)]`}
      >
        {/* Card header */}
        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            {/* Thumbnail image */}
            {thumbnailUrl && (
              <div className="flex-shrink-0">
                <img
                  src={thumbnailUrl}
                  alt={movement.name}
                  className="h-16 w-16 rounded-lg object-cover shadow-md ring-2 ring-white/60 sm:h-20 sm:w-20 sm:rounded-xl"
                />
              </div>
            )}
            
            <div className="flex-1 space-y-3">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                <InfoPill tone="movement" icon={<Sparkles className="h-3 w-3" />} size="sm">
                  Movement
                </InfoPill>
                {years ? (
                  <InfoPill tone="muted" size="sm" uppercase={false}>
                    {years}
                  </InfoPill>
                ) : null}
                {movement.region || movement.geography ? (
                  <InfoPill tone="muted" size="sm" uppercase={false}>
                    {movement.region ?? movement.geography}
                  </InfoPill>
                ) : null}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold leading-tight tracking-tight text-slate-900">{movement.name}</h3>

              {/* Preview text */}
              {movement.overview ? (
                <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{movement.overview}</p>
              ) : null}
            </div>

            {/* Expand chevron */}
            <div className="flex-shrink-0 pt-1">
              <ChevronDown
                className={`h-5 w-5 text-emerald-600 transition-transform ${isActive ? "rotate-180" : ""}`}
              />
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-3 border-t border-white/50 pt-3 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-amber-600" />
              {works.length} {works.length === 1 ? "Work" : "Works"}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-fuchsia-600" />
              {figures.length} {figures.length === 1 ? "Figure" : "Figures"}
            </span>
          </div>
        </div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isActive ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <MovementDetails
              movement={movement}
              macroName={macroName}
              palette={palette}
              works={works}
              figures={figures}
              allMovements={allMovements}
            />
            
            {works.length > 0 && (
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-700">
                  <Building className="h-4 w-4" />
                  Signature Works & Buildings
                </h4>
                {/* All cards in order - expand in place */}
                <div className="flex flex-col gap-4">
                  {works.map((work) => (
                    <WorkCard
                      key={work.name}
                      work={work}
                      paletteKey={workPaletteKey}
                      isActive={activeWorkId === work.name}
                      onToggle={() => handleWorkToggle(work.name)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {figures.length > 0 && (
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-fuchsia-700">
                  <Users className="h-4 w-4" />
                  Key Figures
                </h4>
                {/* All cards in order - expand in place */}
                <div className="flex flex-col gap-4">
                  {figures.map((figure) => (
                    <FigureCard
                      key={figure.name}
                      figure={figure}
                      paletteKey={figurePaletteKey}
                      isActive={activeFigureId === figure.name}
                      onToggle={() => handleFigureToggle(figure.name)}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
