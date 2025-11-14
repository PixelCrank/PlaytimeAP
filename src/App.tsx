// src/App.tsx
import { useState, useEffect } from "react";
import TemporalTimelineView from "./components/TemporalTimelineView";
import EmotionMapCanvas from "./components/EmotionMapCanvas";
import WorkDetailModal from "./components/WorkDetailModal";
import EmotionLegend from "./components/EmotionLegend";
import EmotionRangeFilter from "./components/EmotionRangeFilter";
import InsightsPanel from "./components/InsightsPanel";
import SerendipityExplorer from "./components/SerendipityExplorer";
import CorpusGapAnalyzer from "./components/CorpusGapAnalyzer";
import SocialExperienceGenerator from "./components/SocialExperienceGenerator";
import EmotionalTrajectoryTimeline from "./components/EmotionalTrajectoryTimeline";
import CrossMediumRemix from "./components/CrossMediumRemix";
import AnalysisHub from "./components/AnalysisHub";
import CorpusConversation from "./components/CorpusConversation";
import WelcomeModal from "./components/WelcomeModal";
import CollectionPanel from "./components/CollectionPanel";
import InsightHistoryPanel from "./components/InsightHistoryPanel";
import WorkComparisonPanel from "./components/WorkComparisonPanel";
import VisitHistoryPanel from "./components/VisitHistoryPanel";
import CustomTagsManager from "./components/CustomTagsManager";
import ShareSnapshotPanel from "./components/ShareSnapshotPanel";
import MediaGalleryView from "./components/MediaGalleryView";
import MediaLightbox from "./components/MediaLightbox";
import VideoPlaylistBuilder from "./components/VideoPlaylistBuilder";
import EmotionalClusters from "./components/EmotionalClusters";
import MediumMoodExplorer from "./components/MediumMoodExplorer";
import MegaCategoryFilter from "./components/MegaCategoryFilter";
import MediumFilter from "./components/MediumFilter";
import { useStore } from "./store/useStore";

