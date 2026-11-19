import { ChunkState, isChunkActive } from '@constants/chunks.config';

describe('chunks.config', () => {
  describe('isChunkActive', () => {
    it('is true for an active state (AUTOTUNE)', () => {
      expect(isChunkActive(ChunkState.AUTOTUNE)).toBe(true);
    });

    it('is false for an inactive state (INIT)', () => {
      expect(isChunkActive(ChunkState.INIT)).toBe(false);
    });

    it('is false for a chunk without a state', () => {
      expect(isChunkActive(undefined)).toBe(false);
    });

    it('is false for a state code the frontend does not know', () => {
      expect(isChunkActive(99 as ChunkState)).toBe(false);
    });
  });
});
