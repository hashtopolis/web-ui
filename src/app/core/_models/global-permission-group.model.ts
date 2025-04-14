import { User } from 'src/app/users/user.model';
import { JUser } from '@src/app/core/_models/user.model';
import { BaseModel } from '@src/app/core/_models/base.model';

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

export interface JGlobalPermissionGroup extends BaseModel {
  name: string;
  permissions: Permission;
  userMembers: JUser[];
}

