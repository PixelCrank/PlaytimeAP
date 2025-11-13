import { useState } from "react";
import { useStore } from "../store/useStore";

export default function InsightHistoryPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'bookmarked'>('all');
  
  const insightHistory = useStore(s => s.insightHistory);
  const bookmarkedInsights = useStore(s => s.bookmarkedInsights);
  const toggleInsightBookmark = useStore(s => s.toggleInsightBookmark);
  const deleteInsight = useStore(s => s.deleteInsight);
  const clearInsightHistory = useStore(s => s.clearInsightHistory);
  const setFilters = useStore(s => s.setFilters);
  const setRealm = useStore(s => s.setRealm);
  const setCenturyFilter = useStore(s => s.setCenturyFilter);

  const filteredInsights = filterType === 'bookmarked'
    ? insightHistory.filter(i => bookmarkedInsights.has(i.id))
    : insightHistory;

  const insightColors = {
    discovery: 'bg-violet-50 border-violet-300 text-violet-900',
    comparison: 'bg-blue-50 border-blue-300 text-blue-900',
    anomaly: 'bg-amber-50 border-amber-300 text-amber-900',
    pattern: 'bg-emerald-50 border-emerald-300 text-emerald-900',
  };

  const handleReplayInsight = (insight: typeof insightHistory[0]) => {
    setRealm(insight.filterState.realm as any);
    setFilters(insight.filterState.filters);
    setCenturyFilter(insight.filterState.centuryFilter as any);
    setIsOpen(false);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffMins < 1440) return `Il y a ${Math.floor(diffMins / 60)}h`;
    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  };

  const handleExport = () => {
    const exportData = filteredInsights.map(i => ({
      découverte: i.message,
      type: i.type,
      date: new Date(i.timestamp).toLocaleString('fr-FR'),
      royaume: i.filterState.realm,
      œuvres: i.filterState.totalWorks,
    }));
    
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playtime-insights-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg text-sm font-medium shadow-sm transition-all hover:shadow-md flex items-center gap-2"
      >
        <span className="text-lg">🔍</span>
        <span>Découvertes</span>
        {insightHistory.length > 0 && (
          <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs font-bold">
            {insightHistory.length}
          </span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔍</span>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Historique des découvertes</h2>
                    <p className="text-sm text-slate-600">
                      {insightHistory.length} insight{insightHistory.length > 1 ? 's' : ''} révélé{insightHistory.length > 1 ? 's' : ''} pendant votre exploration
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Filters and actions */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      filterType === 'all'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white border text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Toutes ({insightHistory.length})
                  </button>
                  <button
                    onClick={() => setFilterType('bookmarked')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      filterType === 'bookmarked'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white border text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ⭐ Favoris ({bookmarkedInsights.size})
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleExport}
                    disabled={filteredInsights.length === 0}
                    className="px-3 py-1.5 bg-white border rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📥 Exporter
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Supprimer toutes les découvertes non-favorites ?')) {
                        clearInsightHistory();
                      }
                    }}
                    disabled={insightHistory.length === bookmarkedInsights.size}
                    className="px-3 py-1.5 bg-white border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🗑️ Nettoyer
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredInsights.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-slate-600">
                    {filterType === 'bookmarked'
                      ? "Aucune découverte favorite pour l'instant"
                      : "Explorez le corpus pour révéler des insights"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`border-2 rounded-lg p-4 ${insightColors[insight.type]} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl shrink-0">{insight.icon}</div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm leading-relaxed mb-2">
                            {insight.message}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 bg-white/60 rounded">
                              {formatTime(insight.timestamp)}
                            </span>
                            <span className="px-2 py-0.5 bg-white/60 rounded">
                              {insight.filterState.realm}
                            </span>
                            <span className="px-2 py-0.5 bg-white/60 rounded">
                              {insight.filterState.totalWorks} œuvres
                            </span>
                            {insight.filterState.centuryFilter && (
                              <span className="px-2 py-0.5 bg-white/60 rounded">
                                {insight.filterState.centuryFilter === 19 ? 'XIXe' : 'XXe–XXIe'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => toggleInsightBookmark(insight.id)}
                            className={`p-1.5 rounded hover:bg-white/60 transition ${
                              bookmarkedInsights.has(insight.id) ? 'text-yellow-500' : 'text-slate-400'
                            }`}
                            title={bookmarkedInsights.has(insight.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          >
                            ⭐
                          </button>
                          <button
                            onClick={() => handleReplayInsight(insight)}
                            className="p-1.5 rounded hover:bg-white/60 transition text-slate-600"
                            title="Reproduire cette vue"
                          >
                            🔄
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Supprimer cette découverte ?')) {
                                deleteInsight(insight.id);
                              }
                            }}
                            className="p-1.5 rounded hover:bg-white/60 transition text-red-500"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