export default function App() {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const realm = useStore((state) => state.realm);
  const centuryFilter = useStore((state) => state.centuryFilter);
  
  const [view, setView] = useState<"constellation" | "emotion" | "gallery">("constellation");
  const [showWelcome, setShowWelcome] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [showVisitHistory, setShowVisitHistory] = useState(false);
  const [showCustomTags, setShowCustomTags] = useState(false);
  const [showShareSnapshot, setShowShareSnapshot] = useState(false);
  const [lightboxWorkId, setLightboxWorkId] = useState<string | null>(null);
  const [showPlaylistBuilder, setShowPlaylistBuilder] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");

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

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.types.length > 0) {
      params.set('types', filters.types.join(','));
    }
    
    if (filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','));
    }
    
    if (filters.emotions.length > 0) {
      params.set('emotions', filters.emotions.join(','));
    }
    
    if (filters.yearRange) {
      params.set('yearMin', String(filters.yearRange[0]));
      params.set('yearMax', String(filters.yearRange[1]));
    }
    
    if (filters.search) {
      params.set('search', filters.search);
    }
    
    if (realm) {
      params.set('realm', realm);
    }
    
    if (centuryFilter !== null) {
      params.set('century', String(centuryFilter));
    }
    
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [filters, realm, centuryFilter]);

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
                  📅 Chronologie
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
              {/* Insights Panel - Compact Header Version */}
              <InsightsPanel compact={true} />
              
              {/* Tools Dropdown - Simplified */}
              <div className="relative group">
                <button className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 flex items-center gap-2 transition">
                  ⚙️ Plus
                  <span className="text-xs">▼</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border-2 border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="py-2">
                    <InsightHistoryPanel asMenuItem={true} />
                    {view === 'gallery' && (
                      <button
                        onClick={() => setShowPlaylistBuilder(true)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
                      >
                        <span>🎬</span>
                        <span>Créer une playlist vidéo</span>
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
            {/* Quick Search - Always visible at top */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par titre ou créateur..."
                  value={quickSearch}
                  onChange={(e) => {
                    setQuickSearch(e.target.value);
                    if (e.target.value.trim()) {
                      setFilters({
                        ...filters,
                        search: e.target.value
                      });
                    } else {
                      setFilters({
                        ...filters,
                        search: ""
                      });
                    }
                  }}
                  className="w-full px-4 py-2 pl-10 text-sm border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                {quickSearch && (
                  <button
                    onClick={() => {
                      setQuickSearch("");
                      setFilters({ ...filters, search: "" });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            
            {/* Clear All Filters */}
            {(filters.emotions.length > 0 || filters.types.length > 0 || filters.categories.length > 0 || filters.search) && (
              <button
                onClick={() => {
                  setQuickSearch("");
                  setFilters({
                    types: [],
                    categories: [],
                    emotions: [],
                    yearRange: null,
                    search: "",
                    realmFilter: "tous",
                    centuryFilter: "tous"
                  });
                }}
                className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>Réinitialiser tous les filtres</span>
              </button>
            )}

            {/* 1. DISCOVER - Emotion-first exploration */}
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-xl">📍</span>
                Découvrir
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowConversation(!showConversation)}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition shadow-md"
                >
                  <span className="text-xl">💬</span>
                  <span className="font-semibold text-sm">Discuter avec le corpus</span>
                </button>
                
                <div>
                  <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Clusters émotionnels</h3>
                  <EmotionalClusters />
                </div>
                
                <div>
                  <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Ambiances par médium</h3>
                  <MediumMoodExplorer />
                </div>
                
                <SerendipityExplorer />
              </div>
            </div>
            
            {/* 2. REFINE - Advanced filtering (collapsed by default) */}
            <div className="border-t-2 pt-5">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between text-left hover:bg-slate-50 rounded-lg p-3 transition group"
              >
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-xl">🎚️</span>
                  Affiner
                  <span className="text-xs font-normal text-slate-500">({showFilters ? 'filtres' : 'ouvrir'})</span>
                </h2>
                <span className="text-slate-400 text-lg group-hover:text-slate-600">{showFilters ? "−" : "+"}</span>
              </button>
              
              {showFilters && (
                <div className="mt-4 space-y-4">
                  <EmotionRangeFilter />
                  <MediumFilter />
                  <MegaCategoryFilter />
                </div>
              )}
            </div>
            
            {/* 3. COLLECTION & TOOLS - Combined collapsed section */}
            <div className="border-t-2 pt-5">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="w-full flex items-center justify-between text-left hover:bg-slate-50 rounded-lg p-3 transition group"
              >
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-xl">💾</span>
                  Ma Collection & Outils
                  <span className="text-xs font-normal text-slate-500">({showAnalysis ? 'ouvrir' : 'fermer'})</span>
                </h2>
                <span className="text-slate-400 text-lg group-hover:text-slate-600">{showAnalysis ? "−" : "+"}</span>
              </button>
              {showAnalysis && (
                <div className="mt-3 space-y-4">
                  {/* Collection */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Collection</h3>
                    <CollectionPanel />
                    <div className="mt-2 space-y-2">
                      <button
                        onClick={() => setShowVisitHistory(true)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 rounded-lg flex items-center gap-3 transition"
                      >
                        <span>📚</span>
                        <span>Historique</span>
                      </button>
                      <button
                        onClick={() => setShowCustomTags(true)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 rounded-lg flex items-center gap-3 transition"
                      >
                        <span>🏷️</span>
                        <span>Tags personnalisés</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Analysis Tools */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Analyse</h3>
                    <div className="space-y-2">
                      <EmotionalTrajectoryTimeline />
                      <CrossMediumRemix />
                      <AnalysisHub />
                    </div>
                  </div>
                  
                  {/* Research Tools */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Recherche</h3>
                    <div className="space-y-2">
                      <CorpusGapAnalyzer />
                      <SocialExperienceGenerator />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 relative">
          <div className="absolute inset-0">
            {view === "constellation" ? (
              <TemporalTimelineView />
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
          <WorkDetailModal />
        </main>
      </div>

      {/* Work Comparison Floating Panel */}
      <WorkComparisonPanel />

      {/* Personal Layer Modals */}
      {showConversation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>💬</span>
                Conversation avec le corpus
              </h2>
              <button
                onClick={() => setShowConversation(false)}
                className="text-slate-400 hover:text-slate-600 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <CorpusConversation />
            </div>
          </div>
        </div>
      )}
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