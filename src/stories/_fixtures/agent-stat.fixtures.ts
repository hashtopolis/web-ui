import type { JAgentStat } from '@src/app/core/_models/agent-stats.model';

import { ASC } from '@src/app/core/_constants/agentsc.config';

const BASE_TIME = 1_700_000_000;

const samples = (
  statType: number,
  count: number,
  deviceCount: number,
  deviceValue: (i: number, device: number) => number,
  intervalSeconds = 60
): JAgentStat[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: 'agentStat',
    agentId: 1,
    statType,
    time: BASE_TIME + i * intervalSeconds,
    value: Array.from({ length: deviceCount }, (_, d) => Math.round(deviceValue(i, d)))
  }));

export const EMPTY: JAgentStat[] = [];

export const SINGLE_DEVICE_GPU_TEMP: JAgentStat[] = samples(
  ASC.GPU_TEMP,
  40,
  1,
  (i) => 62 + Math.sin(i / 3) * 8
);

export const MULTI_DEVICE_GPU_UTIL: JAgentStat[] = samples(
  ASC.GPU_UTIL,
  40,
  3,
  (i, d) => 70 + Math.sin(i / 4 + d) * 20 + d * 3
);

export const CPU_UTIL_OVER_DAY: JAgentStat[] = samples(
  ASC.CPU_UTIL,
  48,
  1,
  (i) => 35 + Math.cos(i / 6) * 25,
  60 * 30
);
