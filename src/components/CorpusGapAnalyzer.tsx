import { useMemo, useState } from "react";
import data from "../data/works.json";
import { useStore } from "../store/useStore";
import { buildPredicateWithCentury } from "../lib/filters";

interface Gap {
  type: "emotion-category" | "medium-realm" | "century-emotion" | "missing-connections";
  title: string;
  description: string;
  count: number;
  examples?: string[];
  suggestion: string;
}

export default function CorpusGapAnalyzer({ isOpen, onClose }: Props) {
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);

  const all = data as any[];
  const filtered = useMemo(
    () => all.filter(buildPredicateWithCentury(filters, centuryFilter)),
    [all, filters, centuryFilter]
  );

  const gaps = useMemo(() => {
    const results: Gap[] = [];

    // 1. Underrepresented emotion-category pairs
    const emotionCategoryPairs: Record<string, number> = {};
    filtered.forEach(work => {
      work.emotions?.forEach((e: string) => {
        work.categories?.forEach((c: string) => {
          const key = `${e}::${c}`;
          emotionCategoryPairs[key] = (emotionCategoryPairs[key] || 0) + 1;
        });
      });
    });

    // Find rare but interesting combinations
    const rarePairs = Object.entries(emotionCategoryPairs)
      .filter(([_, count]) => count <= 3)
      .slice(0, 5);

    if (rarePairs.length > 0) {
      results.push({
        type: "emotion-category",
        title: "Combinaisons émotions-thèmes rares",
        description: "Ces associations existent mais sont sous-explorées dans le corpus",
        count: rarePairs.length,
        examples: rarePairs.map(([pair]) => pair.replace('::', ' × ')),
        suggestion: "Recherchez ou créez des œuvres explorant ces associations uniques",
      });
    }

    // 2. Medium gaps by realm
    const mediumsByRealm: Record<string, Record<string, number>> = {
      cosmic: {},
      human: {},
      disrupted: {},
    };

    filtered.forEach(work => {
      const realm = work.realm || "human";
      mediumsByRealm[realm][work.type] = (mediumsByRealm[realm][work.type] || 0) + 1;
    });

    Object.entries(mediumsByRealm).forEach(([realm, mediums]) => {
      const lowRepresented = Object.entries(mediums)
        .filter(([_, count]) => count < 10)
        .map(([medium]) => medium);

      if (lowRepresented.length > 0) {
        results.push({
          type: "medium-realm",
          title: `Médiums sous-représentés (${realm})`,
          description: `Ces médiums ont peu d'œuvres dans le monde "${realm}"`,
          count: lowRepresented.length,
          examples: lowRepresented,
          suggestion: `Enrichir le corpus avec plus de ${lowRepresented.join(', ')} dans le temps ${realm}`,
        });
      }
    });

    // 3. Century-emotion gaps
    const xixEmotions: Record<string, number> = {};
    const xxEmotions: Record<string, number> = {};

    filtered.forEach(work => {
      const target = work.anneeNum === 19 ? xixEmotions : xxEmotions;
      work.emotions?.forEach((e: string) => {
        target[e] = (target[e] || 0) + 1;
      });
    });

    // Find emotions present in one century but not the other
    const xixOnly = Object.keys(xixEmotions).filter(e => !xxEmotions[e]);
    const xxOnly = Object.keys(xxEmotions).filter(e => !xixEmotions[e]);

    if (xixOnly.length > 0) {
      results.push({
        type: "century-emotion",
        title: "Émotions absentes du XXe siècle",
        description: "Ces émotions apparaissent au XIXe mais pas dans les œuvres contemporaines",
        count: xixOnly.length,
        examples: xixOnly,
        suggestion: "Explorer comment ces émotions pourraient être actualisées dans des œuvres contemporaines",
      });
    }

    if (xxOnly.length > 0) {
      results.push({
        type: "century-emotion",
        title: "Émotions absentes du XIXe siècle",
        description: "Ces émotions émergent au XXe siècle",
        count: xxOnly.length,
        examples: xxOnly,
        suggestion: "Comprendre quelles nouveautés culturelles ont fait émerger ces émotions",
      });
    }

    // 4. Isolated works (no shared emotions/categories)
    const isolated = filtered.filter(work => {
      const hasSharedEmotion = filtered.some(other => 
        other.id !== work.id && 
        other.emotions?.some((e: string) => work.emotions?.includes(e))
      );
      const hasSharedCategory = filtered.some(other => 
        other.id !== work.id && 
        other.categories?.some((c: string) => work.categories?.includes(c))
      );
      return !hasSharedEmotion || !hasSharedCategory;
    });

    if (isolated.length > 0) {
      results.push({
        type: "missing-connections",
        title: "Œuvres isolées",
        description: "Ces œuvres partagent peu de liens émotionnels/thématiques avec le reste",
        count: isolated.length,
        examples: isolated.slice(0, 5).map(w => w.titre),
        suggestion: "Enrichir le corpus avec des œuvres qui créent des ponts vers ces îlots",
      });
    }

    return results;
  }, [filtered]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              🔬 Analyse des manques du corpus
            </h2>
            <p className="text-sm text-orange-100 mt-1">
              Identifiez les zones sous-explorées pour enrichir votre recherche
            </p>
          </div>
          <button
            onClick={() => onClose()}
            className="text-white hover:text-orange-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <p className="text-sm text-slate-600">
              Analyse basée sur <span className="font-semibold">{filtered.length}</span> œuvre{filtered.length > 1 ? 's' : ''} 
              {filters.categories.length > 0 || filters.emotions.length > 0 || centuryFilter ? ' filtrées' : ' du corpus'}
            </p>
          </div>

          {gaps.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg mb-2">✅ Corpus équilibré</p>
              <p className="text-sm">Aucun manque significatif détecté avec les filtres actuels</p>
            </div>
          ) : (
            <div className="space-y-4">
              {gaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="border-2 border-orange-200 rounded-lg p-4 bg-gradient-to-br from-orange-50 to-red-50"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                      {gap.count}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-orange-900 mb-1">
                        {gap.title}
                      </h3>
                      <p className="text-sm text-orange-700 mb-2">
                        {gap.description}
                      </p>
                    </div>
                  </div>

                  {gap.examples && gap.examples.length > 0 && (
                    <div className="mb-3 pl-13">
                      <p className="text-xs font-semibold text-orange-800 mb-1">
                        Exemples :
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {gap.examples.map((ex, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-white border border-orange-300 text-xs rounded"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pl-13 bg-white border-l-4 border-orange-500 rounded p-3">
                    <p className="text-xs font-semibold text-slate-700 mb-1">
                      💡 Suggestion :
                    </p>
                    <p className="text-sm text-slate-600">
                      {gap.suggestion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-bold text-slate-900 mb-2">
              📊 Comment utiliser cette analyse ?
            </h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• <strong>Pour la recherche</strong> : Identifiez des angles originaux à explorer</li>
              <li>• <strong>Pour la curation</strong> : Complétez le corpus de manière stratégique</li>
              <li>• <strong>Pour la création</strong> : Trouvez des niches thématiques inexploitées</li>
              <li>• <strong>Pour l'enseignement</strong> : Montrez les biais du corpus actuel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
