import { useState } from "react";
import { useStore } from "../store/useStore";
import { getEmotionIcon } from "../lib/emotionIcons";
import { getMediumIcon } from "../lib/mediumIcons";
import { typeColor } from "../lib/colors";

export default function FilterBar() {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const [showEmotions, setShowEmotions] = useState(false);
  const [showMediums, setShowMediums] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const emotions = [
    'tristesse', 'nostalgie', 'joie', 'peur', 'colère', 'surprise',
    'confiance', 'fascination', 'sérénité', 'tension', 'vigilance',
    'dégoût', 'admiration', 'excitation', 'ennui'
  ];

  const mediumTypes = ['Littérature', 'Cinéma', 'Jeux vidéo', 'Music', 'Art', 'BD'];

  const categories = [
    'Identité', 'Mémoire', 'Temps vécu', 'Cosmique', 'Écologique',
    'Technologique', 'Humain', 'Dérangé', 'Cyclique', 'Linéaire'
  ];

  const toggleEmotion = (emotion: string) => {
    const newEmotions = filters.emotions.includes(emotion)
      ? filters.emotions.filter(e => e !== emotion)
      : [...filters.emotions, emotion];
    setFilters({ ...filters, emotions: newEmotions });
  };

  const toggleMedium = (medium: string) => {
    const newTypes = filters.types.includes(medium)
      ? filters.types.filter(t => t !== medium)
      : [...filters.types, medium];
    setFilters({ ...filters, types: newTypes });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setFilters({ ...filters, categories: newCategories });
  };

  const clearAllFilters = () => {
    setFilters({
      emotions: [],
      types: [],
      categories: [],
      yearRange: null,
      search: "",
      realmFilter: "tous",
      centuryFilter: "tous"
    });
  };

  const hasActiveFilters = filters.emotions.length > 0 || filters.types.length > 0 || filters.categories.length > 0;

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter label */}
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span>🎚️</span>
            <span>Filtres:</span>
          </div>

          {/* Emotions dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowEmotions(!showEmotions);
                setShowMediums(false);
                setShowCategories(false);
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                filters.emotions.length > 0
                  ? 'bg-purple-100 text-purple-900 border-2 border-purple-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-transparent'
              }`}
            >
              🎭 Émotions {filters.emotions.length > 0 && `(${filters.emotions.length})`}
            </button>
            {showEmotions && (
              <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border-2 border-slate-200 p-3 z-50 w-80 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion}
                      onClick={() => toggleEmotion(emotion)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition text-left flex items-center gap-2 ${
                        filters.emotions.includes(emotion)
                          ? 'bg-purple-100 text-purple-900 border-2 border-purple-400'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-2 border-transparent'
                      }`}
                    >
                      <span>{getEmotionIcon(emotion)}</span>
                      <span className="capitalize">{emotion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mediums dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowMediums(!showMediums);
                setShowEmotions(false);
                setShowCategories(false);
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                filters.types.length > 0
                  ? 'bg-blue-100 text-blue-900 border-2 border-blue-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-transparent'
              }`}
            >
              📚 Médiums {filters.types.length > 0 && `(${filters.types.length})`}
            </button>
            {showMediums && (
              <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border-2 border-slate-200 p-3 z-50 w-64">
                <div className="grid grid-cols-2 gap-2">
                  {mediumTypes.map((medium) => {
                    const color = typeColor[medium] || '#64748b';
                    return (
                      <button
                        key={medium}
                        onClick={() => toggleMedium(medium)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition text-left flex items-center gap-2 border-2 ${
                          filters.types.includes(medium)
                            ? 'text-white'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-transparent'
                        }`}
                        style={filters.types.includes(medium) ? { backgroundColor: color, borderColor: color } : {}}
                      >
                        <span>{getMediumIcon(medium)}</span>
                        <span>{medium}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Categories dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCategories(!showCategories);
                setShowEmotions(false);
                setShowMediums(false);
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                filters.categories.length > 0
                  ? 'bg-green-100 text-green-900 border-2 border-green-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-transparent'
              }`}
            >
              🏷️ Catégories {filters.categories.length > 0 && `(${filters.categories.length})`}
            </button>
            {showCategories && (
              <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border-2 border-slate-200 p-3 z-50 w-80">
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition text-left ${
                        filters.categories.includes(category)
                          ? 'bg-green-100 text-green-900 border-2 border-green-400'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-2 border-transparent'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear all button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="ml-auto px-4 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
            >
              ✕ Effacer tout
            </button>
          )}

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap pl-2 border-l-2 border-slate-200">
              {filters.emotions.map((emotion) => (
                <span
                  key={emotion}
                  className="px-2 py-1 bg-purple-100 text-purple-900 rounded text-xs font-medium flex items-center gap-1"
                >
                  {getEmotionIcon(emotion)} {emotion}
                  <button onClick={() => toggleEmotion(emotion)} className="hover:text-purple-700">✕</button>
                </span>
              ))}
              {filters.types.map((type) => (
                <span
                  key={type}
                  className="px-2 py-1 bg-blue-100 text-blue-900 rounded text-xs font-medium flex items-center gap-1"
                >
                  {getMediumIcon(type)} {type}
                  <button onClick={() => toggleMedium(type)} className="hover:text-blue-700">✕</button>
                </span>
              ))}
              {filters.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-1 bg-green-100 text-green-900 rounded text-xs font-medium flex items-center gap-1"
                >
                  {cat}
                  <button onClick={() => toggleCategory(cat)} className="hover:text-green-700">✕</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showEmotions || showMediums || showCategories) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowEmotions(false);
            setShowMediums(false);
            setShowCategories(false);
          }}
        />
      )}
    </div>
  );
}
