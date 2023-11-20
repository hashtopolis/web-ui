export interface Permission {
  [key: string]: boolean;
}

export interface GlobalPermissionGroup {
  _id: number;
  _self: string;
  id: number;
  name: string;
  permissions: Permission;
}
