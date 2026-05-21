// constants/serviceIcons.ts
export const SERVICE_ICONS: Record<string, { color: string; emoji: string }> = {
  'netflix': { color: '#E50914', emoji: '🎬' },
  'spotify': { color: '#1DB954', emoji: '🎵' },
  'claude': { color: '#E96B3B', emoji: '🤖' },
  'chatgpt': { color: '#10A37F', emoji: '💬' },
  'github': { color: '#333', emoji: '🐙' },
  'photoshop': { color: '#31A8FF', emoji: '🎨' },
  'default': { color: '#888', emoji: '📦' },
};

export const getServiceIcon = (name: string) => {
  const key = name.toLowerCase().replace(/\s/g, '');
  return Object.entries(SERVICE_ICONS).find(([k]) => key.includes(k))?.[1] 
    ?? SERVICE_ICONS['default'];
};