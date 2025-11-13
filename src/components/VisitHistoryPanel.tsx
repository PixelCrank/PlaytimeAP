import { useMemo, useState } from "react";
import { useStore } from "../store/useStore";
import works from "../data/works.json";
import type { WorkNode } from "../lib/types";

const entries = works as WorkNode[];

export default function VisitHistoryPanel({ onClose }: { onClose: () => void }) {
  const visitHistory = useStore(s => s.visitHistory);
  const clearVisitHistory = useStore(s => s.clearVisitHistory);
  const setSelectedId = useStore(s => s.setSelectedId);
  const setRealm = useStore(s => s.setRealm);
  const setFilters = useStore(s => s.setFilters);
  const setCenturyFilter = useStore(s => s.setCenturyFilter);
  
  const [showAll, setShowAll] = useState(false);

  // Group visits by session (5-minute gaps define new sessions)
  const sessions = useMemo(() => {
    const grouped: Array<{ sessionStart: number; visits: typeof visitHistory }> = [];
    let currentSession: typeof visitHistory = [];
    let lastTimestamp = 0;

    visitHistory.forEach((visit) => {
      const gap = lastTimestamp - visit.timestamp;
      if (gap > 5 * 60 * 1000 && currentSession.length > 0) {
        // New session
        grouped.push({ sessionStart: currentSession[0].timestamp, visits: [...currentSession] });
        currentSession = [visit];
      } else {
        currentSession.push(visit);
      }
      lastTimestamp = visit.timestamp;
    });

    if (currentSession.length > 0) {
      grouped.push({ sessionStart: currentSession[0].timestamp, visits: currentSession });
    }

    return grouped;
  }, [visitHistory]);

  const displaySessions = showAll ? sessions : sessions.slice(0, 3);

  const getWorkTitle = (workId: string) => {
    const work = entries.find(w => w.id === workId);
    return work?.titre || "Œuvre inconnue";
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Hier à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const replayContext = (visit: typeof visitHistory[0]) => {
    setRealm(visit.context.realm as any);
    setFilters(visit.context.filters);
    setCenturyFilter(visit.context.centuryFilter as 19 | 20 | null);
    setSelectedId(visit.workId);
    onClose();
  };

  const handleClear = () => {
    if (confirm("Effacer tout l'historique de visite ?")) {
      clearVisitHistory();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              🕰️ Historique de visite
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {visitHistory.length} œuvre{visitHistory.length > 1 ? 's' : ''} visitée{visitHistory.length > 1 ? 's' : ''} · {sessions.length} session{sessions.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            {visitHistory.length > 0 && (
              <button
                onClick={handleClear}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                🗑️ Effacer
              </button>
            )}
            <button
              onClick={onClose}
              className="text-2xl text-slate-400 hover:text-slate-600 px-2"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {visitHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-slate-600">Aucune visite enregistrée</p>
              <p className="text-sm text-slate-400 mt-2">
                Explorez les œuvres pour commencer à construire votre historique
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {displaySessions.map((session, idx) => (
                <div key={idx} className="border-l-4 border-violet-200 pl-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Session {formatTimestamp(session.sessionStart)}
                  </div>
                  <div className="space-y-2">
                    {session.visits.map((visit) => (
                      <div
                        key={visit.id}
                        className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-800 truncate">
                              {getWorkTitle(visit.workId)}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-500">
                              <span className="bg-white px-2 py-0.5 rounded">
                                {visit.context.realm === 'human' ? '⏳ Humain' : 
                                 visit.context.realm === 'cosmic' ? '🌌 Cosmique' : 
                                 '⚡ Perturbé'}
                              </span>
                              {visit.context.centuryFilter && (
                                <span className="bg-white px-2 py-0.5 rounded">
                                  📅 {visit.context.centuryFilter}e siècle
                                </span>
                              )}
                              {visit.context.filters.emotions.length > 0 && (
                                <span className="bg-white px-2 py-0.5 rounded">
                                  💜 {visit.context.filters.emotions.length} émotion{visit.context.filters.emotions.length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => replayContext(visit)}
                            className="shrink-0 px-3 py-1.5 text-xs bg-violet-500 text-white rounded-lg hover:bg-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ↻ Rejouer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {sessions.length > 3 && !showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className="w-full py-2 text-sm text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg"
                >
                  Afficher {sessions.length - 3} session{sessions.length - 3 > 1 ? 's' : ''} de plus...
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
