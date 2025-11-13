import { useState } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";

interface Playlist {
  id: string;
  name: string;
  description: string;
  workIds: string[];
  createdAt: number;
}

export default function CuratedPlaylistBuilder() {
  const [isOpen, setIsOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem("playtime_playlists");
    return saved ? JSON.parse(saved) : [];
  });
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  
  const pinned = useStore(s => s.pinned);
  const setSelectedId = useStore(s => s.setSelectedId);
  const setPinned = useStore(s => s.setPinned);

  const all = data as any[];

  const createPlaylist = () => {
    if (!newName.trim()) return;

    const playlist: Playlist = {
      id: Date.now().toString(),
      name: newName,
      description: newDescription,
      workIds: Array.from(pinned),
      createdAt: Date.now(),
    };

    const updated = [...playlists, playlist];
    setPlaylists(updated);
    localStorage.setItem("playtime_playlists", JSON.stringify(updated));
    
    setNewName("");
    setNewDescription("");
    setPinned(new Set());
  };

  const deletePlaylist = (id: string) => {
    const updated = playlists.filter(p => p.id !== id);
    setPlaylists(updated);
    localStorage.setItem("playtime_playlists", JSON.stringify(updated));
  };

  const loadPlaylist = (playlist: Playlist) => {
    setPinned(new Set(playlist.workIds));
    setIsOpen(false);
  };

  const exportPlaylist = (playlist: Playlist) => {
    const works = playlist.workIds
      .map(id => all.find(w => w.id === id))
      .filter(Boolean);
    
    const text = `# ${playlist.name}\n\n${playlist.description}\n\n${works.map(w => 
      `## ${w.titre}\n- Créateur: ${w.createur}\n- Type: ${w.type}\n- Année: ${w.annee}\n- ${w.commentaire}\n`
    ).join('\n')}`;

    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playlist.name.replace(/\s+/g, '_')}.md`;
    a.click();
  };

  if (!isOpen) {
    return (
      <div className="space-y-2">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition text-sm font-medium shadow-md"
        >
          <span className="text-lg">📚</span>
          <span>Mes collections</span>
          {playlists.length > 0 && (
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {playlists.length}
            </span>
          )}
        </button>
        {pinned.size > 0 && (
          <div className="text-xs text-slate-600 bg-slate-50 border rounded px-3 py-2">
            <span className="font-medium">{pinned.size}</span> œuvre{pinned.size > 1 ? 's' : ''} épinglée{pinned.size > 1 ? 's' : ''}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              📚 Mes collections curées
            </h2>
            <p className="text-sm text-green-100 mt-1">
              Créez des parcours personnalisés et exportez-les
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-green-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Create new playlist */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-green-900 mb-3">
              ✨ Créer une nouvelle collection
            </h3>
            <p className="text-xs text-green-700 mb-3">
              {pinned.size > 0 
                ? `${pinned.size} œuvre${pinned.size > 1 ? 's' : ''} épinglée${pinned.size > 1 ? 's' : ''} — elles seront ajoutées à votre collection`
                : "Épinglez des œuvres dans la visualisation (📌) puis créez votre collection"}
            </p>
            
            <div className="space-y-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nom de la collection..."
                className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none text-sm"
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description (optionnelle)..."
                rows={2}
                className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none text-sm"
              />
              <button
                onClick={createPlaylist}
                disabled={!newName.trim() || pinned.size === 0}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Créer la collection ({pinned.size} œuvres)
              </button>
            </div>
          </div>

          {/* Existing playlists */}
          {playlists.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg mb-2">📭 Aucune collection</p>
              <p className="text-sm">Créez votre première collection pour commencer</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 mb-3">
                Vos collections ({playlists.length})
              </h3>
              {playlists.map((playlist) => {
                const works = playlist.workIds
                  .map(id => all.find(w => w.id === id))
                  .filter(Boolean);

                return (
                  <div
                    key={playlist.id}
                    className="border-2 border-slate-200 rounded-lg p-4 hover:border-green-400 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 mb-1">
                          {playlist.name}
                        </h4>
                        {playlist.description && (
                          <p className="text-sm text-slate-600 mb-2">
                            {playlist.description}
                          </p>
                        )}
                        <p className="text-xs text-slate-500">
                          {works.length} œuvre{works.length > 1 ? 's' : ''} • 
                          Créée le {new Date(playlist.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {works.slice(0, 5).map(w => (
                        <button
                          key={w.id}
                          onClick={() => {
                            setSelectedId(w.id);
                            setIsOpen(false);
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-xs rounded border"
                          title={w.titre}
                        >
                          {w.titre.length > 30 ? w.titre.slice(0, 30) + '...' : w.titre}
                        </button>
                      ))}
                      {works.length > 5 && (
                        <span className="px-2 py-1 bg-slate-50 text-xs text-slate-500 rounded">
                          +{works.length - 5} autres
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => loadPlaylist(playlist)}
                        className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
                      >
                        📌 Charger
                      </button>
                      <button
                        onClick={() => exportPlaylist(playlist)}
                        className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
                      >
                        💾 Exporter
                      </button>
                      <button
                        onClick={() => deletePlaylist(playlist.id)}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
