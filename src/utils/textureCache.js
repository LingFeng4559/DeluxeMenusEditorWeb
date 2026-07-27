// Global Fast Texture Memory Cache

const validatedTextureCache = new Map();

export function getCachedTextureUrl(material) {
  if (!material) return null;
  return validatedTextureCache.get(String(material).toUpperCase().trim()) || null;
}

export function setCachedTextureUrl(material, url) {
  if (!material || !url) return;
  validatedTextureCache.set(String(material).toUpperCase().trim(), url);
}

export function clearTextureCache() {
  validatedTextureCache.clear();
}
