// Medium type icons for visual identification
export const mediumIcons: Record<string, string> = {
  'Littérature': '📚',
  'Cinéma': '🎬',
  'Jeux vidéo': '🎮',
  'Music': '🎵',
  'Art': '🎨',
  'BD': '📖',
  // Fallback aliases
  'Livre': '📚',
  'Film': '🎬',
  'Jeu vidéo': '🎮',
  'Musique': '🎵',
  'Art visuel': '🎨',
  'Bande dessinée': '📖',
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
