export enum FilesTableCol {
  ID,
  NAME,
  SIZE,
  LINE_COUNT,
  ACCESS_GROUP
}

export const FilesTableColumnLabel = {
  [FilesTableCol.ID]: 'ID',
  [FilesTableCol.NAME]: 'Name',
  [FilesTableCol.SIZE]: 'Size',
  [FilesTableCol.LINE_COUNT]: 'Line Count',
  [FilesTableCol.ACCESS_GROUP]: 'Access Group'
};

export const FilesRowAction = {
  TOGGLE_SECRET: 'toggle-secret',
  RECOUNT_LINES: 'recount-lines'
} as const;
export type FilesRowAction = (typeof FilesRowAction)[keyof typeof FilesRowAction];

export const FilesRowActionLabel = {
  SET_SECRET: 'Set Secret',
  UNSET_SECRET: 'Unset Secret',
  RECOUNT_LINES: 'Recount Lines'
} as const;

export const FilesRowActionIcon = {
  SET_SECRET: 'lock',
  UNSET_SECRET: 'lock_open',
  RECOUNT_LINES: 'calculate'
} as const;
