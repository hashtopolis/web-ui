/**
 * Role service definition for agents
 */
import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

@Injectable({
  providedIn: 'root'
})
export class AgentRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      read: [Perm.Agent.READ],
      readStat: [Perm.Agent.READ, Perm.AgentStat.READ],
      readAssignment: [Perm.AgentAssignment.READ, Perm.Task.READ, Perm.TaskWrapper.READ],
      readChunk: [Perm.Task.READ, Perm.TaskWrapper.READ, Perm.Chunk.READ],
      readAccessGroup: [Perm.GroupAccess.READ],
      readError: [Perm.AgentError.READ],
      create: [Perm.Agent.CREATE, Perm.Agent.READ, Perm.Voucher.READ, Perm.AgentBinary.READ],
      update: [Perm.Agent.UPDATE],
      updateAssignment: [Perm.AgentAssignment.UPDATE, Perm.AgentAssignment.READ, Perm.Task.READ, Perm.TaskWrapper.READ]
    });
  }
}
