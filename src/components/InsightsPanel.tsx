import { useStore } from "../store/useStore";
import data from "../data/works.json";
import { useMemo, useState, useEffect } from "react";
import { buildPredicateWithCentury } from "../lib/filters";

interface Insight {
  id: string;
  type: 'discovery' | 'comparison' | 'anomaly' | 'pattern';
  icon: string;
  message: string;
  confidence: 'high' | 'medium' | 'low';
}

export default function InsightsPanel({ compact = false }: { compact?: boolean }) {
  const filters = useStore(s => s.filters);
  const centuryFilter = useStore(s => s.centuryFilter);
  const realm = useStore(s => s.realm);
  const saveInsight = useStore(s => s.saveInsight);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

  const all = data as any[];
  const filtered = useMemo(
    () => all.filter(buildPredicateWithCentury(filters, centuryFilter)),
    [all, filters, centuryFilter]
  );

  // Comprehensive stats calculation
  const stats = useMemo(() => {
    const types: Record<string, number> = {};
    const emotions: Record<string, number> = {};
    const categories: Record<string, number> = {};
    const centuries: Record<string, number> = {};
    const emotionPairs: Record<string, number> = {};
    const categoryEmotionPairs: Record<string, number> = {};
    
    filtered.forEach(work => {
      // Basic counts
      types[work.type] = (types[work.type] || 0) + 1;
      if (work.anneeNum) {
        centuries[work.anneeNum] = (centuries[work.anneeNum] || 0) + 1;
      }
      
      // Emotion analysis
      work.emotions?.forEach((e: string) => {
        emotions[e] = (emotions[e] || 0) + 1;
      });
      
      // Category analysis
      work.categories?.forEach((c: string) => {
        categories[c] = (categories[c] || 0) + 1;
      });
      
      // Co-occurrence patterns
      if (work.emotions?.length >= 2) {
        const sorted = [...work.emotions].sort();
        for (let i = 0; i < sorted.length - 1; i++) {
          for (let j = i + 1; j < sorted.length; j++) {
            const pair = `${sorted[i]}+${sorted[j]}`;
            emotionPairs[pair] = (emotionPairs[pair] || 0) + 1;
          }
        }
      }
      
      // Category-emotion combinations
      work.categories?.forEach((cat: string) => {
        work.emotions?.forEach((emo: string) => {
          const key = `${cat}×${emo}`;
          categoryEmotionPairs[key] = (categoryEmotionPairs[key] || 0) + 1;
        });
      });
    });

    return {
      total: filtered.length,
      types,
      emotions,
      categories,
      centuries,
      emotionPairs,
      categoryEmotionPairs,
      sortedTypes: Object.entries(types).sort((a, b) => b[1] - a[1]),
      sortedEmotions: Object.entries(emotions).sort((a, b) => b[1] - a[1]),
      sortedCategories: Object.entries(categories).sort((a, b) => b[1] - a[1]),
      sortedEmotionPairs: Object.entries(emotionPairs).sort((a, b) => b[1] - a[1]),
      sortedCategoryEmotionPairs: Object.entries(categoryEmotionPairs).sort((a, b) => b[1] - a[1]),
    };
  }, [filtered]);

  // Intelligent insight generation
  const insights = useMemo((): Insight[] => {
    const findings: Insight[] = [];
    
    if (stats.total === 0) return findings;
    
    const totalCorpus = all.length;
    const percentage = Math.round((stats.total / totalCorpus) * 100);
    
    // 1. Dominant emotion discoveries
    if (stats.sortedEmotions.length > 0) {
      const [topEmotion, topCount] = stats.sortedEmotions[0];
      const emotionPercentage = Math.round((topCount / stats.total) * 100);
      
      if (emotionPercentage >= 60) {
        findings.push({
          id: 'dominant-emotion',
          type: 'discovery',
          icon: '🎭',
          message: `${emotionPercentage}% des œuvres affichées portent "${topEmotion}" — une dominante émotionnelle très marquée`,
          confidence: 'high'
        });
      } else if (emotionPercentage >= 40) {
        findings.push({
          id: 'strong-emotion',
          type: 'pattern',
          icon: '💫',
          message: `"${topEmotion}" apparaît dans ${emotionPercentage}% de cette sélection`,
          confidence: 'medium'
        });
      }
    }
    
    // 2. Medium concentration insights
    if (stats.sortedTypes.length > 0) {
      const [topType, typeCount] = stats.sortedTypes[0];
      const typePercentage = Math.round((typeCount / stats.total) * 100);
      
      if (typePercentage >= 70) {
        findings.push({
          id: 'medium-dominance',
          type: 'discovery',
          icon: '🎬',
          message: `Cette sélection est dominée à ${typePercentage}% par le ${topType}`,
          confidence: 'high'
        });
      }
      
      // Check for balanced media distribution
      if (stats.sortedTypes.length >= 4) {
        const top4 = stats.sortedTypes.slice(0, 4);
        const avgTop4 = top4.reduce((sum, [, count]) => sum + count, 0) / 4;
        const variance = top4.reduce((sum, [, count]) => sum + Math.pow(count - avgTop4, 2), 0) / 4;
        
        if (variance < avgTop4 * 0.3) {
          findings.push({
            id: 'balanced-media',
            type: 'pattern',
            icon: '⚖️',
            message: `Distribution équilibrée entre ${stats.sortedTypes.length} médias différents`,
            confidence: 'medium'
          });
        }
      }
    }
    
    // 3. Rare emotion combinations
    if (stats.sortedEmotionPairs.length > 0) {
      const [topPair, pairCount] = stats.sortedEmotionPairs[0];
      const [emo1, emo2] = topPair.split('+');
      
      if (pairCount >= 3 && pairCount / stats.total >= 0.15) {
        findings.push({
          id: 'emotion-pair',
          type: 'pattern',
          icon: '🔗',
          message: `${pairCount} œuvres combinent "${emo1}" et "${emo2}" — une paire récurrente`,
          confidence: 'medium'
        });
      }
    }
    
    // 4. Category-emotion insights (revealing corpus DNA)
    if (stats.sortedCategoryEmotionPairs.length > 0) {
      const [topCombo, comboCount] = stats.sortedCategoryEmotionPairs[0];
      const [category, emotion] = topCombo.split('×');
      const comboPercentage = Math.round((comboCount / stats.total) * 100);
      
      if (comboPercentage >= 30) {
        findings.push({
          id: 'category-emotion',
          type: 'discovery',
          icon: '🧬',
          message: `${comboPercentage}% des œuvres lient "${category}" avec "${emotion}"`,
          confidence: 'high'
        });
      }
    }
    
    // 5. Temporal insights
    const centuryEntries = Object.entries(stats.centuries);
    if (centuryEntries.length === 1) {
      const [century, count] = centuryEntries[0];
      const centuryLabel = century === '19' ? 'XIXe siècle' : 'XXe–XXIe siècles';
      findings.push({
        id: 'single-century',
        type: 'discovery',
        icon: '📅',
        message: `Toutes les œuvres proviennent du ${centuryLabel}`,
        confidence: 'high'
      });
    } else if (centuryEntries.length === 2) {
      const [cent1, count1] = centuryEntries[0];
      const [cent2, count2] = centuryEntries[1];
      const ratio = Math.max(count1, count2) / Math.min(count1, count2);
      
      if (ratio >= 3) {
        const dominant = count1 > count2 ? (cent1 === '19' ? 'XIXe' : 'XXe–XXIe') : (cent2 === '19' ? 'XIXe' : 'XXe–XXIe');
        findings.push({
          id: 'temporal-skew',
          type: 'comparison',
          icon: '⏳',
          message: `Forte prédominance du ${dominant} dans cette sélection`,
          confidence: 'medium'
        });
      }
    }
    
    // 6. Anomaly detection: rare emotions
    const rareEmotions = ['dégoût', 'ennui', 'joie'];
    const foundRare = stats.sortedEmotions.find(([emo]) => rareEmotions.includes(emo));
    if (foundRare) {
      const [rareEmo, rareCount] = foundRare;
      if (rareCount >= 2) {
        findings.push({
          id: 'rare-emotion',
          type: 'anomaly',
          icon: '✨',
          message: `"${rareEmo}" est rare dans le corpus — ${rareCount} œuvres ici la portent`,
          confidence: 'medium'
        });
      }
    }
    
    // 7. Comparative insight: vs full corpus
    if (percentage < 10) {
      findings.push({
        id: 'narrow-selection',
        type: 'comparison',
        icon: '🔍',
        message: `Sélection très ciblée : ${percentage}% du corpus total (${stats.total}/${totalCorpus} œuvres)`,
        confidence: 'high'
      });
    } else if (percentage > 80) {
      findings.push({
        id: 'broad-view',
        type: 'comparison',
        icon: '🌐',
        message: `Vue d'ensemble : ${percentage}% du corpus visible`,
        confidence: 'high'
      });
    }
    
    // 8. Gap analysis: missing emotions
    const expectedEmotions = ['tristesse', 'nostalgie', 'fascination'];
    const missingExpected = expectedEmotions.filter(e => !stats.emotions[e]);
    if (missingExpected.length > 0 && stats.total > 20) {
      findings.push({
        id: 'missing-common',
        type: 'anomaly',
        icon: '❓',
        message: `Absence notable : "${missingExpected[0]}" n'apparaît pas dans cette sélection`,
        confidence: 'low'
      });
    }
    
    return findings.sort((a, b) => {
      const confScore = { high: 3, medium: 2, low: 1 };
      return confScore[b.confidence] - confScore[a.confidence];
    });
  }, [stats, all.length]);

  // Save high-confidence insights to history
  useEffect(() => {
    if (insights.length === 0) return;
    
    const highConfidenceInsights = insights.filter(i => i.confidence === 'high');
    highConfidenceInsights.forEach(insight => {
      saveInsight({
        type: insight.type,
        message: insight.message,
        icon: insight.icon,
        filterState: {
          realm,
          filters,
          centuryFilter,
          totalWorks: filtered.length,
        },
      });
    });
  }, [insights, realm, filters, centuryFilter, filtered.length, saveInsight]);

  // Rotate insights every 5 seconds
  useEffect(() => {
    if (insights.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentInsightIndex(prev => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [insights.length]);

  // Reset index when insights change
  useEffect(() => {
    setCurrentInsightIndex(0);
  }, [insights]);

  if (filtered.length === 0) {
    return (
      <aside className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-900">
          Aucune œuvre ne correspond aux filtres actuels. Essayez d'élargir votre sélection.
        </p>
      </aside>
    );
  }

  const currentInsight = insights[currentInsightIndex];
  const insightColors = {
    discovery: 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-300 text-violet-900',
    comparison: 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 text-blue-900',
    anomaly: 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-900',
    pattern: 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 text-emerald-900',
  };

  return (
    <div className={compact ? "space-y-3" : "flex items-center justify-between gap-4"}>
      {/* Quick stats */}
      {!compact && (
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 bg-slate-100 rounded-lg border">
            <span className="text-lg font-bold text-slate-900">{stats.total}</span>
            <span className="text-xs text-slate-600 ml-1">œuvres</span>
          </div>
          
          {stats.sortedTypes.length > 0 && (
            <div className="flex gap-1">
              {stats.sortedTypes.slice(0, 3).map(([type, count]) => (
                <div key={type} className="px-2 py-1 bg-slate-50 border rounded text-xs text-slate-700">
                  <span className="font-medium">{count}</span> {type}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {compact && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-violet-700">💡 Découvertes</span>
          <span className="text-xs text-slate-500">{stats.total} œuvres</span>
        </div>
      )}

      {/* Rotating intelligent insight */}
      {currentInsight && (
        <div className={`${compact ? '' : 'flex-1'} flex items-start gap-2 p-3 rounded-lg border-2 ${insightColors[currentInsight.type]} transition-all duration-300`}>
          <div className={compact ? "text-lg shrink-0" : "text-2xl shrink-0"}>{currentInsight.icon}</div>
          <div className="flex-1 min-w-0">
            <p className={compact ? "text-xs leading-relaxed" : "text-sm font-medium leading-tight"}>
              {currentInsight.message}
            </p>
          </div>
          
          {insights.length > 1 && (
            <div className={compact ? "flex flex-col gap-1 shrink-0" : "flex items-center gap-1 shrink-0"}>
              {insights.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentInsightIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentInsightIndex 
                      ? compact ? 'bg-slate-700 h-3' : 'bg-slate-700 w-3'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Voir insight ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
