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

export const ChunkStateLabel = {
  NEW: 'New',
  INIT: 'Init',
  RUNNING: 'Running',
  PAUSED: 'Paused',
  EXHAUSTED: 'Exhausted',
  CRACKED: 'Cracked',
  ABORTED: 'Aborted',
  QUIT: 'Quit',
  BYPASS: 'Bypass',
  TRIMMED: 'Trimmed',
  ABORTING: 'Aborting...'
} as const;
export type ChunkStateLabel = (typeof ChunkStateLabel)[keyof typeof ChunkStateLabel];

/** Maps each `ChunkState` code to its display label. Exhaustive by construction - a new `ChunkState` member is a compile error here until given a label. */
export const ChunkStateLabels: Record<ChunkState, ChunkStateLabel> = {
  [ChunkState.NEW]: ChunkStateLabel.NEW,
  [ChunkState.INIT]: ChunkStateLabel.INIT,
  [ChunkState.RUNNING]: ChunkStateLabel.RUNNING,
  [ChunkState.PAUSED]: ChunkStateLabel.PAUSED,
  [ChunkState.EXHAUSTED]: ChunkStateLabel.EXHAUSTED,
  [ChunkState.CRACKED]: ChunkStateLabel.CRACKED,
  [ChunkState.ABORTED]: ChunkStateLabel.ABORTED,
  [ChunkState.QUIT]: ChunkStateLabel.QUIT,
  [ChunkState.BYPASS]: ChunkStateLabel.BYPASS,
  [ChunkState.TRIMMED]: ChunkStateLabel.TRIMMED,
  [ChunkState.ABORTING]: ChunkStateLabel.ABORTING
};
