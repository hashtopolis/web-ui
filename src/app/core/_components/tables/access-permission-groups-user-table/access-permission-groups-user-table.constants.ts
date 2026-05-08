export enum AccessPermissionGroupsUserTableCol {
  ROW_TOGGLE,
  NAME,
  CREATE,
  READ,
  UPDATE,
  DELETE
}

export const AccessPermissionGroupsUserTableColumnLabel = {
  [AccessPermissionGroupsUserTableCol.ROW_TOGGLE]: '',
  [AccessPermissionGroupsUserTableCol.NAME]: 'Name',
  [AccessPermissionGroupsUserTableCol.CREATE]: 'Create',
  [AccessPermissionGroupsUserTableCol.READ]: 'Read',
  [AccessPermissionGroupsUserTableCol.UPDATE]: 'Update',
  [AccessPermissionGroupsUserTableCol.DELETE]: 'Delete'
};

export const APGUTableEditableAction = {
  CHANGE_CREATE_PERMISSION: 'change-create-permission',
  CHANGE_READ_PERMISSION: 'change-read-permission',
  CHANGE_UPDATE_PERMISSION: 'change-update-permission',
  CHANGE_DELETE_PERMISSION: 'change-delete-permission',
  // Intentionally has no CRUD verb segment so actionToVerb()'s regex never
  // classifies it as a per-cell event.
  CHANGE_ROW_PERMISSION: 'change-row-permissions'
};
