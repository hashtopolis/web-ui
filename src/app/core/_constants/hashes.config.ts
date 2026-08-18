/**
 * Which parent resource the hashes view is scoped to.
 */
export const HashesViewType = {
  CHUNKS: 'chunks',
  TASKS: 'tasks',
  HASHLISTS: 'hashlists'
} as const;
export type HashesViewType = (typeof HashesViewType)[keyof typeof HashesViewType];

/**
 * Which of the two selects on the hashes view a value belongs to.
 */
export const HashesSelectKind = {
  DISPLAY: 0,
  FILTER: 1
} as const;
export type HashesSelectKind = (typeof HashesSelectKind)[keyof typeof HashesSelectKind];

/**
 * `cracked` filter values for the hashes view. An empty id means "no filter".
 */
export const HashesFilter = {
  CRACKED: 'cracked',
  ALL: ''
} as const;
export type HashesFilter = (typeof HashesFilter)[keyof typeof HashesFilter];

export const filters = [
  { _id: HashesFilter.CRACKED, name: 'Cracked' },
  { _id: HashesFilter.CRACKED, name: 'Uncracked' },
  { _id: HashesFilter.ALL, name: 'All' }
];

/**
 * Which columns the hashes view renders. An empty id means "hashes and plaintexts".
 */
export const HashesDisplay = {
  HASH_AND_PLAIN: '',
  HASH: 'hash',
  PLAIN: 'plain',
  HASH_PLAIN_CRACKPOS: 'hpc',
  HASH_CRACKPOS: 'hc',
  PLAIN_CRACKPOS: 'pc'
} as const;
export type HashesDisplay = (typeof HashesDisplay)[keyof typeof HashesDisplay];

export const displays = [
  { _id: HashesDisplay.HASH_AND_PLAIN, name: 'Hashes + Plaintexts' },
  { _id: HashesDisplay.HASH, name: 'Hashes only' },
  { _id: HashesDisplay.PLAIN, name: 'Plaintexts only' },
  { _id: HashesDisplay.HASH_PLAIN_CRACKPOS, name: 'Hashes + Plaintexts + Crackposition' },
  { _id: HashesDisplay.HASH_CRACKPOS, name: 'Hashes + Crackposition' },
  { _id: HashesDisplay.PLAIN_CRACKPOS, name: 'Plaintexts + Crackposition' }
];
