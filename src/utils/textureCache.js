/**
 * Global Fast Texture Memory Cache with localStorage persistence and LRU eviction.
 * PERF-4: Added Negative Cache to avoid repeated HTTP 404 requests for invalid materials.
 * PERF: Added localStorage persistence so textures survive page refreshes.
 */

const MAX_CACHE_SIZE = 500;
const LS_KEY = 'dme_texture_cache_v1';

// Load persisted cache from localStorage on startup
const validatedTextureCache = new Map();
const negativeCache = new Set();

try {
  const saved = localStorage.getItem(LS_KEY);
  if (saved) {
    const entries = JSON.parse(saved);
    for (const [k, v] of Object.entries(entries)) {
      validatedTextureCache.set(k, v);
    }
  }
} catch (e) {
  // Ignore localStorage errors (e.g. private mode)
}

// Save cache to localStorage (throttled)
let saveTimer = null;
function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      const obj = {};
      for (const [k, v] of validatedTextureCache.entries()) {
        obj[k] = v;
      }
      localStorage.setItem(LS_KEY, JSON.stringify(obj));
    } catch (e) {}
  }, 2000);
}

// LRU eviction: remove the oldest entry when cache is full
function evictIfNeeded() {
  if (validatedTextureCache.size >= MAX_CACHE_SIZE) {
    const firstKey = validatedTextureCache.keys().next().value;
    validatedTextureCache.delete(firstKey);
  }
}

export function getCachedTextureUrl(material) {
  if (!material) return null;
  const key = String(material).toUpperCase().trim();
  if (negativeCache.has(key)) return '__NEGATIVE__';
  return validatedTextureCache.get(key) || null;
}

export function setCachedTextureUrl(material, url) {
  if (!material || !url) return;
  const key = String(material).toUpperCase().trim();
  if (!validatedTextureCache.has(key)) {
    evictIfNeeded();
  }
  validatedTextureCache.set(key, url);
  scheduleSave();
}

// PERF-4: Mark a material as definitely having no valid texture (Negative Cache)
export function markNegativeCache(material) {
  if (!material) return;
  const key = String(material).toUpperCase().trim();
  negativeCache.add(key);
}

export function isNegativeCached(material) {
  if (!material) return false;
  return negativeCache.has(String(material).toUpperCase().trim());
}

export function clearTextureCache() {
  validatedTextureCache.clear();
  negativeCache.clear();
  try { localStorage.removeItem(LS_KEY); } catch (e) {}
}
