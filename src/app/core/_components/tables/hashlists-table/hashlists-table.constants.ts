export enum HashlistsTableCol {
  ID,
  NAME,
  STATUS,
  HASHTYPE,
  FORMAT,
  CRACKED,
  HASH_COUNT
}

export const HashlistsTableColumnLabel = {
  [HashlistsTableCol.ID]: 'ID',
  [HashlistsTableCol.NAME]: 'Name',
  [HashlistsTableCol.STATUS]: 'Status',
  [HashlistsTableCol.HASHTYPE]: 'Hash Type',
  [HashlistsTableCol.FORMAT]: 'Format',
  [HashlistsTableCol.CRACKED]: 'Cracked',
  [HashlistsTableCol.HASH_COUNT]: 'Hash Count'
};
