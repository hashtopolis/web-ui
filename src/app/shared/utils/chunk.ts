/**
 * Shared chunk math, used by the chunk tables and the chunk detail page so they agree on every value.
 * Plain functions (not pipes) so table render callbacks can use them too.
 */
import { JChunk } from '@models/chunk.model';

type ChunkRange = Pick<JChunk, 'skip' | 'length' | 'checkpoint'>;

/** Keyspace positions covered so far: checkpoint minus skip, clamped to the chunk's length. */
export function chunkProcessed(chunk: ChunkRange): number {
  const done = (chunk.checkpoint ?? 0) - (chunk.skip ?? 0);
  if (!(done > 0)) return 0;
  return Math.min(chunk.length ?? 0, done);
}

/** Share of the chunk covered by the checkpoint, in percent (0-100). */
export function chunkCheckpointPercent(chunk: ChunkRange): number {
  if (!(chunk.length > 0)) return 0;
  return (chunkProcessed(chunk) / chunk.length) * 100;
}

/**
 * Progress through the chunk in percent (0-100).
 *
 * The agent reports `progress` in hundredths of a percent; when that is missing or 0 while the checkpoint has
 * already moved past `skip`, the checkpoint is used instead. Returns null when neither is known.
 */
export function chunkProgressPercent(chunk: ChunkRange & Pick<JChunk, 'progress'>): number | null {
  if (chunk.progress > 0) return Math.min(100, chunk.progress / 100);
  if (chunkProcessed(chunk) > 0) return chunkCheckpointPercent(chunk);
  return chunk.progress === undefined || chunk.progress === null ? null : 0;
}

/** Seconds between dispatch and the last activity, 0 when either is missing. */
export function chunkTimeSpent(chunk: Pick<JChunk, 'dispatchTime' | 'solveTime'>): number {
  if (!chunk.dispatchTime || !chunk.solveTime) return 0;
  return Math.max(0, chunk.solveTime - chunk.dispatchTime);
}
