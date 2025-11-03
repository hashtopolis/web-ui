/**
 * Base RoleService to combine several single permissions to a role based approach to show or hide UI components
 *
 * Usage:
 * - create a new service class which extends RoleService
 * - add all role to permission mappings to the super() call in the child class constructor
 *
 */
import { PermissionValues } from '@constants/userpermissions.config';

import { PermissionService } from '@services/permission/permission.service';

export type RoleMapping = Record<string, Array<PermissionValues>>;

export abstract class RoleService {
  protected constructor(
    private permissionService: PermissionService,
    private readonly roles: RoleMapping
  ) {}

  /**
   * Check, if the rolename exists in the role object
   * @param key - name of role to check
   * @return true, if the role exists
   * @private
   */
  private hasRoleEntry(key: keyof RoleMapping): boolean {
    return Array.isArray(this.roles[key]) && this.roles[key].length > 0;
  }

  /**
   * Check, if the user has all permissions required for the given role
   *
   * @param roleName - name of the role to check
   * @return true: all permissions granted, false: at least one missing permission for the role
   */
  hasRole(roleName: string): boolean {
    if (!this.hasRoleEntry(roleName)) {
      return false;
    }
    for (const entry of this.roles[roleName]) {
      if (!this.permissionService.hasPermissionSync(entry)) {
        return false;
      }
    }
    return true;
  }
}
