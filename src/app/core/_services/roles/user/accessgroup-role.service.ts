/**
 * Role service definition for access groups
 */
import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGroupRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      read: [Perm.GroupAccess.READ]
    });
  }
}
