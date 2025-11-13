import { useStore } from "../store/useStore";
import { journeys } from "../lib/journeys";

export default function JourneySelector() {
  const selectedJourney = useStore(s => s.selectedJourney);
  const setJourney = useStore(s => s.setJourney);
  const setRealm = useStore(s => s.setRealm);
  const setFilters = useStore(s => s.setFilters);
  const setCenturyFilter = useStore(s => s.setCenturyFilter);

  const handleSelect = (journeyId: string | null) => {
    setJourney(journeyId);
    
    if (!journeyId) {
      // Reset filters
      setFilters({ categories: [], emotions: [] });
      setCenturyFilter(null);
      return;
    }

    const journey = journeys.find(j => j.id === journeyId);
    if (!journey) return;

    // Apply journey filters
    if (journey.realms && journey.realms.length > 0) {
      setRealm(journey.realms[0]);
    }
    
    if (journey.categories || journey.emotions) {
      setFilters({
        categories: journey.categories ?? [],
        emotions: journey.emotions ?? [],
      });
    }
    
    if (journey.century !== undefined) {
      setCenturyFilter(journey.century);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          🧭 Parcours guidés
        </h3>
        {selectedJourney && (
          <button
            onClick={() => handleSelect(null)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Réinitialiser
          </button>
        )}
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">
        Explorez le corpus selon des thématiques précises
      </p>
      <div className="space-y-2">
        {journeys.map((journey) => {
          const isActive = selectedJourney === journey.id;
          return (
            <button
              key={journey.id}
              type="button"
              onClick={() => handleSelect(isActive ? null : journey.id)}
              className={`w-full px-3 py-2.5 text-left rounded-lg border-2 transition-all ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-2">
                {isActive && <span className="text-sm">✓</span>}
                <div className="flex-1">
                  <div className="text-sm font-semibold">{journey.name}</div>
                  <div className={`text-xs mt-0.5 ${isActive ? "text-blue-100" : "text-slate-500"}`}>
                    {journey.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
