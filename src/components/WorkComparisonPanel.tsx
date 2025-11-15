import { useMemo, useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import data from "../data/works.json";
import type { WorkNode } from "../lib/types";
import TemporalDNAFingerprint from "./TemporalDNAFingerprint";

export default function WorkComparisonPanel() {
  const comparisonWorkIds = useStore(s => s.comparisonWorkIds);
  const removeFromComparison = useStore(s => s.removeFromComparison);
  const clearComparison = useStore(s => s.clearComparison);
  const setSelectedId = useStore(s => s.setSelectedId);
  const [isExpanded, setIsExpanded] = useState(false);

  const works = useMemo(() => {
    const allWorks = data as WorkNode[];
    return comparisonWorkIds.map(id => allWorks.find(w => w.id === id)).filter(Boolean) as WorkNode[];
  }, [comparisonWorkIds]);

  // Safety check: clear comparison if works can't be found
  useEffect(() => {
    if (comparisonWorkIds.length >= 2 && works.length < 2) {
      console.error('Comparison error: Unable to find works', comparisonWorkIds);
      clearComparison();
    }
  }, [comparisonWorkIds, works.length, clearComparison]);

  // Generate contextual insights - must be before any returns (Rules of Hooks)
  const generateInsights = useMemo(() => {
    if (works.length < 2) return [];
    
    const [work1, work2] = works;
    if (!work1 || !work2) return [];
    
    const insights: string[] = [];
    
    // Calculate comparison data inline for insights
    const emotions1 = new Set(work1.emotions || []);
    const emotions2 = new Set(work2.emotions || []);
    const sharedEmotions = [...emotions1].filter(e => emotions2.has(e));
    const sameMedium = work1.type === work2.type;
    const sameRealm = work1.realm === work2.realm;
    
    const year1 = work1.annee ? parseInt(work1.annee.match(/\d{4}/)?.[0] || '0') : 0;
    const year2 = work2.annee ? parseInt(work2.annee.match(/\d{4}/)?.[0] || '0') : 0;
    const temporalDistance = year1 && year2 ? Math.abs(year1 - year2) : null;
    
    // Temporal insights
    if (temporalDistance) {
      if (temporalDistance < 10) {
        insights.push(`Ces œuvres sont contemporaines (${temporalDistance} ans d'écart) et reflètent probablement les mêmes contextes culturels.`);
      } else if (temporalDistance > 100) {
        insights.push(`Malgré ${temporalDistance} ans de distance, ces œuvres dialoguent à travers le temps sur des préoccupations similaires.`);
      }
    }
    
    // Cross-medium insights
    if (!sameMedium) {
      insights.push(`Cette comparaison trans-média entre ${work1.type} et ${work2.type} révèle comment différents médiums explorent des territoires émotionnels similaires.`);
    }
    
    // Emotional resonance
    if (sharedEmotions.length >= 2) {
      insights.push(`L'intersection émotionnelle (${sharedEmotions.join(', ')}) suggère une résonance profonde dans leur rapport au temps.`);
    }
    
    // Realm insights
    if (sameRealm) {
      const realmLabels = { cosmic: 'cosmique', human: 'humain', disrupted: 'dérangé' };
      insights.push(`Les deux œuvres appartiennent au monde ${realmLabels[work1.realm as keyof typeof realmLabels]}, partageant une vision similaire de la temporalité.`);
    } else {
      insights.push(`Ces œuvres explorent des "mondes du temps" différents (${work1.realm} vs ${work2.realm}), offrant des perspectives complémentaires.`);
    }
    
    return insights;
  }, [works]);

  const comparison = useMemo(() => {
    if (works.length < 2) return null;

    const [work1, work2] = works;
    
    // Safety check - ensure both works exist
    if (!work1 || !work2) return null;

    // Emotion comparison
    const emotions1 = new Set(work1.emotions || []);
    const emotions2 = new Set(work2.emotions || []);
    const sharedEmotions = [...emotions1].filter(e => emotions2.has(e));
    const uniqueEmotions1 = [...emotions1].filter(e => !emotions2.has(e));
    const uniqueEmotions2 = [...emotions2].filter(e => !emotions1.has(e));

    // Category comparison
    const categories1 = new Set(work1.categories || []);
    const categories2 = new Set(work2.categories || []);
    const sharedCategories = [...categories1].filter(c => categories2.has(c));
    const uniqueCategories1 = [...categories1].filter(c => !categories2.has(c));
    const uniqueCategories2 = [...categories2].filter(c => !categories1.has(c));

    // Temporal distance
    const year1 = work1.annee ? parseInt(work1.annee.match(/\d{4}/)?.[0] || '0') : 0;
    const year2 = work2.annee ? parseInt(work2.annee.match(/\d{4}/)?.[0] || '0') : 0;
    const temporalDistance = year1 && year2 ? Math.abs(year1 - year2) : null;

    // Similarity score
    const emotionScore = sharedEmotions.length * 3;
    const categoryScore = sharedCategories.length * 2;
    const mediumScore = work1.type === work2.type ? 2 : 0;
    const centuryScore = work1.anneeNum === work2.anneeNum ? 1 : 0;
    const totalScore = emotionScore + categoryScore + mediumScore + centuryScore;
    const maxPossible = (Math.max(emotions1.size, emotions2.size) * 3) + 
                        (Math.max(categories1.size, categories2.size) * 2) + 3;
    const similarityPercent = Math.round((totalScore / maxPossible) * 100);

    return {
      sharedEmotions,
      uniqueEmotions1,
      uniqueEmotions2,
      sharedCategories,
      uniqueCategories1,
      uniqueCategories2,
      temporalDistance,
      similarityPercent,
      totalScore,
      sameMedium: work1.type === work2.type,
      sameCentury: work1.anneeNum === work2.anneeNum,
      sameRealm: work1.realm === work2.realm,
    };
  }, [works]);

  if (works.length === 0) {
    return (
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-6 right-6 bg-white border-2 border-indigo-300 rounded-full shadow-lg hover:shadow-xl transition-all p-4 z-50 group"
        title="Comparaison d'œuvres"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚖️</span>
          <span className="text-sm font-medium text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap">
            Comparer des œuvres
          </span>
        </div>
      </button>
    );
  }

  if (works.length === 1) {
    // Compact badge showing 1 work selected
    if (!isExpanded) {
      return (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all px-4 py-3 z-50 flex items-center gap-2"
        >
          <span className="text-xl">⚖️</span>
          <span className="text-sm font-medium">1 œuvre · Cliquez pour comparer</span>
          <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">
            +
          </span>
        </button>
      );
    }

    return (
      <div className="fixed bottom-6 right-6 bg-white border-2 border-indigo-300 rounded-2xl shadow-2xl p-6 w-96 z-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <h3 className="text-lg font-bold text-slate-900">Comparaison</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-slate-600 text-xl"
              title="Réduire"
            >
              −
            </button>
            <button
              onClick={clearComparison}
              className="text-slate-400 hover:text-slate-600 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="font-medium text-slate-900 mb-1">{works[0].titre}</div>
              <div className="text-xs text-slate-600">{works[0].createur}</div>
              <div className="text-xs text-slate-500 mt-1">{works[0].type} • {works[0].annee}</div>
            </div>
            <button
              onClick={() => removeFromComparison(works[0].id)}
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-slate-600">
          Sélectionnez une deuxième œuvre pour comparer
        </div>
      </div>
    );
  }

  // Two works selected - show compact badge when collapsed
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all px-4 py-3 z-50 flex items-center gap-2"
      >
        <span className="text-xl">⚖️</span>
        <span className="text-sm font-medium">{comparison?.similarityPercent}% similaire</span>
        <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">
          ↕
        </span>
      </button>
    );
  }

  // Two works selected - expanded view
  return (
    <div className="fixed bottom-6 right-6 bg-white border-2 border-indigo-300 rounded-2xl shadow-2xl p-6 w-[700px] max-h-[85vh] overflow-y-auto z-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚖️</span>
          <h3 className="text-lg font-bold text-slate-900">Analyse comparative</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(false)}
            className="text-slate-400 hover:text-slate-600 text-xl"
            title="Réduire"
          >
            −
          </button>
          <button
            onClick={clearComparison}
            className="text-slate-400 hover:text-slate-600 text-xl"
            title="Fermer"
          >
            ×
          </button>
        </div>
      </div>

      {/* Similarity Score */}
      <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl p-4 mb-4 border-2 border-violet-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-violet-900">Similarité globale</span>
          <span className="text-2xl font-bold text-violet-900">{comparison?.similarityPercent}%</span>
        </div>
        <div className="w-full bg-white/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all"
            style={{ width: `${comparison?.similarityPercent}%` }}
          />
        </div>
        <div className="mt-2 flex gap-2 flex-wrap text-xs">
          {comparison?.sameMedium && (
            <span className="px-2 py-1 bg-white/60 rounded">Même médium</span>
          )}
          {comparison?.sameCentury && (
            <span className="px-2 py-1 bg-white/60 rounded">Même siècle</span>
          )}
          {comparison?.sameRealm && (
            <span className="px-2 py-1 bg-white/60 rounded">Même royaume</span>
          )}
        </div>
      </div>

      {/* DNA Fingerprint Comparison */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span>🧬</span>
          Empreintes ADN temporelles
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {works.map((work, idx) => (
            <div key={`dna-${idx}`} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border-2 border-slate-200">
              <div className="text-xs font-semibold text-slate-700 mb-3 text-center">
                {work.titre.slice(0, 40)}{work.titre.length > 40 ? '...' : ''}
              </div>
              <TemporalDNAFingerprint work={work} size={160} showLabels={false} />
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-600 bg-blue-50 rounded-lg p-3 border border-blue-200">
          <strong>Légende:</strong> Les formes montrent les profils uniques de chaque œuvre. 
          Plus les formes sont similaires, plus les œuvres partagent des caractéristiques structurelles.
        </div>
      </div>

      {/* Side-by-Side Metadata Table */}
      <div className="mb-4">
        <div className="grid grid-cols-[120px_1fr_1fr] gap-2 text-xs">
          {/* Header */}
          <div className="font-semibold text-slate-700 py-2"></div>
          {works.map((work, idx) => (
            <div key={`header-${idx}`} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border">
              <button
                onClick={() => setSelectedId(work.id)}
                className="font-medium text-slate-900 text-left hover:text-indigo-600 transition w-full"
              >
                {work.titre}
              </button>
              <div className="text-slate-600 mt-1">{work.createur}</div>
              <button
                onClick={() => removeFromComparison(work.id)}
                className="text-slate-400 hover:text-slate-600 text-xs mt-2"
              >
                ✕ Retirer
              </button>
            </div>
          ))}
          
          {/* Rows */}
          <div className="font-medium text-slate-600 py-2">Type</div>
          {works.map((w, i) => (
            <div key={`type-${i}`} className="bg-slate-50 rounded px-2 py-2">{w.type}</div>
          ))}
          
          <div className="font-medium text-slate-600 py-2">Année</div>
          {works.map((w, i) => (
            <div key={`year-${i}`} className="bg-slate-50 rounded px-2 py-2">{w.annee || 'N/A'}</div>
          ))}
          
          <div className="font-medium text-slate-600 py-2">Monde</div>
          {works.map((w, i) => (
            <div key={`realm-${i}`} className="bg-slate-50 rounded px-2 py-2 capitalize">{w.realm}</div>
          ))}
          
          <div className="font-medium text-slate-600 py-2">Siècle</div>
          {works.map((w, i) => (
            <div key={`century-${i}`} className="bg-slate-50 rounded px-2 py-2">
              {w.anneeNum === 19 ? 'XIXe' : w.anneeNum === 20 ? 'XXe–XXIe' : 'N/A'}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Context Visualization */}
      {comparison && comparison.temporalDistance !== null && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <span>⏳</span>
            Contexte temporel
          </h4>
          <div className="relative h-16">
            {/* Timeline bar */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-blue-200 rounded"></div>
            
            {/* Work markers */}
            {(() => {
              const year1 = parseInt(works[0].annee?.match(/\d{4}/)?.[0] || '0');
              const year2 = parseInt(works[1].annee?.match(/\d{4}/)?.[0] || '0');
              const minYear = Math.min(year1, year2);
              const maxYear = Math.max(year1, year2);
              const range = maxYear - minYear || 1;
              
              return works.map((work, idx) => {
                const year = parseInt(work.annee?.match(/\d{4}/)?.[0] || '0');
                const position = ((year - minYear) / range) * 100;
                
                return (
                  <div
                    key={work.id}
                    className="absolute"
                    style={{ left: `${position}%`, top: idx === 0 ? '0' : '2rem' }}
                  >
                    <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-violet-500' : 'bg-orange-500'} border-2 border-white shadow`}></div>
                    <div className={`text-[10px] font-medium mt-1 whitespace-nowrap ${idx === 0 ? 'text-violet-700' : 'text-orange-700'}`}>
                      {year}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
          <div className="text-xs text-blue-800 mt-3 text-center">
            <strong>{comparison.temporalDistance} années</strong> séparent ces œuvres
          </div>
        </div>
      )}

      {/* Venn Diagram Visualization */}
      {comparison && (comparison.sharedEmotions.length > 0 || comparison.sharedCategories.length > 0) && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <span>◉</span>
            Diagramme de Venn - Intersections
          </h4>
          
          {/* Visual Venn representation */}
          <div className="flex items-center justify-center mb-3 relative h-24">
            {/* Left circle */}
            <div className="absolute left-[25%] w-20 h-20 rounded-full bg-violet-300/40 border-2 border-violet-400 flex items-center justify-center">
              <span className="text-xs font-bold text-violet-700">{works[0].emotions?.length || 0}</span>
            </div>
            
            {/* Right circle */}
            <div className="absolute right-[25%] w-20 h-20 rounded-full bg-orange-300/40 border-2 border-orange-400 flex items-center justify-center">
              <span className="text-xs font-bold text-orange-700">{works[1].emotions?.length || 0}</span>
            </div>
            
            {/* Intersection */}
            <div className="absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-violet-400/60 to-orange-400/60 border-2 border-purple-500 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-900">{comparison.sharedEmotions.length}</div>
                <div className="text-[8px] text-purple-800">partagées</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="text-violet-700">
              <div className="font-semibold">{(comparison.uniqueEmotions1.length || 0) + (comparison.uniqueCategories1.length || 0)}</div>
              <div className="text-[10px]">Uniques à 1</div>
            </div>
            <div className="text-purple-900">
              <div className="font-semibold">{comparison.sharedEmotions.length + comparison.sharedCategories.length}</div>
              <div className="text-[10px]">Partagées</div>
            </div>
            <div className="text-orange-700">
              <div className="font-semibold">{(comparison.uniqueEmotions2.length || 0) + (comparison.uniqueCategories2.length || 0)}</div>
              <div className="text-[10px]">Uniques à 2</div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Emotions */}
      {comparison && comparison.sharedEmotions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span>🎭</span>
            Émotions partagées ({comparison.sharedEmotions.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {comparison.sharedEmotions.map(emotion => (
              <span 
                key={emotion}
                className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-full text-sm text-green-900 font-medium"
              >
                {emotion}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Unique Emotions Venn */}
      {comparison && (comparison.uniqueEmotions1.length > 0 || comparison.uniqueEmotions2.length > 0) && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Émotions uniques</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-600 mb-1">Uniquement dans {works[0].titre.slice(0, 20)}...</div>
              <div className="flex flex-wrap gap-1">
                {comparison.uniqueEmotions1.map(emotion => (
                  <span 
                    key={emotion}
                    className="px-2 py-0.5 bg-slate-100 border rounded text-xs text-slate-700"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-600 mb-1">Uniquement dans {works[1].titre.slice(0, 20)}...</div>
              <div className="flex flex-wrap gap-1">
                {comparison.uniqueEmotions2.map(emotion => (
                  <span 
                    key={emotion}
                    className="px-2 py-0.5 bg-slate-100 border rounded text-xs text-slate-700"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Categories */}
      {comparison && comparison.sharedCategories.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span>🧬</span>
            Thèmes partagés ({comparison.sharedCategories.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {comparison.sharedCategories.map(category => (
              <span 
                key={category}
                className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-full text-sm text-purple-900 font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Unique Categories */}
      {comparison && (comparison.uniqueCategories1.length > 0 || comparison.uniqueCategories2.length > 0) && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Thèmes uniques</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex flex-wrap gap-1">
                {comparison.uniqueCategories1.map(category => (
                  <span 
                    key={category}
                    className="px-2 py-0.5 bg-slate-100 border rounded text-xs text-slate-700"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap gap-1">
                {comparison.uniqueCategories2.map(category => (
                  <span 
                    key={category}
                    className="px-2 py-0.5 bg-slate-100 border rounded text-xs text-slate-700"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced AI-Generated Insights */}
      {comparison && generateInsights.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🧠</span>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-900 mb-2">Analyse contextuelle</h4>
              
              {/* Summary insight */}
              <p className="text-sm text-amber-800 mb-3 pb-3 border-b border-amber-200">
                {comparison.similarityPercent >= 70 ? (
                  <>Ces œuvres partagent un <strong>ADN culturel très proche</strong> ({comparison.similarityPercent}% de similarité). Elles explorent des territoires émotionnels et thématiques similaires.</>
                ) : comparison.similarityPercent >= 40 ? (
                  <>Ces œuvres présentent des <strong>convergences thématiques notables</strong> ({comparison.similarityPercent}% de similarité) tout en maintenant des identités distinctes.</>
                ) : (
                  <>Ces œuvres sont <strong>relativement différentes</strong> ({comparison.similarityPercent}% de similarité), révélant la diversité des représentations temporelles.</>
                )}
              </p>
              
              {/* Contextual insights */}
              <div className="space-y-2">
                {generateInsights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-amber-800">
                    <span className="text-amber-600 mt-0.5">▸</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
              
              {/* Research suggestion */}
              {comparison.similarityPercent >= 40 && (
                <div className="mt-3 pt-3 border-t border-amber-200 text-xs text-amber-700">
                  <strong>💡 Piste de recherche :</strong> Ces œuvres pourraient constituer une base intéressante pour explorer 
                  {comparison.sharedCategories.length > 0 ? ` les thèmes de ${comparison.sharedCategories[0]}` : ' les dialogues trans-temporels'} 
                  dans le corpus.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
