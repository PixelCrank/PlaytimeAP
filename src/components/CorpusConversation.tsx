import { useState, useMemo, useRef, useEffect } from "react";
import { useStore } from "../store/useStore";
import works from "../data/works.json";
import type { WorkNode } from "../lib/types";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  works?: WorkNode[];
  stats?: any;
}

export default function CorpusConversation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'assistant',
      content: "👋 Bonjour ! Je suis votre assistant de recherche. Posez-moi des questions sur le corpus : \"Quelles œuvres explorent la nostalgie ?\", \"Pourquoi la tristesse domine-t-elle le XXe siècle ?\", \"Montre-moi des œuvres similaires à 1984\"..."
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const setFilters = useStore(s => s.setFilters);
  const setSelectedId = useStore(s => s.setSelectedId);

  const allWorks = works as WorkNode[];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const parseQuery = (query: string) => {
    const q = query.toLowerCase();
    
    // Extract emotions
    const emotions = [
      'tristesse', 'nostalgie', 'joie', 'peur', 'colère', 'surprise',
      'anticipation', 'confiance', 'mélancolie', 'fascination', 'sérénité',
      'anxiété', 'tension', 'vigilance', 'dégoût'
    ].filter(e => q.includes(e));

    // Extract centuries/decades
    let century = null;
    if (q.includes('xixe') || q.includes('xix') || q.includes('19')) century = 19;
    if (q.includes('xxe') || q.includes('xx') || q.includes('20')) century = 20;
    if (q.includes('xxie') || q.includes('xxi') || q.includes('21')) century = 21;

    // Extract decades
    const decadeMatch = q.match(/(\d{4})s|années (\d{4})|(\d{4})/);
    const decade = decadeMatch ? Math.floor(parseInt(decadeMatch[1] || decadeMatch[2] || decadeMatch[3]) / 10) * 10 : null;

    // Extract media types
    const mediaTypes = ['littérature', 'cinéma', 'jeu vidéo', 'musique', 'art', 'bd', 'philosophie']
      .filter(m => q.includes(m));

    // Extract categories/themes
    const categories = [
      'identité', 'mémoire', 'temps vécu', 'cosmique', 'écologique',
      'technologique', 'humain', 'dérangé'
    ].filter(c => q.includes(c));

    // Detect query intent
    const intent = {
      isWhy: q.includes('pourquoi') || q.includes('why'),
      isHow: q.includes('comment') || q.includes('how'),
      isWhat: q.includes('quel') || q.includes('quoi') || q.includes('what'),
      isShow: q.includes('montre') || q.includes('trouve') || q.includes('show') || q.includes('find'),
      isCompare: q.includes('compar') || q.includes('versus') || q.includes('vs'),
      isSimilar: q.includes('similaire') || q.includes('ressembl') || q.includes('comme'),
      isCount: q.includes('combien') || q.includes('how many')
    };

    return { emotions, century, decade, mediaTypes, categories, intent };
  };

  const generateResponse = (query: string, parsed: any): Message => {
    const { emotions, century, decade, mediaTypes, categories, intent } = parsed;

    // Filter works based on parsed criteria
    let filtered = allWorks.filter(w => {
      if (emotions.length > 0 && !emotions.some(e => w.emotions?.includes(e))) return false;
      if (century && w.annee) {
        const wCentury = w.annee < 1900 ? 19 : w.annee < 2000 ? 20 : 21;
        if (wCentury !== century) return false;
      }
      if (decade && w.annee) {
        const wDecade = Math.floor(w.annee / 10) * 10;
        if (wDecade !== decade) return false;
      }
      if (mediaTypes.length > 0 && !mediaTypes.some(m => w.type?.toLowerCase().includes(m))) return false;
      if (categories.length > 0 && !categories.some(c => 
        w.categories?.some(wc => wc.toLowerCase().includes(c))
      )) return false;
      return true;
    });

    // Generate contextual response based on intent
    let content = '';
    let stats: any = {};

    if (intent.isWhy) {
      // Explain patterns
      if (emotions.length > 0 && century) {
        const emotionName = emotions[0];
        const centuryWorks = allWorks.filter(w => {
          const wCentury = w.annee ? (w.annee < 1900 ? 19 : w.annee < 2000 ? 20 : 21) : 0;
          return wCentury === century;
        });
        const emotionCount = centuryWorks.filter(w => w.emotions?.includes(emotionName)).length;
        const percent = Math.round((emotionCount / centuryWorks.length) * 100);

        content = `📊 **${emotionName}** apparaît dans **${emotionCount} œuvres** du **${century}ᵉ siècle** (${percent}% du total). `;
        
        if (percent > 20) {
          content += `Cette forte présence s'explique par les bouleversements historiques de cette période : guerres mondiales, révolutions industrielles, et questionnements existentiels qui ont marqué la production culturelle.`;
        } else {
          content += `Cette présence modérée suggère que d'autres émotions dominaient les préoccupations artistiques de l'époque.`;
        }
      } else {
        content = "Pour répondre à 'pourquoi', précisez une émotion et une période. Ex: 'Pourquoi la tristesse domine-t-elle le XXe siècle ?'";
      }
    }
    else if (intent.isShow || intent.isWhat) {
      // Show matching works
      if (filtered.length > 0) {
        content = `✨ J'ai trouvé **${filtered.length} œuvre${filtered.length > 1 ? 's' : ''}** correspondant à votre recherche`;
        
        if (emotions.length > 0) content += ` sur **${emotions.join(', ')}**`;
        if (century) content += ` du **${century}ᵉ siècle**`;
        if (categories.length > 0) content += ` explorant **${categories.join(', ')}**`;
        
        content += '. Cliquez sur une œuvre ci-dessous pour explorer ses détails.';

        // Add stats
        const mediaBreakdown = filtered.reduce((acc, w) => {
          acc[w.type] = (acc[w.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        stats = { mediaBreakdown, total: filtered.length };
      } else {
        content = "😔 Aucune œuvre ne correspond à ces critères. Essayez d'élargir votre recherche.";
      }
    }
    else if (intent.isCount) {
      // Count statistics
      content = `📈 **${filtered.length} œuvre${filtered.length > 1 ? 's' : ''}** correspond${filtered.length > 1 ? 'ent' : ''} à votre recherche.`;
      
      if (filtered.length > 0) {
        const byDecade = filtered.reduce((acc, w) => {
          const decade = w.annee ? Math.floor(w.annee / 10) * 10 : 0;
          acc[decade] = (acc[decade] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        const peakDecade = Object.entries(byDecade).sort((a, b) => b[1] - a[1])[0];
        content += ` Pic de production dans les années **${peakDecade[0]}** avec **${peakDecade[1]} œuvres**.`;
      }
    }
    else {
      // General search
      if (filtered.length > 0) {
        content = `🔍 **${filtered.length} œuvre${filtered.length > 1 ? 's' : ''}** trouvée${filtered.length > 1 ? 's' : ''}. `;
        
        const topEmotion = filtered
          .flatMap(w => w.emotions || [])
          .reduce((acc, e) => { acc[e] = (acc[e] || 0) + 1; return acc; }, {} as Record<string, number>);
        
        const dominant = Object.entries(topEmotion).sort((a, b) => b[1] - a[1])[0];
        if (dominant) {
          content += `L'émotion dominante est **${dominant[0]}** (${dominant[1]} occurrences).`;
        }
      } else {
        content = "💡 Essayez une recherche comme : 'Montre-moi des œuvres sur la nostalgie', 'Quelles œuvres explorent le temps écologique ?', ou 'Combien d'œuvres du XXe siècle ?'";
      }
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content,
      works: filtered.slice(0, 12), // Limit to 12 results
      stats
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };
    setMessages(prev => [...prev, userMessage]);

    // Parse and generate response
    setTimeout(() => {
      const parsed = parseQuery(input);
      const response = generateResponse(input, parsed);
      setMessages(prev => [...prev, response]);
      setInput('');
      setIsProcessing(false);
    }, 300);
  };

  const suggestions = [
    "Quelles œuvres explorent la nostalgie ?",
    "Pourquoi la tristesse domine-t-elle le XXe siècle ?",
    "Montre-moi des œuvres sur l'identité",
    "Combien d'œuvres du XIXe siècle parlent de mémoire ?",
    "Trouve des films sur le temps écologique"
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.type === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white shadow-md border border-slate-200'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-line">
                {msg.content.split('**').map((part, i) =>
                  i % 2 === 0 ? (
                    <span key={i}>{part}</span>
                  ) : (
                    <strong key={i} className={msg.type === 'user' ? 'font-bold' : 'font-semibold text-slate-900'}>{part}</strong>
                  )
                )}
              </div>

              {/* Display matching works */}
              {msg.works && msg.works.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.works.map((work) => (
                    <button
                      key={work.id}
                      onClick={() => setSelectedId(work.id)}
                      className="w-full text-left p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition group"
                    >
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600">
                        {work.titre}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {work.type} • {work.annee || '?'}
                        {work.emotions && ` • ${work.emotions.slice(0, 2).join(', ')}`}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Display stats */}
              {msg.stats && msg.stats.mediaBreakdown && (
                <div className="mt-3 text-xs text-slate-600 bg-slate-50 rounded-lg p-2">
                  <strong>Répartition:</strong>{' '}
                  {Object.entries(msg.stats.mediaBreakdown).map(([type, count], i, arr) => (
                    <span key={type}>
                      {type}: {count as number}
                      {i < arr.length - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions (show when no messages) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <div className="text-xs font-semibold text-slate-600 mb-2">Essayez :</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => setInput(sug)}
                className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question sur le corpus..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
          >
            {isProcessing ? '...' : 'Envoyer'}
          </button>
        </div>
      </form>
    </div>
  );
}
