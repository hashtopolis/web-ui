/**
 * How a task's keyspace is split into chunks, matching the `staticChunks` attribute.
 */
export const StaticChunking = {
  NO: 0,
  FIXED_CHUNK_SIZE: 1,
  FIXED_NUMBER_OF_CHUNKS: 2
} as const;
export type StaticChunking = (typeof StaticChunking)[keyof typeof StaticChunking];

export const staticChunking = [
  { id: StaticChunking.NO, name: 'No' },
  { id: StaticChunking.FIXED_CHUNK_SIZE, name: 'Fixed chunk size' },
  { id: StaticChunking.FIXED_NUMBER_OF_CHUNKS, name: 'Fixed number of chunks' }
];

export const benchmarkType = [
  { id: false, name: 'Runtime Benchmark' },
  { id: true, name: 'Speed Test' }
];
