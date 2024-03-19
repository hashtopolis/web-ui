export enum HashtypesTableCol {
  HASHTYPE,
  DESCRIPTION,
  SALTED,
  SLOW_HASH
}

export const HashtypesTableColumnLabel = {
  [HashtypesTableCol.HASHTYPE]: 'Hashtype (Hashcat -m)',
  [HashtypesTableCol.DESCRIPTION]: 'Description',
  [HashtypesTableCol.SALTED]: 'Salted',
  [HashtypesTableCol.SLOW_HASH]: 'Slow Hash'
};
