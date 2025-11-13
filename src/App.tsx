// src/App.tsx
import { useState, useEffect } from "react";
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
import KeywordCloud from "./components/KeywordCloud";
import TemporalDensityHeatmap from "./components/TemporalDensityHeatmap";
import MediumEmotionDialect from "./components/MediumEmotionDialect";
import WelcomeModal from "./components/WelcomeModal";
import CollectionPanel from "./components/CollectionPanel";
import JourneyBuilder from "./components/JourneyBuilder";
import InsightHistoryPanel from "./components/InsightHistoryPanel";
import WorkComparisonPanel from "./components/WorkComparisonPanel";
import VisitHistoryPanel from "./components/VisitHistoryPanel";
import CustomTagsManager from "./components/CustomTagsManager";
import ShareSnapshotPanel from "./components/ShareSnapshotPanel";

export default function App() {
  const [view, setView] = useState<"constellation" | "emotion">("constellation");
  const [showWelcome, setShowWelcome] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showVisitHistory, setShowVisitHistory] = useState(false);
  const [showCustomTags, setShowCustomTags] = useState(false);
  const [showShareSnapshot, setShowShareSnapshot] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("playtime-visited");
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem("playtime-visited", "true");
    }
  }, []);

  // Parse URL parameters to restore shared snapshots
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('realm')) {
      const realm = params.get('realm');
      if (realm === 'cosmic' || realm === 'human' || realm === 'disrupted') {
        // Import useStore here to avoid circular dependencies
        import('./store/useStore').then(({ useStore }) => {
          useStore.getState().setRealm(realm);
        });
      }
    }
    
    if (params.has('century')) {
      const century = parseInt(params.get('century')!);
      if (century === 19 || century === 20) {
        import('./store/useStore').then(({ useStore }) => {
          useStore.getState().setCenturyFilter(century);
        });
      }
    }
    
    const filters: any = {};
    
    if (params.has('types')) {
      filters.types = params.get('types')!.split(',');
    }
    
    if (params.has('categories')) {
      filters.categories = params.get('categories')!.split(',');
    }
    
    if (params.has('emotions')) {
      filters.emotions = params.get('emotions')!.split(',');
    }
    
    if (params.has('yearMin') && params.has('yearMax')) {
      filters.yearRange = [
        parseInt(params.get('yearMin')!),
        parseInt(params.get('yearMax')!)
      ];
    }
    
    if (params.has('search')) {
      filters.search = params.get('search')!;
    }
    
    if (Object.keys(filters).length > 0) {
      import('./store/useStore').then(({ useStore }) => {
        useStore.getState().setFilters(filters);
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Playtime
                </h1>
                <p className="text-xs text-slate-500">
                  620 œuvres · 3 visages du temps
                </p>
              </div>
              
              <div className="flex items-center gap-1 border rounded-lg p-1 bg-slate-50">
                <button
                  onClick={() => setView("constellation")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    view === "constellation"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🌌 Constellation
                </button>
                <button
                  onClick={() => setView("emotion")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    view === "emotion" 
                      ? "bg-white shadow-sm text-slate-900" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🎭 Émotions
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVisitHistory(true)}
                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 flex items-center gap-1.5"
              >
                🕰️ Historique
              </button>
              <button
                onClick={() => setShowCustomTags(true)}
                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 flex items-center gap-1.5"
              >
                🏷️ Tags
              </button>
              <button
                onClick={() => setShowShareSnapshot(true)}
                className="px-3 py-1.5 text-xs bg-violet-500 hover:bg-violet-600 rounded-lg font-medium text-white flex items-center gap-1.5"
              >
                📸 Partager
              </button>
              <InsightHistoryPanel />
              <TimelineSlider />
              <EmotionalCompass />
            </div>
          </div>
        </div>
        
        <div className="border-t bg-slate-50 px-6 py-2">
          <InsightsPanel />
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-80 bg-white border-r shadow-sm overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Quick Start */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">✨</span>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Démarrage rapide</h3>
              </div>
              <MoodBasedEntry />
              <button
                onClick={() => setShowWelcome(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm"
              >
                <span>❓</span>
                <span>Revoir le guide</span>
              </button>
            </div>
            
            {/* Collection & Journey */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💼</span>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ma Collection</h3>
              </div>
              <CollectionPanel />
              <JourneyBuilder />
            </div>
            
            {/* Exploration Tools */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔍</span>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Explorer</h3>
              </div>
              <KeywordCloud />
              <QualitativeSearch />
              <SerendipityExplorer />
            </div>
            
            {/* Filters */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🎯</span>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Filtres</h3>
              </div>
              <JourneySelector />
              <EmotionRangeFilter />
            </div>
            
            {/* Analysis Tools - Collapsible */}
            <div className="border-t pt-4">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="w-full flex items-center justify-between mb-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Analyses</h3>
                </div>
                <span className="text-slate-400 text-sm">{showAnalysis ? "−" : "+"}</span>
              </button>
              {showAnalysis && (
                <div className="space-y-2">
                  <RealmComparison />
                  <TemporalDensityHeatmap />
                  <MediumEmotionDialect />
                  <EmotionalTrajectoryTimeline />
                </div>
              )}
            </div>
            
            {/* Research Tools - Collapsible */}
            <div className="border-t pt-4">
              <button
                onClick={() => setShowResearch(!showResearch)}
                className="w-full flex items-center justify-between mb-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔬</span>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Outils recherche</h3>
                </div>
                <span className="text-slate-400 text-sm">{showResearch ? "−" : "+"}</span>
              </button>
              {showResearch && (
                <div className="space-y-2">
                  <CrossMediumRemix />
                  <CuratedPlaylistBuilder />
                  <CorpusGapAnalyzer />
                  <SocialExperienceGenerator />
                  <MediumComparisonPanel />
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 relative">
          <div className="absolute inset-0">
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
          <NodeDrawer />
        </main>
      </div>

      {/* Work Comparison Floating Panel */}
      <WorkComparisonPanel />

      {/* Personal Layer Modals */}
      {showVisitHistory && <VisitHistoryPanel onClose={() => setShowVisitHistory(false)} />}
      {showCustomTags && <CustomTagsManager onClose={() => setShowCustomTags(false)} />}
      {showShareSnapshot && <ShareSnapshotPanel onClose={() => setShowShareSnapshot(false)} />}

      <footer className="border-t bg-white px-6 py-3 flex items-center justify-between text-xs text-slate-500">
        <span>© 2025 Crank Studio · Playtime v1.0</span>
        <button
          onClick={() => setShowWelcome(true)}
          className="text-slate-400 hover:text-slate-600 transition"
        >
          Aide & Guide
        </button>
      </footer>
    </div>
  );
}