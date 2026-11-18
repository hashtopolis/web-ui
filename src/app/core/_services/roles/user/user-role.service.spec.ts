import type { PermissionValues } from '@constants/userpermissions.config';
import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { UserRoleService } from '@services/roles/user/user-role.service';

describe('UserRoleService', () => {
  const rolePermissions = [
    ['read', [Perm.User.READ]],
    ['create', [Perm.User.CREATE, Perm.RightGroup.READ]],
    ['update', [Perm.User.UPDATE, Perm.RightGroup.READ]],
    ['delete', [Perm.User.DELETE]]
  ] as const;

  function createService(grantedPermissions: readonly PermissionValues[] = []) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return { permissionService, service: new UserRoleService(permissionService) };
  }

  it.each(rolePermissions)('grants the %s role when all required permissions are granted', (role, permissions) => {
    const { permissionService, service } = createService(permissions);

    const result = service.hasRole(role);

    expect(result).toBe(true);
    expect(permissionService.hasPermissionSync).toHaveBeenCalledTimes(permissions.length);
    permissions.forEach((permission, index) => {
      expect(permissionService.hasPermissionSync).toHaveBeenNthCalledWith(index + 1, permission);
    });
  });

  it.each(rolePermissions)('denies the %s role when a required permission is missing', (role, permissions) => {
    for (const missingPermission of permissions) {
      const grantedPermissions = permissions.filter((permission) => permission !== missingPermission);
      const { service } = createService(grantedPermissions);

      const result = service.hasRole(role);

      expect(result).toBe(false);
    }
  });

  it('denies an unknown role without checking permissions', () => {
    const { permissionService, service } = createService([Perm.User.READ]);

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).not.toHaveBeenCalled();
  });
});
