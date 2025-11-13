import { useMemo } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";
import type { WorkNode } from "../lib/types";

export default function WorkComparisonPanel() {
  const comparisonWorkIds = useStore(s => s.comparisonWorkIds);
  const removeFromComparison = useStore(s => s.removeFromComparison);
  const clearComparison = useStore(s => s.clearComparison);
  const setSelectedId = useStore(s => s.setSelectedId);

  const works = useMemo(() => {
    const allWorks = data as WorkNode[];
    return comparisonWorkIds.map(id => allWorks.find(w => w.id === id)).filter(Boolean) as WorkNode[];
  }, [comparisonWorkIds]);

  const comparison = useMemo(() => {
    if (works.length < 2) return null;

    const [work1, work2] = works;

    // Emotion comparison
    const emotions1 = new Set(work1.emotions || []);
    const emotions2 = new Set(work2.emotions || []);
    const sharedEmotions = [...emotions1].filter(e => emotions2.has(e));
    const uniqueEmotions1 = [...emotions1].filter(e => !emotions2.has(e));
    const uniqueEmotions2 = [...emotions2].filter(e => !emotions1.has(e));

    // Category comparison
    const categories1 = new Set(work1.categories || []);
    const categories2 = new Set(work2.categories || []);
    const sharedCategories = [...categories1].filter(c => categories2.has(c));
    const uniqueCategories1 = [...categories1].filter(c => !categories2.has(c));
    const uniqueCategories2 = [...categories2].filter(c => !categories1.has(c));

    // Temporal distance
    const year1 = work1.annee ? parseInt(work1.annee.match(/\d{4}/)?.[0] || '0') : 0;
    const year2 = work2.annee ? parseInt(work2.annee.match(/\d{4}/)?.[0] || '0') : 0;
    const temporalDistance = year1 && year2 ? Math.abs(year1 - year2) : null;

    // Similarity score
    const emotionScore = sharedEmotions.length * 3;
    const categoryScore = sharedCategories.length * 2;
    const mediumScore = work1.type === work2.type ? 2 : 0;
    const centuryScore = work1.anneeNum === work2.anneeNum ? 1 : 0;
    const totalScore = emotionScore + categoryScore + mediumScore + centuryScore;
    const maxPossible = (Math.max(emotions1.size, emotions2.size) * 3) + 
                        (Math.max(categories1.size, categories2.size) * 2) + 3;
    const similarityPercent = Math.round((totalScore / maxPossible) * 100);

    return {
      sharedEmotions,
      uniqueEmotions1,
      uniqueEmotions2,
      sharedCategories,
      uniqueCategories1,
      uniqueCategories2,
      temporalDistance,
      similarityPercent,
      totalScore,
      sameMedium: work1.type === work2.type,
      sameCentury: work1.anneeNum === work2.anneeNum,
      sameRealm: work1.realm === work2.realm,
    };
  }, [works]);

  if (works.length === 0) {
    return (
      <div className="fixed bottom-6 right-6 bg-white border-2 border-indigo-300 rounded-2xl shadow-2xl p-6 w-96 z-50">
        <div className="text-center">
          <div className="text-4xl mb-3">⚖️</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Comparaison d'œuvres</h3>
          <p className="text-sm text-slate-600 mb-3">
            Sélectionnez 2 œuvres pour analyser leurs similitudes et différences
          </p>
          <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
            <strong>Astuce :</strong> Clic droit sur une œuvre dans la carte et choisissez "Comparer"
          </div>
        </div>
      </div>
    );
  }

  if (works.length === 1) {
    return (
      <div className="fixed bottom-6 right-6 bg-white border-2 border-indigo-300 rounded-2xl shadow-2xl p-6 w-96 z-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <h3 className="text-lg font-bold text-slate-900">Comparaison</h3>
          </div>
          <button
            onClick={clearComparison}
            className="text-slate-400 hover:text-slate-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="font-medium text-slate-900 mb-1">{works[0].titre}</div>
              <div className="text-xs text-slate-600">{works[0].createur}</div>
              <div className="text-xs text-slate-500 mt-1">{works[0].type} • {works[0].annee}</div>
            </div>
            <button
              onClick={() => removeFromComparison(works[0].id)}
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-slate-600">
          Sélectionnez une deuxième œuvre pour comparer
        </div>
      </div>
    );
  }

  // Two works selected
  return (
    <div className="fixed bottom-6 right-6 bg-white border-2 border-indigo-300 rounded-2xl shadow-2xl p-6 w-[600px] max-h-[80vh] overflow-y-auto z-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚖️</span>
          <h3 className="text-lg font-bold text-slate-900">Comparaison d'œuvres</h3>
        </div>
        <button
          onClick={clearComparison}
          className="text-slate-400 hover:text-slate-600 text-xl"
        >
          ×
        </button>
      </div>

      {/* Similarity Score */}
      <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl p-4 mb-4 border-2 border-violet-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-violet-900">Similarité globale</span>
          <span className="text-2xl font-bold text-violet-900">{comparison?.similarityPercent}%</span>
        </div>
        <div className="w-full bg-white/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all"
            style={{ width: `${comparison?.similarityPercent}%` }}
          />
        </div>
        <div className="mt-2 flex gap-2 flex-wrap text-xs">
          {comparison?.sameMedium && (
            <span className="px-2 py-1 bg-white/60 rounded">Même médium</span>
          )}
          {comparison?.sameCentury && (
            <span className="px-2 py-1 bg-white/60 rounded">Même siècle</span>
          )}
          {comparison?.sameRealm && (
            <span className="px-2 py-1 bg-white/60 rounded">Même royaume</span>
          )}
        </div>
      </div>

      {/* Works Side by Side */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {works.map((work, idx) => (
          <div 
            key={work.id}
            className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 pr-2">
                <button
                  onClick={() => setSelectedId(work.id)}
                  className="font-medium text-slate-900 text-left hover:text-indigo-600 transition"
                >
                  {work.titre}
                </button>
                <div className="text-xs text-slate-600 mt-1">{work.createur}</div>
              </div>
              <button
                onClick={() => removeFromComparison(work.id)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ×
              </button>
            </div>
            <div className="text-xs text-slate-500 flex flex-wrap gap-1">
              <span className="px-1.5 py-0.5 bg-white rounded">{work.type}</span>
              <span className="px-1.5 py-0.5 bg-white rounded">{work.annee}</span>
              <span className="px-1.5 py-0.5 bg-white rounded">{work.realm}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Temporal Distance */}
      {comparison && comparison.temporalDistance !== null && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">📅</span>
            <span className="text-blue-900">
              <strong>{comparison.temporalDistance} ans</strong> séparent ces deux œuvres
            </span>
          </div>
        </div>
      )}

      {/* Shared Emotions */}
      {comparison && comparison.sharedEmotions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span>🎭</span>
            Émotions partagées ({comparison.sharedEmotions.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {comparison.sharedEmotions.map(emotion => (
              <span 
                key={emotion}
                className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-full text-sm text-green-900 font-medium"
              >
                {emotion}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Unique Emotions Venn */}
      {comparison && (comparison.uniqueEmotions1.length > 0 || comparison.uniqueEmotions2.length > 0) && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Émotions uniques</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-600 mb-1">Uniquement dans {works[0].titre.slice(0, 20)}...</div>
              <div className="flex flex-wrap gap-1">
                {comparison.uniqueEmotions1.map(emotion => (
                  <span 
                    key={emotion}
                    className="px-2 py-0.5 bg-slate-100 border rounded text-xs text-slate-700"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-600 mb-1">Uniquement dans {works[1].titre.slice(0, 20)}...</div>
              <div className="flex flex-wrap gap-1">
                {comparison.uniqueEmotions2.map(emotion => (
                  <span 
                    key={emotion}
                    className="px-2 py-0.5 bg-slate-100 border rounded text-xs text-slate-700"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Categories */}
      {comparison && comparison.sharedCategories.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span>🧬</span>
            Thèmes partagés ({comparison.sharedCategories.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {comparison.sharedCategories.map(category => (
              <span 
                key={category}
                className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-full text-sm text-purple-900 font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Unique Categories */}
      {comparison && (comparison.uniqueCategories1.length > 0 || comparison.uniqueCategories2.length > 0) && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Thèmes uniques</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex flex-wrap gap-1">
                {comparison.uniqueCategories1.map(category => (
                  <span 
                    key={category}
                    className="px-2 py-0.5 bg-slate-100 border rounded text-xs text-slate-700"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap gap-1">
                {comparison.uniqueCategories2.map(category => (
                  <span 
                    key={category}
                    className="px-2 py-0.5 bg-slate-100 border rounded text-xs text-slate-700"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interpretation */}
      {comparison && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-900 mb-1">Interprétation</h4>
              <p className="text-sm text-amber-800">
                {comparison.similarityPercent >= 70 ? (
                  <>Ces œuvres partagent une <strong>ADN culturel très proche</strong> malgré leurs différences de médium ou d'époque. Elles explorent des territoires émotionnels et thématiques similaires.</>
                ) : comparison.similarityPercent >= 40 ? (
                  <>Ces œuvres présentent des <strong>convergences thématiques notables</strong> tout en maintenant des identités distinctes. Elles dialoguent autour de préoccupations communes.</>
                ) : (
                  <>Ces œuvres sont <strong>très différentes</strong> dans leur approche du temps. Leur comparaison révèle la diversité des représentations temporelles dans le corpus.</>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
