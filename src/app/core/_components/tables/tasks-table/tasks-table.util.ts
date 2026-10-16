/**
 * Router links shared by the tasks table and the task card view, so a route only has to be
 * updated in one place when it moves.
 */

/** Edit page of a single task. */
export const taskDetailLink = (taskId: number): Array<string | number> => ['/tasks', 'show-tasks', taskId, 'edit'];

/** Cracked hashes of a single task. */
export const taskCrackedLink = (taskId: number): Array<string | number> => ['/hashlists', 'hashes', 'tasks', taskId];

/** Edit page of a hashlist. */
export const hashlistLink = (hashlistId: number): Array<string | number> => [
  '/hashlists',
  'hashlist',
  hashlistId,
  'edit'
];

/** Edit page of an access group. */
export const accessGroupLink = (accessGroupId: number): Array<string | number> => [
  '/users',
  'access-groups',
  accessGroupId,
  'edit'
];
