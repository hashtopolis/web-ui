import { SelectOption } from '@src/app/shared/utils/forms';

export const StaticChunkingMode = {
  NONE: 0,
  FIXED_CHUNK_SIZE: 1,
  FIXED_NUMBER_OF_CHUNKS: 2
} as const;
export type StaticChunkingMode = (typeof StaticChunkingMode)[keyof typeof StaticChunkingMode];

export const StaticChunkingModeLabels: Record<StaticChunkingMode, string> = {
  [StaticChunkingMode.NONE]: 'No',
  [StaticChunkingMode.FIXED_CHUNK_SIZE]: 'Fixed chunk size',
  [StaticChunkingMode.FIXED_NUMBER_OF_CHUNKS]: 'Fixed number of chunks'
};

export const staticChunking: SelectOption<number>[] = [
  { id: StaticChunkingMode.NONE, name: StaticChunkingModeLabels[StaticChunkingMode.NONE] },
  { id: StaticChunkingMode.FIXED_CHUNK_SIZE, name: StaticChunkingModeLabels[StaticChunkingMode.FIXED_CHUNK_SIZE] },
  {
    id: StaticChunkingMode.FIXED_NUMBER_OF_CHUNKS,
    name: StaticChunkingModeLabels[StaticChunkingMode.FIXED_NUMBER_OF_CHUNKS]
  }
];

export const benchmarkType = [
  { id: false, name: 'Runtime Benchmark' },
  { id: true, name: 'Speed Test' }
];
