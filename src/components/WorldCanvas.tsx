import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";
import { buildPredicateWithCentury } from "../lib/filters";
import { typeColor, defaultNodeColor } from "../lib/colors";
import HoverPreview from "./HoverPreview";
import WorkContextMenu from "./WorkContextMenu";
import type { WorkNode } from "../lib/types";

export default function WorldCanvas() {
  const realm = useStore(s => s.realm);
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const setSelectedId = useStore(s => s.setSelectedId);
  const markVisited   = useStore(s => s.markVisited);
  const bookmarked = useStore(s => s.bookmarked);
  const toggleBookmark = useStore(s => s.toggleBookmark);
  const ref = useRef<SVGSVGElement>(null);
  
  const [hoveredWork, setHoveredWork] = useState<WorkNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ workId: string; x: number; y: number } | null>(null);

  const all = data as any[];
  const filtered = useMemo(
    () => all.filter(buildPredicateWithCentury(filters, centuryFilter)),
    [all, filters, centuryFilter]
  );

  useEffect(() => {
    const width = ref.current?.clientWidth ?? 900;
    const height = ref.current?.clientHeight ?? 600;

    const nodes = filtered.map(d => ({ ...d }));

    const centers: Record<string, [number, number]> = {
      human: [width/2, height*0.65],
      cosmic: [width*0.25, height*0.25],
      disrupted: [width*0.75, height*0.25],
    };
    const [cx, cy] = centers[realm] ?? centers.human;

    const sim = d3.forceSimulation(nodes as any)
      .force("charge", d3.forceManyBody().strength(-20))
      .force("center", d3.forceCenter(cx, cy))
      .force("collision", d3.forceCollide().radius(() => 8))
      .alpha(1).alphaDecay(0.05);

    const svg = d3.select(ref.current!);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const circles = g
  .selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r", (d: any) => bookmarked.has(d.id) ? 6 : 4)
  .attr("opacity", 0.9)
  .attr("fill", (d: any) => typeColor[d.type] ?? defaultNodeColor)
  .attr("stroke", (d: any) => bookmarked.has(d.id) ? "#fbbf24" : "none")
  .attr("stroke-width", (d: any) => bookmarked.has(d.id) ? 2 : 0)
  .attr("class", "cursor-pointer")
  .on("click", (_: any, d: any) => {
    setHoveredWork(null);
    setSelectedId(d.id);
    markVisited(d.id);
  })
  .on("contextmenu", (event: any, d: any) => {
    event.preventDefault();
    event.stopPropagation();
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
  .text((d: any) => `${d.titre}${d.type ? " — " + d.type : ""}\n(Clic droit pour ${bookmarked.has(d.id) ? "retirer de" : "ajouter à"} la collection)`);

    const update = g.selectAll("circle");
    sim.on("tick", () => {
      update
        .attr("cx", (d: any) => Math.max(6, Math.min(width-6, (d as any).x)))
        .attr("cy", (d: any) => Math.max(6, Math.min(height-6, (d as any).y)));
    });

    return () => { sim.stop(); };
  }, [realm, filtered, bookmarked, setSelectedId, markVisited, toggleBookmark]);

  return (
    <div className="relative w-full h-[70vh]">
      <svg ref={ref} className="w-full h-full select-none" role="img" aria-label="Carte des œuvres" />
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