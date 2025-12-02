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
      create: [Perm.SuperTask.CREATE],
      read: [Perm.SuperTask.READ],
      edit: [Perm.SuperTask.UPDATE, Perm.Pretask.READ],
      delete: [Perm.SuperTask.DELETE],
      editSupertaskPreTasks: [Perm.Pretask.READ],
      editSupertaskApplyHashlist: [Perm.Hashlist.READ, Perm.Task.READ, Perm.CrackerBinaryType.READ]
    });
  }
}
