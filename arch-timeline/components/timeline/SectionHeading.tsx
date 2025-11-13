"use client";

import { type ReactNode } from "react";

export function SectionHeading({
  icon,
  title,
  eyebrow,
  description,
}: {
  icon?: ReactNode;
  title: string;
  eyebrow?: string;
  description?: string;
}) {
  return (
    <header className="flex flex-col gap-4">
      {eyebrow ? <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{eyebrow}</span> : null}
      <div className="flex items-start gap-4">
        {icon ? (
          <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/80 text-slate-600 shadow-inner">
            {icon}
          </span>
        ) : null}
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 lg:text-4xl">{title}</h2>
          {description ? <p className="text-sm leading-relaxed text-slate-600 lg:text-base">{description}</p> : null}
        </div>
      </div>
      <span className="h-1 w-16 rounded-full bg-gradient-to-r from-slate-900/20 to-transparent" />
    </header>
  );
}
