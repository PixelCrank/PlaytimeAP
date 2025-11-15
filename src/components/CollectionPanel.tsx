import { useMemo, useState } from "react";
import { useStore } from "../store/useStore";
import works from "../data/works.json";
import type { Work } from "../lib/types";

type SortOption = "recent" | "title" | "year" | "emotion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CollectionPanel({ isOpen, onClose }: Props) {
  const bookmarked = useStore((s) => s.bookmarked);
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const setSelectedId = useStore((s) => s.setSelectedId);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterEmotion, setFilterEmotion] = useState<string>("");

  const bookmarkedWorks = useMemo(() => {
    let filtered = works.filter((w) => bookmarked.has(w.id));

    // Filter by emotion if selected
    if (filterEmotion) {
      filtered = filtered.filter((w) =>
        w.emotions?.some((e) => e.toLowerCase().includes(filterEmotion.toLowerCase()))
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.titre.localeCompare(b.titre);
        case "year":
          return (parseInt(a.annee || "0") || 0) - (parseInt(b.annee || "0") || 0);
        case "emotion":
          return (a.emotions?.[0] || "").localeCompare(b.emotions?.[0] || "");
        case "recent":
        default:
          return 0; // Keep insertion order
      }
    });

    return sorted;
  }, [bookmarked, sortBy, filterEmotion]);

  const exportCollection = () => {
    const exportData = bookmarkedWorks.map((w) => ({
      titre: w.titre,
      createur: w.createur,
      annee: w.annee,
      medium: w.medium,
      categories: w.categories,
      emotions: w.emotions,
      commentaire: w.commentaire,
      lien: w.lien,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `playtime-collection-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsText = () => {
    const text = bookmarkedWorks
      .map(
        (w, i) =>
          `${i + 1}. ${w.titre} (${w.createur}, ${w.annee})\n   ${w.medium} • ${w.categories?.join(", ")}\n   ${w.commentaire || ""}\n   ${w.lien || ""}\n`
      )
      .join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `playtime-collection-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uniqueEmotions = useMemo(() => {
    const emotions = new Set<string>();
    bookmarkedWorks.forEach((w) => {
      w.emotions?.forEach((e) => emotions.add(e));
    });
    return Array.from(emotions).sort();
  }, [bookmarkedWorks]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              ⭐ Ma Collection
            </h2>
            <p className="text-sm text-purple-100 mt-1">
              {bookmarked.size} œuvre{bookmarked.size !== 1 ? "s" : ""} sauvegardée
              {bookmarked.size !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {bookmarked.size === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              Votre collection est vide
            </h3>
            <p className="text-slate-500 max-w-md">
              Cliquez sur l'icône ⭐ sur n'importe quelle œuvre pour l'ajouter à votre
              collection personnelle.
            </p>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="border-b border-slate-200 px-6 py-4 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Trier par:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="recent">Ajout récent</option>
                  <option value="title">Titre</option>
                  <option value="year">Année</option>
                  <option value="emotion">Émotion</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">Émotion:</label>
                <select
                  value={filterEmotion}
                  onChange={(e) => setFilterEmotion(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Toutes</option>
                  {uniqueEmotions.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ml-auto flex gap-2">
                <button
                  onClick={exportAsText}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition"
                >
                  📄 Export TXT
                </button>
                <button
                  onClick={exportCollection}
                  className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition"
                >
                  💾 Export JSON
                </button>
              </div>
            </div>

            {/* Works Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {bookmarkedWorks.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p>Aucune œuvre ne correspond aux filtres sélectionnés.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarkedWorks.map((work) => (
                    <div
                      key={work.id}
                      className="bg-white border-2 border-purple-200 rounded-lg p-4 hover:shadow-lg transition group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className="font-bold text-slate-800 text-sm leading-tight cursor-pointer hover:text-purple-600"
                          onClick={() => {
                            setSelectedId(work.id);
                            onClose();
                          }}
                        >
                          {work.titre}
                        </h3>
                        <button
                          onClick={() => toggleBookmark(work.id)}
                          className="text-purple-600 hover:text-purple-800 text-lg leading-none"
                          title="Retirer de la collection"
                        >
                          ⭐
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 mb-2">
                        {work.createur} • {work.annee}
                      </p>

                      <div className="text-xs text-slate-500 mb-2">
                        <span className="font-semibold">{work.medium}</span>
                      </div>

                      {work.emotions && work.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {work.emotions.slice(0, 3).map((e, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
                            >
                              {e}
                            </span>
                          ))}
                        </div>
                      )}

                      {work.commentaire && (
                        <p className="text-xs text-slate-600 line-clamp-2 mt-2">
                          {work.commentaire}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
