export const ChunkState = {
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
export type ChunkState = (typeof ChunkState)[keyof typeof ChunkState];

export const chunkStates: ChunkState[] = [
  ChunkState.NEW,
  ChunkState.INIT,
  ChunkState.RUNNING,
  ChunkState.PAUSED,
  ChunkState.EXHAUSTED,
  ChunkState.CRACKED,
  ChunkState.ABORTED,
  ChunkState.QUIT,
  ChunkState.BYPASS,
  ChunkState.TRIMMED,
  ChunkState.ABORTING
];
