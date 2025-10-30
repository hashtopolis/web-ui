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
    editHashList: {
      readTasks: [Perm.TaskWrapper.READ],
      updateHashList: [Perm.Hashlist.UPDATE],
      readGroups: [Perm.GroupAccess.READ],
      createWordList: [Perm.Hash.READ, Perm.File.CREATE]
    }
  };

  private roleGroup: string;

  constructor(private permissionService: PermissionService) {}

  /**
   * Set the component's group name
   * @param roleGroup
   */
  setRoleGroup(roleGroup: string) {
    this.roleGroup = roleGroup;
  }

  /**
   * Check, if the user has all permissions required for the given role
   *
   * @param roleName - name of the role inside roleGroup to check
   * @return true: all permissions granted, false: at least one missing permission for the role
   */
  hasRole(roleName: string): boolean {
    for (const entry of this.requiredRoles[this.roleGroup][roleName]) {
      if (!this.permissionService.hasPermissionSync(entry)) {
        return false;
      }
    }
    return true;
  }
}
