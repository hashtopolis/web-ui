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
