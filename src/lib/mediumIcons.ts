// Medium type icons for visual identification
export const mediumIcons: Record<string, string> = {
  'Livre': '📚',
  'Film': '🎬',
  'Jeu vidéo': '🎮',
  'Musique': '🎵',
  'Philosophie': '🧠',
  'Art visuel': '🎨',
  'Série TV': '📺',
  'Podcast': '🎙️',
  'Théâtre': '🎭',
  'Bande dessinée': '📖',
  'Photographie': '📷',
  'Sculpture': '🗿',
  'Architecture': '🏛️',
  'Danse': '💃',
  'Opéra': '🎼',
  'Performance': '🎪',
};

// Get icon for medium type
export function getMediumIcon(type: string): string {
  return mediumIcons[type] || '📄';
}

// Get all medium types with icons
export function getMediumsWithIcons(): Array<{ type: string; icon: string }> {
  return Object.entries(mediumIcons).map(([type, icon]) => ({
    type,
    icon
  }));
}
