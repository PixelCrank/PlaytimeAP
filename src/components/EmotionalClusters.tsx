import { useStore } from "../store/useStore";

const clusters = [
  {
    id: "melancholic",
    emoji: "☁️",
    label: "Mélancolique",
    description: "Nostalgie et tristesse",
    emotions: ["nostalgie", "tristesse"],
    color: "from-slate-400 to-blue-400"
  },
  {
    id: "contemplative",
    emoji: "🌅",
    label: "Contemplatif",
    description: "Nostalgie et sérénité",
    emotions: ["nostalgie", "sérénité"],
    color: "from-amber-400 to-teal-400"
  },
  {
    id: "resilient",
    emoji: "🛡️",
    label: "Résilient",
    description: "Confiance et nostalgie",
    emotions: ["confiance", "nostalgie"],
    color: "from-green-400 to-amber-400"
  },
  {
    id: "dynamic",
    emoji: "⚡",
    label: "Dynamique",
    description: "Excitation et surprise",
    emotions: ["excitation", "surprise"],
    color: "from-orange-400 to-pink-400"
  }
];

export default function EmotionalClusters() {
  const setFilters = useStore(s => s.setFilters);
  const filters = useStore(s => s.filters);

  const handleClusterClick = (emotions: string[]) => {
    setFilters({ emotions });
  };

  const isActive = (emotions: string[]) => {
    return filters.emotions.length === emotions.length &&
           emotions.every(e => filters.emotions.includes(e));
  };

  return (
    <div className="space-y-2">
      {clusters.map(cluster => (
        <button
          key={cluster.id}
          onClick={() => handleClusterClick(cluster.emotions)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
            isActive(cluster.emotions)
              ? `bg-gradient-to-r ${cluster.color} text-white shadow-md`
              : "bg-slate-50 hover:bg-slate-100 text-slate-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{cluster.emoji}</span>
            <div className="flex-1">
              <div className="font-semibold text-sm">{cluster.label}</div>
              <div className={`text-xs ${isActive(cluster.emotions) ? "text-white/80" : "text-slate-500"}`}>
                {cluster.description}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
