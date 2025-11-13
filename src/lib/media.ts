// Media utility functions for extracting thumbnails and detecting media types

export type MediaType = 'youtube' | 'vimeo' | 'image' | 'webpage';

export interface MediaInfo {
  type: MediaType;
  thumbnail?: string;
  embedUrl?: string;
  originalUrl: string;
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Extract Vimeo video ID from URL
 */
export function extractVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Get YouTube thumbnail URL (multiple quality options)
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'mq'): string {
  const qualityMap = {
    default: 'default',     // 120x90
    hq: 'hqdefault',        // 480x360
    mq: 'mqdefault',        // 320x180
    sd: 'sddefault',        // 640x480
    maxres: 'maxresdefault' // 1920x1080
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Get Vimeo thumbnail (requires API call in production, using placeholder)
 */
export function getVimeoThumbnail(videoId: string): string {
  // In production, you'd fetch from: https://vimeo.com/api/v2/video/${videoId}.json
  // For now, return a placeholder
  return `https://i.vimeocdn.com/video/${videoId}_640.jpg`;
}

/**
 * Check if URL is a direct image
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/i.test(url);
}

/**
 * Detect media type and generate appropriate metadata
 */
export function analyzeMediaUrl(url: string | null | undefined): MediaInfo | null {
  if (!url) return null;
  
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return {
      type: 'youtube',
      thumbnail: getYouTubeThumbnail(youtubeId, 'mq'),
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      originalUrl: url
    };
  }
  
  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return {
      type: 'vimeo',
      thumbnail: getVimeoThumbnail(vimeoId),
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      originalUrl: url
    };
  }
  
  if (isImageUrl(url)) {
    return {
      type: 'image',
      thumbnail: url,
      originalUrl: url
    };
  }
  
  return {
    type: 'webpage',
    originalUrl: url
  };
}

/**
 * Get a fallback icon emoji for media type
 */
export function getMediaIcon(type: MediaType): string {
  const icons = {
    youtube: '▶️',
    vimeo: '▶️',
    image: '🖼️',
    webpage: '🔗'
  };
  return icons[type] || '🔗';
}
