// src/components/EmotionLegend.tsx
import { typeColor } from "../lib/colors";

const typeOrder = ["Cinéma", "Art", "Jeux vidéo", "Littérature", "BD", "Music"];

export default function EmotionLegend() {
  return (
    <section className="mt-4 flex flex-col gap-3 text-xs text-slate-600 md:flex-row md:items-start md:justify-between">
      <div className="max-w-md space-y-1">
        <h2 className="font-semibold text-slate-700 text-sm">
          Carte valence × arousal
        </h2>
        <p>
          Chaque point représente une œuvre. Sa position horizontale correspond
          à la <span className="font-medium">valence</span> : de ressentis
          plutôt négatifs (à gauche) à plutôt positifs (à droite).
        </p>
        <p>
          Sa position verticale correspond à l{" "}
          <span className="font-medium">activation émotionnelle</span> (arousal)
          : de calme (en bas) à intense (en haut).
        </p>
        <p>
          Les couleurs indiquent le <span className="font-medium">type de
          média</span>.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
        {typeOrder.map((t) => (
          <div key={t} className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: typeColor[t] ?? "#64748b" }}
            />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </section>
  );
}