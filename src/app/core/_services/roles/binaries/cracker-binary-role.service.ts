/**
 * Role service definition for cracker binaries
 */
import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

@Injectable({
  providedIn: 'root'
})
export class CrackerBinaryRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      read: [Perm.CrackerBinary.READ, Perm.CrackerBinaryType.READ],
      create: [Perm.CrackerBinary.CREATE, Perm.CrackerBinaryType.CREATE],
      update: [Perm.CrackerBinary.UPDATE, Perm.CrackerBinaryType.UPDATE]
    });
  }
}
