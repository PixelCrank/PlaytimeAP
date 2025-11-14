import { useRef, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import works from "../data/works.json";
import { useStore } from "../store/useStore";
import { emotionsToCoords } from "../lib/emotionMap";
import { typeColor, defaultNodeColor } from "../lib/colors";
import { buildPredicateWithCentury } from "../lib/filters";
import HoverPreview from "./HoverPreview";
import WorkContextMenu from "./WorkContextMenu";
import EmptyStateWithSuggestions from "./EmptyStateWithSuggestions";
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

  // Memoize node positions with collision detection - only recalculate when filtered works change
  const nodesWithPositions = useMemo(() => {
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = 900; // Use fixed width for calculation
    const height = 600;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    // Build data with coords
    const nodes = filtered.map((w) => {
      const { valence, arousal } = emotionsToCoords(w.emotions);
      return { ...w, valence, arousal, fx: null, fy: null };
    });

    // Scales
    const x = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([0, innerW]);

    const y = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([innerH, 0]);

    // Convert emotional coordinates to pixel positions
    nodes.forEach((n: any) => {
      n.x = x(n.valence);
      n.y = y(n.arousal);
    });

    // Force simulation to prevent overlaps
    const simulation = d3.forceSimulation(nodes as any)
      .force("x", d3.forceX((d: any) => x(d.valence)).strength(0.3))
      .force("y", d3.forceY((d: any) => y(d.arousal)).strength(0.3))
      .force("collide", d3.forceCollide().radius(6).strength(0.8))
      .stop();

    // Run simulation for a fixed number of iterations
    for (let i = 0; i < 120; i++) {
      simulation.tick();
    }

    return nodes;
  }, [filtered]);

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

    // Scales for current viewport
    const x = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([0, innerW]);

    const y = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([innerH, 0]);

    // Grid lines for better readability
    const gridValues = [-1, -0.5, 0, 0.5, 1];
    
    // Vertical grid lines
    gridValues.forEach(val => {
      g.append("line")
        .attr("x1", x(val))
        .attr("x2", x(val))
        .attr("y1", 0)
        .attr("y2", innerH)
        .attr("stroke", val === 0 ? "#cbd5e1" : "#f1f5f9")
        .attr("stroke-width", val === 0 ? 2 : 1)
        .attr("stroke-dasharray", val === 0 ? "4 4" : "none");
    });
    
    // Horizontal grid lines
    gridValues.forEach(val => {
      g.append("line")
        .attr("x1", 0)
        .attr("x2", innerW)
        .attr("y1", y(val))
        .attr("y2", y(val))
        .attr("stroke", val === 0 ? "#cbd5e1" : "#f1f5f9")
        .attr("stroke-width", val === 0 ? 2 : 1)
        .attr("stroke-dasharray", val === 0 ? "4 4" : "none");
    });

    // Axes with custom styling
    const xAxis = d3.axisBottom(x).ticks(5).tickFormat((d: any) => {
      if (d === -1) return "😔 Négatif";
      if (d === 0) return "";
      if (d === 1) return "😊 Positif";
      return String(d);
    });
    
    const yAxis = d3.axisLeft(y).ticks(5).tickFormat((d: any) => {
      if (d === -1) return "😴 Calme";
      if (d === 0) return "";
      if (d === 1) return "⚡ Intense";
      return String(d);
    });

    g.append("g")
      .attr("transform", `translate(0, ${innerH})`)
      .call(xAxis)
      .selectAll("text")
      .attr("class", "text-xs fill-slate-700 font-medium");

    g.append("g")
      .call(yAxis)
      .selectAll("text")
      .attr("class", "text-xs fill-slate-700 font-medium");

    // Descriptive axis labels
    g.append("text")
      .attr("x", innerW / 2)
      .attr("y", innerH + 50)
      .attr("text-anchor", "middle")
      .attr("class", "text-sm fill-slate-800 font-semibold")
      .text("Valence émotionnelle");

    g.append("text")
      .attr("x", -innerH / 2)
      .attr("y", -45)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("class", "text-sm fill-slate-800 font-semibold")
      .text("Intensité");

    // nodes - use memoized simulation-adjusted positions
    const circles = g
  .selectAll("circle")
  .data(nodesWithPositions)
  .enter()
  .append("circle")
  .attr("cx", (d: any) => d.x)
  .attr("cy", (d: any) => d.y)
  .attr("r", 5)
  .attr("opacity", 0.85)
  .attr("fill", (d: any) => typeColor[d.type] ?? defaultNodeColor)
  .attr("stroke", "#fff")
  .attr("stroke-width", 1.5)
  .attr("class", "cursor-pointer transition-all hover:r-7 hover:opacity-100")
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

    // Enhanced hover effects
    circles
      .on("mouseenter", function(this: any) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", 7)
          .attr("opacity", 1)
          .attr("stroke-width", 2);
      })
      .on("mouseleave", function(this: any) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", 5)
          .attr("opacity", 0.85)
          .attr("stroke-width", 1.5);
      });
  }, [filtered, setSelectedId, markVisited]);

  if (filtered.length === 0) {
    return <EmptyStateWithSuggestions />;
  }

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
