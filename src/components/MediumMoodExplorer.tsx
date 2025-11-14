import { useStore } from "../store/useStore";

const mediumMoods = [
  {
    medium: "Music",
    emoji: "🎵",
    emotion: "nostalgie",
    label: "Musique nostalgique",
    description: "49 œuvres évoquant le souvenir",
    color: "from-purple-400 to-pink-400"
  },
  {
    medium: "Art",
    emoji: "🎨",
    emotion: "fascination",
    label: "Art fascinant",
    description: "31 œuvres émerveillant",
    color: "from-blue-400 to-cyan-400"
  },
  {
    medium: "Jeux vidéo",
    emoji: "🎮",
    emotion: "excitation",
    label: "Jeux excitants",
    description: "22 œuvres stimulantes",
    color: "from-orange-400 to-red-400"
  },
  {
    medium: "Cinéma",
    emoji: "🎬",
    emotion: "tristesse",
    label: "Cinéma mélancolique",
    description: "19 films touchants",
    color: "from-slate-400 to-blue-500"
  }
];

export default function MediumMoodExplorer() {
  const setFilters = useStore(s => s.setFilters);
  const filters = useStore(s => s.filters);

  const handleMoodClick = (medium: string, emotion: string) => {
    setFilters({ 
      types: [medium],
      emotions: [emotion]
    });
  };

  const isActive = (medium: string, emotion: string) => {
    return filters.types.includes(medium) && filters.emotions.includes(emotion);
  };

  return (
    <div className="space-y-2">
      {mediumMoods.map(mood => (
        <button
          key={mood.medium}
          onClick={() => handleMoodClick(mood.medium, mood.emotion)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
            isActive(mood.medium, mood.emotion)
              ? `bg-gradient-to-r ${mood.color} text-white shadow-md`
              : "bg-slate-50 hover:bg-slate-100 text-slate-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{mood.emoji}</span>
            <div className="flex-1">
              <div className="font-semibold text-sm">{mood.label}</div>
              <div className={`text-xs ${isActive(mood.medium, mood.emotion) ? "text-white/80" : "text-slate-500"}`}>
                {mood.description}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
