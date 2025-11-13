import { useMemo } from "react";
import works from "../data/works.json";
import type { WorkNode } from "../lib/types";
import { useStore } from "../store/useStore";

const entries = works as WorkNode[];

const formatList = (items: string[] | undefined) =>
  items && items.length > 0 ? items.join(" · ") : "—";

export default function NodeDrawer() {
  const selectedId = useStore(s => s.selectedId);
  const setSelectedId = useStore(s => s.setSelectedId);
  const togglePin = useStore(s => s.togglePin);
  const pinned = useStore(s => s.pinned);

  const node = useMemo(() => entries.find(w => w.id === selectedId) ?? null, [selectedId]);

  if (!node) {
    return (
      <aside
        className="mt-6 md:mt-0 md:absolute md:inset-y-0 md:right-0 md:w-96 border rounded-lg bg-white/90 backdrop-blur p-4 shadow-sm"
        aria-live="polite"
      >
        <h2 className="text-lg font-semibold">Explorer les œuvres</h2>
        <p className="mt-2 text-sm text-slate-600">
          Cliquez sur un point de la carte pour ouvrir la fiche détaillée d'une œuvre. Utilisez la boussole pour naviguer entre les trois royaumes du temps.
        </p>
      </aside>
    );
  }

  const isPinned = pinned.has(node.id);

  return (
    <aside
      className="mt-6 md:mt-0 md:absolute md:inset-y-0 md:right-0 md:w-96 border rounded-lg bg-white/95 backdrop-blur p-4 shadow-md flex flex-col"
      aria-live="polite"
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{node.type}</p>
          <h2 className="text-xl font-semibold leading-snug">{node.titre}</h2>
          {node.createur && (
            <p className="text-sm text-slate-600">{node.createur}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => togglePin(node.id)}
            className={`text-xs border rounded-full px-3 py-1 ${isPinned ? "bg-black text-white" : "bg-white"}`}
          >
            {isPinned ? "Épinglé" : "Épingler"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Fermer
          </button>
        </div>
      </header>

      <div className="mt-4 space-y-3 text-sm text-slate-700 overflow-y-auto">
        {node.annee && (
          <p><strong className="font-medium text-slate-900">Année :</strong> {node.annee}</p>
        )}
        {node.medium && (
          <p><strong className="font-medium text-slate-900">Médium :</strong> {node.medium}</p>
        )}
        <p><strong className="font-medium text-slate-900">Catégories :</strong> {formatList(node.categories)}</p>
        <p><strong className="font-medium text-slate-900">Émotions :</strong> {formatList(node.emotions)}</p>
        {node.motsCles?.length ? (
          <p><strong className="font-medium text-slate-900">Mots-clés :</strong> {node.motsCles.join(", ")}</p>
        ) : null}
        {node.commentaire && (
          <p className="text-slate-600 whitespace-pre-line leading-relaxed">{node.commentaire}</p>
        )}
        {node.lien && (
          <p>
            <a
              href={node.lien.trim()}
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 hover:text-sky-800 underline"
            >
              Ressource
            </a>
          </p>
        )}
      </div>
    </aside>
  );
}