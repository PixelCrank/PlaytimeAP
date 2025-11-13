"use client";

import { ArrowLeft, Building, Clock, Layers, Sparkles, Users } from "lucide-react";
import { InfoPill } from "./InfoPill";

export function HeroSection({
  hasHighlights,
  onClear,
}: {
  hasHighlights: boolean;
  onClear: () => void;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-12">
      <div className="absolute inset-x-0 -top-40 -z-10 h-[420px] overflow-hidden">
        <div className="hero-gradient mx-auto h-full max-w-[1100px] rounded-[60px] opacity-80 blur-3xl" />
      </div>
      <div className="section-container space-y-6 sm:space-y-10">
        {/* Main header */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            <InfoPill tone="macro" icon={<Layers className="h-4 w-4" />}>
              Architecture Family Tree
            </InfoPill>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl xl:text-6xl">
              {"Tracing architecture's lineage through time"}
            </h1>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              A chronological journey through architectural history. Each <strong>Macro Era</strong> spawns{" "}
              <strong>Movements</strong>, which produce <strong>Signature Works</strong> and are shaped by{" "}
              <strong>Key Figures</strong>.
            </p>
          </div>
          {hasHighlights ? (
            <button
              type="button"
              onClick={onClear}
              className="glass-button inline-flex items-center gap-2 self-start rounded-2xl px-5 py-3 text-sm font-semibold text-slate-600 shadow-soft transition hover:bg-white/70"
            >
              <ArrowLeft className="h-4 w-4" />
              Clear highlights
            </button>
          ) : null}
        </div>

        {/* Visual hierarchy explanation */}
        <div className="glass-surface rounded-2xl border border-white/50 p-5 shadow-soft backdrop-blur-lg sm:rounded-3xl sm:p-8">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-700 sm:mb-6 sm:text-sm">How to Read This Timeline</h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-400 shadow-md">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <InfoPill tone="macro">Macro Era</InfoPill>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                Historical periods ordered chronologically. Click to expand and explore nested movements.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-lime-400 shadow-md">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <InfoPill tone="movement">Movement</InfoPill>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                Child movements within each era. Inheriting ideas, geography, and methods from their parent macro.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 shadow-md">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <InfoPill tone="work">Signature Work</InfoPill>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                Built artifacts and projects that manifest the movement&apos;s core principles and aesthetics.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-400 to-purple-400 shadow-md">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <InfoPill tone="figure">Key Figure</InfoPill>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                Architects, theorists, and designers who shaped and advanced the movement&apos;s vision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
