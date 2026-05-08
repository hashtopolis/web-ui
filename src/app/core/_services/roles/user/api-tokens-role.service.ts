import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

@Injectable({
  providedIn: 'root'
})
export class ApiTokensRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      read: [Perm.JwtApiKey.READ],
      create: [Perm.JwtApiKey.CREATE],
      update: [Perm.JwtApiKey.UPDATE],
      delete: [Perm.JwtApiKey.DELETE]
    });
  }
}
