/**
 * Role service definition for superhashlists
 */

import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

@Injectable({
  providedIn: 'root'
})
export class SuperHashListRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      read: [Perm.Hashlist.READ, Perm.SuperHashlist.READ],
      create: [Perm.SuperHashlist.CREATE, Perm.Hashlist.CREATE, Perm.Hashlist.READ]
    });
  }
}
