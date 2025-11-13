import { useState } from "react";

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Bienvenue dans Playtime",
      description: "Une exploration de 620 œuvres culturelles et leurs rapports au temps",
      emoji: "🌟",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600">
            Playtime vous invite à découvrir comment la littérature, le cinéma, 
            les jeux vidéo, la musique, l'art et la BD explorent le temps à travers 
            trois visages principaux :
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-3xl mb-2">🌌</div>
              <div className="font-semibold text-indigo-900">Cosmique</div>
              <div className="text-xs text-indigo-700">L'échelle de l'univers</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-3xl mb-2">🧑</div>
              <div className="font-semibold text-emerald-900">Humain</div>
              <div className="text-xs text-emerald-700">L'expérience vécue</div>
            </div>
            <div className="text-center p-4 bg-rose-50 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-semibold text-rose-900">Perturbé</div>
              <div className="text-xs text-rose-700">Les manipulations</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Deux façons d'explorer",
      description: "Choisissez votre mode de navigation",
      emoji: "🗺️",
      content: (
        <div className="space-y-4">
          <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <h3 className="font-bold text-blue-900">Vue Constellation</h3>
            </div>
            <p className="text-sm text-blue-800">
              Explorez les œuvres organisées par royaume temporel. Chaque point est une œuvre, 
              colorée par son médium. Cliquez pour découvrir les détails.
            </p>
          </div>
          
          <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎨</span>
              <h3 className="font-bold text-purple-900">Carte Émotionnelle</h3>
            </div>
            <p className="text-sm text-purple-800">
              Naviguez par ressenti : tristesse, nostalgie, fascination... 
              Les œuvres sont positionnées selon leur intensité émotionnelle.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Commencez par votre humeur",
      description: "Le moyen le plus simple de débuter",
      emoji: "💫",
      content: (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-amber-300">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🌟</div>
              <h3 className="font-bold text-amber-900 text-lg">Mon humeur du jour</h3>
            </div>
            <p className="text-sm text-amber-800 text-center mb-4">
              Choisissez comment vous vous sentez par rapport au temps aujourd'hui, 
              et nous créerons un parcours personnalisé de 8 œuvres pour vous.
            </p>
            <div className="text-xs text-amber-700 text-center">
              Vous trouverez ce bouton tout en haut de la barre latérale
            </div>
          </div>
          
          <p className="text-sm text-slate-600 text-center">
            Ou utilisez les filtres ci-dessous pour explorer librement...
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
