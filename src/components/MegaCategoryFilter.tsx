import { useStore } from "../store/useStore";

const megaCategories = [
  {
    id: "personal",
    label: "Temps personnel",
    emoji: "👤",
    description: "Vécu, identité, biologique",
    categories: [
      "temps vécu",
      "temps et identité",
      "temps biologique",
      "temps et sacré"
    ],
    color: "from-blue-400 to-purple-400",
    count: 213
  },
  {
    id: "philosophical",
    label: "Temps philosophique",
    emoji: "🌌",
    description: "Nature, expérience, cosmique",
    categories: [
      "expérience du temps",
      "nature du temps",
      "temps cosmique",
      "temps et espace",
      "temps géologique",
      "temps écologique"
    ],
    color: "from-cyan-400 to-blue-500",
    count: 155
  },
  {
    id: "altered",
    label: "Temps altéré",
    emoji: "⚡",
    description: "Manipulations, représentations",
    categories: [
      "manipulations du temps",
      "représentation du temps",
      "temps et rêve"
    ],
    color: "from-orange-400 to-pink-500",
    count: 178
  }
];

export default function MegaCategoryFilter() {
  const setFilters = useStore(s => s.setFilters);
  const filters = useStore(s => s.filters);

  const handleCategoryClick = (categories: string[]) => {
    // Toggle: if already selected, clear, otherwise set
    const isActive = categories.some(c => filters.categories.includes(c));
    if (isActive) {
      setFilters({ categories: [] });
    } else {
      setFilters({ categories });
    }
  };

  const isActive = (categories: string[]) => {
    return categories.some(c => filters.categories.includes(c));
  };

  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 mb-2 block">Thèmes</label>
      <div className="space-y-2">
        {megaCategories.map(mega => (
          <button
            key={mega.id}
            onClick={() => handleCategoryClick(mega.categories)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              isActive(mega.categories)
                ? `bg-gradient-to-r ${mega.color} text-white shadow-md`
                : "bg-slate-50 hover:bg-slate-100 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{mega.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-sm">{mega.label}</div>
                <div className={`text-xs ${isActive(mega.categories) ? "text-white/80" : "text-slate-500"}`}>
                  {mega.description}
                </div>
              </div>
              <div className={`text-xs font-medium ${isActive(mega.categories) ? "text-white/90" : "text-slate-400"}`}>
                ~{mega.count}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
