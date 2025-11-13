"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronDown, Link2, MapPin, Users } from "lucide-react";
import type { TimelineFigure } from "../../lib/timelineData";
import { InfoPill } from "./InfoPill";
import { TimelineDot } from "./TimelineDot";
import { parseSourceLinks, splitList, extractStartYear, type SourceLink } from "@/components/timeline/utils";

export function FigureCard({
  figure,
  paletteKey,
  isActive,
  onToggle,
}: {
  figure: TimelineFigure;
  paletteKey: "a" | "b" | "c";
  isActive: boolean;
  onToggle: () => void;
}) {
  const palette = figurePalette[paletteKey];

  const roles = splitList([figure.philosophy, figure.aesthetics].filter(Boolean) as string[]);
  const aesthetics = splitList(figure.aesthetics);
  const writings = splitList(figure.keyWritings);
  const majorWorks = splitList(figure.majorWorks);
  const sources: SourceLink[] = parseSourceLinks(figure.sources);
  const birthYear = extractStartYear(figure.lifeDates);

  return (
    <motion.article className="relative w-full">
      {/* Timeline year indicator on the left */}
      {birthYear && (
        <div className="absolute -left-24 top-8 hidden items-center gap-3 md:flex">
          <div className="flex flex-col items-end">
            <div className="rounded-lg bg-gradient-to-br from-fuchsia-400 to-purple-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
              {birthYear > 0 ? `${birthYear} CE` : `${Math.abs(birthYear)} BCE`}
            </div>
          </div>
          <div className="h-0.5 w-16 bg-gradient-to-r from-fuchsia-300/60 to-transparent" />
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
          {figure.imageUrl && (
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20">
              <img
                src={figure.imageUrl}
                alt={figure.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1 space-y-2 sm:space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <InfoPill tone="figure" icon={<Users className="h-3 w-3" />} size="sm">
                Figure
              </InfoPill>
              {figure.lifeDates ? (
                <InfoPill tone="muted" size="sm" uppercase={false}>
                  {figure.lifeDates}
                </InfoPill>
              ) : null}
              {figure.nationality && !isActive ? (
                <InfoPill tone="muted" size="sm" uppercase={false}>
                  {figure.nationality}
                </InfoPill>
              ) : null}
            </div>
            <h4 className="text-base font-bold leading-tight tracking-tight text-slate-900">{figure.name}</h4>
            {!isActive && figure.description ? (
              <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">{figure.description}</p>
            ) : null}
          </div>
          <ChevronDown
            className={`h-5 w-5 flex-shrink-0 text-fuchsia-600 transition-transform ${isActive ? "rotate-180" : ""}`}
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
              {figure.imageUrl && (
                <div className="relative h-72 w-full overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={figure.imageUrl}
                    alt={figure.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              
              {/* Two-column layout for content */}
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                {/* Main Content Column */}
                <div className="space-y-4">
                  {/* Description */}
                  {figure.description ? (
                    <div>
                      <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-fuchsia-700">Biography</h5>
                      <p className="text-sm leading-relaxed text-slate-700">{figure.description}</p>
                    </div>
                  ) : null}

                  {/* Anecdotes */}
                  {figure.anecdotes ? (
                    <div className="rounded-lg border border-fuchsia-200/60 bg-gradient-to-br from-fuchsia-50/80 to-white/80 p-3.5 shadow-sm">
                      <h6 className="mb-2 text-xs font-bold uppercase tracking-wider text-fuchsia-700">Personal Stories & Anecdotes</h6>
                      <p className="text-xs leading-relaxed text-slate-700">{figure.anecdotes}</p>
                    </div>
                  ) : null}

                  {/* Aesthetics */}
                  {aesthetics.length ? (
                    <div className="rounded-lg border border-purple-200/60 bg-white/50 p-3.5 shadow-sm">
                      <h6 className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-700">Key Aesthetics & Forms</h6>
                      <ul className="space-y-1 text-xs leading-relaxed text-slate-700">
                        {aesthetics.map((item, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-purple-600">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Details */}
                  {(roles.length || majorWorks.length || writings.length) ? (
                    <div className="space-y-3">
                      {roles.length ? (
                        <div className="rounded-lg border border-fuchsia-200/60 bg-white/50 p-3.5 shadow-sm">
                          <h6 className="mb-2 text-xs font-bold uppercase tracking-wider text-fuchsia-700">Practice & Philosophy</h6>
                          <ul className="space-y-1 text-xs leading-relaxed text-slate-700">
                            {roles.map((item, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-fuchsia-600">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {majorWorks.length ? (
                        <div className="rounded-lg border border-purple-200/60 bg-white/50 p-3.5 shadow-sm">
                          <h6 className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-700">Major Works</h6>
                          <ul className="space-y-1 text-xs leading-relaxed text-slate-700">
                            {majorWorks.map((item, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-purple-600">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {writings.length ? (
                        <div className="rounded-lg border border-blue-200/60 bg-white/50 p-3.5 shadow-sm">
                          <h6 className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-700">Key Texts</h6>
                          <ul className="space-y-1 text-xs leading-relaxed text-slate-700">
                            {writings.map((item, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-blue-600">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Influence / Legacy */}
                  {figure.influence ? (
                    <div className="rounded-lg border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-white/80 p-3.5 shadow-sm">
                      <h6 className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">Influence & Legacy</h6>
                      <p className="text-xs leading-relaxed text-slate-700">{figure.influence}</p>
                    </div>
                  ) : null}
                </div>

                {/* Sidebar Column */}
                <div className="space-y-4">
                  {/* Bio metadata */}
                  {(figure.nationality || figure.education) ? (
                    <div className="rounded-lg border border-white/60 bg-white/40 p-4 shadow-sm">
                      <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">Details</h5>
                      <div className="space-y-3">
                        {figure.nationality ? (
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-fuchsia-600" />
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Nationality</p>
                              <p className="text-xs text-slate-700">{figure.nationality}</p>
                            </div>
                          </div>
                        ) : null}
                        {figure.education ? (
                          <div className="flex items-start gap-2">
                            <BookOpen className="mt-0.5 h-4 w-4 flex-shrink-0 text-fuchsia-600" />
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Education</p>
                              <p className="text-xs text-slate-700">{figure.education}</p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {/* Sources */}
                  {sources.length ? (
                    <div className="rounded-lg border border-fuchsia-200/60 bg-gradient-to-br from-fuchsia-50/80 to-white/80 p-4 shadow-sm">
                      <h5 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fuchsia-700">
                        <Link2 className="h-3.5 w-3.5" />
                        Sources & References
                      </h5>
                      <div className="space-y-2">
                        {sources.map((source, index) =>
                          source.href ? (
                            <a
                              key={`${figure.id}-source-${index}`}
                              href={source.href}
                              target="_blank"
                              rel="noreferrer"
                              className="group flex items-center gap-2 rounded-lg border border-fuchsia-200/70 bg-white/90 px-3 py-2 text-xs font-medium text-fuchsia-700 shadow-sm transition-all hover:border-fuchsia-300 hover:bg-fuchsia-50 hover:shadow-md"
                            >
                              <Link2 className="h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:scale-110" />
                              <span className="flex-1 truncate">{source.label}</span>
                              <svg className="h-3 w-3 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              <span className="flex-1 truncate">{source.label}</span>
                              <svg className="h-3 w-3 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ) : (
                            <div
                              key={`${figure.id}-source-${index}`}
                              className="flex items-center gap-2 rounded-lg border border-fuchsia-200/70 bg-white/90 px-3 py-2 text-xs font-medium text-fuchsia-700"
                            >
                              <span className="flex-1">{source.label}</span>
                            </div>
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

const figurePalette: Record<"a" | "b" | "c", { surface: string; accent: string }> = {
  a: {
    surface: "from-fuchsia-50/95 via-white/96 to-purple-50/95",
    accent: "text-fuchsia-700",
  },
  b: {
    surface: "from-sky-50/95 via-white/96 to-indigo-50/95",
    accent: "text-sky-700",
  },
  c: {
    surface: "from-violet-50/95 via-white/96 to-pink-50/95",
    accent: "text-violet-700",
  },
};
