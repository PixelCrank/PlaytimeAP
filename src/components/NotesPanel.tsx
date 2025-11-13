import { useState, useEffect } from "react";
import { useStore } from "../store/useStore";

interface NotesPanelProps {
  workId: string;
}

export default function NotesPanel({ workId }: NotesPanelProps) {
  const addNote = useStore(s => s.addNote);
  const updateNote = useStore(s => s.updateNote);
  const deleteNote = useStore(s => s.deleteNote);
  const getNoteForWork = useStore(s => s.getNoteForWork);
  
  const existingNote = getNoteForWork(workId);
  const [content, setContent] = useState(existingNote?.content || "");
  const [isEditing, setIsEditing] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(existingNote?.updatedAt || null);

  // Update local state when work changes
  useEffect(() => {
    const note = getNoteForWork(workId);
    setContent(note?.content || "");
    setLastSaved(note?.updatedAt || null);
    setIsEditing(false);
  }, [workId, getNoteForWork]);

  // Auto-save after 1 second of inactivity
  useEffect(() => {
    if (!isEditing) return;
    
    const timer = setTimeout(() => {
      if (content.trim()) {
        addNote(workId, content);
        setLastSaved(Date.now());
      } else if (existingNote) {
        deleteNote(existingNote.id);
        setLastSaved(null);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, isEditing, workId, addNote, deleteNote, existingNote]);

  const handleDelete = () => {
    if (existingNote && confirm("Supprimer cette note ?")) {
      deleteNote(existingNote.id);
      setContent("");
      setLastSaved(null);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          📝 Notes personnelles
        </h3>
        {existingNote && (
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
          >
            🗑️ Supprimer
          </button>
        )}
      </div>

      {lastSaved && (
        <div className="text-xs text-slate-400 mb-2">
          Sauvegardée {formatTimestamp(lastSaved)}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsEditing(true);
        }}
        onBlur={() => setIsEditing(false)}
        placeholder="Ajoutez vos notes, réflexions, ou connexions avec d'autres œuvres..."
        className="w-full min-h-[120px] px-3 py-2 text-sm border border-slate-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-violet-400"
      />

      <div className="mt-2 text-xs text-slate-500">
        💡 Supporte le Markdown : **gras**, *italique*, [liens](url)
      </div>

      {/* Markdown Preview (simple) */}
      {content && !isEditing && (
        <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-xs font-semibold text-slate-600 mb-1">Aperçu:</div>
          <div 
            className="text-sm text-slate-700 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: content
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" class="text-violet-600 hover:underline">$1</a>')
            }}
          />
        </div>
      )}
    </div>
  );
}
