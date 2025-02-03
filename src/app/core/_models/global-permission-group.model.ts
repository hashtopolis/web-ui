import { User } from 'src/app/users/user.model';

export interface Permission {
  [key: string]: boolean;
}

export interface GlobalPermissionGroup {
  _id: number;
  _self: string;
  id: number;
  name: string;
  permissions: Permission;
  user: User[];
}


export interface GlobalPermissionGroupData {
  type: string;
  id: number;
  attributes: GlobalPermissionGroupDataAttributes;
  links: DataLinks;
  relationships: GlobalPermissionGroupDataRelationships;
}

export interface GlobalPermissionGroupDataAttributes {
  name: string;
  permissions: { [key: string]: boolean };
  userCount: number;
}

export interface DataLinks {
  self: string;
}

export interface GlobalPermissionGroupDataRelationships {
  userMembers: UserMembers;
}

export interface UserMembers {
  links: UserMembersLinks;
  data: UserMembersData[];
}

export interface UserMembersLinks {
  self: string;
  related: string;
}

export interface UserMembersData {
  type: string;
  id: number;
}
