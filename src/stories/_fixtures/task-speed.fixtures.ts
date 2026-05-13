import type { SpeedStat } from '@src/app/core/_models/speed-stat.model';

const BASE_TIME = 1_700_000_000;

const build = (
  count: number,
  hashRate: (i: number) => number,
  intervalSeconds = 60
): SpeedStat[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: 'speed',
    agentId: 1,
    taskId: 42,
    speedId: i + 1,
    time: BASE_TIME + i * intervalSeconds,
    speed: Math.round(hashRate(i))
  }));

export const EMPTY: SpeedStat[] = [];

export const SINGLE_POINT: SpeedStat[] = build(1, () => 12_500_000);

// A short ~10-minute run with mild oscillation.
export const SHORT_RUN: SpeedStat[] = build(10, (i) => 9_000_000 + Math.sin(i / 2) * 1_500_000 + i * 200_000);

// Longer dataset so the data-zoom slider has something to chew on.
export const LONG_RUN_WITH_ZOOM: SpeedStat[] = build(
  120,
  (i) => 14_000_000 + Math.sin(i / 5) * 4_000_000 + Math.cos(i / 11) * 2_000_000
);

// High hash rates push the unit auto-formatter into GH/s.
export const HIGH_RATE_GHZ: SpeedStat[] = build(
  60,
  (i) => 12_000_000_000 + Math.sin(i / 4) * 1_500_000_000
);
