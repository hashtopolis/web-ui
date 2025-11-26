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
export class SupertasksRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      create: [Perm.SuperTask.CREATE, Perm.Pretask.READ],
      read: [Perm.SuperTask.READ, Perm.Pretask.READ],
      edit: [Perm.SuperTask.READ, Perm.Pretask.READ],
      delete: [Perm.SuperTask.DELETE]
    });
  }
}
