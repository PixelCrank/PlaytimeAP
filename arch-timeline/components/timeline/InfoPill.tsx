"use client";

import { type ReactNode } from "react";

type Tone = "macro" | "movement" | "work" | "figure" | "neutral" | "muted";
type Size = "sm" | "md";

const toneStyles: Record<Tone, string> = {
  macro: "border-sky-400/50 bg-gradient-to-br from-sky-100/90 to-sky-50/80 text-sky-800 shadow-sm",
  movement: "border-emerald-400/50 bg-gradient-to-br from-emerald-100/90 to-emerald-50/80 text-emerald-800 shadow-sm",
  work: "border-amber-400/50 bg-gradient-to-br from-amber-100/90 to-amber-50/80 text-amber-800 shadow-sm",
  figure: "border-fuchsia-400/50 bg-gradient-to-br from-fuchsia-100/90 to-fuchsia-50/80 text-fuchsia-800 shadow-sm",
  neutral: "border-slate-300/60 bg-white/80 text-slate-700 shadow-sm",
  muted: "border-slate-300/50 bg-gradient-to-br from-slate-100/80 to-white/70 text-slate-600 shadow-sm",
};

const sizeStyles: Record<Size, { wrapper: string; text: string; icon: string }> = {
  sm: {
    wrapper: "px-2.5 py-0.5 gap-1.5",
    text: "text-[10px] tracking-[0.06em]",
    icon: "h-3 w-3",
  },
  md: {
    wrapper: "px-3 py-1 gap-2",
    text: "text-[11px] tracking-[0.08em]",
    icon: "h-3.5 w-3.5",
  },
};

export function InfoPill({
  children,
  icon,
  tone = "neutral",
  size = "md",
  uppercase = true,
}: {
  children: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
  size?: Size;
  uppercase?: boolean;
}) {
  const sizing = sizeStyles[size];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${sizing.wrapper} ${sizing.text} ${toneStyles[tone]}`}
    >
      {icon ? <span className={`flex-shrink-0 ${sizing.icon}`}>{icon}</span> : null}
      <span className={uppercase ? "uppercase" : ""}>{children}</span>
    </span>
  );
}
