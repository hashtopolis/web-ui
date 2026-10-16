import { JChunk } from '@models/chunk.model';

import {
  chunkCheckpointPercent,
  chunkProcessed,
  chunkProgressPercent,
  chunkTimeSpent
} from '@src/app/shared/utils/chunk';

const chunk = (fields: Partial<JChunk>): JChunk => ({ skip: 0, length: 1000, checkpoint: 0, ...fields }) as JChunk;

describe('chunkProcessed', () => {
  it('counts positions from skip to the checkpoint', () => {
    expect(chunkProcessed(chunk({ skip: 100, checkpoint: 600 }))).toBe(500);
  });

  it('is 0 before the checkpoint passes skip', () => {
    expect(chunkProcessed(chunk({ skip: 100, checkpoint: 0 }))).toBe(0);
    expect(chunkProcessed(chunk({ skip: 100, checkpoint: 100 }))).toBe(0);
  });

  it('never exceeds the chunk length', () => {
    expect(chunkProcessed(chunk({ skip: 0, length: 1000, checkpoint: 5000 }))).toBe(1000);
  });
});

describe('chunkCheckpointPercent', () => {
  it('is the processed share of the chunk', () => {
    expect(chunkCheckpointPercent(chunk({ skip: 100, checkpoint: 350 }))).toBe(25);
  });

  it('is 0 for an empty chunk', () => {
    expect(chunkCheckpointPercent(chunk({ length: 0, checkpoint: 10 }))).toBe(0);
  });
});

describe('chunkProgressPercent', () => {
  it('uses the reported progress (hundredths of a percent)', () => {
    expect(chunkProgressPercent(chunk({ progress: 5000, checkpoint: 100 }))).toBe(50);
  });

  it('caps at 100', () => {
    expect(chunkProgressPercent(chunk({ progress: 12000 }))).toBe(100);
  });

  it('falls back to the checkpoint when progress is 0 or missing', () => {
    expect(chunkProgressPercent(chunk({ progress: 0, checkpoint: 200 }))).toBe(20);
    expect(chunkProgressPercent(chunk({ progress: null as unknown as number, checkpoint: 200 }))).toBe(20);
    expect(chunkProgressPercent(chunk({ checkpoint: 200 }))).toBe(20);
  });

  it('is 0 when progress is 0 and the checkpoint has not moved', () => {
    expect(chunkProgressPercent(chunk({ progress: 0 }))).toBe(0);
  });

  it('is null when nothing is known', () => {
    expect(chunkProgressPercent(chunk({}))).toBeNull();
  });
});

describe('chunkTimeSpent', () => {
  it('is the time between dispatch and last activity', () => {
    expect(chunkTimeSpent({ dispatchTime: 50, solveTime: 100 })).toBe(50);
  });

  it('is 0 when either timestamp is missing', () => {
    expect(chunkTimeSpent({ dispatchTime: 50, solveTime: 0 })).toBe(0);
    expect(chunkTimeSpent({ dispatchTime: 0, solveTime: 100 })).toBe(0);
  });

  it('never goes negative', () => {
    expect(chunkTimeSpent({ dispatchTime: 100, solveTime: 50 })).toBe(0);
  });
});
