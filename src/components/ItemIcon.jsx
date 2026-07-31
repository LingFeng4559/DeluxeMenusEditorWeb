import React, { useState, useEffect } from 'react';
import { getCachedTextureUrl, setCachedTextureUrl, markNegativeCache, isNegativeCached } from '../utils/textureCache';
import { getTextureCandidates } from '../utils/itemDatabase';
import { resolveHdbTextureHash } from '../utils/hdbResolver';
import { Box } from 'lucide-react';

export default function ItemIcon({ material, className = 'w-8 h-8' }) {
  const [sourceState, setSourceState] = useState({ material: '', index: 0 });
  const [loadedTexture, setLoadedTexture] = useState({ material: '', url: null });
  const [failedMaterial, setFailedMaterial] = useState(null);

  const matUpper = String(material || '').trim().toUpperCase();
  const srcIndex = sourceState.material === matUpper ? sourceState.index : 0;
  const loadedUrl = loadedTexture.material === matUpper ? loadedTexture.url : null;
  const hasFailedAll = failedMaterial === matUpper;

  useEffect(() => {
    let isCancelled = false;

    // Reset state instantly when material changes
    setSourceState({ material: matUpper, index: 0 });
    setFailedMaterial(null);

    // PERF-4: Check negative cache first — skip all HTTP requests for known-bad materials
    if (isNegativeCached(matUpper)) {
      setLoadedTexture({ material: matUpper, url: null });
      setFailedMaterial(matUpper);
      return;
    }

    const cached = getCachedTextureUrl(matUpper);
    if (cached && cached !== '__NEGATIVE__') {
      setLoadedTexture({ material: matUpper, url: cached });
      return;
    } else if (cached === '__NEGATIVE__') {
      setLoadedTexture({ material: matUpper, url: null });
      setFailedMaterial(matUpper);
      return;
    } else {
      setLoadedTexture({ material: matUpper, url: null });
    }

    // Handle Async HDB Head resolution
    if (matUpper.startsWith('HDB-')) {
      const hdbId = matUpper.slice(4).trim();
      resolveHdbTextureHash(hdbId)
        .then((hash) => {
          if (!isCancelled && hash) {
            const url = `https://mc-heads.net/head/${hash}/32`;
            setCachedTextureUrl(matUpper, url);
            setLoadedTexture({ material: matUpper, url });
          }
        })
        .catch(() => {
          if (!isCancelled) {
            const fallback = `https://mc-heads.net/head/MHF_Question/32`;
            setLoadedTexture({ material: matUpper, url: fallback });
          }
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [matUpper]);

  const candidates = getTextureCandidates(material);

  // Fallback default icon
  if (!matUpper || matUpper === 'AIR' || hasFailedAll) {
    return (
      <div className={`relative flex items-center justify-center bg-slate-900/60 rounded-md border border-cyan-500/30 p-1 shadow-inner ${className}`}>
        <Box className="w-full h-full text-cyan-400 opacity-70 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-md pointer-events-none" />
      </div>
    );
  }

  const currentSrcUrl = loadedUrl || candidates[srcIndex] || candidates[0];

  const handleError = () => {
    const nextIndex = srcIndex + 1;
    if (nextIndex < candidates.length) {
      setSourceState({ material: matUpper, index: nextIndex });
    } else {
      // PERF-4: All candidates failed — mark as negative so we never retry
      markNegativeCache(matUpper);
      setFailedMaterial(matUpper);
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
