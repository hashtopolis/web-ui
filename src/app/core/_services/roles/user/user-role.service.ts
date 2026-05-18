/**
 * Role service definition for users
 */
import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      read: [Perm.User.READ],
      create: [Perm.User.CREATE, Perm.RightGroup.READ],
      update: [Perm.User.UPDATE, Perm.RightGroup.READ],
      delete: [Perm.User.DELETE]
    });
  }
}
