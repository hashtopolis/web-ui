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
  [ChunkState.ERROR]: 'Error',
  [ChunkState.ABORTED_FINISH]: 'Aborted at finish',
  [ChunkState.AUTODETECT]: 'Autodetect'
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

/**
 * Whether an agent's hashcat is working on a chunk in each `ChunkState`. Such a chunk has to be aborted:
 * resetting it does not stop the agent, whose next progress report overwrites the reset. Exhaustive by
 * construction - a new `ChunkState` member is a compile error here until it is decided.
 */
export const ChunkStateIsActive: Record<ChunkState, boolean> = {
  [ChunkState.INIT]: false,
  [ChunkState.AUTOTUNE]: true,
  [ChunkState.SELFTEST]: true,
  [ChunkState.RUNNING]: true,
  [ChunkState.PAUSED]: true,
  [ChunkState.EXHAUSTED]: false,
  [ChunkState.CRACKED]: false,
  [ChunkState.ABORTED]: false,
  [ChunkState.QUIT]: false,
  [ChunkState.BYPASS]: false,
  [ChunkState.ABORTED_CHECKPOINT]: false,
  [ChunkState.ABORTED_RUNTIME]: false,
  [ChunkState.ERROR]: false,
  [ChunkState.ABORTED_FINISH]: false,
  [ChunkState.AUTODETECT]: true
};

/** Whether an agent's hashcat is working on a chunk in this state, see `ChunkStateIsActive`. */
export function isChunkActive(state: ChunkState | undefined): boolean {
  return state !== undefined && ChunkStateIsActive[state] === true;
}
