export enum AccessPermissionGroupsUserTableCol {
  NAME,
  CREATE,
  READ,
  UPDATE,
  DELETE
}

export const AccessPermissionGroupsUserTableColumnLabel = {
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
  CHANGE_DELETE_PERMISSION: 'change-delete-permission'
};
