// Emotion coordinate mapping based on Russell's circumplex model
// Valence: negative (-1) ← neutral (0) → positive (+1)
// Arousal: calm (-1) ← neutral (0) → intense (+1)

type EmotionCoord = { valence: number; arousal: number };

// src/lib/emotionMap.ts

const emotionCoords: Record<string, { valence: number; arousal: number }> = {
  // 🌿 Positives - calm
  "sérénité": { valence: 0.9, arousal: -0.7 },
  "serenite": { valence: 0.9, arousal: -0.7 },

  "confiance": { valence: 0.75, arousal: -0.1 },

  // 🌞 Positives - more energetic
  "joie": { valence: 0.95, arousal: 0.7 },
  "admiration": { valence: 0.8, arousal: 0.4 },
  "fascination": { valence: 0.7, arousal: 0.6 },
  "excitation": { valence: 0.6, arousal: 0.95 },

  // 🌙 Bittersweet / mixed
  // moved nostalgie further positive and calmer
  "nostalgie": { valence: 0.45, arousal: -0.3 },
  "mélancolie": { valence: -0.3, arousal: -0.4 },
  "melancolie": { valence: -0.3, arousal: -0.4 },

  // 🌧 Negatives - calmer or heavy
  "tristesse": { valence: -0.8, arousal: -0.3 },

  // ⚡ Negatives - high arousal
  "peur": { valence: -0.9, arousal: 0.8 },
  "vigilance": { valence: -0.2, arousal: 0.75 },
  "colère": { valence: -0.9, arousal: 0.95 },
  "colere": { valence: -0.9, arousal: 0.95 },
  "dégoût": { valence: -0.8, arousal: 0.5 },
  "degout": { valence: -0.8, arousal: 0.5 },

  // ❓ Ambiguous / transitional
  "surprise": { valence: 0.1, arousal: 0.85 },
};

const emotionTable: Record<string, EmotionCoord> = {
  // High arousal, negative valence
  tension: { valence: -0.6, arousal: 0.7 },
  peur: { valence: -0.8, arousal: 0.8 },
  colère: { valence: -0.7, arousal: 0.9 },
  
  // High arousal, positive valence
  surprise: { valence: 0.3, arousal: 0.8 },
  fascination: { valence: 0.7, arousal: 0.6 },
  excitation: { valence: 0.8, arousal: 0.9 },
  
  // Low arousal, negative valence
  nostalgie: { valence: -0.4, arousal: -0.5 },
  mélancolie: { valence: -0.6, arousal: -0.6 },
  tristesse: { valence: -0.7, arousal: -0.4 },
  
  // Low arousal, positive valence
  sérénité: { valence: 0.6, arousal: -0.7 },
  contemplation: { valence: 0.4, arousal: -0.5 },
  paix: { valence: 0.7, arousal: -0.8 },
  
  // Neutral/ambiguous
  confusion: { valence: -0.2, arousal: 0.3 },
  curiosité: { valence: 0.3, arousal: 0.4 },
};

export function emotionsToCoords(emotions: string[] = []): EmotionCoord {
  if (emotions.length === 0) {
    return { valence: 0, arousal: 0 };
  }

  const totals = emotions.reduce(
    (acc, emotion) => {
      const coord = emotionTable[emotion.toLowerCase()] ?? { valence: 0, arousal: 0 };
      acc.valence += coord.valence;
      acc.arousal += coord.arousal;
      return acc;
    },
    { valence: 0, arousal: 0 }
  );

  return {
    valence: totals.valence / emotions.length,
    arousal: totals.arousal / emotions.length,
  };
}