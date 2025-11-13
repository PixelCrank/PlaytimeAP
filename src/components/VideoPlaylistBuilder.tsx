import { useState, useMemo } from "react";
import { useStore } from "../store/useStore";
import works from "../data/works.json";
import type { WorkNode } from "../lib/types";
import { analyzeMediaUrl } from "../lib/media";

const entries = works as WorkNode[];

type PlaylistWork = WorkNode & { mediaInfo: ReturnType<typeof analyzeMediaUrl> };

export default function VideoPlaylistBuilder({ onClose }: { onClose: () => void }) {
  const filters = useStore(s => s.filters);
  const bookmarked = useStore(s => s.bookmarked);
  
  const [playlist, setPlaylist] = useState<PlaylistWork[]>([]);
  const [playlistName, setPlaylistName] = useState("Ma playlist");
  const [autoQueueBy, setAutoQueueBy] = useState<'emotion' | 'century' | 'manual'>('manual');

  // Get all video works
  const videoWorks = useMemo(() => {
    return entries
      .filter(w => w.lien && w.lien.trim() !== '')
      .map(w => ({
        ...w,
        mediaInfo: analyzeMediaUrl(w.lien)
      }))
      .filter((w): w is PlaylistWork => 
        w.mediaInfo !== null && (w.mediaInfo.type === 'youtube' || w.mediaInfo.type === 'vimeo')
      );
  }, []);

  // Auto-generate playlist
  const handleAutoQueue = () => {
    let sorted = [...videoWorks];
    
    if (autoQueueBy === 'emotion') {
      // Group by primary emotion
      const emotionGroups: { [key: string]: PlaylistWork[] } = {};
      sorted.forEach(w => {
        const emotion = w.emotions?.[0] || 'autre';
        if (!emotionGroups[emotion]) emotionGroups[emotion] = [];
        emotionGroups[emotion].push(w);
      });
      sorted = Object.values(emotionGroups).flat();
    } else if (autoQueueBy === 'century') {
      // Sort by year
      sorted.sort((a, b) => {
        const aYear = typeof a.annee === 'number' ? a.annee : parseInt(a.annee || '0');
        const bYear = typeof b.annee === 'number' ? b.annee : parseInt(b.annee || '0');
        return aYear - bYear;
      });
    }
    
    setPlaylist(sorted.slice(0, 20)); // Limit to 20 videos
  };

  const addToPlaylist = (work: PlaylistWork) => {
    if (!playlist.find(w => w.id === work.id)) {
      setPlaylist([...playlist, work]);
    }
  };

  const removeFromPlaylist = (workId: string) => {
    setPlaylist(playlist.filter(w => w.id !== workId));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newPlaylist = [...playlist];
    [newPlaylist[index], newPlaylist[index - 1]] = [newPlaylist[index - 1], newPlaylist[index]];
    setPlaylist(newPlaylist);
  };

  const moveDown = (index: number) => {
    if (index === playlist.length - 1) return;
    const newPlaylist = [...playlist];
    [newPlaylist[index], newPlaylist[index + 1]] = [newPlaylist[index + 1], newPlaylist[index]];
    setPlaylist(newPlaylist);
  };

  const generatePlaylistURL = () => {
    const videoIds = playlist
      .map(w => {
        if (w.mediaInfo?.type === 'youtube' && w.lien) {
          return w.lien.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
        }
        return null;
      })
      .filter(Boolean);
    
    if (videoIds.length === 0) return '';
    
    // Create YouTube playlist URL
    const firstVideo = videoIds[0];
    const remainingVideos = videoIds.slice(1).join(',');
    return `https://www.youtube.com/watch?v=${firstVideo}&list=${remainingVideos}`;
  };

  const exportPlaylist = () => {
    const data = {
      name: playlistName,
      created: new Date().toISOString(),
      works: playlist.map(w => ({
        id: w.id,
        titre: w.titre,
        createur: w.createur,
        lien: w.lien,
        emotions: w.emotions,
        annee: w.annee
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playlist-${playlistName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalDuration = playlist.length * 5; // Estimate 5min per video

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Left Panel - Available Videos */}
        <div className="w-1/2 border-r flex flex-col">
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold text-slate-800 mb-2">📹 Vidéos disponibles</h3>
            <p className="text-sm text-slate-500">{videoWorks.length} vidéos</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {videoWorks.slice(0, 50).map(work => {
              const inPlaylist = playlist.find(w => w.id === work.id);
              return (
                <div
                  key={work.id}
                  className={`p-3 rounded-lg border-2 transition ${
                    inPlaylist
                      ? 'border-violet-400 bg-violet-50'
                      : 'border-slate-200 bg-white hover:border-violet-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">
                        {work.titre}
                      </h4>
                      {work.createur && (
                        <p className="text-xs text-slate-500 line-clamp-1">{work.createur}</p>
                      )}
                      {work.emotions && work.emotions.length > 0 && (
                        <span className="text-xs text-violet-600">{work.emotions[0]}</span>
                      )}
                    </div>
                    <button
                      onClick={() => inPlaylist ? removeFromPlaylist(work.id) : addToPlaylist(work)}
                      className={`shrink-0 px-3 py-1 rounded text-xs font-medium ${
                        inPlaylist
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-violet-500 text-white hover:bg-violet-600'
                      }`}
                    >
                      {inPlaylist ? '−' : '+'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Playlist */}
        <div className="w-1/2 flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="text-lg font-bold text-slate-800 bg-transparent border-b-2 border-transparent hover:border-violet-300 focus:border-violet-500 focus:outline-none px-2 py-1"
              />
              <button
                onClick={onClose}
                className="text-2xl text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
              <span>{playlist.length} vidéos</span>
              <span>•</span>
              <span>≈{totalDuration} min</span>
            </div>

            <div className="flex gap-2">
              <select
                value={autoQueueBy}
                onChange={(e) => setAutoQueueBy(e.target.value as any)}
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                <option value="manual">Manuel</option>
                <option value="emotion">Par émotion</option>
                <option value="century">Par chronologie</option>
              </select>
              <button
                onClick={handleAutoQueue}
                className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-medium hover:bg-violet-600"
              >
                Auto-générer
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {playlist.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-2">🎬</div>
                <p className="text-slate-600">Playlist vide</p>
                <p className="text-sm text-slate-400">Ajoutez des vidéos ou auto-générez</p>
              </div>
            ) : (
              playlist.map((work, index) => (
                <div
                  key={work.id}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                >
                  <div className="text-sm font-semibold text-slate-400 w-8 text-center">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">
                      {work.titre}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{work.createur}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === playlist.length - 1}
                      className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeFromPlaylist(work.id)}
                      className="p-1 hover:bg-red-100 text-red-500 rounded text-sm"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t bg-slate-50 space-y-2">
            <button
              onClick={exportPlaylist}
              disabled={playlist.length === 0}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💾 Exporter en JSON
            </button>
            {generatePlaylistURL() && (
              <a
                href={generatePlaylistURL()}
                target="_blank"
                rel="noreferrer"
                className="block w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 text-center"
              >
                ▶️ Lire sur YouTube
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
