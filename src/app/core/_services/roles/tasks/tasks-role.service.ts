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
      edit: [Perm.Task.UPDATE, Perm.TaskWrapper.UPDATE],
      editTaskInfoHashlist: [Perm.Hashlist.READ, Perm.Hashtype.READ],
      editTaskInfoCracker: [Perm.CrackerBinary.READ, Perm.CrackerBinaryType.READ],
      editTaskAgents: [Perm.Agent.READ, Perm.AgentAssignment.READ],
      editTaskAssignAgents: [Perm.AgentAssignment.CREATE, Perm.AgentAssignment.DELETE],
      editTaskFiles: [Perm.File.READ],
      editTaskSpeed: [Perm.Speed.READ],
      editTaskChunks: [Perm.Chunk.READ, Perm.Agent.READ]
    });
  }
}
