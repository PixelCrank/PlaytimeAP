"use client";

import { LegendCard, type LegendItem } from "./LegendCard";

export function LegendSection({ items }: { items: LegendItem[] }) {
  return (
    <section className="section-container">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <LegendCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
