import { useState } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";

export default function QualitativeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const setSelectedId = useStore(s => s.setSelectedId);

  const handleSearch = () => {
    const all = data as any[];
    const lowerQuery = query.toLowerCase();
    
    const matches = all.filter(work => {
      const searchableText = [
        work.titre,
        work.createur,
        work.commentaire,
        ...(work.categories || []),
        ...(work.emotions || []),
        ...(work.motscles || []),
      ].join(" ").toLowerCase();
      
      return searchableText.includes(lowerQuery);
    });

    setResults(matches);
    setIsOpen(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-sm"
      >
        <span className="text-lg">🔍</span>
        <span className="font-medium text-slate-700">Recherche qualitative</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b bg-slate-50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-slate-900">🔍 Recherche qualitative</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-900 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          <p className="text-sm text-slate-600 mb-4">
            Cherchez par titre, créateur, émotion, catégorie, mot-clé ou thème...
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Ex: "nostalgie XIXe", "boucle temporelle", "Verne"...'
              className="flex-1 px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Chercher
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {results.length === 0 && query && (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg mb-2">Aucun résultat</p>
              <p className="text-sm">Essayez d'autres mots-clés</p>
            </div>
          )}

          {results.length === 0 && !query && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg mb-2">💭 Commencez à chercher</p>
              <p className="text-sm">Exemples de requêtes intéressantes :</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {["tristesse", "temps cosmique", "manipulation", "mémoire", "XIXe"].map(q => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-xs text-slate-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className="mb-4 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{results.length}</span> œuvre{results.length > 1 ? 's' : ''} trouvée{results.length > 1 ? 's' : ''}
              </div>

              <div className="space-y-3">
                {results.map((work) => (
                  <div
                    key={work.id}
                    className="p-4 border rounded-lg hover:border-blue-400 hover:shadow-sm transition cursor-pointer"
                    onClick={() => {
                      setSelectedId(work.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {work.titre}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {work.createur} • {work.type}
                        </p>
                        {work.commentaire && (
                          <p className="text-sm text-slate-700 line-clamp-2 mb-2">
                            {work.commentaire}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {work.emotions?.slice(0, 3).map((e: string) => (
                            <span key={e} className="px-2 py-0.5 bg-purple-50 border border-purple-200 text-xs rounded">
                              {e}
                            </span>
                          ))}
                          {work.categories?.slice(0, 2).map((c: string) => (
                            <span key={c} className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-xs rounded">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">{work.annee}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
