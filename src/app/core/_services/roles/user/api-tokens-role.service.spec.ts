import type { PermissionValues } from '@constants/userpermissions.config';
import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { ApiTokensRoleService } from '@services/roles/user/api-tokens-role.service';

describe('ApiTokensRoleService', () => {
  const rolePermissions = [
    ['read', Perm.JwtApiKey.READ],
    ['create', Perm.JwtApiKey.CREATE],
    ['update', Perm.JwtApiKey.UPDATE],
    ['delete', Perm.JwtApiKey.DELETE]
  ] as const;

  function createService(grantedPermissions: readonly PermissionValues[] = []) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return { permissionService, service: new ApiTokensRoleService(permissionService) };
  }

  it.each(rolePermissions)('grants the %s role when its permission is granted', (role, permission) => {
    const { permissionService, service } = createService([permission]);

    const result = service.hasRole(role);

    expect(result).toBe(true);
    expect(permissionService.hasPermissionSync).toHaveBeenCalledExactlyOnceWith(permission);
  });

  it.each(rolePermissions)('denies the %s role when its permission is missing', (role) => {
    const { permissionService, service } = createService();

    const result = service.hasRole(role);

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).toHaveBeenCalledTimes(1);
  });

  it('denies an unknown role without checking permissions', () => {
    const { permissionService, service } = createService([Perm.JwtApiKey.READ]);

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).not.toHaveBeenCalled();
  });
});
