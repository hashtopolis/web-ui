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
export class TasksRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      create: [Perm.Task.CREATE, Perm.TaskWrapper.CREATE, Perm.Hashlist.READ, Perm.AgentBinary.READ],
      read: [Perm.Task.READ, Perm.TaskWrapper.READ],
      update: [Perm.Task.UPDATE, Perm.TaskWrapper.UPDATE]
    });
  }
}
