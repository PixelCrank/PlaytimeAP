"use client";

import { InfoPill } from "./InfoPill";

export type LegendItem = {
  title: string;
  description: string;
  gradient: string;
  accent: string;
  tone: "macro" | "movement" | "work" | "figure";
};

export function LegendCard({ title, description, gradient, accent, tone }: LegendItem) {
  return (
    <article
      className={`glass-surface flex flex-col gap-3 rounded-3xl border border-white/40 bg-gradient-to-br ${gradient} p-5 shadow-soft backdrop-blur`}
    >
      <InfoPill tone={tone}>{title}</InfoPill>
      <p className={`text-sm leading-relaxed ${accent}`}>{description}</p>
    </article>
  );
}
