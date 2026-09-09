/**
 * Chunk state codes (0-10) matching the generated Zod schema and the server's
 * `DHashcatStatus` enum.
 */
export const ChunkState = {
  NEW: 0,
  INIT: 1,
  RUNNING: 2,
  PAUSED: 3,
  EXHAUSTED: 4,
  CRACKED: 5,
  ABORTED: 6,
  QUIT: 7,
  BYPASS: 8,
  TRIMMED: 9,
  ABORTING: 10
} as const;
export type ChunkState = (typeof ChunkState)[keyof typeof ChunkState];

/** Maps each `ChunkState` code to its display label. Exhaustive by construction - a new `ChunkState` member is a compile error here until given a label. */
export const ChunkStateLabels: Record<ChunkState, string> = {
  [ChunkState.NEW]: 'New',
  [ChunkState.INIT]: 'Init',
  [ChunkState.RUNNING]: 'Running',
  [ChunkState.PAUSED]: 'Paused',
  [ChunkState.EXHAUSTED]: 'Exhausted',
  [ChunkState.CRACKED]: 'Cracked',
  [ChunkState.ABORTED]: 'Aborted',
  [ChunkState.QUIT]: 'Quit',
  [ChunkState.BYPASS]: 'Bypass',
  [ChunkState.TRIMMED]: 'Trimmed',
  [ChunkState.ABORTING]: 'Aborting...'
};
