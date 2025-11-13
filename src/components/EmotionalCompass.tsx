import { useStore } from "../store/useStore";

export default function EmotionalCompass() {
  const realm = useStore(s => s.realm);
  const setRealm = useStore(s => s.setRealm);

  const btn = (key: any, label: string) => (
    <button
      onClick={() => setRealm(key)}
      className={`px-3 py-1 rounded-full border text-sm ${realm === key ? "bg-black text-white" : "bg-white"}`}
      aria-pressed={realm === key}
    >{label}</button>
  );

  return (
    <div className="flex items-center gap-2">
      {btn("cosmic", "Cosmic")}
      {btn("human", "Human")}
      {btn("disrupted", "Disrupted")}
    </div>
  );
}
