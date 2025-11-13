"use client";

import { motion } from "framer-motion";
import { Building, Users, Sparkles } from "lucide-react";

type DotType = "movement" | "work" | "figure";

export function TimelineDot({
  type,
  year,
  label,
  isActive = false,
}: {
  type: DotType;
  year: number;
  label: string;
  isActive?: boolean;
}) {
  const colors = {
    movement: {
      bg: "from-emerald-400 to-green-500",
      ring: "ring-emerald-400/30",
      text: "text-emerald-700",
      icon: Sparkles,
    },
    work: {
      bg: "from-amber-400 to-orange-500",
      ring: "ring-amber-400/30",
      text: "text-amber-700",
      icon: Building,
    },
    figure: {
      bg: "from-fuchsia-400 to-purple-500",
      ring: "ring-fuchsia-400/30",
      text: "text-fuchsia-700",
      icon: Users,
    },
  };

  const config = colors[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="group absolute left-0 -translate-x-1/2 z-20"
      title={`${label} (${year > 0 ? year + ' CE' : Math.abs(year) + ' BCE'})`}
    >
      {/* Connecting line to card */}
      <div className="absolute left-1/2 top-1/2 h-0.5 w-8 bg-gradient-to-r from-slate-300/80 to-transparent" />
      
      {/* Dot with icon */}
      <motion.div
        whileHover={{ scale: 1.2 }}
        className={`relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${config.bg} shadow-lg ring-4 ${config.ring} ${isActive ? 'ring-offset-2' : ''}`}
      >
        <Icon className="h-4 w-4 text-white" />
      </motion.div>

      {/* Year label on hover */}
      <div className="pointer-events-none absolute left-full top-1/2 ml-10 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <div className={`whitespace-nowrap rounded-lg border border-white/50 bg-white/95 px-3 py-1.5 text-xs font-semibold ${config.text} shadow-lg backdrop-blur-sm`}>
          {year > 0 ? `${year} CE` : `${Math.abs(year)} BCE`}
        </div>
      </div>
    </motion.div>
  );
}
