/**
 * Agent Stats Constants
 **/

export class ASC {
  public static GPU_TEMP = 1;
  public static GPU_UTIL = 2;
  public static CPU_UTIL = 3;
}

/**
 * Enum for agent ignore errors
 */
export enum IgnoreErrors {
  NO = 0,
  IGNORE_SAVE = 1,
  IGNORE_NOSAVE = 2
}

export const IGNORE_ERROR_CHOICES = [
  { id: IgnoreErrors.NO, name: 'Deactivate agent on error' },
  { id: IgnoreErrors.IGNORE_SAVE, name: 'Keep agent running, but save errors' },
  { id: IgnoreErrors.IGNORE_NOSAVE, name: 'Keep agent running and discard errors' }
];
