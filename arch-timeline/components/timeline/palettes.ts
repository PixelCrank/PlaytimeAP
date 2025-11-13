import { type LegendItem } from "./LegendCard";
import { type MacroPalette } from "./MacroSection";

export const LEGEND_ITEMS: LegendItem[] = [
  {
    title: "Macro Family",
    description: "Primary era anchoring a branch of architectural thinking.",
    gradient: "from-sky-200/60 via-white/80 to-indigo-200/60",
    accent: "text-sky-800",
    tone: "macro",
  },
  {
    title: "Movement",
    description: "Child movement inheriting ideas, geography, and method.",
    gradient: "from-emerald-200/60 via-white/80 to-lime-200/60",
    accent: "text-emerald-800",
    tone: "movement",
  },
  {
    title: "Signature Works",
    description: "Built artifacts that manifest the movement's DNA.",
    gradient: "from-amber-200/60 via-white/80 to-orange-200/60",
    accent: "text-amber-800",
    tone: "work",
  },
  {
    title: "Key Figures",
    description: "Thinkers and designers stewarding the branch.",
    gradient: "from-fuchsia-200/60 via-white/80 to-purple-200/60",
    accent: "text-fuchsia-800",
    tone: "figure",
  },
];

export const MACRO_PALETTES: MacroPalette[] = [
  {
    surface: "from-sky-100/80 via-white/85 to-indigo-100/80",
    accent: "text-sky-700",
    movementPalette: {
      cardSurface: "from-emerald-50/90 via-white/95 to-sky-50/90",
      cardAccent: "text-emerald-700",
      panelSurface: "from-emerald-50/96 via-white/98 to-sky-50/96",
    },
    workPaletteKey: "a",
    figurePaletteKey: "a",
  },
  {
    surface: "from-amber-100/80 via-white/85 to-rose-100/80",
    accent: "text-amber-700",
    movementPalette: {
      cardSurface: "from-lime-50/90 via-white/95 to-emerald-50/90",
      cardAccent: "text-lime-700",
      panelSurface: "from-lime-50/96 via-white/98 to-emerald-50/96",
    },
    workPaletteKey: "b",
    figurePaletteKey: "b",
  },
  {
    surface: "from-fuchsia-100/80 via-white/85 to-purple-100/80",
    accent: "text-fuchsia-700",
    movementPalette: {
      cardSurface: "from-sky-50/90 via-white/95 to-indigo-50/90",
      cardAccent: "text-sky-700",
      panelSurface: "from-sky-50/96 via-white/98 to-indigo-50/96",
    },
    workPaletteKey: "c",
    figurePaletteKey: "c",
  },
];
