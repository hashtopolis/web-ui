import { SelectOption } from '@src/app/shared/utils/forms';

export const StaticChunkingMode = {
  NONE: 0,
  FIXED_CHUNK_SIZE: 1,
  FIXED_NUMBER_OF_CHUNKS: 2
} as const;
export type StaticChunkingMode = (typeof StaticChunkingMode)[keyof typeof StaticChunkingMode];

export const staticChunking: SelectOption<number>[] = [
  { id: StaticChunkingMode.NONE, name: 'No' },
  { id: StaticChunkingMode.FIXED_CHUNK_SIZE, name: 'Fixed chunk size' },
  { id: StaticChunkingMode.FIXED_NUMBER_OF_CHUNKS, name: 'Fixed number of chunks' }
];

export const benchmarkType = [
  { id: false, name: 'Runtime Benchmark' },
  { id: true, name: 'Speed Test' }
];
