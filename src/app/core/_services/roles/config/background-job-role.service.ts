/**
 * Role service definition for background jobs
 */
import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundJobRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      read: [Perm.BackgroundJob.READ],
      delete: [Perm.BackgroundJob.DELETE]
    });
  }
}
