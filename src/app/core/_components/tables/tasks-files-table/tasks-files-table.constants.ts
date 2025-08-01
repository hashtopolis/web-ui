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
