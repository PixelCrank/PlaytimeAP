import { useState } from "react";
import { useStore } from "../store/useStore";

export default function ShareSnapshotPanel({ onClose }: { onClose: () => void }) {
  const realm = useStore(s => s.realm);
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const [copied, setCopied] = useState(false);
  const [includeFilters, setIncludeFilters] = useState(true);

  const generateShareURL = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    
    if (!includeFilters) {
      return baseUrl;
    }

    const params = new URLSearchParams();
    params.set('realm', realm);
    
    if (centuryFilter) {
      params.set('century', centuryFilter.toString());
    }
    
    if (filters.types.length > 0) {
      params.set('types', filters.types.join(','));
    }
    
    if (filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','));
    }
    
    if (filters.emotions.length > 0) {
      params.set('emotions', filters.emotions.join(','));
    }
    
    if (filters.yearRange) {
      params.set('yearMin', filters.yearRange[0].toString());
      params.set('yearMax', filters.yearRange[1].toString());
    }
    
    if (filters.search) {
      params.set('search', filters.search);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const shareUrl = generateShareURL();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Impossible de copier l'URL");
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.types.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.emotions.length > 0) count++;
    if (filters.yearRange) count++;
    if (filters.search) count++;
    if (centuryFilter) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-violet-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              📸 Partager cette vue
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Générez un lien vers votre exploration actuelle
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-slate-600 px-2"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current View Summary */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Vue actuelle</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Royaume:</span>
                <span className="font-semibold">
                  {realm === 'human' ? '⏳ Humain' : 
                   realm === 'cosmic' ? '🌌 Cosmique' : 
                   '⚡ Perturbé'}
                </span>
              </div>
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Filtres actifs:</span>
                  <span className="font-semibold">{activeFiltersCount}</span>
                </div>
              )}
              {centuryFilter && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Siècle:</span>
                  <span className="font-semibold">{centuryFilter}e</span>
                </div>
              )}
            </div>
          </div>

          {/* Include Filters Toggle */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <input
              type="checkbox"
              id="includeFilters"
              checked={includeFilters}
              onChange={(e) => setIncludeFilters(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="includeFilters" className="text-sm text-slate-700 cursor-pointer">
              Inclure les filtres actuels dans le lien partagé
            </label>
          </div>

          {/* Share URL */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Lien de partage</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm font-mono"
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-violet-500 text-white hover:bg-violet-600'
                }`}
              >
                {copied ? '✓ Copié' : '📋 Copier'}
              </button>
            </div>
          </div>

          {/* Share Actions */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Partager via</h3>
            <div className="flex gap-2">
              <a
                href={`mailto:?subject=Découvrez cette exploration sur PlaytimeAP&body=${encodeURIComponent(shareUrl)}`}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-center text-sm font-semibold"
              >
                📧 Email
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Découvrez cette exploration sur PlaytimeAP')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 px-4 py-2 bg-sky-100 hover:bg-sky-200 rounded-lg text-center text-sm font-semibold"
              >
                🐦 Twitter
              </a>
            </div>
          </div>

          {/* Info */}
          <div className="text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-lg p-3">
            💡 <strong>Astuce:</strong> Les personnes qui ouvriront ce lien verront exactement la même vue que vous, avec les mêmes filtres et le même royaume sélectionné.
          </div>
        </div>
      </div>
    </div>
  );
}
