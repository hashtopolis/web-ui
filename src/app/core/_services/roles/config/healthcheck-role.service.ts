/**
 * Role service definition for agent health checks
 */
import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      read: [Perm.HealthCheck.READ],
      create: [Perm.HealthCheck.CREATE, Perm.AgentBinary.READ]
    });
  }
}
