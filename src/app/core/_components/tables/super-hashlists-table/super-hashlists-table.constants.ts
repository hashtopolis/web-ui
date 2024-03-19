export enum SuperHashlistsTableCol {
  ID,
  NAME,
  STATUS,
  HASHTYPE,
  PRE_CRACKED,
  HASHLISTS,
  CRACKED
}

export const SuperHashlistsTableColumnLabel = {
  [SuperHashlistsTableCol.ID]: 'ID',
  [SuperHashlistsTableCol.NAME]: 'Name',
  [SuperHashlistsTableCol.STATUS]: 'Status',
  [SuperHashlistsTableCol.HASHTYPE]: 'Hash Type',
  [SuperHashlistsTableCol.PRE_CRACKED]: 'Pre-cracked',
  [SuperHashlistsTableCol.HASHLISTS]: 'Hashlists',
  [SuperHashlistsTableCol.CRACKED]: 'Cracked'
};
