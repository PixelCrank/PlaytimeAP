import { useMemo, useState } from "react";
import { useStore } from "../store/useStore";
import works from "../data/works.json";
import type { WorkNode } from "../lib/types";
import { analyzeMediaUrl, type MediaType } from "../lib/media";
import { buildPredicateWithCentury } from "../lib/filters";

const entries = works as WorkNode[];

type MediaFilter = MediaType | 'all' | 'video';

export default function MediaGalleryView({ onOpenLightbox }: { onOpenLightbox: (workId: string) => void }) {
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const setSelectedId = useStore(s => s.setSelectedId);
  const bookmarked = useStore(s => s.bookmarked);
  const toggleBookmark = useStore(s => s.toggleBookmark);
  
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaFilter>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'emotion'>('date');

  // Filter works with media links
  const worksWithMedia = useMemo(() => {
    const filtered = entries.filter(buildPredicateWithCentury(filters, centuryFilter));
    return filtered
      .filter(w => w.lien && w.lien.trim() !== '')
      .map(w => ({
        ...w,
        mediaInfo: analyzeMediaUrl(w.lien)
      }))
      .filter(w => w.mediaInfo !== null);
  }, [filters, centuryFilter]);

  // Apply media type filter
  const filteredByType = useMemo(() => {
    if (mediaTypeFilter === 'all') return worksWithMedia;
    if (mediaTypeFilter === 'video') {
      return worksWithMedia.filter(w => w.mediaInfo?.type === 'youtube' || w.mediaInfo?.type === 'vimeo');
    }
    return worksWithMedia.filter(w => w.mediaInfo?.type === mediaTypeFilter);
  }, [worksWithMedia, mediaTypeFilter]);

  // Sort works
  const sortedWorks = useMemo(() => {
    const sorted = [...filteredByType];
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.titre.localeCompare(b.titre));
      case 'emotion':
        return sorted.sort((a, b) => {
          const aEmotion = a.emotions?.[0] || '';
          const bEmotion = b.emotions?.[0] || '';
          return aEmotion.localeCompare(bEmotion);
        });
      case 'date':
      default:
        return sorted.sort((a, b) => {
          const aYear = typeof a.annee === 'number' ? a.annee : parseInt(a.annee || '0');
          const bYear = typeof b.annee === 'number' ? b.annee : parseInt(b.annee || '0');
          return aYear - bYear;
        });
    }
  }, [filteredByType, sortBy]);

  const mediaTypeCounts = useMemo(() => {
    const counts = { video: 0, image: 0, webpage: 0 };
    worksWithMedia.forEach(w => {
      if (w.mediaInfo?.type === 'youtube' || w.mediaInfo?.type === 'vimeo') {
        counts.video++;
      } else if (w.mediaInfo?.type === 'image') {
        counts.image++;
      } else if (w.mediaInfo?.type === 'webpage') {
        counts.webpage++;
      }
    });
    return counts;
  }, [worksWithMedia]);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Filter Bar */}
      <div className="bg-white border-b px-6 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800">🎬 Galerie Média</h2>
            <span className="text-sm text-slate-500">
              {sortedWorks.length} œuvre{sortedWorks.length > 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Trier par:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="date">Date</option>
              <option value="title">Titre</option>
              <option value="emotion">Émotion</option>
            </select>
          </div>
        </div>

        {/* Media Type Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setMediaTypeFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mediaTypeFilter === 'all'
                ? 'bg-violet-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tous ({worksWithMedia.length})
          </button>
          <button
            onClick={() => setMediaTypeFilter('video')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mediaTypeFilter === 'video'
                ? 'bg-red-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🎥 Vidéos ({mediaTypeCounts.video})
          </button>
          <button
            onClick={() => setMediaTypeFilter('image')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mediaTypeFilter === 'image'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🖼️ Images ({mediaTypeCounts.image})
          </button>
          <button
            onClick={() => setMediaTypeFilter('webpage')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mediaTypeFilter === 'webpage'
                ? 'bg-green-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🔗 Pages web ({mediaTypeCounts.webpage})
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {sortedWorks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-600 text-lg">Aucun média disponible</p>
            <p className="text-sm text-slate-400 mt-2">
              Essayez de modifier vos filtres
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedWorks.map((work) => (
              <div
                key={work.id}
                className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-violet-400"
                onClick={() => onOpenLightbox(work.id)}
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-slate-200 relative overflow-hidden">
                  {work.mediaInfo?.thumbnail ? (
                    <img
                      src={work.mediaInfo.thumbnail}
                      alt={work.titre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {work.mediaInfo?.type === 'youtube' || work.mediaInfo?.type === 'vimeo' ? '🎥' :
                       work.mediaInfo?.type === 'image' ? '🖼️' : '🔗'}
                    </div>
                  )}
                  
                  {/* Media Type Badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                    {work.mediaInfo?.type === 'youtube' || work.mediaInfo?.type === 'vimeo' ? '🎥 Vidéo' :
                     work.mediaInfo?.type === 'image' ? '🖼️ Image' : '🔗 Web'}
                  </div>

                  {/* Bookmark Badge */}
                  {bookmarked.has(work.id) && (
                    <div className="absolute top-2 left-2 text-2xl">⭐</div>
                  )}
                </div>

                {/* Info Overlay */}
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-slate-800 line-clamp-2 mb-1">
                    {work.titre}
                  </h3>
                  {work.createur && (
                    <p className="text-xs text-slate-500 line-clamp-1">{work.createur}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">{work.annee || '—'}</span>
                    {work.emotions && work.emotions.length > 0 && (
                      <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded">
                        {work.emotions[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Actions (appear on hover) */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(work.id);
                      }}
                      className="px-3 py-2 bg-white text-slate-800 rounded-lg text-sm font-medium hover:bg-slate-100"
                    >
                      👁️ Détails
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(work.id);
                      }}
                      className="px-3 py-2 bg-white text-slate-800 rounded-lg text-sm font-medium hover:bg-slate-100"
                    >
                      {bookmarked.has(work.id) ? '⭐' : '☆'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
