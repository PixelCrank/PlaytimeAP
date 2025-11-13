import { useState, useMemo } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";

export default function CrossMediumRemix() {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceWork, setSourceWork] = useState<any | null>(null);
  const [remixes, setRemixes] = useState<any[]>([]);
  const setSelectedId = useStore(s => s.setSelectedId);

  const all = data as any[];

  const handleSelectSource = (work: any) => {
    setSourceWork(work);

    // Find works from OTHER media with similar emotional/thematic DNA
    const matches = all
      .filter(w => w.id !== work.id && w.type !== work.type)
      .map(w => {
        // Calculate similarity score
        let score = 0;

        // Emotion overlap (weighted heavily)
        const sharedEmotions = (w.emotions || []).filter((e: string) =>
          work.emotions?.includes(e)
        );
        score += sharedEmotions.length * 3;

        // Category overlap
        const sharedCategories = (w.categories || []).filter((c: string) =>
          work.categories?.includes(c)
        );
        score += sharedCategories.length * 2;

        // Same century bonus
        if (w.anneeNum === work.anneeNum) {
          score += 1;
        }

        return {
          work: w,
          score,
          sharedEmotions,
          sharedCategories,
        };
      })
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score);

    // Get top match per medium type
    const byMedium: Record<string, any> = {};
    matches.forEach(match => {
      if (!byMedium[match.work.type] || byMedium[match.work.type].score < match.score) {
        byMedium[match.work.type] = match;
      }
    });

    setRemixes(Object.values(byMedium).slice(0, 5));
  };

  const randomWork = useMemo(() => {
    return all[Math.floor(Math.random() * all.length)];
  }, [all]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition text-sm font-medium shadow-md"
      >
        <span className="text-lg">🎭</span>
        <span>Remix trans-média</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              🎭 Remix trans-média
            </h2>
            <p className="text-sm text-cyan-100 mt-1">
              Si cette œuvre était un film / jeu / roman, ce serait...
            </p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              setSourceWork(null);
              setRemixes([]);
            }}
            className="text-white hover:text-cyan-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!sourceWork ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-slate-600 mb-4">
                  Choisissez une œuvre pour découvrir ses équivalents dans d'autres médias
                </p>

                <button
                  onClick={() => handleSelectSource(randomWork)}
                  className="w-full p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg hover:border-blue-400 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🎲</div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-cyan-900 mb-1">
                        Œuvre aléatoire
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {randomWork.titre}
                      </p>
                      <p className="text-sm text-slate-600">
                        {randomWork.createur} • {randomWork.type}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3">
                  Ou parcourez le catalogue :
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {all.slice(0, 50).map((work) => (
                    <button
                      key={work.id}
                      onClick={() => handleSelectSource(work)}
                      className="text-left p-3 border rounded-lg hover:border-cyan-400 hover:shadow-sm transition"
                    >
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">
                        {work.titre}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {work.createur} • {work.type}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <button
                  onClick={() => {
                    setSourceWork(null);
                    setRemixes([]);
                  }}
                  className="text-sm text-cyan-600 hover:text-cyan-800 mb-3"
                >
                  ← Choisir une autre œuvre
                </button>

                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-400 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">🎬</div>
                    <div className="flex-1">
                      <div className="px-2 py-0.5 bg-cyan-600 text-white text-xs rounded-full inline-block mb-2">
                        ŒUVRE SOURCE • {sourceWork.type}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {sourceWork.titre}
                      </h3>
                      <p className="text-sm text-slate-700 mb-3">
                        {sourceWork.createur} • {sourceWork.annee}
                      </p>
                      {sourceWork.commentaire && (
                        <p className="text-sm text-slate-600 italic mb-3">
                          {sourceWork.commentaire}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {sourceWork.emotions?.map((e: string) => (
                          <span key={e} className="px-2 py-1 bg-purple-100 text-purple-900 text-xs rounded-full font-medium">
                            {e}
                          </span>
                        ))}
                        {sourceWork.categories?.slice(0, 2).map((c: string) => (
                          <span key={c} className="px-2 py-1 bg-blue-100 text-blue-900 text-xs rounded">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span>🔀</span>
                  <span>Équivalents trans-média</span>
                  <span className="text-sm font-normal text-slate-600">
                    ({remixes.length} trouvés)
                  </span>
                </h3>
              </div>

              {remixes.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-lg mb-2">🤔 Aucune correspondance forte</p>
                  <p className="text-sm">Cette œuvre a un profil unique dans le corpus</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {remixes.map((remix, idx) => (
                    <div
                      key={remix.work.id}
                      className="border-2 rounded-lg p-4 hover:border-cyan-400 hover:shadow-md transition cursor-pointer"
                      onClick={() => {
                        setSelectedId(remix.work.id);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-xs rounded font-medium">
                              {remix.work.type}
                            </span>
                            <span className="text-xs text-slate-500">
                              Match: {remix.score} pts
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-1">
                            {remix.work.titre}
                          </h4>
                          <p className="text-sm text-slate-600 mb-3">
                            {remix.work.createur} • {remix.work.annee}
                          </p>

                          <div className="bg-slate-50 rounded p-3 mb-3">
                            <p className="text-xs font-semibold text-slate-700 mb-2">
                              🧬 ADN partagé :
                            </p>
                            <div className="space-y-2">
                              {remix.sharedEmotions.length > 0 && (
                                <div>
                                  <p className="text-xs text-slate-600 mb-1">Émotions:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {remix.sharedEmotions.map((e: string) => (
                                      <span key={e} className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                                        {e}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {remix.sharedCategories.length > 0 && (
                                <div>
                                  <p className="text-xs text-slate-600 mb-1">Thèmes:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {remix.sharedCategories.map((c: string) => (
                                      <span key={c} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                        {c}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {remix.work.commentaire && (
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {remix.work.commentaire}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm text-slate-700">
                  <strong>💡 Comment ça marche ?</strong> L'algorithme compare les émotions 
                  et thèmes de chaque œuvre pour trouver des correspondances dans d'autres médias. 
                  Plus le score est élevé, plus l'ADN temporel est similaire.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
