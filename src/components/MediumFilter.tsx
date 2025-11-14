import { useStore } from "../store/useStore";

const mediaTypes = [
  { type: "Art", emoji: "🎨", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { type: "Cinéma", emoji: "🎬", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
  { type: "Littérature", emoji: "📚", color: "bg-green-100 text-green-700 hover:bg-green-200" },
  { type: "Jeux vidéo", emoji: "🎮", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
  { type: "BD", emoji: "💭", color: "bg-pink-100 text-pink-700 hover:bg-pink-200" },
  { type: "Music", emoji: "🎵", color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" }
];

export default function MediumFilter() {
  const setFilters = useStore(s => s.setFilters);
  const filters = useStore(s => s.filters);

  const handleToggle = (type: string) => {
    const current = filters.types;
    if (current.includes(type)) {
      setFilters({ types: current.filter(t => t !== type) });
    } else {
      setFilters({ types: [...current, type] });
    }
  };

  const isActive = (type: string) => filters.types.includes(type);

  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 mb-2 block">Médiums</label>
      <div className="grid grid-cols-2 gap-2">
        {mediaTypes.map(media => (
          <button
            key={media.type}
            onClick={() => handleToggle(media.type)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 justify-center ${
              isActive(media.type)
                ? "bg-slate-800 text-white shadow-md"
                : media.color
            }`}
          >
            <span>{media.emoji}</span>
            <span>{media.type}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
