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
  const setFilters = useStore(s => s.setFilters);
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

    // Account for NodeDrawer on right side - shift centers left slightly
    const effectiveWidth = width - 100; // Less space reservation
    const xOffset = 0; // Use full left edge
    
    const centers: Record<string, [number, number]> = {
      human: [width/2, height*0.6],
      cosmic: [width*0.3, height*0.35],
      disrupted: [width*0.7, height*0.35],
    };
    const [cx, cy] = centers[realm] ?? centers.human;

    // When a specific realm is selected, spread nodes more to reveal clusters
    const isRealmFiltered = filters.realmFilter !== 'tous';
    const chargeStrength = isRealmFiltered ? -80 : -35;
    const centerStrength = isRealmFiltered ? 0.4 : 0.6;
    
    const sim = d3.forceSimulation(nodes as any)
      .force("charge", d3.forceManyBody().strength(chargeStrength))
      .force("center", d3.forceCenter(cx, cy).strength(centerStrength))
      .force("collision", d3.forceCollide().radius((d: any) => (bookmarked.has(d.id) ? 10 : 8)))
      .alpha(1).alphaDecay(0.05);

    const svg = d3.select(ref.current!);
    svg.selectAll("*").remove();

    const g = svg.append("g");
    
    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event: any) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom as any);
    
    // Apply initial zoom when realm is selected
    if (isRealmFiltered) {
      const [zoomX, zoomY] = centers[filters.realmFilter as keyof typeof centers] || [width/2, height/2];
      svg.transition()
        .duration(750)
        .call(zoom.transform as any, d3.zoomIdentity.translate(width/2 - zoomX * 1.5, height/2 - zoomY * 1.5).scale(1.5));
    } else {
      svg.transition()
        .duration(750)
        .call(zoom.transform as any, d3.zoomIdentity);
    }

    // Realm background zones with visible labels
    const realmZones = [
      { name: "Cosmique", emoji: "🌌", x: width*0.3, y: height*0.35, color: "rgba(147, 51, 234, 0.1)" },
      { name: "Humain", emoji: "👤", x: width/2, y: height*0.6, color: "rgba(59, 130, 246, 0.1)" },
      { name: "Dérangé", emoji: "⚡", x: width*0.7, y: height*0.35, color: "rgba(239, 68, 68, 0.1)" },
    ];

    realmZones.forEach(zone => {
      const realmKey = zone.name === 'Cosmique' ? 'cosmic' : zone.name === 'Humain' ? 'human' : 'disrupted';
      const isActive = filters.realmFilter === realmKey;
      
      // Background circle for realm
      const circle = g.append("circle")
        .attr("cx", zone.x)
        .attr("cy", zone.y)
        .attr("r", Math.min(width, height) * (isActive ? 0.18 : 0.12))
        .attr("fill", zone.color)
        .attr("stroke", zone.color)
        .attr("stroke-width", isActive ? 3 : 2)
        .attr("stroke-dasharray", "5,5")
        .attr("opacity", isActive ? 0.3 : 0.2)
        .style("cursor", "pointer")
        .style("transition", "all 0.3s ease")
        .on("click", () => {
          if (isActive) {
            setFilters({ realmFilter: 'tous' });
          } else {
            setFilters({ realmFilter: realmKey });
          }
        })
        .on("mouseover", function(this: SVGCircleElement) {
          d3.select(this)
            .attr("opacity", 0.4)
            .attr("stroke-width", 3);
        })
        .on("mouseout", function(this: SVGCircleElement) {
          d3.select(this)
            .attr("opacity", isActive ? 0.3 : 0.2)
            .attr("stroke-width", isActive ? 3 : 2);
        });
      
      // Realm label with emoji - also clickable
      g.append("text")
        .attr("x", zone.x)
        .attr("y", zone.y - Math.min(width, height) * 0.14)
        .attr("text-anchor", "middle")
        .attr("font-size", isActive ? "20px" : "18px")
        .attr("font-weight", "bold")
        .attr("opacity", isActive ? 0.9 : 0.7)
        .style("cursor", "pointer")
        .text(`${zone.emoji} ${zone.name}`)
        .on("click", () => {
          if (isActive) {
            setFilters({ realmFilter: 'tous' });
          } else {
            setFilters({ realmFilter: realmKey });
          }
        });
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
  .attr("r", (d: any) => bookmarked.has(d.id) ? 7 : 5)
  .attr("opacity", 0.9)
  .attr("fill", (d: any) => typeColor[d.type] ?? defaultNodeColor)
  .attr("stroke", (d: any) => bookmarked.has(d.id) ? "#fbbf24" : "none")
  .attr("stroke-width", (d: any) => bookmarked.has(d.id) ? 2 : 0)
  .attr("class", "cursor-pointer")
  .on("click", (event: any, d: any) => {
    event.stopPropagation();
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
  }, [realm, filtered, bookmarked, setSelectedId, markVisited, toggleBookmark, filters.realmFilter]);

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