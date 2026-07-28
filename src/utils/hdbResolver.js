// HDB ID to Mojang Texture Hash Resolver & Cache
// UX-6 Fix: Multiple CORS proxy fallbacks to prevent HDB resolution failure when one proxy goes down

const HDB_PRECACHED_HASHES = {
  '61373': 'df5de940bfe499c59ee8dac9f9c3919e7535eff3a9acb16f4842bf290f4c679f',
  '63124': 'd7ff01e581c81db31af55c46288d6d2aef10c81c1939328727fd38a795f8f2bb',
  '23223': '16439d2e306b225516aa9a6d007a7e75edd2d5015d113b42f44be62a517e574f',
  '33098': '7e3deb57eaa2f4d403ad57283ce8b41805ee5b6de912ee2b4ea736a9d1f465a7'
};

// UX-6: Multiple CORS proxy fallback chain — try each in order until one succeeds
const CORS_PROXIES = [
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://proxy.cors.sh/${url}`,
];

const memoryCache = new Map(Object.entries(HDB_PRECACHED_HASHES));

// Load additional saved hashes from localStorage if available
try {
  const saved = localStorage.getItem('dme_hdb_hashes');
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.entries(parsed).forEach(([k, v]) => memoryCache.set(k, v));
  }
} catch (e) {}

/**
 * Returns Texture Hash for an HDB ID if cached, otherwise null.
 */
export function getHdbTextureHashSync(hdbId) {
  if (!hdbId) return null;
  const cleanId = String(hdbId).replace(/^hdb-/i, '').trim();
  return memoryCache.get(cleanId) || null;
}

/**
 * Dynamically resolves HDB ID to Mojang Texture Hash online and caches the result.
 * UX-6: Tries multiple CORS proxies in sequence for fault tolerance.
 */
export async function resolveHdbTextureHash(hdbId) {
  if (!hdbId) return null;
  const cleanId = String(hdbId).replace(/^hdb-/i, '').trim();

  if (memoryCache.has(cleanId)) {
    return memoryCache.get(cleanId);
  }

  const targetUrl = `https://minecraft-heads.com/custom-heads/head/${cleanId}`;

  // UX-6: Try each CORS proxy in order until one succeeds
  for (const proxyFn of CORS_PROXIES) {
    try {
      const proxyUrl = proxyFn(targetUrl);
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const html = await res.text();
      const match = html.match(/textures\.minecraft\.net\/texture\/([a-f0-9]+)/i);

      if (match && match[1]) {
        const textureHash = match[1];
        memoryCache.set(cleanId, textureHash);

        // Save to localStorage
        try {
          const obj = {};
          memoryCache.forEach((val, key) => { obj[key] = val; });
          localStorage.setItem('dme_hdb_hashes', JSON.stringify(obj));
        } catch (e) {}

        return textureHash;
      }
    } catch (e) {
      // This proxy failed — try next one
      console.warn(`HDB proxy failed for ID ${cleanId}:`, e.message || e);
    }
  }

  // All proxies failed
  console.warn(`HDB resolution exhausted all proxies for ID: ${cleanId}`);
  return null;
}
