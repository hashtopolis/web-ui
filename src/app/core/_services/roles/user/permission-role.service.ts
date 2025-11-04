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
export class PermissionRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      read: [Perm.RightGroup.READ]
    });
  }
}
