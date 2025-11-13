"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatmapLayerProps {
  points: [number, number, number][];
}

export function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) {
      console.log('⚠️ Map or points not ready:', { hasMap: !!map, pointsLength: points.length });
      return;
    }

    console.log('✅ HeatmapLayer: map instance available, creating heatmap with', points.length, 'points');

    // Find max intensity for scaling
    const maxIntensity = Math.max(...points.map(p => p[2]));
    console.log('📈 Max intensity:', maxIntensity);

    // Remove any existing heatmap layers
    map.eachLayer((layer: any) => {
      if (layer._heat) {
        map.removeLayer(layer);
        console.log('Removed old heatmap layer');
      }
    });

    // Create the heatmap layer
    const heatLayer = (L as any).heatLayer(points, {
      radius: 50,
      blur: 60,
      maxZoom: 17,
      max: maxIntensity,
      minOpacity: 0.4,
      gradient: {
        0.0: "#3b82f6", // blue
        0.25: "#8b5cf6", // violet
        0.5: "#ec4899", // fuchsia
        0.75: "#f59e0b", // amber
        1.0: "#ef4444", // red
      },
    });

    heatLayer.addTo(map);
    console.log('✅ Heatmap layer added to map successfully');

    // Cleanup function
    return () => {
      if (map && heatLayer) {
        map.removeLayer(heatLayer);
        console.log('🧹 Heatmap layer cleaned up');
      }
    };
  }, [map, points]);

  return null;
}
