import { useState, useMemo } from "react";
import { useStore } from "../store/useStore";
import works from "../data/works.json";
import EmotionalArcVisualizer from "./EmotionalArcVisualizer";
import type { CustomJourney } from "../store/useStore";

export default function JourneyBuilder() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const customJourneys = useStore((s) => s.customJourneys);
  const addCustomJourney = useStore((s) => s.addCustomJourney);
  const updateCustomJourney = useStore((s) => s.updateCustomJourney);
  const deleteCustomJourney = useStore((s) => s.deleteCustomJourney);
  const bookmarked = useStore((s) => s.bookmarked);
  const setSelectedId = useStore((s) => s.setSelectedId);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedWorks, setSelectedWorks] = useState<string[]>([]);
  const [transitions, setTransitions] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState("");

  const bookmarkedWorks = useMemo(
    () => works.filter((w) => bookmarked.has(w.id)),
    [bookmarked]
  );

  const availableWorks = useMemo(() => {
    if (!searchQuery) return bookmarkedWorks;
    const query = searchQuery.toLowerCase();
    return bookmarkedWorks.filter(
      (w) =>
        w.titre.toLowerCase().includes(query) ||
        w.createur?.toLowerCase().includes(query) ||
        w.medium?.toLowerCase().includes(query)
    );
  }, [bookmarkedWorks, searchQuery]);

  const startCreate = () => {
    setMode("create");
    setTitle("");
    setDescription("");
    setSelectedWorks([]);
    setTransitions({});
    setSearchQuery("");
  };

  const startEdit = (journey: CustomJourney) => {
    setMode("edit");
    setEditingId(journey.id);
    setTitle(journey.title);
    setDescription(journey.description);
    setSelectedWorks([...journey.workIds]);
    setTransitions({ ...journey.transitions });
    setSearchQuery("");
  };

  const handleSave = () => {
    if (!title.trim() || selectedWorks.length === 0) {
      alert("Veuillez ajouter un titre et au moins une œuvre.");
      return;
    }

    if (mode === "edit" && editingId) {
      updateCustomJourney(editingId, {
        title,
        description,
        workIds: selectedWorks,
        transitions,
      });
    } else {
      addCustomJourney({
        title,
        description,
        workIds: selectedWorks,
        transitions,
      });
    }

    setMode("list");
    setEditingId(null);
  };

  const handleCancel = () => {
    setMode("list");
    setEditingId(null);
  };

  const addWork = (workId: string) => {
    if (!selectedWorks.includes(workId)) {
      setSelectedWorks([...selectedWorks, workId]);
    }
  };

  const removeWork = (workId: string) => {
    setSelectedWorks(selectedWorks.filter((id) => id !== workId));
    const newTransitions = { ...transitions };
    delete newTransitions[workId];
    setTransitions(newTransitions);
  };

  const moveWork = (fromIndex: number, toIndex: number) => {
    const newWorks = [...selectedWorks];
    const [moved] = newWorks.splice(fromIndex, 1);
    newWorks.splice(toIndex, 0, moved);
    setSelectedWorks(newWorks);
  };

  const setTransition = (workId: string, note: string) => {
    setTransitions({ ...transitions, [workId]: note });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition text-sm font-medium shadow-md"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🎬</span>
          <span>Créer un parcours</span>
        </div>
        {customJourneys.length > 0 && (
          <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs font-bold">
            {customJourneys.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              🎬 {mode === "list" ? "Mes Parcours" : mode === "edit" ? "Modifier le parcours" : "Créer un parcours"}
            </h2>
            <p className="text-sm text-indigo-100 mt-1">
              {mode === "list"
                ? `${customJourneys.length} parcours personnalisé${customJourneys.length !== 1 ? "s" : ""}`
                : "Construisez une séquence narrative d'œuvres"}
            </p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              setMode("list");
            }}
            className="text-white hover:text-indigo-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mode === "list" ? (
            <div className="p-6">
              <div className="mb-6">
                <button
                  onClick={startCreate}
                  className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <span className="text-lg">+</span>
                  <span>Nouveau parcours</span>
                </button>
              </div>

              {customJourneys.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <div className="text-6xl mb-4">🎭</div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">
                    Aucun parcours créé
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Créez des parcours narratifs personnalisés en assemblant des œuvres
                    de votre collection dans un ordre significatif.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customJourneys.map((journey) => {
                    const journeyWorks = journey.workIds
                      .map((id) => works.find((w) => w.id === id))
                      .filter(Boolean);

                    return (
                      <div
                        key={journey.id}
                        className="bg-slate-50 border-2 border-indigo-200 rounded-lg p-4 hover:shadow-lg transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg">
                              {journey.title}
                            </h3>
                            {journey.description && (
                              <p className="text-sm text-slate-600 mt-1">
                                {journey.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(journey)}
                              className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded text-sm font-medium transition"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    "Êtes-vous sûr de vouloir supprimer ce parcours ?"
                                  )
                                ) {
                                  deleteCustomJourney(journey.id);
                                }
                              }}
                              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-slate-500 mb-3">
                          {journeyWorks.length} œuvre{journeyWorks.length !== 1 ? "s" : ""} •
                          Créé le{" "}
                          {new Date(journey.createdAt).toLocaleDateString("fr-FR")}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {journeyWorks.slice(0, 5).map((work) => (
                            <div
                              key={work!.id}
                              className="px-3 py-1 bg-white border border-indigo-200 rounded text-xs cursor-pointer hover:bg-indigo-50"
                              onClick={() => {
                                setSelectedId(work!.id);
                                setIsOpen(false);
                              }}
                            >
                              {work!.titre}
                            </div>
                          ))}
                          {journeyWorks.length > 5 && (
                            <div className="px-3 py-1 bg-slate-200 rounded text-xs text-slate-600">
                              +{journeyWorks.length - 5} autres
                            </div>
                          )}
                        </div>

                        <EmotionalArcVisualizer workIds={journey.workIds} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 p-6">
              {/* Left: Journey Builder */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Titre du parcours *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Du cosmos à l'intime"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez l'intention de ce parcours..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Séquence d'œuvres ({selectedWorks.length})
                  </label>
                  {selectedWorks.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-300 rounded-lg">
                      Ajoutez des œuvres depuis votre collection →
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {selectedWorks.map((workId, index) => {
                        const work = works.find((w) => w.id === workId);
                        if (!work) return null;

                        return (
                          <div
                            key={workId}
                            className="bg-white border-2 border-indigo-200 rounded-lg p-3"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() =>
                                    index > 0 && moveWork(index, index - 1)
                                  }
                                  disabled={index === 0}
                                  className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                                >
                                  ▲
                                </button>
                                <span className="text-xs font-bold text-slate-500">
                                  {index + 1}
                                </span>
                                <button
                                  onClick={() =>
                                    index < selectedWorks.length - 1 &&
                                    moveWork(index, index + 1)
                                  }
                                  disabled={index === selectedWorks.length - 1}
                                  className="text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                                >
                                  ▼
                                </button>
                              </div>

                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-bold text-sm text-slate-800">
                                      {work.titre}
                                    </h4>
                                    <p className="text-xs text-slate-600">
                                      {work.createur} • {work.medium}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => removeWork(workId)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    ×
                                  </button>
                                </div>

                                <input
                                  type="text"
                                  value={transitions[workId] || ""}
                                  onChange={(e) =>
                                    setTransition(workId, e.target.value)
                                  }
                                  placeholder="Note de transition (optionnel)..."
                                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {selectedWorks.length > 0 && (
                  <EmotionalArcVisualizer workIds={selectedWorks} />
                )}
              </div>

              {/* Right: Available Works */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Votre collection ({bookmarkedWorks.length} œuvres)
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {bookmarkedWorks.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-sm mb-2">Votre collection est vide</p>
                    <p className="text-xs">
                      Ajoutez des œuvres à votre collection pour créer des parcours
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {availableWorks.map((work) => {
                      const isAdded = selectedWorks.includes(work.id);
                      return (
                        <div
                          key={work.id}
                          className={`bg-white border-2 rounded-lg p-3 transition ${
                            isAdded
                              ? "border-green-300 bg-green-50"
                              : "border-slate-200 hover:border-indigo-300 cursor-pointer"
                          }`}
                          onClick={() => !isAdded && addWork(work.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-sm text-slate-800">
                                {work.titre}
                              </h4>
                              <p className="text-xs text-slate-600 mt-1">
                                {work.createur} • {work.medium}
                              </p>
                            </div>
                            {isAdded && (
                              <span className="text-green-600 text-sm">✓</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {mode !== "list" && (
          <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3 bg-slate-50">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
            >
              {mode === "edit" ? "Enregistrer" : "Créer le parcours"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
