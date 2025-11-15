import { useState } from "react";

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Bienvenue dans Playtime",
      description: "Une exploration visuelle du temps dans la culture",
      emoji: "⏳",
      content: (
        <div className="space-y-6">
          <p className="text-slate-700 text-lg leading-relaxed">
            <strong className="text-slate-900">Playtime</strong> réunit <strong className="text-indigo-600">310 œuvres</strong> — 
            films, livres, jeux vidéo, musique, philosophie et art — qui explorent notre relation au temps.
          </p>

          <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
            <p className="text-slate-700 leading-relaxed">
              Comment la littérature représente-t-elle la mémoire ? Quelles émotions les films évoquent-ils 
              face au temps qui passe ? Comment les jeux vidéo manipulent-ils notre perception temporelle ?
            </p>
            <p className="text-slate-600 text-sm mt-3 italic">
              Cette plateforme vous permet d'explorer ces questions à travers trois visualisations interactives.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-4 bg-white rounded-lg border-2 border-slate-200">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-xs font-semibold text-slate-700">Littérature</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-slate-200">
              <div className="text-3xl mb-2">🎬</div>
              <div className="text-xs font-semibold text-slate-700">Cinéma</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-slate-200">
              <div className="text-3xl mb-2">🎮</div>
              <div className="text-xs font-semibold text-slate-700">Jeux vidéo</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-slate-200">
              <div className="text-3xl mb-2">🎵</div>
              <div className="text-xs font-semibold text-slate-700">Musique</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-slate-200">
              <div className="text-3xl mb-2">🧠</div>
              <div className="text-xs font-semibold text-slate-700">Philosophie</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-slate-200">
              <div className="text-3xl mb-2">🎨</div>
              <div className="text-xs font-semibold text-slate-700">Art visuel</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Trois façons d'explorer",
      description: "Changez de vue pour découvrir différentes perspectives",
      emoji: "🗺️",
      content: (
        <div className="space-y-4">
          <div className="flex gap-4 items-start p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-300">
            <div className="text-5xl shrink-0">📅</div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Chronologie</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Voyez les 310 œuvres organisées par décennie, de 1800 à aujourd'hui. 
                Les couleurs indiquent le type de médium. Cliquez sur 🔭 Ensemble pour voir toutes les œuvres d'un coup.
              </p>
              <div className="mt-3 text-xs text-slate-600 bg-white/50 p-2 rounded">
                💡 <strong>Astuce :</strong> Utilisez le bouton 🔭 Ensemble pour avoir une vue panoramique, ou 🔍 Détails pour explorer en profondeur
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-300">
            <div className="text-5xl shrink-0">🎭</div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Émotions</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Carte valence × arousal : les œuvres sont positionnées selon leur tonalité émotionnelle. 
                <strong>Positif ↔ Négatif</strong> (horizontal), <strong>Calme ↔ Intense</strong> (vertical). 
                Les couleurs indiquent le type de médium.
              </p>
              <div className="mt-3 text-xs text-slate-600 bg-white/50 p-2 rounded">
                💡 <strong>Astuce :</strong> Les œuvres proches partagent des atmosphères émotionnelles similaires
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300">
            <div className="text-5xl shrink-0">🎬</div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Galerie</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Explorez visuellement les œuvres avec leurs médias (affiches, images, vidéos). 
                Filtrez par type de médium pour découvrir films, livres, jeux vidéo, etc.
              </p>
              <div className="mt-3 text-xs text-slate-600 bg-white/50 p-2 rounded">
                💡 <strong>Astuce :</strong> Utilisez les filtres par médium en haut pour voir seulement les films, livres ou jeux
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Filtrez et découvrez",
      description: "Affinez votre exploration avec des outils intelligents",
      emoji: "🔍",
      content: (
        <div className="space-y-5">
          <div className="p-5 border-2 border-indigo-200 rounded-xl bg-gradient-to-br from-indigo-50 to-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🎯</span>
              <h3 className="font-bold text-lg text-slate-900">Recherche et filtres</h3>
            </div>
            <p className="text-sm text-slate-700 mb-3 leading-relaxed">
              Utilisez la barre de recherche pour trouver une œuvre par titre ou créateur. 
              Combinez les filtres par <strong>émotion</strong>, <strong>médium</strong>, et <strong>catégorie</strong> pour affiner.
            </p>
            <div className="bg-white p-3 rounded-lg text-xs text-slate-600">
              <strong>Exemple :</strong> Filtrez par "nostalgie" + "cinéma" + "XIXᵉ siècle" pour découvrir 
              des films nostalgiques sur cette époque
            </div>
          </div>

          <div className="p-5 border-2 border-purple-200 rounded-xl bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🌀</span>
              <h3 className="font-bold text-lg text-slate-900">Clusters émotionnels</h3>
            </div>
            <p className="text-sm text-slate-700 mb-3 leading-relaxed">
              Notre algorithme a identifié 6 groupes d'œuvres partageant des combinaisons émotionnelles uniques : 
              <em>Mélancolie sombre</em>, <em>Contemplatif</em>, <em>Résilient</em>, etc.
            </p>
            <div className="bg-white p-3 rounded-lg text-xs text-slate-600">
              Cliquez sur un cluster dans la barre latérale pour explorer ces familles émotionnelles
            </div>
          </div>

          <div className="p-5 border-2 border-green-200 rounded-xl bg-gradient-to-br from-green-50 to-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">💡</span>
              <h3 className="font-bold text-lg text-slate-900">Insights automatiques</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              L'application détecte automatiquement des patterns dans vos sélections : 
              médium dominant, émotion récurrente, période temporelle, etc. Les insights apparaissent dans l'en-tête.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Explorez chaque œuvre",
      description: "Découvrez les connexions et contextes",
      emoji: "✨",
      content: (
        <div className="space-y-5">
          <div className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-slate-300">
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">🎯</div>
              <h3 className="font-bold text-slate-900 text-xl">Cliquez sur une œuvre</h3>
            </div>
            <p className="text-sm text-slate-700 text-center leading-relaxed">
              Une fenêtre modale s'ouvre avec toutes les informations : émotions, catégories, commentaires, 
              liens vers médias, et une section <strong>"Œuvres similaires"</strong> générée intelligemment.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl mb-2">🧬</div>
              <div className="text-xs font-semibold text-purple-900 mb-1">DNA Temporel</div>
              <div className="text-[10px] text-purple-700 leading-relaxed">
                Diagramme radar montrant 4 dimensions : émotions, catégories, médias, complexité
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl mb-2">🔗</div>
              <div className="text-xs font-semibold text-blue-900 mb-1">Œuvres similaires</div>
              <div className="text-[10px] text-blue-700 leading-relaxed">
                4 recommandations basées sur émotions partagées, catégories, médium et proximité temporelle
              </div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-xs font-semibold text-amber-900 mb-1">Contexte narratif</div>
              <div className="text-[10px] text-amber-700 leading-relaxed">
                Description générée analysant la position unique de l'œuvre dans le corpus
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-xs font-semibold text-green-900 mb-1">Sauvegardez</div>
              <div className="text-[10px] text-green-700 leading-relaxed">
                Ajoutez aux favoris, créez des notes personnelles, construisez votre collection
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Prêt à explorer ?",
      description: "Votre voyage à travers le temps commence maintenant",
      emoji: "🚀",
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl border-2 border-indigo-300">
            <div className="text-center">
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">310 œuvres vous attendent</h3>
              <p className="text-slate-700 leading-relaxed">
                Commencez par la chronologie pour voir l'évolution historique, 
                explorez la carte émotionnelle pour trouver des atmosphères, 
                ou plongez dans la galerie pour une découverte visuelle.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-white rounded-lg border-2 border-slate-200">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-xs font-bold text-slate-900">Recherchez</div>
              <div className="text-[10px] text-slate-600 mt-1">Par titre, créateur, émotion</div>
            </div>
            <div className="p-4 bg-white rounded-lg border-2 border-slate-200">
              <div className="text-3xl mb-2">🎨</div>
              <div className="text-xs font-bold text-slate-900">Filtrez</div>
              <div className="text-[10px] text-slate-600 mt-1">Combinez médiums et émotions</div>
            </div>
            <div className="p-4 bg-white rounded-lg border-2 border-slate-200">
              <div className="text-3xl mb-2">💾</div>
              <div className="text-xs font-bold text-slate-900">Sauvegardez</div>
              <div className="text-[10px] text-slate-600 mt-1">Créez votre collection</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl border-2 border-yellow-300">
            <p className="text-sm text-center text-amber-900">
              <strong>💡 Astuce finale :</strong> Cliquez sur le <strong>❓</strong> dans l'en-tête 
              pour revenir à ce guide à tout moment
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white shrink-0">
          <div className="text-5xl mb-3 text-center">{currentStep.emoji}</div>
          <h2 className="text-2xl font-bold text-center">{currentStep.title}</h2>
          <p className="text-indigo-100 text-center mt-2">{currentStep.description}</p>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          {currentStep.content}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50 flex items-center justify-between border-t shrink-0">
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
