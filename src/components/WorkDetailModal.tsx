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

function calculateSimilarity(work1: WorkNode, work2: WorkNode): number {
  let score = 0;
  
  // Shared emotions (high weight)
  const emotions1 = new Set(work1.emotions || []);
  const emotions2 = new Set(work2.emotions || []);
  const sharedEmotions = [...emotions1].filter(e => emotions2.has(e)).length;
  score += sharedEmotions * 3;
  
  // Shared categories (medium weight)
  const categories1 = new Set(work1.categories || []);
  const categories2 = new Set(work2.categories || []);
  const sharedCategories = [...categories1].filter(c => categories2.has(c)).length;
  score += sharedCategories * 2;
  
  // Same type (small weight)
  if (work1.type === work2.type) score += 1;
  
  // Temporal proximity (within 20 years)
  const year1 = parseInt(work1.annee || '0');
  const year2 = parseInt(work2.annee || '0');
  if (year1 && year2) {
    const yearDiff = Math.abs(year1 - year2);
    if (yearDiff <= 20) score += 1 - (yearDiff / 20);
  }
  
  return score;
}

export default function WorkDetailModal() {
  const selectedId = useStore(s => s.selectedId);
  const setSelectedId = useStore(s => s.setSelectedId);
  const bookmarked = useStore(s => s.bookmarked);
  const toggleBookmark = useStore(s => s.toggleBookmark);

  const node = useMemo(() => entries.find(w => w.id === selectedId) ?? null, [selectedId]);
  
  const [showEmbed, setShowEmbed] = useState(false);
  
  const mediaInfo = useMemo(() => {
    if (!node || !node.lien || node.lien.trim() === '') return null;
    return analyzeMediaUrl(node.lien);
  }, [node?.lien]);

  // Find similar works
  const similarWorks = useMemo(() => {
    if (!node) return [];
    
    const scored = entries
      .filter(w => w.id !== node.id)
      .map(w => ({ work: w, score: calculateSimilarity(node, w) }))
      .filter(({ score }) => score > 2) // Only works with decent similarity
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
    
    return scored.map(s => s.work);
  }, [node]);

  if (!node) return null;

  const isBookmarked = bookmarked.has(node.id);

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => setSelectedId(null)}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-slate-50 to-white shrink-0">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {node.type}
              </span>
              {node.annee && (
                <span className="text-xs text-slate-500">📅 {node.annee}</span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">{node.titre}</h2>
            {node.createur && (
              <p className="text-sm text-slate-600 mt-1">{node.createur}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(node.id)}
              className={`p-2.5 rounded-lg transition-all ${
                isBookmarked 
                  ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200' 
                  : 'text-slate-400 hover:text-yellow-600 hover:bg-yellow-50'
              }`}
              title={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <span className="text-xl">{isBookmarked ? '⭐' : '☆'}</span>
            </button>
            
            <button
              onClick={() => setSelectedId(null)}
              className="p-2.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Fermer"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="col-span-2 space-y-6">
              {/* Emotions & Categories */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Émotions</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(node.emotions || []).map((emotion, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Catégories</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(node.categories || []).map((category, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-amber-100 text-amber-800 rounded text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Commentary */}
              {node.commentaire && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Commentaire</h3>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{node.commentaire}</p>
                </div>
              )}

              {/* Context Narrative */}
              <WorkContextNarrative work={node} />

              {/* Media */}
              {mediaInfo && node.lien && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Média</h3>
                  <a
                    href={node.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                  >
                    <span className="text-lg">{getMediaIcon(mediaInfo.type)}</span>
                    <span>Ouvrir {mediaInfo.type}</span>
                  </a>
                </div>
              )}

              {/* Notes */}
              <NotesPanel workId={node.id} />
            </div>

            {/* Right Column - DNA & Similar Works */}
            <div className="space-y-6">
              {/* DNA Fingerprint */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">DNA Temporel</h3>
                <div className="flex justify-center">
                  <TemporalDNAFingerprint work={node} size={200} showLabels={false} />
                </div>
              </div>

              {/* Similar Works */}
              {similarWorks.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Œuvres similaires</h3>
                  <div className="space-y-2">
                    {similarWorks.map(work => (
                      <button
                        key={work.id}
                        onClick={() => setSelectedId(work.id)}
                        className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition group"
                      >
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 line-clamp-2">
                          {work.titre}
                        </div>
                        {work.createur && (
                          <div className="text-xs text-slate-500 mt-1">{work.createur}</div>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(work.emotions || []).slice(0, 2).map((e, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                              {e}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
