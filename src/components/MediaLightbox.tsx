import { useEffect, useMemo } from "react";
import { useStore } from "../store/useStore";
import works from "../data/works.json";
import type { WorkNode } from "../lib/types";
import { analyzeMediaUrl } from "../lib/media";

const entries = works as WorkNode[];

interface MediaLightboxProps {
  workId: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function MediaLightbox({ workId, onClose, onNext, onPrev }: MediaLightboxProps) {
  const toggleBookmark = useStore(s => s.toggleBookmark);
  const bookmarked = useStore(s => s.bookmarked);
  const setSelectedId = useStore(s => s.setSelectedId);

  const work = useMemo(() => entries.find(w => w.id === workId), [workId]);
  const mediaInfo = useMemo(() => {
    if (!work || !work.lien) return null;
    return analyzeMediaUrl(work.lien);
  }, [work?.lien]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!work || !mediaInfo) return null;

  const isBookmarked = bookmarked.has(work.id);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white text-4xl z-10 w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-lg transition"
      >
        ×
      </button>

      {/* Navigation Arrows */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl z-10 w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-lg transition"
        >
          ←
        </button>
      )}
      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl z-10 w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-lg transition"
        >
          →
        </button>
      )}

      {/* Media Content */}
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="max-w-7xl w-full h-full flex flex-col">
          {/* Media Display */}
          <div className="flex-1 flex items-center justify-center mb-4">
            {mediaInfo.type === 'youtube' && mediaInfo.embedUrl && (
              <iframe
                src={mediaInfo.embedUrl}
                className="w-full h-full max-h-[70vh] aspect-video rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {mediaInfo.type === 'vimeo' && mediaInfo.embedUrl && (
              <iframe
                src={mediaInfo.embedUrl}
                className="w-full h-full max-h-[70vh] aspect-video rounded-lg"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            )}

            {mediaInfo.type === 'image' && (
              <img
                src={mediaInfo.originalUrl}
                alt={work.titre}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            )}

            {mediaInfo.type === 'webpage' && (
              <div className="bg-white/10 backdrop-blur rounded-lg p-12 text-center">
                <div className="text-6xl mb-6">🔗</div>
                <h3 className="text-2xl font-bold text-white mb-4">{work.titre}</h3>
                <p className="text-white/70 mb-6">Cette œuvre est une page web externe</p>
                <a
                  href={mediaInfo.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition"
                >
                  Ouvrir dans un nouvel onglet <span>↗</span>
                </a>
              </div>
            )}
          </div>

          {/* Work Info Overlay */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-white mb-2">{work.titre}</h2>
                {work.createur && (
                  <p className="text-lg text-white/80 mb-3">{work.createur}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {work.annee && (
                    <span className="px-3 py-1 bg-white/20 text-white text-sm rounded">
                      📅 {work.annee}
                    </span>
                  )}
                  {work.type && (
                    <span className="px-3 py-1 bg-white/20 text-white text-sm rounded">
                      {work.type}
                    </span>
                  )}
                  {work.medium && (
                    <span className="px-3 py-1 bg-white/20 text-white text-sm rounded">
                      {work.medium}
                    </span>
                  )}
                </div>

                {work.emotions && work.emotions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {work.emotions.map((emotion, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-violet-500/80 text-white text-xs rounded"
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                )}

                {work.categories && work.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {work.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-500/60 text-white text-xs rounded"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toggleBookmark(work.id)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition flex items-center gap-2"
                >
                  {isBookmarked ? '⭐' : '☆'}
                  <span className="text-sm">{isBookmarked ? 'Retiré' : 'Ajouter'}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedId(work.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition flex items-center gap-2"
                >
                  <span>👁️</span>
                  <span className="text-sm">Détails</span>
                </button>
                {mediaInfo.type !== 'webpage' && (
                  <a
                    href={mediaInfo.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition flex items-center gap-2 text-sm"
                  >
                    Ouvrir ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Hints */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm flex gap-4">
        <span>ESC pour fermer</span>
        {onPrev && <span>← Précédent</span>}
        {onNext && <span>Suivant →</span>}
      </div>
    </div>
  );
}
