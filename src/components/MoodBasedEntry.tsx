import { useState } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";

const moodOptions = [
  {
    id: "nostalgic-calm",
    emoji: "🌅",
    label: "Nostalgique et contemplatif",
    description: "Je pense au passé avec douceur",
    emotions: ["nostalgie", "sérénité", "tristesse"],
    categories: ["temps vécu", "temps et identité"],
  },
  {
    id: "anxious-future",
    emoji: "⚡",
    label: "Anxieux face au futur",
    description: "Le temps qui vient m'inquiète",
    emotions: ["peur", "vigilance", "tension"],
    categories: ["manipulations du temps", "représentation du temps"],
  },
  {
    id: "curious-wonder",
    emoji: "✨",
    label: "Curieux et émerveillé",
    description: "Je veux comprendre le mystère du temps",
    emotions: ["fascination", "surprise", "excitation"],
    categories: ["nature du temps", "temps cosmique", "temps et espace"],
  },
  {
    id: "melancholic-loss",
    emoji: "🍂",
    label: "Mélancolique",
    description: "Je ressens la perte et le passage",
    emotions: ["tristesse", "nostalgie", "ennui"],
    categories: ["temps vécu", "temps biologique", "temps et identité"],
  },
  {
    id: "playful-experimental",
    emoji: "🎮",
    label: "Joueur et expérimental",
    description: "Je veux manipuler et jouer avec le temps",
    emotions: ["excitation", "surprise", "joie"],
    categories: ["manipulations du temps", "temps et rêve"],
  },
  {
    id: "spiritual-timeless",
    emoji: "🕊️",
    label: "Spirituel et intemporel",
    description: "Je cherche ce qui transcende le temps",
    emotions: ["sérénité", "confiance", "fascination"],
    categories: ["temps et sacré", "nature du temps", "temps cosmique"],
  },
];

export default function MoodBasedEntry() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [generatedWorks, setGeneratedWorks] = useState<any[]>([]);
  
  const setFilters = useStore(s => s.setFilters);
  const setRealm = useStore(s => s.setRealm);
  const setSelectedId = useStore(s => s.setSelectedId);

  const all = data as any[];

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    const mood = moodOptions.find(m => m.id === moodId)!;

    // Find matching works
    const matches = all.filter(work => {
      const emotionMatch = mood.emotions.some(e => 
        work.emotions?.includes(e)
      );
      const categoryMatch = mood.categories.some(c => 
        work.categories?.includes(c)
      );
      return emotionMatch && categoryMatch;
    });

    // Create a journey of 8 works with variety
    const journey: any[] = [];
    const types = new Set<string>();
    
    // Prioritize diverse media types
    for (const work of matches) {
      if (journey.length >= 8) break;
      if (!types.has(work.type) || journey.length > 5) {
        journey.push(work);
        types.add(work.type);
      }
    }
    
    // Fill remaining slots if needed
    while (journey.length < 8 && journey.length < matches.length) {
      const remaining = matches.filter(w => !journey.includes(w));
      if (remaining.length === 0) break;
      journey.push(remaining[0]);
    }

    setGeneratedWorks(journey);

    // Apply filters
    setFilters({
      categories: mood.categories,
      emotions: mood.emotions,
    });

    // Set appropriate realm
    if (mood.categories.includes("temps cosmique") || mood.categories.includes("nature du temps")) {
      setRealm("cosmic");
    } else if (mood.categories.includes("manipulations du temps")) {
      setRealm("disrupted");
    } else {
      setRealm("human");
    }
  };

  const handleExplore = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition text-sm font-medium shadow-md"
      >
        <span className="text-lg">🌟</span>
        <span>Mon humeur du jour</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold">
              🌟 Comment vous sentez-vous par rapport au temps aujourd'hui ?
            </h2>
            <p className="text-sm text-amber-100 mt-1">
              Commencez votre exploration par votre ressenti
            </p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              setSelectedMood(null);
              setGeneratedWorks([]);
            }}
            className="text-white hover:text-amber-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!selectedMood ? (
            <>
              <p className="text-sm text-slate-600 mb-6">
                Choisissez l'humeur qui vous correspond le mieux — nous créerons un parcours personnalisé pour vous.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    className="text-left p-4 border-2 border-slate-200 rounded-lg hover:border-orange-400 hover:shadow-md transition group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-4xl group-hover:scale-110 transition">
                        {mood.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">
                          {mood.label}
                        </h3>
                        <p className="text-sm text-slate-600 italic mb-2">
                          "{mood.description}"
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {mood.emotions.slice(0, 2).map(e => (
                            <span key={e} className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <button
                  onClick={() => {
                    setSelectedMood(null);
                    setGeneratedWorks([]);
                  }}
                  className="text-sm text-orange-600 hover:text-orange-800 mb-3"
                >
                  ← Changer d'humeur
                </button>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-300 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">
                      {moodOptions.find(m => m.id === selectedMood)!.emoji}
                    </span>
                    <div>
                      <h3 className="font-bold text-orange-900">
                        {moodOptions.find(m => m.id === selectedMood)!.label}
                      </h3>
                      <p className="text-sm text-orange-700">
                        {generatedWorks.length} œuvres sélectionnées pour vous
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-slate-900 mb-3">
                  Votre parcours personnalisé
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {generatedWorks.map((work, idx) => (
                    <div
                      key={work.id}
                      className="p-3 border-2 border-slate-200 rounded-lg hover:border-orange-400 hover:shadow-sm transition cursor-pointer"
                      onClick={() => {
                        setSelectedId(work.id);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 text-sm mb-1">
                            {work.titre}
                          </h4>
                          <p className="text-xs text-slate-600 mb-2">
                            {work.createur} • {work.type}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {work.emotions?.slice(0, 2).map((e: string) => (
                              <span key={e} className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                                {e}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleExplore}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
                >
                  Explorer ces œuvres
                </button>
                <button
                  onClick={() => handleMoodSelect(selectedMood)}
                  className="px-4 py-3 bg-white border-2 border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition font-medium"
                >
                  🎲 Nouveau parcours
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
