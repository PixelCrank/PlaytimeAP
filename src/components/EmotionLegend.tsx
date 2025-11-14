// src/components/EmotionLegend.tsx
import { typeColor } from "../lib/colors";

const typeOrder = ["Cinéma", "Art", "Jeux vidéo", "Littérature", "BD", "Music"];

export default function EmotionLegend() {
  return (
    <section className="mt-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 p-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="max-w-md space-y-2">
        <h2 className="font-semibold text-slate-900 text-base">
          Carte valence × arousal
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          Chaque point représente une œuvre. Sa position horizontale correspond
          à la <span className="font-semibold text-slate-900">valence</span> : de ressentis
          plutôt négatifs (à gauche) à plutôt positifs (à droite).
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          Sa position verticale correspond à l{" "}
          <span className="font-semibold text-slate-900">activation émotionnelle</span> (arousal)
          : de calme (en bas) à intense (en haut).
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          Les couleurs indiquent le <span className="font-semibold text-slate-900">type de
          média</span>.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
        {typeOrder.map((t) => (
          <div key={t} className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: typeColor[t] ?? "#64748b" }}
            />
            <span className="text-sm font-medium text-slate-900">{t}</span>
          </div>
        ))}
      </div>
    </section>
  );
}