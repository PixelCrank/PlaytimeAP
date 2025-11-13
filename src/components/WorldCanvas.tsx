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

    // Add realm background zones with labels
    const realmZones = [
      { realm: 'cosmic', center: centers.cosmic, label: '🌌 Cosmique', color: '#a78bfa', textColor: '#7c3aed' },
      { realm: 'human', center: centers.human, label: '👤 Humain', color: '#60a5fa', textColor: '#2563eb' },
      { realm: 'disrupted', center: centers.disrupted, label: '⚡ Dérangé', color: '#f87171', textColor: '#dc2626' }
    ];

    realmZones.forEach(zone => {
      const [zx, zy] = zone.center;
      
      // Background circle for realm
      g.append("circle")
        .attr("cx", zx)
        .attr("cy", zy)
        .attr("r", Math.min(width, height) * 0.15)
        .attr("fill", zone.color)
        .attr("opacity", 0.08)
        .attr("stroke", zone.color)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("opacity", 0.15);
      
      // Realm label
      g.append("text")
        .attr("x", zx)
        .attr("y", zy - Math.min(width, height) * 0.18)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", zone.textColor)
        .attr("opacity", 0.6)
        .text(zone.label);
    });

    // Detect and label emotional clusters
    const emotionClusters = new Map<string, { works: any[], x: number, y: number }>();
    
    // Group works by dominant emotion
    nodes.forEach((node: any) => {
      if (node.emotions && node.emotions.length > 0) {
        const dominantEmotion = node.emotions[0];
        if (!emotionClusters.has(dominantEmotion)) {
          emotionClusters.set(dominantEmotion, { works: [], x: 0, y: 0 });
        }
        emotionClusters.get(dominantEmotion)!.works.push(node);
      }
    });

    // Annotate significant clusters (5+ works with same emotion)
    const clusterLabels: { text: string, x: number, y: number, color: string }[] = [];
    const emotionZoneNames: Record<string, string> = {
      'tristesse': '💔 Zone de Mélancolie',
      'nostalgie': '🌅 Coin Nostalgique',
      'peur': '😰 Zone d\'Anxiété',
      'vigilance': '👁️ Zone de Surveillance',
      'tension': '⚡ Zone de Tension',
      'sérénité': '☮️ Havre de Paix',
      'fascination': '✨ Zone d\'Émerveillement',
      'joie': '🌈 Coin Joyeux'
    };

    sim.on("tick.clusters", () => {
      emotionClusters.forEach((cluster, emotion) => {
        if (cluster.works.length >= 5) {
          // Calculate cluster centroid
          cluster.x = d3.mean(cluster.works, (w: any) => w.x) || 0;
          cluster.y = d3.mean(cluster.works, (w: any) => w.y) || 0;
          
          if (emotionZoneNames[emotion]) {
            clusterLabels.push({
              text: emotionZoneNames[emotion],
              x: cluster.x,
              y: cluster.y,
              color: '#64748b'
            });
          }
        }
      });
    });

    const circles = g
  .selectAll("circle.work-node")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("class", "work-node")
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

    const update = g.selectAll("circle.work-node");
    
    // Create cluster label group (will be updated on tick)
    const clusterLabelGroup = g.append("g").attr("class", "cluster-labels");
    
    sim.on("tick", () => {
      update
        .attr("cx", (d: any) => Math.max(6, Math.min(width-6, (d as any).x)))
        .attr("cy", (d: any) => Math.max(6, Math.min(height-6, (d as any).y)));
      
      // Update cluster labels every few ticks to avoid performance issues
      if (sim.alpha() < 0.3 && clusterLabels.length > 0) {
        clusterLabelGroup.selectAll("*").remove();
        
        clusterLabels.forEach(label => {
          // Background for readability
          clusterLabelGroup.append("rect")
            .attr("x", label.x - 60)
            .attr("y", label.y - 12)
            .attr("width", 120)
            .attr("height", 20)
            .attr("fill", "white")
            .attr("opacity", 0.85)
            .attr("rx", 10);
          
          // Label text
          clusterLabelGroup.append("text")
            .attr("x", label.x)
            .attr("y", label.y)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "11px")
            .attr("font-weight", "600")
            .attr("fill", label.color)
            .text(label.text);
        });
        
        clusterLabels.length = 0; // Clear after rendering once
      }
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