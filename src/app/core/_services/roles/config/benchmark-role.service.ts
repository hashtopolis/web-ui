/**
 * Role service definition for the benchmark cache. The cache is server
 * configuration, so it reuses the config permission (matching the server-side
 * serverConfigAccess on the BenchmarkAPI).
 */
import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

@Injectable({
  providedIn: 'root'
})
export class BenchmarkRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      read: [Perm.Config.READ],
      delete: [Perm.Config.DELETE]
    });
  }
}
