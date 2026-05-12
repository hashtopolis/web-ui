import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

export const ApiTokensRole = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete'
} as const;
export type ApiTokensRole = (typeof ApiTokensRole)[keyof typeof ApiTokensRole];

@Injectable({
  providedIn: 'root'
})
export class ApiTokensRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      [ApiTokensRole.READ]: [Perm.JwtApiKey.READ],
      [ApiTokensRole.CREATE]: [Perm.JwtApiKey.CREATE],
      [ApiTokensRole.UPDATE]: [Perm.JwtApiKey.UPDATE],
      [ApiTokensRole.DELETE]: [Perm.JwtApiKey.DELETE]
    });
  }
}
