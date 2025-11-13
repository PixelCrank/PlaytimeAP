"use client";

import { motion } from "framer-motion";
import { Calendar, Layers, MapPin } from "lucide-react";
import type { ChildMovement, TimelineBuilding, TimelineFigure } from "../../lib/timelineData";
import { InfoPill } from "./InfoPill";
import { RelationshipPanel } from "./RelationshipPanel";
import { formatMovementYears, splitList } from "@/components/timeline/utils";

export function MovementDetails({
  movement,
  macroName,
  palette,
  works = [],
  figures = [],
  allMovements = [],
}: {
  movement: ChildMovement;
  macroName: string;
  palette: MovementPalette;
  works?: TimelineBuilding[];
  figures?: TimelineFigure[];
  allMovements?: ChildMovement[];
}) {
  const years = formatMovementYears(movement);
  const regions = splitList(movement.geography ?? movement.region ?? "");
  const traits = splitList(movement.hallmarkTraits);
  const context = splitList(movement.socialPoliticalContext);
  const ideas = splitList(movement.philosophicalIdeas);
  const canonical = splitList(movement.canonicalWorks);
  const texts = splitList(movement.keyTexts);
  const figureNames = splitList(movement.keyFiguresList);

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className={`overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br ${palette.panelSurface} shadow-soft`}
    >
      {/* Main content area */}
      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Left column - main text */}
        <div className="space-y-5">
          {movement.overview ? (
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Overview</h5>
              <p className="text-sm leading-relaxed text-slate-700">{movement.overview}</p>
            </div>
          ) : null}
          {movement.description && movement.description !== movement.overview ? (
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Description</h5>
              <p className="text-sm leading-relaxed text-slate-700">{movement.description}</p>
            </div>
          ) : null}
          {context.length ? (
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Context</h5>
              <p className="text-sm leading-relaxed text-slate-600">{context.join(" • ")}</p>
            </div>
          ) : null}
          {ideas.length ? (
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Philosophical Ideas</h5>
              <p className="text-sm leading-relaxed text-slate-600">{ideas.join(" • ")}</p>
            </div>
          ) : null}
          {movement.notes ? (
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Notes</h5>
              <p className="text-sm leading-relaxed text-slate-600">{movement.notes}</p>
            </div>
          ) : null}
        </div>

        {/* Right column - metadata */}
        <div className="space-y-3">
          {years ? (
            <InfoPill tone="movement" icon={<Calendar className="h-3.5 w-3.5" />} size="sm">
              {years}
            </InfoPill>
          ) : null}
          {regions.length ? (
            <div className="space-y-2">
              <InfoPill tone="movement" icon={<MapPin className="h-3.5 w-3.5" />} size="sm">
                Geography / Regions
              </InfoPill>
              <p className="text-xs leading-relaxed text-slate-700">{regions.join(" • ")}</p>
            </div>
          ) : null}
          <InfoPill tone="macro" icon={<Layers className="h-3.5 w-3.5" />} size="sm">
            {macroName}
          </InfoPill>
          {traits.length ? (
            <div className="rounded-xl border border-emerald-200/60 bg-white/60 p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Hallmark Traits</h5>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">{traits.join(" • ")}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Relationship visualization */}
      {(works.length > 0 || figures.length > 0 || allMovements.length > 0) && (
        <div className="border-t border-white/50 bg-white/20 p-6">
          <RelationshipPanel
            movement={movement}
            works={works}
            figures={figures}
            allMovements={allMovements}
          />
        </div>
      )}

      {/* Bottom grid - reference materials */}
      {(canonical.length || texts.length || figureNames.length) ? (
        <div className="border-t border-white/50 bg-white/30 p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {canonical.length ? quickCard("Canonical Works", canonical) : null}
            {texts.length ? quickCard("Key Texts", texts) : null}
            {figureNames.length ? quickCard("Key Figures", figureNames) : null}
          </div>
        </div>
      ) : null}
    </motion.section>
  );
}

function quickCard(label: string, values: string[]) {
  return (
    <div className="rounded-xl border border-white/50 bg-white/50 p-4 shadow-sm">
      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</h5>
      <p className="mt-2 text-xs leading-relaxed text-slate-700">{values.join(" • ")}</p>
    </div>
  );
}

export type MovementPalette = {
  cardSurface: string;
  cardAccent: string;
  panelSurface: string;
};
