// src/App.tsx
import { useState } from "react";
import EmotionalCompass from "./components/EmotionalCompass";
import WorldCanvas from "./components/WorldCanvas";
import EmotionMapCanvas from "./components/EmotionMapCanvas";
import NodeDrawer from "./components/NodeDrawer";
import EmotionLegend from "./components/EmotionLegend";
import TimelineSlider from "./components/TimelineSlider";
import EmotionRangeFilter from "./components/EmotionRangeFilter";
import JourneySelector from "./components/JourneySelector";
import InsightsPanel from "./components/InsightsPanel";
import MediumComparisonPanel from "./components/MediumComparisonPanel";
import TemporalEvolutionPanel from "./components/TemporalEvolutionPanel";
import QualitativeSearch from "./components/QualitativeSearch";
import SerendipityExplorer from "./components/SerendipityExplorer";
import CuratedPlaylistBuilder from "./components/CuratedPlaylistBuilder";
import CorpusGapAnalyzer from "./components/CorpusGapAnalyzer";
import SocialExperienceGenerator from "./components/SocialExperienceGenerator";
import MoodBasedEntry from "./components/MoodBasedEntry";
import EmotionalTrajectoryTimeline from "./components/EmotionalTrajectoryTimeline";
import CrossMediumRemix from "./components/CrossMediumRemix";
import RealmComparison from "./components/RealmComparison";

export default function App() {
  const [view, setView] = useState<"constellation" | "emotion">(
    "constellation"
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Playtime — Les trois visages du temps
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Explorez 620 œuvres à travers leurs rapports au temps
              </p>
            </div>
            <EmotionalCompass />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Vue:</span>
              <div className="flex items-center gap-1 border rounded-lg p-1 bg-slate-50">
                <button
                  onClick={() => setView("constellation")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                    view === "constellation"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🌌 Constellation
                </button>
                <button
                  onClick={() => setView("emotion")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                    view === "emotion" 
                      ? "bg-white shadow-sm text-slate-900" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🎭 Émotions
                </button>
              </div>
            </div>
            
            <div className="flex-1" />
            <TimelineSlider />
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-80 bg-white border-r shadow-sm overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <MoodBasedEntry />
              <QualitativeSearch />
              <SerendipityExplorer />
            </div>
            
            <div className="border-t pt-4">
              <JourneySelector />
            </div>
            <EmotionRangeFilter />
            
            <div className="pt-4 border-t space-y-2">
              <RealmComparison />
              <EmotionalTrajectoryTimeline />
              <CrossMediumRemix />
              <CuratedPlaylistBuilder />
              <CorpusGapAnalyzer />
              <SocialExperienceGenerator />
              <MediumComparisonPanel />
            </div>
          </div>
        </aside>

        <main className="flex-1 relative">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-shrink-0 bg-white border-b px-6 py-3 space-y-3">
              <InsightsPanel />
              <TemporalEvolutionPanel />
            </div>
            
            <div className="flex-1 relative">
              {view === "constellation" ? (
                <WorldCanvas />
              ) : (
                <>
                  <EmotionMapCanvas />
                  <div className="absolute bottom-4 right-4">
                    <EmotionLegend />
                  </div>
                </>
              )}
            </div>
          </div>
          <NodeDrawer />
        </main>
      </div>

      <footer className="p-4 text-xs text-slate-500">
        © Crank Studio — Prototype
      </footer>
    </div>
  );
}