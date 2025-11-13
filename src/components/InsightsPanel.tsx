import { useStore } from "../store/useStore";
import data from "../data/works.json";
import { useMemo } from "react";
import { buildPredicateWithCentury } from "../lib/filters";

export default function InsightsPanel() {
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const realm = useStore(s => s.realm);

  const all = data as any[];
  const filtered = useMemo(
    () => all.filter(buildPredicateWithCentury(filters, centuryFilter)),
    [all, filters, centuryFilter]
  );

  // Stats about filtered set
  const stats = useMemo(() => {
    const types: Record<string, number> = {};
    const emotions: Record<string, number> = {};
    const categories: Record<string, number> = {};
    
    filtered.forEach(work => {
      types[work.type] = (types[work.type] || 0) + 1;
      work.emotions?.forEach((e: string) => {
        emotions[e] = (emotions[e] || 0) + 1;
      });
      work.categories?.forEach((c: string) => {
        categories[c] = (categories[c] || 0) + 1;
      });
    });

    const sortedTypes = Object.entries(types).sort((a, b) => b[1] - a[1]);
    const sortedEmotions = Object.entries(emotions).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return {
      total: filtered.length,
      types: sortedTypes,
      topEmotions: sortedEmotions,
      topCategories: sortedCategories,
    };
  }, [filtered]);

  // Realm insights based on analysis
  const realmInsights = {
    cosmic: {
      title: "Temps cosmique",
      description: "Échelles inhumaines, vertige, lenteur",
      expectedEmotions: ["fascination", "sérénité", "peur"],
      narrative: "L'humain face à l'immense",
    },
    human: {
      title: "Temps humain",
      description: "Mémoire, identité, filiation, vieillissement",
      expectedEmotions: ["nostalgie", "tristesse", "confiance"],
      narrative: "Intimité et vécu personnel",
    },
    disrupted: {
      title: "Temps manipulé",
      description: "Boucles, voyages temporels, distorsions",
      expectedEmotions: ["surprise", "tension", "excitation"],
      narrative: "Technologie et fiction",
    },
  };

  const currentRealm = realmInsights[realm];

  if (filtered.length === 0) {
    return (
      <aside className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-900">
          Aucune œuvre ne correspond aux filtres actuels. Essayez d'élargir votre sélection.
        </p>
      </aside>
    );
  }

  return (
    <div className="flex items-center gap-6">
      {/* Current realm insight */}
      <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg border">
        <div className="text-2xl">📍</div>
        <div>
          <div className="text-sm font-semibold text-slate-900">{currentRealm.title}</div>
          <div className="text-xs text-slate-600">{currentRealm.description}</div>
        </div>
      </div>

      {/* Filtered count */}
      <div className="flex items-center gap-3 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
          <div className="text-xs text-blue-700">œuvres</div>
        </div>
        <div className="flex flex-col gap-0.5">
          {stats.types.slice(0, 3).map(([type, count]) => (
            <div key={type} className="text-xs text-blue-700">
              <span className="font-medium">{count}</span> {type}
            </div>
          ))}
        </div>
      </div>

      {/* Top emotions */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-600">Émotions:</span>
        <div className="flex gap-1">
          {stats.topEmotions.slice(0, 4).map(([emotion, count]) => (
            <div 
              key={emotion} 
              className="px-2 py-1 bg-purple-50 border border-purple-200 rounded text-xs"
              title={`${count} œuvres`}
            >
              {emotion}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
