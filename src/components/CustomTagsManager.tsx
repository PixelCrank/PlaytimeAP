import { useState } from "react";
import { useStore } from "../store/useStore";
import works from "../data/works.json";
import type { WorkNode } from "../lib/types";

const entries = works as WorkNode[];

const PRESET_COLORS = [
  "#ef4444", "#f59e0b", "#10b981", "#3b82f6", 
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
];

export default function CustomTagsManager({ onClose }: { onClose: () => void }) {
  const customTags = useStore(s => s.customTags);
  const addCustomTag = useStore(s => s.addCustomTag);
  const updateCustomTag = useStore(s => s.updateCustomTag);
  const deleteCustomTag = useStore(s => s.deleteCustomTag);
  const addWorkToTag = useStore(s => s.addWorkToTag);
  const removeWorkFromTag = useStore(s => s.removeWorkFromTag);
  const setFilters = useStore(s => s.setFilters);
  const filters = useStore(s => s.filters);
  
  const [newTagLabel, setNewTagLabel] = useState("");
  const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [searchWorkQuery, setSearchWorkQuery] = useState("");
  const [selectedTagForWork, setSelectedTagForWork] = useState<string | null>(null);

  const handleCreateTag = () => {
    if (newTagLabel.trim()) {
      addCustomTag(newTagLabel.trim(), newTagColor);
      setNewTagLabel("");
      setNewTagColor(PRESET_COLORS[0]);
    }
  };

  const handleDeleteTag = (tagId: string) => {
    if (confirm("Supprimer ce tag ?")) {
      deleteCustomTag(tagId);
    }
  };

  const getWorkTitle = (workId: string) => {
    const work = entries.find(w => w.id === workId);
    return work?.titre || "Œuvre inconnue";
  };

  const filteredWorks = searchWorkQuery
    ? entries.filter(w => 
        w.titre.toLowerCase().includes(searchWorkQuery.toLowerCase()) ||
        w.createur?.toLowerCase().includes(searchWorkQuery.toLowerCase())
      ).slice(0, 20)
    : [];

  const handleAddWorkToTag = (tagId: string, workId: string) => {
    addWorkToTag(tagId, workId);
    setSearchWorkQuery("");
    setSelectedTagForWork(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              🏷️ Tags personnalisés
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Créez vos propres catégories pour organiser les œuvres
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-slate-600 px-2"
          >
            ×
          </button>
        </div>

        {/* Create New Tag */}
        <div className="p-6 border-b bg-slate-50">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Créer un nouveau tag</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTagLabel}
              onChange={(e) => setNewTagLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
              placeholder="Nom du tag..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <div className="flex gap-1">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    newTagColor === color ? 'border-slate-800 scale-110' : 'border-transparent'
                  } transition-all`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <button
              onClick={handleCreateTag}
              disabled={!newTagLabel.trim()}
              className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer
            </button>
          </div>
        </div>

        {/* Tags List */}
        <div className="overflow-y-auto flex-1 p-6">
          {customTags.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏷️</div>
              <p className="text-slate-600">Aucun tag créé</p>
              <p className="text-sm text-slate-400 mt-2">
                Créez des tags pour organiser vos œuvres favorites
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {customTags.map(tag => (
                <div
                  key={tag.id}
                  className="border-2 rounded-xl overflow-hidden"
                  style={{ borderColor: tag.color }}
                >
                  <div className="p-4 flex items-center justify-between" style={{ backgroundColor: tag.color + '10' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: tag.color }} />
                      <h4 className="font-semibold text-slate-800">{tag.label}</h4>
                      <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded">
                        {tag.workIds.length} œuvre{tag.workIds.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedTagForWork(selectedTagForWork === tag.id ? null : tag.id)}
                        className="px-3 py-1 text-sm bg-white rounded-lg hover:bg-slate-50 border"
                      >
                        + Ajouter œuvre
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Add Work to Tag */}
                  {selectedTagForWork === tag.id && (
                    <div className="p-4 border-t bg-white">
                      <input
                        type="text"
                        value={searchWorkQuery}
                        onChange={(e) => setSearchWorkQuery(e.target.value)}
                        placeholder="Rechercher une œuvre par titre ou créateur..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 mb-2"
                      />
                      {searchWorkQuery && (
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {filteredWorks.map(work => (
                            <button
                              key={work.id}
                              onClick={() => handleAddWorkToTag(tag.id, work.id)}
                              disabled={tag.workIds.includes(work.id)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {work.titre} {work.createur && `— ${work.createur}`}
                              {tag.workIds.includes(work.id) && <span className="text-green-600 ml-2">✓</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Works with this tag */}
                  {tag.workIds.length > 0 && (
                    <div className="p-4 border-t bg-white">
                      <div className="flex flex-wrap gap-2">
                        {tag.workIds.map(workId => (
                          <div
                            key={workId}
                            className="group flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-sm hover:bg-slate-100"
                          >
                            <span className="text-slate-700">{getWorkTitle(workId)}</span>
                            <button
                              onClick={() => removeWorkFromTag(tag.id, workId)}
                              className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
