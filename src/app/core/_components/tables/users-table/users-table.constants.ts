export enum UsersTableCol {
  ID,
  NAME,
  REGISTERED,
  LAST_LOGIN,
  EMAIL,
  STATUS,
  SESSION,
  PERM_GROUP
}

export const UsersTableColumnLabel = {
  [UsersTableCol.ID]: 'ID',
  [UsersTableCol.NAME]: 'Name',
  [UsersTableCol.REGISTERED]: 'Registered',
  [UsersTableCol.LAST_LOGIN]: 'Last Login',
  [UsersTableCol.EMAIL]: 'Email',
  [UsersTableCol.STATUS]: 'Status',
  [UsersTableCol.SESSION]: 'Session Lifetime',
  [UsersTableCol.PERM_GROUP]: 'Permission Group'
};

export const UsersTableStatus = {
  VALID: 'Valid',
  INVALID: 'Invalid/Not activated'
};
