/**
 * Role service definition for preprocessors
 */
import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

@Injectable({
  providedIn: 'root'
})
export class PreprocessorRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      read: [Perm.Prepro.READ],
      create: [Perm.Prepro.CREATE],
      update: [Perm.Prepro.UPDATE]
    });
  }
}
