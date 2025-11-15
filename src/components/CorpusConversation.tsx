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
  filters?: {
    emotions: string[];
    types: string[];
    categories: string[];
    yearRange?: [number, number];
  };
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
    
    // Extract emotions (matches actual dataset)
    const emotions = [
      'tristesse', 'nostalgie', 'joie', 'peur', 'colère', 'surprise',
      'confiance', 'fascination', 'sérénité', 'tension', 'vigilance',
      'dégoût', 'admiration', 'excitation', 'ennui'
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
      if (emotions.length > 0 && !emotions.some((e: string) => w.emotions?.includes(e))) return false;
      if (century && w.anneeNum) {
        const wCentury = w.anneeNum < 1900 ? 19 : w.anneeNum < 2000 ? 20 : 21;
        if (wCentury !== century) return false;
      }
      if (decade && w.anneeNum) {
        const wDecade = Math.floor(w.anneeNum / 10) * 10;
        if (wDecade !== decade) return false;
      }
      if (mediaTypes.length > 0 && !mediaTypes.some((m: string) => w.type?.toLowerCase().includes(m))) return false;
      if (categories.length > 0 && !categories.some((c: string) => 
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
          const wCentury = w.anneeNum ? (w.anneeNum < 1900 ? 19 : w.anneeNum < 2000 ? 20 : 21) : 0;
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
          const decade = w.anneeNum ? Math.floor(w.anneeNum / 10) * 10 : 0;
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

    // Build filter object for apply button
    const filterObj = {
      emotions,
      types: mediaTypes.map((m: string) => {
        if (m.includes('cinéma')) return 'Cinéma';
        if (m.includes('jeu')) return 'Jeux vidéo';
        if (m.includes('littérature')) return 'Littérature';
        if (m.includes('musique')) return 'Music';
        if (m.includes('art')) return 'Art';
        if (m.includes('bd')) return 'BD';
        return m;
      }),
      categories,
      yearRange: decade ? [decade, decade + 9] as [number, number] : 
                 century ? [century === 19 ? 1800 : century === 20 ? 1900 : 2000, 
                           century === 19 ? 1899 : century === 20 ? 1999 : 2099] as [number, number] : 
                 undefined
    };

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content,
      works: filtered.slice(0, 12), // Limit to 12 results
      stats,
      filters: (emotions.length > 0 || mediaTypes.length > 0 || categories.length > 0 || decade || century) ? filterObj : undefined
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

  const generateCreativeOutput = (works: WorkNode[], type: 'script' | 'project' | 'adaptation' | 'collaboration') => {
    if (works.length === 0) return;

    const pick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const work1 = pick(works);
    const work2 = works.length > 1 ? pick(works.filter(w => w.id !== work1.id)) : work1;
    const work3 = works.length > 2 ? pick(works.filter(w => w.id !== work1.id && w.id !== work2.id)) : work2;

    let content = '';

    if (type === 'script') {
      const sharedEmotions = work1.emotions?.filter(e => work2.emotions?.includes(e)) || [];
      const emotion = sharedEmotions[0] || work1.emotions?.[0] || 'mélancolie';
      const decade1 = Math.floor((work1.anneeNum || 2000) / 10) * 10;
      const decade2 = Math.floor((work2.anneeNum || 2000) / 10) * 10;

      content = `🎬 **Concept de scénario généré**\n\n`;
      content += `**Titre provisoire**: "Entre ${decade1} et ${decade2}"\n\n`;
      content += `**Prémisse**: Un personnage découvre un objet mystérieux qui le connecte à deux époques (${decade1}s et ${decade2}s). `;
      content += `Inspiré par l'atmosphère de "${work1.titre}" (${work1.annee}) et la structure narrative de "${work2.titre}" (${work2.annee}), `;
      content += `le récit explore **${emotion}** à travers le temps.\n\n`;
      content += `**Médium suggéré**: ${work1.type === work2.type ? work1.type : `Hybride ${work1.type}/${work2.type}`}\n\n`;
      content += `**Thèmes centraux**: ${[...new Set([...(work1.categories || []), ...(work2.categories || [])].slice(0, 3))].join(', ')}\n\n`;
      content += `**Ton émotionnel**: ${[...new Set([...(work1.emotions || []), ...(work2.emotions || [])].slice(0, 4))].join(' → ')}\n\n`;
      content += `**Note créative**: Ce concept fusionne l'approche de "${work1.titre}" avec l'univers de "${work2.titre}" pour créer quelque chose de nouveau qui interroge notre relation au temps.`;
    }
    else if (type === 'project') {
      const allEmotions = works.flatMap(w => w.emotions || []);
      const emotionCounts = allEmotions.reduce((acc, e) => { acc[e] = (acc[e] || 0) + 1; return acc; }, {} as Record<string, number>);
      const topEmotions = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([e]) => e);
      
      const allCategories = works.flatMap(w => w.categories || []);
      const uniqueCategories = [...new Set(allCategories)].slice(0, 3);

      content = `🎨 **Proposition de projet artistique**\n\n`;
      content += `**Titre**: "Archive émotionnelle : ${topEmotions.join(', ')}"\n\n`;
      content += `**Concept**: Installation interactive explorant ${topEmotions[0]} à travers ${works.length} œuvres culturelles. `;
      content += `Visiteurs naviguent dans un espace physique où chaque zone représente une décennie, `;
      content += `avec des fragments de "${work1.titre}", "${work2.titre}", "${work3.titre}" et d'autres œuvres qui dialoguent.\n\n`;
      content += `**Format**: Installation multimédia (vidéo, son, texte, interactif)\n\n`;
      content += `**Expérience utilisateur**: Les visiteurs utilisent un dispositif tactile pour "remonter le temps" et découvrir comment ${topEmotions[0]} a évolué culturellement de ${Math.min(...works.map(w => w.anneeNum || 2000))} à ${Math.max(...works.map(w => w.anneeNum || 2000))}.\n\n`;
      content += `**Thématiques**: ${uniqueCategories.join(', ')}\n\n`;
      content += `**Public cible**: Amateurs d'art contemporain, chercheurs en études culturelles, grand public curieux\n\n`;
      content += `**Durabilité**: L'installation peut évoluer avec de nouvelles œuvres ajoutées par le public.`;
    }
    else if (type === 'adaptation') {
      const source = work1.type === 'Littérature' ? work1 : work2.type === 'Littérature' ? work2 : work1;
      const targetMediums = ['Jeux vidéo', 'Cinéma', 'Art visuel', 'Série TV'].filter(m => m !== source.type);
      const target = pick(targetMediums);

      content = `🔄 **Concept d'adaptation transmédia**\n\n`;
      content += `**Source**: "${source.titre}" (${source.annee}, ${source.type})\n`;
      content += `**Vers**: ${target}\n\n`;
      content += `**Vision créative**: `;
      
      if (target === 'Jeux vidéo') {
        content += `Transformer l'univers de "${source.titre}" en jeu narratif où les choix du joueur manipulent le temps. `;
        content += `Genre: Aventure narrative avec mécaniques de boucles temporelles. `;
        content += `Le joueur incarne un personnage qui doit comprendre ${source.emotions?.[0] || 'nostalgie'} pour progresser.`;
      } else if (target === 'Cinéma') {
        content += `Adaptation cinématographique qui capture l'essence émotionnelle de "${source.titre}". `;
        content += `Style visuel: ${source.emotions?.includes('mélancolie') ? 'Palette désaturée, lumière naturelle' : 'Contrastes forts, couleurs vibrantes'}. `;
        content += `Durée: Long-métrage (110 min) ou série limitée (6 épisodes).`;
      } else if (target === 'Art visuel') {
        content += `Série d'installations qui matérialisent les thèmes de "${source.titre}". `;
        content += `Médiums: Sculpture, projection vidéo, son ambiant. `;
        content += `Chaque salle explore une émotion clé: ${source.emotions?.slice(0, 3).join(', ')}.`;
      } else {
        content += `Série TV en ${work2.anneeNum && work2.anneeNum > 2015 ? '8' : '6'} épisodes qui étend l'univers de "${source.titre}". `;
        content += `Chaque épisode explore une période temporelle différente, connectée par ${source.emotions?.[0] || 'nostalgie'}.`;
      }
      
      content += `\n\n**Pourquoi ça marcherait**: L'exploration de ${source.categories?.slice(0, 2).join(' et ') || 'temps et identité'} dans "${source.titre}" se prête parfaitement à ${target === 'Jeux vidéo' ? 'l\'interactivité' : target === 'Cinéma' ? 'la narration visuelle' : 'l\'expérience immersive'}.`;
    }
    else if (type === 'collaboration') {
      content = `🤝 **Collaboration impossible**\n\n`;
      content += `**Concept**: Et si ${work1.createur || 'le créateur de "' + work1.titre + '"'} rencontrait "${work2.titre}" ?\n\n`;
      content += `**Pitch**: Imaginez ${work1.createur || 'le créateur de "' + work1.titre + '"'} (${work1.annee}) `;
      content += `découvrant "${work2.titre}" (${work2.annee}). `;
      
      const yearDiff = Math.abs((work1.anneeNum || 0) - (work2.anneeNum || 0));
      if (yearDiff > 50) {
        content += `Malgré ${yearDiff} ans d'écart, `;
      } else {
        content += `Séparés par ${yearDiff} ans, `;
      }
      
      content += `ces deux œuvres partagent ${work1.emotions?.filter(e => work2.emotions?.includes(e)).length || 'plusieurs'} émotions communes.\n\n`;
      content += `**Projet résultant**: Une œuvre hybride ${work1.type}/${work2.type} qui explore `;
      content += `${[...new Set([...(work1.emotions || []), ...(work2.emotions || [])])].slice(0, 2).join(' et ')} `;
      content += `à travers une lentille ${work3.categories?.[0] || 'temporelle'}.\n\n`;
      content += `**Titre provisoire**: "${work1.titre.split(' ')[0]} ${work2.titre.split(' ').slice(-1)[0]}"\n\n`;
      content += `**Inspiration**: Ce projet synthétiserait l'approche de "${work1.titre}" avec l'univers de "${work2.titre}" pour créer une expérience inédite.`;
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'assistant',
      content
    }]);
  };

  const suggestions = [
    "Quelles œuvres explorent la nostalgie ?",
    "Pourquoi la tristesse domine-t-elle le XXe siècle ?",
    "Montre-moi des œuvres sur l'identité",
    "Combien d'œuvres du XIXe siècle parlent de mémoire ?",
    "Quelles œuvres de cinéma explorent le temps écologique ?",
    "Trouve des œuvres similaires à 1984"
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

              {/* Interactive actions */}
              {msg.type === 'assistant' && msg.works && msg.works.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
                  {/* Analysis actions */}
                  {msg.filters && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setFilters({
                            types: msg.filters!.types,
                            categories: msg.filters!.categories,
                            emotions: msg.filters!.emotions,
                            yearRange: msg.filters!.yearRange || null,
                            search: "",
                            realmFilter: "tous",
                            centuryFilter: "tous"
                          });
                        }}
                        className="px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                      >
                        🔍 Appliquer les filtres
                      </button>
                      
                      {msg.works.length >= 2 && (
                        <button
                          onClick={() => {
                            const random1 = msg.works![Math.floor(Math.random() * msg.works!.length)];
                            const random2 = msg.works![Math.floor(Math.random() * msg.works!.length)];
                            if (random1.id !== random2.id) {
                              const suggestion = `💡 **Découverte suggérée**: Comparez "${random1.titre}" (${random1.annee}) et "${random2.titre}" (${random2.annee}) - elles partagent ${
                                random1.emotions?.filter(e => random2.emotions?.includes(e)).length || 0
                              } émotions communes !`;
                              
                              setMessages(prev => [...prev, {
                                id: Date.now().toString(),
                                type: 'assistant',
                                content: suggestion
                              }]);
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                        >
                          ✨ Suggérer une comparaison
                        </button>
                      )}
                      
                      {msg.works.length >= 3 && (
                        <button
                          onClick={() => {
                            const emotions = msg.works!.flatMap(w => w.emotions || []);
                            const emotionCounts = emotions.reduce((acc, e) => {
                              acc[e] = (acc[e] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>);
                            const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
                            
                            const decades = msg.works!.map(w => Math.floor((w.anneeNum || 0) / 10) * 10).filter(d => d > 0);
                            const uniqueDecades = [...new Set(decades)].sort();
                            
                            const insight = `📊 **Pattern détecté**: Ces ${msg.works!.length} œuvres sont unies par **${topEmotion[0]}** (${topEmotion[1]} occurrences) et s'étendent sur ${uniqueDecades.length} décennies (${uniqueDecades[0]}s à ${uniqueDecades[uniqueDecades.length - 1]}s). Cette continuité temporelle suggère que cette émotion traverse les époques culturelles.`;
                            
                            setMessages(prev => [...prev, {
                              id: Date.now().toString(),
                              type: 'assistant',
                              content: insight
                            }]);
                          }}
                          className="px-3 py-1.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition"
                        >
                          📊 Analyser les patterns
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Creative generation - only if 2+ works */}
                  {msg.works.length >= 2 && (
                    <div>
                      <div className="text-xs font-semibold text-slate-600 mb-2">🎨 Générateur créatif :</div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => generateCreativeOutput(msg.works!, 'script')}
                          className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-lg hover:from-pink-200 hover:to-rose-200 transition"
                        >
                          🎬 Scénario
                        </button>
                        <button
                          onClick={() => generateCreativeOutput(msg.works!, 'project')}
                          className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-lg hover:from-cyan-200 hover:to-blue-200 transition"
                        >
                          🎨 Projet artistique
                        </button>
                        <button
                          onClick={() => generateCreativeOutput(msg.works!, 'adaptation')}
                          className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-lg hover:from-emerald-200 hover:to-green-200 transition"
                        >
                          🔄 Adaptation
                        </button>
                        <button
                          onClick={() => generateCreativeOutput(msg.works!, 'collaboration')}
                          className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 rounded-lg hover:from-violet-200 hover:to-purple-200 transition"
                        >
                          🤝 Collaboration
                        </button>
                      </div>
                    </div>
                  )}
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
