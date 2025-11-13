"use client";

import { motion } from "framer-motion";
import { Network, TrendingUp } from "lucide-react";
import type { ChildMovement, TimelineBuilding, TimelineFigure } from "../../lib/timelineData";

interface RelationshipNode {
  id: string;
  name: string;
  type: "movement" | "work" | "figure";
  connections: string[];
}

export function RelationshipPanel({
  movement,
  works,
  figures,
  allMovements,
}: {
  movement: ChildMovement;
  works: TimelineBuilding[];
  figures: TimelineFigure[];
  allMovements: ChildMovement[];
}) {
  // Find related movements based on shared figures or similar time periods
  const relatedMovements = allMovements
    .filter((m) => {
      if (m.id === movement.id) return false;
      
      // Check if they share time period (within 100 years)
      const timeDiff = Math.abs((m.start || 0) - (movement.start || 0));
      if (timeDiff < 100) return true;
      
      // Check if they share geographic region
      if (m.geography && movement.geography) {
        const mRegions = m.geography.toLowerCase();
        const myRegions = movement.geography.toLowerCase();
        if (mRegions.includes(myRegions) || myRegions.includes(mRegions)) {
          return true;
        }
      }
      
      return false;
    })
    .slice(0, 3);

  // Find influential figures (those with major works)
  const influentialFigures = figures.filter((f) => {
    const majorWorks = Array.isArray(f.majorWorks) ? f.majorWorks : [];
    return majorWorks.length > 0 || f.influence;
  });

  // Find landmark buildings
  const landmarkWorks = works.filter((w) => {
    const features = Array.isArray(w.uniqueFeatures) ? w.uniqueFeatures : [];
    return features.length > 0 || w.currentStatus?.toLowerCase().includes("unesco");
  });

  const hasConnections = relatedMovements.length > 0 || influentialFigures.length > 0 || landmarkWorks.length > 0;

  if (!hasConnections) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 p-6 shadow-md"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md">
          <Network className="h-4 w-4 text-white" />
        </div>
        <h5 className="text-sm font-bold uppercase tracking-wider text-emerald-800">
          Connections & Influence
        </h5>
      </div>

      <div className="space-y-4">
        {/* Related Movements */}
        {relatedMovements.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <TrendingUp className="h-3.5 w-3.5" />
              Contemporary Movements
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedMovements.map((m) => (
                <div
                  key={m.id}
                  className="rounded-lg border border-emerald-200 bg-white/60 px-3 py-1.5 text-xs font-medium text-emerald-800 shadow-sm transition hover:bg-white hover:shadow-md"
                >
                  {m.name}
                  {m.start && (
                    <span className="ml-1.5 text-[10px] text-emerald-600">
                      ({m.start > 0 ? m.start : `${Math.abs(m.start)} BCE`})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Influential Figures */}
        {influentialFigures.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold text-fuchsia-700">Key Contributors</div>
            <div className="space-y-2">
              {influentialFigures.slice(0, 3).map((f) => (
                <div
                  key={f.id}
                  className="rounded-lg border border-fuchsia-200/60 bg-white/60 p-2.5 shadow-sm"
                >
                  <div className="text-xs font-bold text-slate-900">{f.name}</div>
                  {f.influence && (
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-600">
                      {f.influence}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Landmark Works */}
        {landmarkWorks.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold text-amber-700">Notable Works</div>
            <div className="flex flex-wrap gap-2">
              {landmarkWorks.slice(0, 4).map((w) => (
                <div
                  key={w.id}
                  className="rounded-lg border border-amber-200 bg-white/60 px-3 py-1.5 text-xs font-medium text-amber-800 shadow-sm"
                >
                  {w.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Connection visualization hint */}
      <div className="mt-4 rounded-lg bg-emerald-100/50 p-3 text-[11px] leading-relaxed text-emerald-800">
        💡 <strong>Tip:</strong> These connections show contemporary movements, influential figures, and
        landmark buildings that helped shape {movement.name}.
      </div>
    </motion.div>
  );
}
