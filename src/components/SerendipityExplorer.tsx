import { useMemo, useState } from "react";
import data from "../data/works.json";

interface ConnectionNode {
  id: string;
  title: string;
  sharedWith: string[];
  emotions: string[];
  categories: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SerendipityExplorer({ isOpen, onClose }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const all = data as any[];

  const findConnections = (workId: string) => {
    const work = all.find(w => w.id === workId);
    if (!work) return [];

    const workEmotions = new Set(work.emotions || []);
    const workCategories = new Set(work.categories || []);

    // Find works that share emotions OR categories but are different media
    const connections = all
      .filter(w => w.id !== workId && w.type !== work.type)
      .map(w => {
        const sharedEmotions = (w.emotions || []).filter((e: string) => workEmotions.has(e));
        const sharedCategories = (w.categories || []).filter((c: string) => workCategories.has(c));
        
        return {
          work: w,
          shared: [...sharedEmotions, ...sharedCategories],
          score: sharedEmotions.length * 2 + sharedCategories.length,
        };
      })
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    return connections;
  };

  const randomWork = useMemo(() => {
    return all[Math.floor(Math.random() * all.length)];
  }, [all]);

  const connections = useMemo(() => {
    return selectedId ? findConnections(selectedId) : findConnections(randomWork.id);
  }, [selectedId, randomWork]);

  const currentWork = selectedId ? all.find(w => w.id === selectedId) : randomWork;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              ✨ Mode Sérendipité
            </h2>
            <p className="text-sm text-pink-100 mt-1">
              Découvrez des connexions inattendues entre médiums
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-pink-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Current work */}
          <div className="mb-6 p-4 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-purple-300 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="inline-block px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full font-medium mb-2">
                  Point de départ
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {currentWork?.titre}
                </h3>
                <p className="text-sm text-slate-700 mb-2">
                  {currentWork?.createur} • <span className="font-semibold">{currentWork?.type}</span>
                </p>
                {currentWork?.commentaire && (
                  <p className="text-sm text-slate-600 italic mb-3">
                    {currentWork.commentaire}
                  </p>
                )}
                <div className="flex flex-wrap gap-1">
                  {currentWork?.emotions?.map((e: string) => (
                    <span key={e} className="px-2 py-1 bg-purple-100 text-purple-900 text-xs rounded-full font-medium">
                      {e}
                    </span>
                  ))}
                  {currentWork?.categories?.map((c: string) => (
                    <span key={c} className="px-2 py-1 bg-pink-100 text-pink-900 text-xs rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  const newWork = all[Math.floor(Math.random() * all.length)];
                  setSelectedId(newWork.id);
                }}
                className="px-3 py-1.5 bg-white border-2 border-purple-400 text-purple-700 rounded-lg hover:bg-purple-50 transition text-sm font-medium"
              >
                🎲 Autre départ
              </button>
            </div>
          </div>

          {/* Connections */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              🌉 Connexions trans-média ({connections.length})
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Ces œuvres d'autres médiums partagent des émotions ou thèmes similaires
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {connections.map(({ work, shared, score }) => (
              <div
                key={work.id}
                className="p-4 border-2 border-slate-200 rounded-lg hover:border-purple-400 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedId(work.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {work.titre}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {work.createur} • <span className="font-semibold">{work.type}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full">
                    <span className="text-xs font-bold text-purple-700">{score}</span>
                    <span className="text-xs text-purple-600">pts</span>
                  </div>
                </div>

                <div className="mb-2">
                  <p className="text-xs text-slate-500 font-medium mb-1">Points communs :</p>
                  <div className="flex flex-wrap gap-1">
                    {shared.map((s: string) => (
                      <span key={s} className="px-2 py-0.5 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 text-xs rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {work.commentaire && (
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2">
                    {work.commentaire}
                  </p>
                )}
              </div>
            ))}
          </div>

          {connections.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p>Aucune connexion trouvée. Essayez un autre point de départ !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
