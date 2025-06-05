export enum SearchHashTableCol {
  HASH,
  PLAINTEXT,
  HASHLIST,
  INFO
}

export const SearchHashTableColumnLabel = {
  [SearchHashTableCol.HASH]: 'Hash',
  [SearchHashTableCol.PLAINTEXT]: 'Plaintext',
  [SearchHashTableCol.HASHLIST]: 'HashLists',
  [SearchHashTableCol.INFO]: 'Info'
};
