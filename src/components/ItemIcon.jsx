import React, { useState, useEffect } from 'react';
import { getTextureCandidates } from '../utils/itemDatabase';
import { getCachedTextureUrl, setCachedTextureUrl } from '../utils/textureCache';
import { resolveHdbTextureHash } from '../utils/hdbResolver';
import { Box } from 'lucide-react';

export default function ItemIcon({ material, className = 'w-8 h-8' }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const [loadedUrl, setLoadedUrl] = useState(null);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  const matUpper = String(material || '').trim().toUpperCase();

  useEffect(() => {
    let isCancelled = false;

    // Reset state instantly when material changes
    setSrcIndex(0);
    setHasFailedAll(false);

    const cached = getCachedTextureUrl(matUpper);
    if (cached) {
      setLoadedUrl(cached);
      return;
    } else {
      setLoadedUrl(null);
    }

    // Handle Async HDB Head resolution
    if (matUpper.startsWith('HDB-')) {
      const hdbId = matUpper.slice(4).trim();
      resolveHdbTextureHash(hdbId)
        .then((hash) => {
          if (!isCancelled && hash) {
            const url = `https://mc-heads.net/head/${hash}/32`;
            setCachedTextureUrl(matUpper, url);
            setLoadedUrl(url);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            const fallback = `https://mc-heads.net/head/MHF_Question/32`;
            setLoadedUrl(fallback);
          }
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [matUpper]);

  const candidates = getTextureCandidates(material);

  // Fallback to default Minecraft 3D Emerald Block Shield Icon
  if (!matUpper || matUpper === 'AIR' || hasFailedAll) {
    return (
      <div className={`relative flex items-center justify-center bg-slate-900/60 rounded-md border border-cyan-500/30 p-1 shadow-inner ${className}`}>
        <Box className="w-full h-full text-cyan-400 opacity-70 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-md pointer-events-none" />
      </div>
    );
  }

  // Use cached or currently resolved URL first, otherwise try candidate list
  const currentSrcUrl = loadedUrl || candidates[srcIndex] || candidates[0];

  const handleError = () => {
    if (srcIndex + 1 < candidates.length) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setHasFailedAll(true);
    }
  };

  const handleSuccess = () => {
    if (currentSrcUrl && !currentSrcUrl.startsWith('data:')) {
      setCachedTextureUrl(matUpper, currentSrcUrl);
    }
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <img
        key={`${matUpper}_${srcIndex}`}
        src={currentSrcUrl}
        alt={material}
        onLoad={handleSuccess}
        onError={handleError}
        className="w-full h-full object-contain image-rendering-pixelated drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none transition-opacity duration-100"
        loading="eager"
      />
    </div>
  );
}
