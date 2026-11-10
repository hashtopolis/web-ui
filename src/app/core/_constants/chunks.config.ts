/**
 * Chunk state codes matching hashcat's status_rc_t enum, the generated Zod
 * schema and the server's `DHashcatStatus` enum. The values 12 and 15 are
 * unused by hashcat and therefore intentionally missing here as well.
 */
export const ChunkState = {
  INIT: 0,
  AUTOTUNE: 1,
  SELFTEST: 2,
  RUNNING: 3,
  PAUSED: 4,
  EXHAUSTED: 5,
  CRACKED: 6,
  ABORTED: 7,
  QUIT: 8,
  BYPASS: 9,
  ABORTED_CHECKPOINT: 10,
  ABORTED_RUNTIME: 11,
  ERROR: 13,
  ABORTED_FINISH: 14,
  AUTODETECT: 16
} as const;
export type ChunkState = (typeof ChunkState)[keyof typeof ChunkState];

/** Maps each `ChunkState` code to its display label. Exhaustive by construction - a new `ChunkState` member is a compile error here until given a label. */
export const ChunkStateLabels: Record<ChunkState, string> = {
  [ChunkState.INIT]: 'New',
  [ChunkState.AUTOTUNE]: 'Autotune',
  [ChunkState.SELFTEST]: 'Selftest',
  [ChunkState.RUNNING]: 'Running',
  [ChunkState.PAUSED]: 'Paused',
  [ChunkState.EXHAUSTED]: 'Exhausted',
  [ChunkState.CRACKED]: 'Cracked',
  [ChunkState.ABORTED]: 'Aborted',
  [ChunkState.QUIT]: 'Quit',
  [ChunkState.BYPASS]: 'Bypass',
  [ChunkState.ABORTED_CHECKPOINT]: 'Trimmed',
  [ChunkState.ABORTED_RUNTIME]: 'Aborting...',
  [ChunkState.ERROR]: 'Errored',
  [ChunkState.ABORTED_FINISH]: 'Aborted',
  [ChunkState.AUTODETECT]: 'Autodetecting'
};

/** Maps each `ChunkState` code to the state pill CSS class defined in `styles/components/_pill.scss`. */
export const ChunkStatePillClass: Record<ChunkState, string> = {
  [ChunkState.INIT]: 'pill-new',
  [ChunkState.AUTOTUNE]: 'pill-autotune',
  [ChunkState.SELFTEST]: 'pill-selftest',
  [ChunkState.RUNNING]: 'pill-running',
  [ChunkState.PAUSED]: 'pill-paused',
  [ChunkState.EXHAUSTED]: 'pill-exhausted',
  [ChunkState.CRACKED]: 'pill-cracked',
  [ChunkState.ABORTED]: 'pill-aborted',
  [ChunkState.QUIT]: 'pill-quit',
  [ChunkState.BYPASS]: 'pill-bypass',
  [ChunkState.ABORTED_CHECKPOINT]: 'pill-trimmed',
  [ChunkState.ABORTED_RUNTIME]: 'pill-aborting',
  [ChunkState.ERROR]: 'pill-error',
  [ChunkState.ABORTED_FINISH]: 'pill-aborted',
  [ChunkState.AUTODETECT]: 'pill-autodetect'
};
