import { useState } from "react";

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Explorez 620 œuvres sur le temps",
      description: "Trois façons de naviguer dans le corpus",
      emoji: "🌟",
      content: (
        <div className="space-y-6">
          <p className="text-slate-700 text-lg leading-relaxed">
            Bienvenue dans <strong className="text-slate-900">Playtime</strong>, une exploration de comment la littérature, 
            le cinéma, la philosophie, les jeux vidéo, la musique et l'art représentent le temps.
          </p>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-start p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="text-4xl">📅</div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">Chronologie</h3>
                <p className="text-sm text-slate-600">
                  Parcourez les œuvres décennie par décennie, de 1800 à aujourd'hui. 
                  Découvrez comment les émotions et thématiques évoluent dans le temps.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
              <div className="text-4xl">🎭</div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">Carte émotionnelle</h3>
                <p className="text-sm text-slate-600">
                  Visualisez les œuvres selon leurs tonalités émotionnelles : tristesse, 
                  fascination, vigilance, nostalgie, tension...
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
              <div className="text-4xl">🖼️</div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">Galerie médias</h3>
                <p className="text-sm text-slate-600">
                  257 œuvres avec images, vidéos, bandes-annonces et extraits à explorer visuellement.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Filtrez et analysez",
      description: "Des outils puissants pour comprendre le corpus",
      emoji: "🔍",
      content: (
        <div className="space-y-4">
          <div className="p-4 border-2 border-slate-200 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <h3 className="font-bold text-slate-900">Filtrer</h3>
            </div>
            <p className="text-sm text-slate-600">
              Affinez par période (XIXᵉ, XXᵉ, XXIᵉ siècle) et par émotions 
              (tristesse, fascination, nostalgie...). Combinez les filtres pour découvrir des patterns.
            </p>
          </div>
          
          <div className="p-4 border-2 border-slate-200 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📊</span>
              <h3 className="font-bold text-slate-900">Analyser</h3>
            </div>
            <p className="text-sm text-slate-600">
              <strong>Insights</strong> découvre automatiquement des patterns cachés. 
              <strong>Comparer</strong> permet d'analyser côte à côte deux œuvres avec diagrammes de Venn et analyse AI.
            </p>
          </div>

          <div className="p-4 border-2 border-slate-200 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⭐</span>
              <h3 className="font-bold text-slate-900">Collection personnelle</h3>
            </div>
            <p className="text-sm text-slate-600">
              Sauvegardez vos œuvres favorites, ajoutez des notes, construisez des parcours thématiques. 
              Clic-droit sur une œuvre pour l'ajouter.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Découvrez des connexions",
      description: "L'intelligence artificielle vous guide",
      emoji: "🧭",
      content: (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-300">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">🧠</div>
              <h3 className="font-bold text-blue-900 text-xl mb-2">Narratives contextuelles</h3>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              Lorsque vous sélectionnez une œuvre, l'application analyse automatiquement sa position 
              unique dans le corpus : combinaisons rares, œuvres similaires, patterns temporels, 
              positionnement émotionnel...
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-1">🔮</div>
              <div className="text-xs font-semibold text-purple-900">Rareté</div>
              <div className="text-[10px] text-purple-700">Combinaisons uniques</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl mb-1">🔗</div>
              <div className="text-xs font-semibold text-green-900">Clusters</div>
              <div className="text-[10px] text-green-700">Œuvres connexes</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl mb-1">⏳</div>
              <div className="text-xs font-semibold text-amber-900">Contexte</div>
              <div className="text-[10px] text-amber-700">Position temporelle</div>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-xs font-semibold text-pink-900">Patterns</div>
              <div className="text-[10px] text-pink-700">Trends émotionnels</div>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 text-center italic">
            Chaque œuvre révèle une histoire unique dans la constellation du temps
          </p>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
          <div className="text-5xl mb-3 text-center">{currentStep.emoji}</div>
          <h2 className="text-2xl font-bold text-center">{currentStep.title}</h2>
          <p className="text-indigo-100 text-center mt-2">{currentStep.description}</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {currentStep.content}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50 flex items-center justify-between border-t">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition ${
                  idx === step ? "bg-indigo-600 w-6" : "bg-slate-300"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition"
              >
                Retour
              </button>
            )}
            
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium"
              >
                Commencer l'exploration 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
