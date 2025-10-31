/**
 * RoleService to combine several single permissions to a role based approach to show or hide UI components
 */

import { Perm, PermissionValues } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';

type RequiredRoles = Record<string, Record<string, Array<PermissionValues>>>;

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private requiredRoles: RequiredRoles = {
    hashList: {
      create: [Perm.Hashlist.CREATE, Perm.Hashtype.READ],
      read: [Perm.Hashlist.READ],
      update: [Perm.Hashlist.UPDATE],
      tasks: [Perm.TaskWrapper.READ],
      groups: [Perm.GroupAccess.READ],
      wordlist: [Perm.Hash.READ, Perm.File.CREATE]
    },
    superHashList: {
      read: [Perm.Hashlist.READ, Perm.SuperHashlist.READ],
      create: [Perm.SuperHashlist.CREATE, Perm.Hashlist.CREATE, Perm.Hashlist.READ]
    },
    hash: {
      read: [Perm.Hash.READ]
    }
  };

  constructor(private permissionService: PermissionService) {}

  /**
   * Check, if the user has all permissions required for the given role
   *
   * @param groupName - name of group
   * @param roleName - name of the role inside roleGroup to check
   * @return true: all permissions granted, false: at least one missing permission for the role
   */
  hasRole(groupName: string, roleName: string): boolean {
    for (const entry of this.requiredRoles[groupName][roleName]) {
      if (!this.permissionService.hasPermissionSync(entry)) {
        return false;
      }
    }
    return true;
  }
}
