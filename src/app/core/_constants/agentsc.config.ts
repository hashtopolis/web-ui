/**
 * Agent Stats Constants
 **/

/**
 * Stat type recorded per agent, matching the `statType` field on agent stats.
 */
export const ASC = {
  GPU_TEMP: 1,
  GPU_UTIL: 2,
  CPU_UTIL: 3
} as const;
export type ASC = (typeof ASC)[keyof typeof ASC];

/**
 * Agent operating system
 */
export const AgentOS = {
  LINUX: 0,
  WINDOWS: 1,
  MACOS: 2
} as const;
export type AgentOS = (typeof AgentOS)[keyof typeof AgentOS];

/**
 * Agent behaviour when a cracking error occurs
 */
export const IgnoreErrors = {
  NO: 0,
  IGNORE_SAVE: 1,
  IGNORE_NOSAVE: 2
} as const;
export type IgnoreErrors = (typeof IgnoreErrors)[keyof typeof IgnoreErrors];

export const IgnoreErrorsLabels: Record<IgnoreErrors, string> = {
  [IgnoreErrors.NO]: 'Deactivate agent on error',
  [IgnoreErrors.IGNORE_SAVE]: 'Keep agent running, but save errors',
  [IgnoreErrors.IGNORE_NOSAVE]: 'Keep agent running and discard errors'
};

export const IGNORE_ERROR_CHOICES = [
  { id: IgnoreErrors.NO, name: IgnoreErrorsLabels[IgnoreErrors.NO] },
  { id: IgnoreErrors.IGNORE_SAVE, name: IgnoreErrorsLabels[IgnoreErrors.IGNORE_SAVE] },
  { id: IgnoreErrors.IGNORE_NOSAVE, name: IgnoreErrorsLabels[IgnoreErrors.IGNORE_NOSAVE] }
];
