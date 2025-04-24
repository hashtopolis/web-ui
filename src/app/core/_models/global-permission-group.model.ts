import { BaseModel } from '@models/base.model';
import { JUser } from '@models/user.model';

export interface Permission {
  [key: string]: boolean;
}

export interface JGlobalPermissionGroup extends BaseModel {
  name: string;
  permissions: Permission;
  userMembers: JUser[];
}
