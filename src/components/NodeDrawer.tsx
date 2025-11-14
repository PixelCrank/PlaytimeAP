import { useMemo, useState } from "react";
import works from "../data/works.json";
import type { WorkNode } from "../lib/types";
import { useStore } from "../store/useStore";
import { analyzeMediaUrl, getMediaIcon } from "../lib/media";
import NotesPanel from "./NotesPanel";
import WorkContextNarrative from "./WorkContextNarrative";
import TemporalDNAFingerprint from "./TemporalDNAFingerprint";

const entries = works as WorkNode[];

const formatList = (items: string[] | undefined) =>
  items && items.length > 0 ? items.join(" · ") : "—";

export default function NodeDrawer() {
  const selectedId = useStore(s => s.selectedId);
  const setSelectedId = useStore(s => s.setSelectedId);
  const togglePin = useStore(s => s.togglePin);
  const pinned = useStore(s => s.pinned);
  const bookmarked = useStore(s => s.bookmarked);
  const toggleBookmark = useStore(s => s.toggleBookmark);

  const node = useMemo(() => entries.find(w => w.id === selectedId) ?? null, [selectedId]);
  
  // Hooks must be called unconditionally before any early returns
  const [showEmbed, setShowEmbed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const mediaInfo = useMemo(() => {
    if (!node || !node.lien || node.lien.trim() === '') return null;
    return analyzeMediaUrl(node.lien);
  }, [node?.lien]);

  if (!node) {
    return null; // Don't show anything when no work is selected
  }

  const isPinned = pinned.has(node.id);
  const isBookmarked = bookmarked.has(node.id);

  return (
    <aside
      className={`mt-6 md:mt-0 md:absolute md:inset-y-0 md:right-0 border-l bg-white/95 backdrop-blur shadow-xl flex flex-col transition-all duration-300 z-50 ${
        isCollapsed ? 'md:w-12' : 'md:w-96'
      }`}
      aria-live="polite"
    >
      {/* Collapse/Expand Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-8 top-4 w-8 h-8 bg-white/95 backdrop-blur border border-r-0 rounded-l-lg shadow-md hover:bg-slate-50 transition flex items-center justify-center text-slate-600 hover:text-slate-900"
        title={isCollapsed ? "Développer" : "Réduire"}
      >
        {isCollapsed ? '◀' : '▶'}
      </button>

      {isCollapsed ? (
        /* Collapsed state - show minimal info */
        <div className="p-2 h-full flex flex-col items-center gap-2 overflow-hidden">
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-xs writing-mode-vertical-rl transform rotate-180 text-slate-600 hover:text-slate-900 py-4"
          >
            {node.titre.slice(0, 20)}...
          </button>
        </div>
      ) : (
        /* Expanded state - full drawer */
        <div className="p-4 flex flex-col h-full overflow-hidden"
    >
        <header className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">{node.type}</p>
            <h2 className="text-xl font-semibold leading-snug">{node.titre}</h2>
            {node.createur && (
              <p className="text-sm text-slate-600">{node.createur}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => toggleBookmark(node.id)}
              className={`text-xs border rounded-full px-3 py-1 ${
                isBookmarked 
                  ? "bg-purple-600 text-white border-purple-600" 
                  : "bg-white hover:bg-purple-50 border-slate-300"
              }`}
              title={isBookmarked ? "Retirer de la collection" : "Ajouter à la collection"}
            >
              {isBookmarked ? "⭐ Dans ma collection" : "⭐ Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => togglePin(node.id)}
              className={`text-xs border rounded-full px-3 py-1 ${isPinned ? "bg-black text-white" : "bg-white"}`}
            >
              {isPinned ? "Épinglé" : "Épingler"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Fermer
            </button>
          </div>
        </header>

        <div className="mt-4 space-y-3 text-sm text-slate-700 overflow-y-auto flex-1">
        {node.annee && (
          <p><strong className="font-medium text-slate-900">Année :</strong> {node.annee}</p>
        )}
        {node.medium && (
          <p><strong className="font-medium text-slate-900">Médium :</strong> {node.medium}</p>
        )}
        <p><strong className="font-medium text-slate-900">Catégories :</strong> {formatList(node.categories)}</p>
        <p><strong className="font-medium text-slate-900">Émotions :</strong> {formatList(node.emotions)}</p>
        {node.motsCles?.length ? (
          <p><strong className="font-medium text-slate-900">Mots-clés :</strong> {node.motsCles.join(", ")}</p>
        ) : null}
        {node.commentaire && (
          <p className="text-slate-600 whitespace-pre-line leading-relaxed">{node.commentaire}</p>
        )}
        
        {/* Media Section */}
        {mediaInfo && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center justify-between mb-2">
              <strong className="font-medium text-slate-900 flex items-center gap-2">
                <span className="text-lg">{getMediaIcon(mediaInfo.type)}</span>
                <span>Média</span>
              </strong>
              {(mediaInfo.type === 'youtube' || mediaInfo.type === 'vimeo') && (
                <button
                  onClick={() => setShowEmbed(!showEmbed)}
                  className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  {showEmbed ? 'Masquer' : 'Afficher'}
                </button>
              )}
            </div>

            {/* YouTube/Vimeo Embed */}
            {showEmbed && mediaInfo.embedUrl && (
              <div className="aspect-video bg-slate-100 rounded overflow-hidden mb-2">
                <iframe
                  src={mediaInfo.embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={node.titre}
                />
              </div>
            )}

            {/* Image Preview */}
            {mediaInfo.type === 'image' && (
              <div className="rounded overflow-hidden mb-2 bg-slate-100">
                <img
                  src={mediaInfo.thumbnail}
                  alt={node.titre}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Thumbnail for videos (when not showing embed) */}
            {!showEmbed && mediaInfo.thumbnail && (mediaInfo.type === 'youtube' || mediaInfo.type === 'vimeo') && (
              <div className="relative rounded overflow-hidden mb-2 cursor-pointer group" onClick={() => setShowEmbed(true)}>
                <img
                  src={mediaInfo.thumbnail}
                  alt={node.titre}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <span className="text-3xl">▶️</span>
                  </div>
                </div>
              </div>
            )}

            {/* External Link */}
            <a
              href={mediaInfo.originalUrl.trim()}
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 hover:text-sky-800 underline text-sm flex items-center gap-1"
            >
              <span>Ouvrir dans un nouvel onglet</span>
              <span className="text-xs">↗</span>
            </a>
          </div>
        )}
        
          {/* Temporal DNA Fingerprint */}
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🧬</span>
              <strong className="font-semibold text-slate-900">ADN temporel</strong>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-4">
              <TemporalDNAFingerprint work={node} size={180} showLabels={true} />
            </div>
            <p className="text-xs text-slate-500 mt-2 italic">
              Empreinte unique de cette œuvre basée sur ses dimensions émotionnelles, 
              thématiques et temporelles
            </p>
          </div>

          {/* AI Contextual Narrative */}
          <WorkContextNarrative work={node} />
          
          {/* Personal Notes */}
          <NotesPanel workId={node.id} />
        </div>
      </div>
      )}
    </aside>
  );
}