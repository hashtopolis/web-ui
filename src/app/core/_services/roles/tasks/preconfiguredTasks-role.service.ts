/**
 * Role service definition for tasks
 */
import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

@Injectable({
  providedIn: 'root'
})
export class PreconfiguredTasksRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      create: [Perm.Pretask.CREATE, Perm.File.READ, Perm.CrackerBinaryType.READ],
      read: [Perm.Pretask.READ],
      edit: [Perm.Pretask.UPDATE, Perm.Pretask.DELETE, Perm.File.READ, Perm.CrackerBinaryType.READ]
    });
  }
}
