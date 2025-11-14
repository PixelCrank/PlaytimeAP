import { useStore } from "../store/useStore";

const clusters = [
  {
    id: "melancholic-pure",
    emoji: "🌧️",
    label: "Mélancolie sombre",
    description: "Nostalgie + tristesse",
    emotions: ["nostalgie", "tristesse"],
    color: "from-slate-500 to-blue-600",
    count: 47
  },
  {
    id: "contemplative",
    emoji: "🌅",
    label: "Contemplatif",
    description: "Nostalgie + sérénité",
    emotions: ["nostalgie", "sérénité"],
    color: "from-amber-400 to-teal-400",
    count: 34
  },
  {
    id: "resilient",
    emoji: "🛡️",
    label: "Résilient",
    description: "Confiance + nostalgie",
    emotions: ["confiance", "nostalgie"],
    color: "from-green-400 to-amber-400",
    count: 32
  },
  {
    id: "hopeful-melancholy",
    emoji: "🌤️",
    label: "Mélancolie optimiste",
    description: "Tristesse + confiance + nostalgie",
    emotions: ["tristesse", "confiance", "nostalgie"],
    color: "from-blue-400 to-green-400",
    count: 17
  },
  {
    id: "dynamic",
    emoji: "⚡",
    label: "Dynamique",
    description: "Excitation + surprise",
    emotions: ["excitation", "surprise"],
    color: "from-orange-400 to-pink-400",
    count: 14
  },
  {
    id: "fascinated",
    emoji: "✨",
    label: "Fasciné",
    description: "Fascination + nostalgie",
    emotions: ["fascination", "nostalgie"],
    color: "from-purple-400 to-pink-400",
    count: 9
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
          className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
            isActive(cluster.emotions)
              ? `bg-gradient-to-r ${cluster.color} text-white shadow-md`
              : "bg-slate-50 hover:bg-slate-100 text-slate-700"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{cluster.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{cluster.label}</div>
              <div className={`text-[11px] ${isActive(cluster.emotions) ? "text-white/80" : "text-slate-500"}`}>
                {cluster.description}
              </div>
            </div>
            <div className={`text-xs font-bold ${isActive(cluster.emotions) ? "text-white" : "text-slate-400"}`}>
              {cluster.count}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
