/**
 * Role service definition for hashlists
 */
import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

@Injectable({
  providedIn: 'root'
})
export class HashListRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      create: [Perm.Hashlist.CREATE, Perm.Hashtype.READ],
      read: [Perm.Hashlist.READ],
      update: [Perm.Hashlist.UPDATE],
      tasks: [Perm.TaskWrapper.READ],
      groups: [Perm.GroupAccess.READ],
      wordlist: [Perm.Hash.READ, Perm.File.CREATE]
    });
  }
}
