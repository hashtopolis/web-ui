/**
 * Role wrapper for user roles
 */
import { Injectable } from '@angular/core';

import { AccessGroupRoleService } from '@services/roles/user/accessgroup-role.service';
import { PermissionRoleService } from '@services/roles/user/permission-role.service';
import { UserRoleService } from '@services/roles/user/user-role.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoleWrapperService {
  constructor(
    private userRoleService: UserRoleService,
    private permissionRoleService: PermissionRoleService,
    private accessGroupRoleService: AccessGroupRoleService
  ) {}

  hasUserRole(roleName: string): boolean {
    return this.userRoleService.hasRole(roleName);
  }

  hasPermissionRole(roleName: string): boolean {
    return this.permissionRoleService.hasRole(roleName);
  }

  hasAccessGroupRole(roleName: string): boolean {
    return this.accessGroupRoleService.hasRole(roleName);
  }
}
