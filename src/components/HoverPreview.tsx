import { useState, useEffect } from "react";
import { analyzeMediaUrl, getMediaIcon } from "../lib/media";
import type { WorkNode } from "../lib/types";
import { getEmotionIcon } from "../lib/emotionIcons";
import { getMediumIcon } from "../lib/mediumIcons";

interface HoverPreviewProps {
  work: WorkNode | null;
  x: number;
  y: number;
}

export default function HoverPreview({ work, x, y }: HoverPreviewProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [work?.id]);

  if (!work) return null;

  const mediaInfo = work.lien ? analyzeMediaUrl(work.lien) : null;
  const hasThumbnail = mediaInfo && (mediaInfo.thumbnail || mediaInfo.type === 'image');

  // Position the preview to avoid going off-screen
  const previewWidth = 340;
  const previewHeight = hasThumbnail ? 280 : 180;
  const padding = 20;
  
  let adjustedX = x + 20;
  let adjustedY = y + 20;
  
  if (adjustedX + previewWidth > window.innerWidth - padding) {
    adjustedX = x - previewWidth - 20;
  }
  
  if (adjustedY + previewHeight > window.innerHeight - padding) {
    adjustedY = y - previewHeight - 20;
  }

  return (
    <div
      className="fixed pointer-events-none z-[100]"
      style={{
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
        maxWidth: `${previewWidth}px`,
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl border-2 border-slate-300 overflow-hidden">
        {/* Thumbnail section */}
        {hasThumbnail && !imageError && (
          <div className="relative bg-slate-100 overflow-hidden" style={{ height: '180px' }}>
            <img
              src={mediaInfo.thumbnail}
              alt={work.titre}
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse text-slate-400 text-4xl">
                  {getMediaIcon(mediaInfo.type)}
                </div>
              </div>
            )}
            {/* Media type badge */}
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
              {getMediaIcon(mediaInfo.type)} {mediaInfo.type}
            </div>
          </div>
        )}

        {/* Content section */}
        <div className="p-3">
          <h3 className="font-bold text-sm text-slate-900 leading-tight mb-1 line-clamp-2">
            {work.titre}
          </h3>
          
          {work.createur && (
            <p className="text-xs text-slate-600 mb-2">{work.createur}</p>
          )}

          <div className="flex items-center gap-1.5 mb-2">
            {work.type && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium flex items-center gap-1">
                <span>{getMediumIcon(work.type)}</span>
                <span>{work.type}</span>
              </span>
            )}
            {work.annee && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                📅 {work.annee}
              </span>
            )}
          </div>

          {work.emotions && work.emotions.length > 0 && (
            <div className="mb-2">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Émotions</div>
              <div className="flex flex-wrap gap-1">
                {work.emotions.map((emotion, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                  >
                    {getEmotionIcon(emotion)} {emotion}
                  </span>
                ))}
              </div>
            </div>
          )}

          {work.categories && work.categories.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Catégories</div>
              <div className="flex flex-wrap gap-1">
                {work.categories.slice(0, 3).map((category, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs"
                  >
                    {category}
                  </span>
                ))}
                {work.categories.length > 3 && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                    +{work.categories.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {!hasThumbnail && mediaInfo && mediaInfo.type === 'webpage' && (
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="text-lg">{getMediaIcon('webpage')}</span>
              <span className="truncate">{mediaInfo.originalUrl}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
