import type { MockedObject } from 'vitest';

import { AccessGroupRoleService } from '@services/roles/user/accessgroup-role.service';
import { PermissionRoleService } from '@services/roles/user/permission-role.service';
import { UserRoleWrapperService } from '@services/roles/user/user-role-wrapper.service';
import { UserRoleService } from '@services/roles/user/user-role.service';

describe('UserRoleWrapperService', () => {
  function createService() {
    const userRoleService = {
      hasRole: vi.fn().mockName('UserRoleService.hasRole')
    } as MockedObject<UserRoleService>;
    const permissionRoleService = {
      hasRole: vi.fn().mockName('PermissionRoleService.hasRole')
    } as MockedObject<PermissionRoleService>;
    const accessGroupRoleService = {
      hasRole: vi.fn().mockName('AccessGroupRoleService.hasRole')
    } as MockedObject<AccessGroupRoleService>;

    return {
      accessGroupRoleService,
      permissionRoleService,
      service: new UserRoleWrapperService(userRoleService, permissionRoleService, accessGroupRoleService),
      userRoleService
    };
  }

  it('delegates each role check and returns the corresponding result', () => {
    const { accessGroupRoleService, permissionRoleService, service, userRoleService } = createService();
    userRoleService.hasRole.mockReturnValue(true);
    permissionRoleService.hasRole.mockReturnValue(false);
    accessGroupRoleService.hasRole.mockReturnValue(true);

    const userResult = service.hasUserRole('read');
    const permissionResult = service.hasPermissionRole('create');
    const accessGroupResult = service.hasAccessGroupRole('delete');

    expect(userResult).toBe(true);
    expect(permissionResult).toBe(false);
    expect(accessGroupResult).toBe(true);
    expect(userRoleService.hasRole).toHaveBeenCalledExactlyOnceWith('read');
    expect(permissionRoleService.hasRole).toHaveBeenCalledExactlyOnceWith('create');
    expect(accessGroupRoleService.hasRole).toHaveBeenCalledExactlyOnceWith('delete');
  });
});
