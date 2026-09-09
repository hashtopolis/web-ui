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
 * `cracked` filter values for the hashes view. An empty id means "no filter".
 */
export const HashesFilter = {
  CRACKED: 'cracked',
  UNCRACKED: 'uncracked',
  ALL: ''
} as const;
export type HashesFilter = (typeof HashesFilter)[keyof typeof HashesFilter];
