import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";
import { buildPredicateWithCentury } from "../lib/filters";
import { typeColor, defaultNodeColor } from "../lib/colors";

export default function WorldCanvas() {
  const realm = useStore(s => s.realm);
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const setSelectedId = useStore(s => s.setSelectedId);
  const markVisited   = useStore(s => s.markVisited);
  const ref = useRef<SVGSVGElement>(null);

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
  .attr("r", 4)
  .attr("opacity", 0.9)
  .attr("fill", (d: any) => typeColor[d.type] ?? defaultNodeColor)
  .attr("class", "cursor-pointer")
  .on("click", (_: any, d: any) => {
    setSelectedId(d.id);
    markVisited(d.id);
  });

circles
  .append("title")
  .text((d: any) => `${d.titre}${d.type ? " — " + d.type : ""}`);

    const update = g.selectAll("circle");
    sim.on("tick", () => {
      update
        .attr("cx", (d: any) => Math.max(6, Math.min(width-6, (d as any).x)))
        .attr("cy", (d: any) => Math.max(6, Math.min(height-6, (d as any).y)));
    });

    return () => { sim.stop(); };
  }, [realm, filtered]);

  return <svg ref={ref} className="w-full h-[70vh] select-none" role="img" aria-label="Carte des œuvres" />;
}