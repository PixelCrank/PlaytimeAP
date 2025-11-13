import { useRef, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import works from "../data/works.json";
import { useStore } from "../store/useStore";
import { emotionsToCoords } from "../lib/emotionMap";
import { typeColor, defaultNodeColor } from "../lib/colors";
import { buildPredicateWithCentury } from "../lib/filters";
import HoverPreview from "./HoverPreview";
import WorkContextMenu from "./WorkContextMenu";
import type { WorkNode } from "../lib/types";

export default function EmotionMapCanvas() {
  const ref = useRef<SVGSVGElement>(null);
  const filters = useStore((s) => s.filters);
  const centuryFilter = useStore((s) => s.centuryFilter);
  const setSelectedId = useStore((s) => s.setSelectedId);
  const markVisited = useStore((s) => s.markVisited);
  
  const [hoveredWork, setHoveredWork] = useState<WorkNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ workId: string; x: number; y: number } | null>(null);

  const all = works as any[];
  const filtered = useMemo(
    () => all.filter(buildPredicateWithCentury(filters, centuryFilter)),
    [all, filters, centuryFilter]
  );

  useEffect(() => {
    const svgEl = ref.current;
    if (!svgEl) return;

    const width = svgEl.clientWidth || 900;
    const height = svgEl.clientHeight || 600;

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // build data with coords
    const nodes = filtered.map((w) => {
      const { valence, arousal } = emotionsToCoords(w.emotions);
      return { ...w, valence, arousal };
    });

    // scales: valence -1..1 → x 0..innerW
    const x = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([0, innerW]);

    // arousal -1..1 → y innerH..0 (so calm is bottom, intense at top)
    const y = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([innerH, 0]);

    // axes / reference lines
    const xAxis = d3.axisBottom(x).ticks(5);
    const yAxis = d3.axisLeft(y).ticks(5);

    g.append("g")
      .attr("transform", `translate(0, ${innerH})`)
      .call(xAxis);

    g.append("g").call(yAxis);

    // axis labels
    g.append("text")
      .attr("x", innerW / 2)
      .attr("y", innerH + 40)
      .attr("text-anchor", "middle")
      .attr("class", "text-xs fill-slate-600")
      .text("Valence (négatif → positif)");

    g.append("text")
      .attr("x", -innerH / 2)
      .attr("y", -40)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("class", "text-xs fill-slate-600")
      .text("Arousal (calme → intense)");

    // zero-lines
    g.append("line")
      .attr("x1", x(0))
      .attr("x2", x(0))
      .attr("y1", 0)
      .attr("y2", innerH)
      .attr("stroke", "#e2e8f0")
      .attr("stroke-dasharray", "4 4");

    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("stroke", "#e2e8f0")
      .attr("stroke-dasharray", "4 4");

    // nodes
    const circles = g
  .selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("cx", (d: any) => x(d.valence))
  .attr("cy", (d: any) => y(d.arousal))
  .attr("r", 4)
  .attr("opacity", 0.9)
  .attr("fill", (d: any) => typeColor[d.type] ?? defaultNodeColor)
  .attr("class", "cursor-pointer")
  .on("click", (_: any, d: any) => {
    setHoveredWork(null);
    setSelectedId(d.id);
    markVisited(d.id);
  })
  .on("contextmenu", (event: any, d: any) => {
    event.preventDefault();
    setContextMenu({ workId: d.id, x: event.clientX, y: event.clientY });
  })
  .on("mouseover", (event: any, d: any) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      setHoveredWork(d);
    }
  })
  .on("mouseout", () => {
    setHoveredWork(null);
  });

    circles
      .append("title")
      .text(
        (d: any) =>
          `${d.titre}${
            d.type ? " — " + d.type : ""
          } [${d.valence.toFixed(2)}, ${d.arousal.toFixed(2)}]`
      );
  }, [filtered, setSelectedId, markVisited]);

  return (
    <div className="relative w-full h-[70vh]">
      <svg
        ref={ref}
        className="w-full h-full select-none"
        role="img"
        aria-label="Carte valence × arousal"
      />
      {hoveredWork && <HoverPreview work={hoveredWork} x={mousePos.x} y={mousePos.y} />}
      {contextMenu && (
        <WorkContextMenu
          workId={contextMenu.workId}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
