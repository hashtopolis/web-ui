export enum FilesTableCol {
  ID,
  NAME,
  SIZE,
  LINE_COUNT,
  ACCESS_GROUP,
  CHECKSUM
}

export const FilesTableColumnLabel = {
  [FilesTableCol.ID]: 'ID',
  [FilesTableCol.NAME]: 'Name',
  [FilesTableCol.SIZE]: 'Size',
  [FilesTableCol.LINE_COUNT]: 'Line Count',
  [FilesTableCol.ACCESS_GROUP]: 'Access Group',
  [FilesTableCol.CHECKSUM]: 'Checksum'
};

/**
 * Shown in the checksum column while a file's checksum is `null`. The backend computes checksums
 * in a background job, so a missing value means "not computed yet" rather than a failure.
 */
export const CHECKSUM_PENDING_LABEL = 'Not computed yet';

export const FilesRowAction = {
  PREVIEW: 'preview-file',
  TOGGLE_SECRET: 'toggle-secret',
  RECOUNT_LINES: 'recount-lines',
  RECOMPUTE_CHECKSUM: 'recompute-checksum'
} as const;
export type FilesRowAction = (typeof FilesRowAction)[keyof typeof FilesRowAction];

export const FilesRowActionLabel = {
  PREVIEW: 'Preview File',
  SET_SECRET: 'Set Secret',
  UNSET_SECRET: 'Unset Secret',
  RECOUNT_LINES: 'Recount Lines',
  RECOMPUTE_CHECKSUM: 'Recompute Checksum'
} as const;

export const FilesRowActionIcon = {
  PREVIEW: 'visibility',
  SET_SECRET: 'lock',
  UNSET_SECRET: 'lock_open',
  RECOUNT_LINES: 'calculate',
  RECOMPUTE_CHECKSUM: 'fingerprint'
} as const;
