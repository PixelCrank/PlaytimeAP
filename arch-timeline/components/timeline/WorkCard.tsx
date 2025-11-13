"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building, ChevronDown, Link2, MapPin, User } from "lucide-react";
import type { TimelineBuilding } from "../../lib/timelineData";
import { InfoPill } from "./InfoPill";
import { TimelineDot } from "./TimelineDot";
import { splitList, parseSourceLinks, extractStartYear, type SourceLink } from "@/components/timeline/utils";

export function WorkCard({
  work,
  paletteKey,
  isActive,
  onToggle,
}: {
  work: TimelineBuilding;
  paletteKey: "a" | "b" | "c";
  isActive: boolean;
  onToggle: () => void;
}) {
  const architects = splitList(work.architects);
  const locationParts = splitList([work.location, work.city, work.country].filter(Boolean) as string[]);
  const materials = splitList(work.materials ?? work.materialsText);
  const hallmarks = splitList(work.uniqueFeatures ?? work.uniqueFeaturesText);
  const symbolism = splitList(work.symbolism ?? work.symbolismText);
  const sources: SourceLink[] = parseSourceLinks(work.sources);

  const palette = workPalette[paletteKey];
  const startYear = extractStartYear(work.yearsBuilt);

  return (
    <motion.article className="relative w-full">
      {/* Timeline year indicator on the left */}
      {startYear && (
        <div className="absolute -left-24 top-8 hidden items-center gap-3 md:flex">
          <div className="flex flex-col items-end">
            <div className="rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
              {startYear > 0 ? `${startYear} CE` : `${Math.abs(startYear)} BCE`}
            </div>
          </div>
          <div className="h-0.5 w-16 bg-gradient-to-r from-amber-300/60 to-transparent" />
        </div>
      )}
      
      <motion.button
        type="button"
        onClick={onToggle}
        whileHover={{ y: -2, scale: isActive ? 1 : 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`glass-panel w-full overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br ${palette.surface} text-left shadow-soft transition-all hover:shadow-[0_12px_40px_rgba(15,23,42,0.15)]`}
      >
        {/* Collapsed header - always visible */}
        <div className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
          {work.imageUrl && (
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20">
              <img
                src={work.imageUrl}
                alt={work.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1 space-y-2 sm:space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <InfoPill tone="work" icon={<Building className="h-3 w-3" />} size="sm">
                Work
              </InfoPill>
              {work.yearsBuilt ? (
                <InfoPill tone="muted" size="sm" uppercase={false}>
                  {work.yearsBuilt}
                </InfoPill>
              ) : null}
              {architects.length > 0 && !isActive ? (
                <InfoPill tone="muted" size="sm" uppercase={false}>
                  {architects[0]}
                </InfoPill>
              ) : null}
            </div>
            <h4 className="text-base font-bold leading-tight tracking-tight text-slate-900">{work.name}</h4>
            {!isActive && work.description ? (
              <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">{work.description}</p>
            ) : null}
          </div>
          <ChevronDown
            className={`h-5 w-5 flex-shrink-0 text-amber-600 transition-transform ${isActive ? "rotate-180" : ""}`}
          />
        </div>
      </motion.button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isActive ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`overflow-hidden rounded-b-2xl border-t-0 bg-gradient-to-br ${palette.surface}`}
          >
            <div className="space-y-4 p-4 pt-3 sm:space-y-5 sm:p-6 sm:pt-4">
              {/* Hero Image */}
              {work.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden rounded-xl shadow-lg sm:h-72">
                  <img
                    src={work.imageUrl}
                    alt={work.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              
              {/* Two-column layout for content */}
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-[2fr_1fr]">
                {/* Main Content Column */}
                <div className="space-y-4">
                  {/* Description */}
                  {work.description ? (
                    <div>
                      <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-700">Overview</h5>
                      <p className="text-sm leading-relaxed text-slate-700">{work.description}</p>
                    </div>
                  ) : null}

                  {/* Features */}
                  {(hallmarks.length || materials.length || symbolism.length) ? (
                    <div className="space-y-3">
                      {hallmarks.length ? (
                        <div className="rounded-lg border border-amber-200/60 bg-white/50 p-3.5 shadow-sm">
                          <h6 className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-700">Hallmarks</h6>
                          <ul className="space-y-1 text-xs leading-relaxed text-slate-700">
                            {hallmarks.map((item, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-amber-600">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {materials.length ? (
                        <div className="rounded-lg border border-slate-200/60 bg-white/50 p-3.5 shadow-sm">
                          <h6 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-600">Materials</h6>
                          <ul className="space-y-1 text-xs leading-relaxed text-slate-700">
                            {materials.map((item, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-slate-400">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {symbolism.length ? (
                        <div className="rounded-lg border border-purple-200/60 bg-white/50 p-3.5 shadow-sm">
                          <h6 className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-700">Symbolism</h6>
                          <ul className="space-y-1 text-xs leading-relaxed text-slate-700">
                            {symbolism.map((item, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-purple-600">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {/* Sidebar Column */}
                <div className="space-y-4">
                  {/* Key metadata */}
                  {(architects.length || locationParts.length) ? (
                    <div className="rounded-lg border border-white/60 bg-white/40 p-4 shadow-sm">
                      <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">Details</h5>
                      <div className="space-y-3">
                        {architects.length ? (
                          <div className="flex items-start gap-2">
                            <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Architect</p>
                              <p className="text-xs text-slate-700">{architects.join(", ")}</p>
                            </div>
                          </div>
                        ) : null}
                        {locationParts.length ? (
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Location</p>
                              <p className="text-xs text-slate-700">{locationParts.join(", ")}</p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {/* Sources */}
                  {sources.length ? (
                    <div className="rounded-lg border border-white/60 bg-white/40 p-4 shadow-sm">
                      <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">Sources</h5>
                      <div className="flex flex-wrap gap-2">
                        {sources.map((source, index) =>
                          source.href ? (
                            <a
                              key={`${work.id}-source-${index}`}
                              href={source.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200/70 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-50/80"
                            >
                              <Link2 className="h-3 w-3" />
                              {source.label}
                            </a>
                          ) : (
                            <span
                              key={`${work.id}-source-${index}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200/70 bg-white/80 px-2.5 py-1.5 text-xs font-medium text-amber-700"
                            >
                              {source.label}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}

const workPalette: Record<"a" | "b" | "c", { surface: string; accent: string }> = {
  a: {
    surface: "from-amber-50/95 via-white/96 to-orange-50/95",
    accent: "text-amber-700",
  },
  b: {
    surface: "from-rose-50/95 via-white/96 to-amber-50/95",
    accent: "text-rose-600",
  },
  c: {
    surface: "from-yellow-50/95 via-white/96 to-lime-50/95",
    accent: "text-lime-600",
  },
};
