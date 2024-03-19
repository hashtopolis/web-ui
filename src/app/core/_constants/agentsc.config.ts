/**
 * Agent Stats Constants
 **/

export class ASC {
  public static GPU_TEMP = 1;
  public static GPU_UTIL = 2;
  public static CPU_UTIL = 3;
}

export const ignoreErrors = [
  { _id: 'NO', name: 'Deactivate agent on error' },
  { _id: 'IGNORE_SAVE', name: 'Keep agent running, but save errors' },
  { _id: 'IGNORE_NOSAVE', name: 'Keep agent running and discard errors' }
];
