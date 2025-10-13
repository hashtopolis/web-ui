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

export const MAX_SEARCH_LENGTH = 100;
export const MAX_SEARCH_SIZE = 5000;
