// Emotion to emoji mapping for consistent visual representation
export const emotionIcons: Record<string, string> = {
  // Core emotions
  'joie': '😊',
  'tristesse': '😢',
  'peur': '😨',
  'colère': '😠',
  'surprise': '😲',
  'dégoût': '🤢',
  'anticipation': '🤔',
  'confiance': '🤝',
  
  // Extended emotions
  'nostalgie': '🌅',
  'mélancolie': '🌧️',
  'fascination': '✨',
  'sérénité': '😌',
  'anxiété': '😰',
  'tension': '😬',
  'vigilance': '👀',
  'ennui': '😑',
  'extase': '🤩',
  'admiration': '😍',
  'terreur': '😱',
  'stupéfaction': '😵',
  'chagrin': '💔',
  'déception': '😞',
  'remords': '😔',
  'mépris': '😒',
  'agressivité': '😤',
  'optimisme': '🌟',
  'amour': '❤️',
  'soumission': '🙏',
  'crainte': '😟',
  'désapprobation': '🙁',
  'culpabilité': '😓',
  'honte': '😳',
  'fierté': '😎',
  'gratitude': '🙂',
  'espoir': '🌈',
  'jalousie': '😒',
  'soulagement': '😮‍💨',
  'contentement': '☺️',
};

// Get emoji for emotion, fallback to first character if not found
export function getEmotionIcon(emotion: string): string {
  const normalized = emotion.toLowerCase().trim();
  return emotionIcons[normalized] || '💭';
}

// Get all unique emotions with icons from the dataset
export function getEmotionsWithIcons(): Array<{ emotion: string; icon: string }> {
  return Object.entries(emotionIcons).map(([emotion, icon]) => ({
    emotion,
    icon
  }));
}
