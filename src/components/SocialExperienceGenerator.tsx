import { useState, useMemo } from "react";
import data from "../data/works.json";
import { useStore } from "../store/useStore";

interface SocialScenario {
  id: string;
  icon: string;
  title: string;
  description: string;
  context: string;
  suggestedWorks: any[];
  prompt: string;
}

export default function SocialExperienceGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const setSelectedId = useStore(s => s.setSelectedId);

  const all = data as any[];

  const scenarios = useMemo((): SocialScenario[] => {
    // Find works for different social contexts
    const melancholicWorks = all
      .filter(w => w.emotions?.includes("tristesse") || w.emotions?.includes("nostalgie"))
      .slice(0, 8);

    const joyfulWorks = all
      .filter(w => w.emotions?.includes("joie") || w.emotions?.includes("excitation"))
      .slice(0, 8);

    const contemplativeWorks = all
      .filter(w => w.emotions?.includes("sérénité") || w.emotions?.includes("fascination"))
      .slice(0, 8);

    const tensionWorks = all
      .filter(w => w.emotions?.includes("peur") || w.emotions?.includes("tension"))
      .slice(0, 8);

    const mixedMediaWorks = all
      .reduce((acc, work) => {
        if (!acc.some((w: any) => w.type === work.type)) {
          acc.push(work);
        }
        return acc;
      }, [] as any[])
      .slice(0, 6);

    return [
      {
        id: "workshop",
        icon: "🎨",
        title: "Atelier création",
        description: "Workshop design/écriture de 3h",
        context: "Groupe de 10-15 personnes explorant le temps via la création",
        suggestedWorks: mixedMediaWorks,
        prompt: "Utilisez ces œuvres comme points de départ pour des exercices créatifs. Chaque participant choisit une œuvre et crée une réponse personnelle (texte, dessin, prototype de jeu, etc.)",
      },
      {
        id: "evening",
        icon: "🌙",
        title: "Soirée contemplative",
        description: "Projection/discussion en petit comité",
        context: "6-8 personnes, ambiance intimiste, 2h",
        suggestedWorks: contemplativeWorks,
        prompt: "Parcours guidé à travers des œuvres sereines et fascinantes. Alternez visualisation silencieuse et discussions ouvertes sur la perception du temps.",
      },
      {
        id: "debate",
        icon: "💬",
        title: "Débat philosophique",
        description: "Discussion structurée sur le temps",
        context: "Format type 'café philo', 15-20 personnes",
        suggestedWorks: tensionWorks,
        prompt: "Les œuvres servent d'ancrage pour débattre : manipulations éthiques du temps, anxiété temporelle, rapport à la finitude. Chaque œuvre lance une question.",
      },
      {
        id: "exhibition",
        icon: "🖼️",
        title: "Exposition curée",
        description: "Parcours muséal thématique",
        context: "Installation physique ou virtuelle",
        suggestedWorks: all.slice(0, 20),
        prompt: "Organisez un parcours spatial avec sections thématiques (Cosmos → Intime → Disruption). Les visiteurs naviguent physiquement entre les 'mondes du temps'.",
      },
      {
        id: "therapy",
        icon: "💭",
        title: "Médiation thérapeutique",
        description: "Support pour art-thérapie",
        context: "Séances individuelles ou groupes de parole",
        suggestedWorks: melancholicWorks,
        prompt: "Œuvres sur le temps vécu comme médiateur émotionnel. Les participants partagent leurs propres expériences du temps en résonance avec les œuvres présentées.",
      },
      {
        id: "classroom",
        icon: "🎓",
        title: "Module pédagogique",
        description: "Cours universitaire ou lycée",
        context: "Séquence de 4-6 séances, 30 étudiants",
        suggestedWorks: mixedMediaWorks,
        prompt: "Comparez comment différents médias traitent le temps. Exercice d'analyse transmédiatique : BD vs Cinéma, Jeux vidéo vs Littérature, etc.",
      },
      {
        id: "party",
        icon: "🎉",
        title: "Expérience festive",
        description: "Installation interactive pour événement",
        context: "50-100 personnes, ambiance dynamique",
        suggestedWorks: joyfulWorks,
        prompt: "Station interactive où les visiteurs découvrent des œuvres par mood. DJ ou VJ utilise le corpus comme source d'inspiration. Mode 'sérendipité' activé pour surprises.",
      },
    ];
  }, [all]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition text-sm font-medium shadow-md"
      >
        <span className="text-lg">🎭</span>
        <span>Scénarios d'usage</span>
      </button>
    );
  }

  const currentScenario = scenarios.find(s => s.id === selectedScenario);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              🎭 Générateur de scénarios sociaux
            </h2>
            <p className="text-sm text-indigo-100 mt-1">
              Utilisez Playtime dans différents contextes : ateliers, cours, expositions...
            </p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              setSelectedScenario(null);
            }}
            className="text-white hover:text-indigo-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!currentScenario ? (
            <>
              <p className="text-sm text-slate-600 mb-6">
                Choisissez un type d'expérience pour obtenir un parcours curé et des suggestions d'animation
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario.id)}
                    className="text-left p-4 border-2 border-slate-200 rounded-lg hover:border-indigo-400 hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{scenario.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">
                          {scenario.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {scenario.description}
                        </p>
                        <p className="text-xs text-slate-500 italic">
                          {scenario.context}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-bold text-slate-900 mb-3">
                  💡 Pourquoi ces scénarios ?
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Votre analyse mentionne (section 5) différents profils d'utilisateurs. Ces scénarios 
                  transforment le corpus en <strong>outil social et pédagogique</strong>.
                </p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• <strong>Ateliers</strong> : création collaborative guidée par les œuvres</li>
                  <li>• <strong>Éducation</strong> : support pédagogique multi-niveaux</li>
                  <li>• <strong>Médiation</strong> : art-thérapie et discussions de groupe</li>
                  <li>• <strong>Événements</strong> : installations interactives festives</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedScenario(null)}
                className="text-sm text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-1"
              >
                ← Retour aux scénarios
              </button>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{currentScenario.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-indigo-900 mb-2">
                      {currentScenario.title}
                    </h3>
                    <p className="text-slate-700 mb-3">
                      {currentScenario.description}
                    </p>
                    <div className="bg-white/50 rounded px-3 py-2 text-sm text-slate-700">
                      <strong>Contexte :</strong> {currentScenario.context}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-slate-900 mb-2">
                  📋 Protocole d'animation
                </h4>
                <div className="bg-slate-50 border rounded-lg p-4 text-sm text-slate-700">
                  {currentScenario.prompt}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3">
                  ✨ Œuvres suggérées ({currentScenario.suggestedWorks.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentScenario.suggestedWorks.map((work) => (
                    <div
                      key={work.id}
                      className="p-3 border rounded-lg hover:border-indigo-400 hover:shadow-sm transition cursor-pointer"
                      onClick={() => {
                        setSelectedId(work.id);
                        setIsOpen(false);
                      }}
                    >
                      <h5 className="font-semibold text-slate-900 mb-1">
                        {work.titre}
                      </h5>
                      <p className="text-xs text-slate-600 mb-2">
                        {work.createur} • {work.type}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {work.emotions?.slice(0, 3).map((e: string) => (
                          <span key={e} className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t bg-yellow-50 border-l-4 border-yellow-400 rounded p-4">
                <p className="text-sm text-slate-700">
                  <strong>💡 Astuce :</strong> Exportez cette sélection vers "Mes collections" 
                  pour la réutiliser plus tard. Vous pouvez aussi la modifier en ajoutant/retirant 
                  des œuvres selon votre public.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
