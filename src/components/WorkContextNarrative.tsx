import { useMemo } from "react";
import works from "../data/works.json";
import type { WorkNode } from "../lib/types";

interface Props {
  work: WorkNode;
}

const allWorks = works as WorkNode[];

export default function WorkContextNarrative({ work }: Props) {
  const narrative = useMemo(() => {
    const insights: string[] = [];

    // 1. Rarity Analysis - Emotion + Category combination
    if (work.emotions && work.emotions.length > 0 && work.categories && work.categories.length > 0) {
      const primaryEmotion = work.emotions[0];
      const primaryCategory = work.categories[0];
      
      const sameCombo = allWorks.filter(w => 
        w.emotions?.[0] === primaryEmotion && 
        w.categories?.includes(primaryCategory)
      ).length;

      if (sameCombo <= 3) {
        insights.push(`🔮 Cette œuvre explore une combinaison rare : **${primaryEmotion}** dans le contexte de **${primaryCategory}**. Seulement **${sameCombo} œuvre${sameCombo > 1 ? 's' : ''}** du corpus partage${sameCombo > 1 ? 'nt' : ''} cette intersection unique.`);
      } else if (sameCombo <= 10) {
        insights.push(`✨ Cette œuvre fait partie d'un petit groupe de **${sameCombo} œuvres** qui explorent **${primaryEmotion}** à travers **${primaryCategory}**.`);
      }
    }

    // 2. Temporal Context - Century positioning
    if (work.anneeNum) {
      const decade = Math.floor(work.anneeNum / 10) * 10;
      const sameDecade = allWorks.filter(w => 
        w.anneeNum && Math.floor(w.anneeNum / 10) * 10 === decade
      );

      if (sameDecade.length <= 5) {
        insights.push(`⏳ Positionnée dans les années **${decade}**, cette œuvre représente l'une des **${sameDecade.length} créations** de cette décennie dans notre corpus, offrant un témoignage précieux de cette période.`);
      }

      // Century emotion dominance
      const century = work.anneeNum < 1900 ? 19 : work.anneeNum < 2000 ? 20 : 21;
      const centuryWorks = allWorks.filter(w => {
        const wCentury = w.anneeNum ? (w.anneeNum < 1900 ? 19 : w.anneeNum < 2000 ? 20 : 21) : 0;
        return wCentury === century;
      });

      if (work.emotions && work.emotions.length > 0 && centuryWorks.length > 0) {
        const primaryEmotion = work.emotions[0];
        const emotionCount = centuryWorks.filter(w => w.emotions?.[0] === primaryEmotion).length;
        const emotionPercent = Math.round((emotionCount / centuryWorks.length) * 100);

        if (emotionPercent >= 15) {
          insights.push(`📊 L'émotion dominante **${primaryEmotion}** résonne avec son époque : **${emotionPercent}%** des œuvres du ${century}ᵉ siècle explorent cette même tonalité.`);
        }
      }
    }

    // 3. Medium Context - Cross-medium patterns
    if (work.type && work.emotions && work.emotions.length > 0) {
      const sameTypeWorks = allWorks.filter(w => w.type === work.type);
      const emotionInType = sameTypeWorks.filter(w => 
        w.emotions?.includes(work.emotions![0])
      ).length;

      if (sameTypeWorks.length > 0) {
        const emotionPercent = Math.round((emotionInType / sameTypeWorks.length) * 100);
        
        if (emotionPercent < 20) {
          insights.push(`🎭 Dans le médium **${work.type}**, l'exploration de **${work.emotions[0]}** est relativement rare (**${emotionPercent}%**), donnant à cette œuvre une perspective distinctive.`);
        }
      }
    }

    // 4. Cluster Identification - Similar works
    if (work.emotions && work.categories) {
      const similar = allWorks.filter(w => {
        if (w.id === work.id) return false;
        
        const emotionOverlap = w.emotions?.filter(e => work.emotions?.includes(e)).length || 0;
        const categoryOverlap = w.categories?.filter(c => work.categories?.includes(c)).length || 0;
        
        return emotionOverlap >= 2 || categoryOverlap >= 2;
      });

      if (similar.length > 0 && similar.length <= 15) {
        const examples = similar.slice(0, 3).map(w => `*${w.titre}*`).join(', ');
        insights.push(`🔗 Cette œuvre résonne avec **${similar.length} autres créations** qui partagent ses thématiques ou tonalités émotionnelles. Explorez par exemple : ${examples}.`);
      } else if (similar.length > 15) {
        insights.push(`🌐 Cette œuvre se situe au cœur d'une constellation de **${similar.length} créations** partageant des thématiques similaires, révélant des motifs récurrents dans notre compréhension du temps.`);
      }
    }

    // 5. Identity Works - Special attention
    if (work.categories?.some(c => c.toLowerCase().includes('identité'))) {
      const identityWorks = allWorks.filter(w => 
        w.categories?.some(c => c.toLowerCase().includes('identité'))
      );
      
      insights.push(`🪞 Cette œuvre fait partie des **${identityWorks.length} créations** qui interrogent l'**identité temporelle**, explorant comment le temps façonne qui nous sommes.`);
    }

    // 6. Cosmic/Human/Disrupted positioning
    if (work.categories) {
      const hasCosmic = work.categories.some(c => 
        c.toLowerCase().includes('cosmique') || 
        c.toLowerCase().includes('cosmos') ||
        c.toLowerCase().includes('éternel')
      );
      const hasHuman = work.categories.some(c => 
        c.toLowerCase().includes('humain') || 
        c.toLowerCase().includes('vécu') ||
        c.toLowerCase().includes('mémoire')
      );
      const hasDisrupted = work.categories.some(c => 
        c.toLowerCase().includes('dérangé') || 
        c.toLowerCase().includes('écologique') ||
        c.toLowerCase().includes('technologique')
      );

      const realms = [
        hasCosmic && '🌌 temps cosmique',
        hasHuman && '👤 temps humain',
        hasDisrupted && '⚡ temps dérangé'
      ].filter(Boolean);

      if (realms.length > 1) {
        insights.push(`🔀 Cette œuvre navigue entre plusieurs royaumes temporels (${realms.join(' + ')}), créant un dialogue fascinant entre différentes échelles de temps.`);
      }
    }

    return insights;
  }, [work]);

  if (narrative.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-3 mt-3 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🧭</span>
        <strong className="font-semibold text-slate-900">Position dans le corpus</strong>
      </div>
      
      <div className="space-y-2.5">
        {narrative.map((insight, i) => (
          <div 
            key={i} 
            className="text-sm text-slate-700 leading-relaxed bg-blue-50/50 border-l-2 border-blue-400 pl-3 py-2 rounded-r"
          >
            <span dangerouslySetInnerHTML={{ 
              __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
                           .replace(/\*(.*?)\*/g, '<em class="text-slate-600">$1</em>')
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}
