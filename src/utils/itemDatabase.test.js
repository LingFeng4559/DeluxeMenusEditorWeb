import { describe, expect, it } from 'vitest';
import { getTextureCandidates } from './itemDatabase';

describe('Minecraft texture candidates', () => {
  it('uses the first animation frame for recovery compasses', () => {
    const candidates = getTextureCandidates('RECOVERY_COMPASS');
    expect(candidates.some((url) => url.includes('/recovery_compass_00.png'))).toBe(true);
    expect(candidates.some((url) => url.includes('/recovery_compass.png'))).toBe(false);
  });
});
