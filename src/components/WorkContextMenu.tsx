import { useState, useEffect } from "react";
import { useStore } from "../store/useStore";

interface WorkContextMenuProps {
  workId: string;
  x: number;
  y: number;
  onClose: () => void;
}

export default function WorkContextMenu({ workId, x, y, onClose }: WorkContextMenuProps) {
  const toggleBookmark = useStore(s => s.toggleBookmark);
  const bookmarked = useStore(s => s.bookmarked);
  const addToComparison = useStore(s => s.addToComparison);
  const comparisonWorkIds = useStore(s => s.comparisonWorkIds);
  const setSelectedId = useStore(s => s.setSelectedId);

  const isBookmarked = bookmarked.has(workId);
  const isInComparison = comparisonWorkIds.includes(workId);
  const canAddToComparison = comparisonWorkIds.length < 2 || isInComparison;

  useEffect(() => {
    const handleClickOutside = () => onClose();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  // Adjust position to stay on screen
  const menuWidth = 200;
  const menuHeight = 180;
  const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  return (
    <div
      className="fixed z-[200] bg-white border-2 border-slate-300 rounded-lg shadow-2xl py-2 min-w-[200px]"
      style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => handleAction(() => setSelectedId(workId))}
        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-3"
      >
        <span className="text-lg">👁️</span>
        <span>Voir les détails</span>
      </button>

      <button
        onClick={() => handleAction(() => toggleBookmark(workId))}
        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-3"
      >
        <span className="text-lg">{isBookmarked ? '⭐' : '☆'}</span>
        <span>{isBookmarked ? 'Retirer de' : 'Ajouter à'} la collection</span>
      </button>

      <div className="border-t my-1" />

      <button
        onClick={() => handleAction(() => addToComparison(workId))}
        disabled={!canAddToComparison && !isInComparison}
        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
      >
        <span className="text-lg">⚖️</span>
        <span>
          {isInComparison 
            ? 'Dans la comparaison' 
            : comparisonWorkIds.length >= 2
            ? 'Remplacer dans comparaison'
            : 'Ajouter à la comparaison'}
        </span>
      </button>

      {comparisonWorkIds.length === 1 && !isInComparison && (
        <div className="px-4 py-1 text-xs text-slate-500 italic">
          Sera comparé avec l'œuvre sélectionnée
        </div>
      )}
    </div>
  );
}
