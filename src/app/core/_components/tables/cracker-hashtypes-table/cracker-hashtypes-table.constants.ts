export enum CrackerHashtypesTableCol {
  HASHTYPE,
  DESCRIPTION,
  SALTED,
  SLOW_HASH
}

export const CrackerHashtypesTableColumnLabel = {
  [CrackerHashtypesTableCol.HASHTYPE]: 'Hashtype (Hashcat -m)',
  [CrackerHashtypesTableCol.DESCRIPTION]: 'Description',
  [CrackerHashtypesTableCol.SALTED]: 'Salted',
  [CrackerHashtypesTableCol.SLOW_HASH]: 'Slow Hash'
};
