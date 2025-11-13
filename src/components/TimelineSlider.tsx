import { useStore } from "../store/useStore";

export default function TimelineSlider() {
  const centuryFilter = useStore(s => s.centuryFilter);
  const setCenturyFilter = useStore(s => s.setCenturyFilter);

  const btn = (value: 19 | 20 | null, label: string) => (
    <button
      type="button"
      onClick={() => setCenturyFilter(value)}
      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
        centuryFilter === value
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
      }`}
      aria-pressed={centuryFilter === value}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 mr-1">Époque :</span>
      {btn(null, "Toutes")}
      {btn(19, "XIXe")}
      {btn(20, "XXe+")}
    </div>
  );
}
