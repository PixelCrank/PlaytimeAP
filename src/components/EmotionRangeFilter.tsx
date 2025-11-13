import { useStore } from "../store/useStore";

export default function EmotionRangeFilter() {
  const filters = useStore(s => s.filters);
  const setFilters = useStore(s => s.setFilters);

  const handleEmotionToggle = (emotion: string) => {
    const current = new Set(filters.emotions);
    if (current.has(emotion)) {
      current.delete(emotion);
    } else {
      current.add(emotion);
    }
    setFilters({ emotions: Array.from(current) });
  };

  const handleReset = () => {
    setFilters({ emotions: [] });
  };

  // Common emotions from analysis
  const commonEmotions = [
    "tristesse",
    "nostalgie",
    "surprise",
    "sérénité",
    "fascination",
    "peur",
    "tension",
    "joie",
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          🎭 Filtrer par émotions
        </h3>
        {filters.emotions.length > 0 && (
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
            {filters.emotions.length} active{filters.emotions.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">
        Sélectionnez une ou plusieurs émotions
      </p>
      <div className="flex flex-wrap gap-2">
        {commonEmotions.map((emotion) => {
          const isActive = filters.emotions.includes(emotion);
          return (
            <button
              key={emotion}
              type="button"
              onClick={() => handleEmotionToggle(emotion)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border-2 transition-all ${
                isActive
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50"
              }`}
            >
              {isActive && "✓ "}{emotion}
            </button>
          );
        })}
      </div>
      {filters.emotions.length > 0 && (
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-purple-600 hover:text-purple-800 font-medium underline"
        >
          Effacer tout
        </button>
      )}
    </div>
  );
}
