import { ChunkState } from '@constants/chunks.config';
import { zChunkResponse } from '@generated/api/zod';

/**
 * Guards against `ChunkState` drifting from the generated `zChunkResponse` schema, which
 * is the actual source of truth for what the backend can send. Two independent failure
 * modes are covered: `ChunkState` claiming a value the backend never sends, and the
 * backend's schema accepting a value `ChunkState` (and therefore `ChunkStateLabel`) doesn't
 * know about yet - the second only surfaces after a regeneration, which is the point.
 */
describe('ChunkState / zChunkResponse drift guardrail', () => {
  const stateSchema = zChunkResponse.shape.data.shape.attributes.shape.state;

  it('accepts every declared ChunkState value', () => {
    for (const value of Object.values(ChunkState)) {
      expect(stateSchema.safeParse(value).success).toBe(true);
    }
  });

  it('rejects every value in a surrounding range that is not a declared ChunkState value', () => {
    const declared = new Set<number>(Object.values(ChunkState));
    const probeRange = Array.from({ length: 21 }, (_, i) => i - 5); // -5..15, straddling the known 0-10 range
    const outOfRange = probeRange.filter((value) => !declared.has(value));

    expect(outOfRange.length).toBeGreaterThan(0);
    for (const value of outOfRange) {
      expect(stateSchema.safeParse(value).success).toBe(false);
    }
  });
});
