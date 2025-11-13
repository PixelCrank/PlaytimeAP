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
import MediaGalleryView from "./components/MediaGalleryView";
import MediaLightbox from "./components/MediaLightbox";
import VideoPlaylistBuilder from "./components/VideoPlaylistBuilder";
import TimelineScrubber from "./components/TimelineScrubber";
import { useStore } from "./store/useStore";

export default function App() {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  
  const [view, setView] = useState<"constellation" | "emotion" | "gallery">("constellation");
  const [showWelcome, setShowWelcome] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showVisitHistory, setShowVisitHistory] = useState(false);
  const [showCustomTags, setShowCustomTags] = useState(false);
  const [showShareSnapshot, setShowShareSnapshot] = useState(false);
  const [lightboxWorkId, setLightboxWorkId] = useState<string | null>(null);
  const [showPlaylistBuilder, setShowPlaylistBuilder] = useState(false);

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
                <button
                  onClick={() => setView("gallery")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    view === "gallery" 
                      ? "bg-white shadow-sm text-slate-900" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🎬 Galerie
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {view !== 'gallery' && <EmotionalCompass />}
              {view !== 'gallery' && <TimelineSlider />}
              
              {/* Tools Dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 flex items-center gap-2 transition">
                  ⚙️ Outils
                  <span className="text-xs">▼</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border-2 border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="py-2">
                    <button
                      onClick={() => setShowVisitHistory(true)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
                    >
                      <span>🕰️</span>
                      <span>Historique de visite</span>
                    </button>
                    <button
                      onClick={() => setShowCustomTags(true)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
                    >
                      <span>🏷️</span>
                      <span>Tags personnalisés</span>
                    </button>
                    <InsightHistoryPanel asMenuItem={true} />
                    <div className="border-t my-1" />
                    {view === 'gallery' && (
                      <button
                        onClick={() => setShowPlaylistBuilder(true)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
                      >
                        <span>🎬</span>
                        <span>Créer une playlist</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowShareSnapshot(true)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
                    >
                      <span>📸</span>
                      <span>Partager cette vue</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowWelcome(true)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                title="Aide"
              >
                ❓
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-80 bg-white border-r shadow-sm overflow-y-auto">
          <div className="p-5 space-y-6">
            {/* Insights - Prominent at top */}
            {view !== 'gallery' && (
              <div className="bg-gradient-to-br from-violet-100 via-purple-50 to-blue-100 rounded-xl p-4 border-2 border-violet-300 shadow-sm">
                <InsightsPanel compact={false} />
              </div>
            )}
            
            {/* 1. DISCOVER - Entry points */}
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-xl">✨</span>
                Explorer
              </h2>
              <div className="space-y-2">
                <MoodBasedEntry />
                <SerendipityExplorer />
              </div>
            </div>
            
            {/* 2. FILTER - Core filtering */}
            <div className="border-t-2 pt-5">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                Filtrer
              </h2>
              
              {/* Monde & Période - Combined */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Monde du temps</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFilters({ realmFilter: "tous" })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        filters.realmFilter === "tous"
                          ? "bg-slate-800 text-white shadow"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setFilters({ realmFilter: "cosmic" })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        filters.realmFilter === "cosmic"
                          ? "bg-purple-600 text-white shadow"
                          : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                      }`}
                    >
                      🌌 Cosmique
                    </button>
                    <button
                      onClick={() => setFilters({ realmFilter: "human" })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        filters.realmFilter === "human"
                          ? "bg-blue-600 text-white shadow"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      👤 Humain
                    </button>
                    <button
                      onClick={() => setFilters({ realmFilter: "disrupted" })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        filters.realmFilter === "disrupted"
                          ? "bg-red-600 text-white shadow"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      ⚡ Dérangé
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Période</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setFilters({ centuryFilter: "tous" })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        filters.centuryFilter === "tous"
                          ? "bg-slate-800 text-white shadow"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Toutes
                    </button>
                    <button
                      onClick={() => setFilters({ centuryFilter: "XIXe" })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        filters.centuryFilter === "XIXe"
                          ? "bg-amber-600 text-white shadow"
                          : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                      }`}
                    >
                      XIXe
                    </button>
                    <button
                      onClick={() => setFilters({ centuryFilter: "XXe" })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        filters.centuryFilter === "XXe"
                          ? "bg-teal-600 text-white shadow"
                          : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                      }`}
                    >
                      XXe–XXIe
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Timeline Scrubber - More prominent */}
              <div className="mb-4">
                <TimelineScrubber />
              </div>
              
              {/* Emotion filter */}
              <EmotionRangeFilter />
            </div>
            
            {/* 3. ANALYZE - Advanced tools (collapsed by default) */}
            <div className="border-t-2 pt-5">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="w-full flex items-center justify-between text-left hover:bg-slate-50 rounded-lg p-3 transition group"
              >
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  Analyser
                  <span className="text-xs font-normal text-slate-500">({showAnalysis ? '5 outils' : 'ouvrir'})</span>
                </h2>
                <span className="text-slate-400 text-lg group-hover:text-slate-600">{showAnalysis ? "−" : "+"}</span>
              </button>
              {showAnalysis && (
                <div className="mt-3 space-y-2">
                  <EmotionalTrajectoryTimeline />
                  <CrossMediumRemix />
                  <RealmComparison />
                  <MediumEmotionDialect />
                  <TemporalDensityHeatmap />
                </div>
              )}
            </div>
            
            {/* Ma Collection - At bottom */}
            <div className="border-t pt-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Ma Collection</h3>
              <CollectionPanel />
            </div>
          </div>
        </aside>

        <main className="flex-1 relative">
          <div className="absolute inset-0">
            {view === "constellation" ? (
              <WorldCanvas />
            ) : view === "emotion" ? (
              <>
                <EmotionMapCanvas />
                <div className="absolute bottom-4 right-4">
                  <EmotionLegend />
                </div>
              </>
            ) : (
              <MediaGalleryView onOpenLightbox={(workId) => setLightboxWorkId(workId)} />
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
      
      {/* Media Gallery Modals */}
      {lightboxWorkId && (
        <MediaLightbox
          workId={lightboxWorkId}
          onClose={() => setLightboxWorkId(null)}
        />
      )}
      {showPlaylistBuilder && <VideoPlaylistBuilder onClose={() => setShowPlaylistBuilder(false)} />}

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