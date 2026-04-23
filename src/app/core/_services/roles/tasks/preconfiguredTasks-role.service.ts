/**
 * Role service definition for tasks
 */
import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

export const PretaskRole = {
  Create: 'create',
  Read: 'read',
  Edit: 'edit'
} as const;

export type PretaskRole = (typeof PretaskRole)[keyof typeof PretaskRole];

@Injectable({
  providedIn: 'root'
})
export class PreconfiguredTasksRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      [PretaskRole.Create]: [Perm.Pretask.CREATE, Perm.File.READ, Perm.CrackerBinaryType.READ],
      [PretaskRole.Read]: [Perm.Pretask.READ],
      [PretaskRole.Edit]: [Perm.Pretask.UPDATE, Perm.Pretask.DELETE, Perm.File.READ, Perm.CrackerBinaryType.READ]
    });
  }
}
