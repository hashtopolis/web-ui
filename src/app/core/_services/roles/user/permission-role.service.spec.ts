import type { PermissionValues } from '@constants/userpermissions.config';
import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { PermissionRoleService } from '@services/roles/user/permission-role.service';

describe('PermissionRoleService', () => {
  const rolePermissions = [
    ['read', Perm.RightGroup.READ],
    ['create', Perm.RightGroup.CREATE]
  ] as const;

  function createService(grantedPermissions: readonly PermissionValues[] = []) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return { permissionService, service: new PermissionRoleService(permissionService) };
  }

  it.each(rolePermissions)('grants the %s role when its permission is granted', (role, permission) => {
    const { permissionService, service } = createService([permission]);

    const result = service.hasRole(role);

    expect(result).toBe(true);
    expect(permissionService.hasPermissionSync).toHaveBeenCalledExactlyOnceWith(permission);
  });

  it.each(rolePermissions)('denies the %s role when its permission is missing', (role, permission) => {
    const { permissionService, service } = createService();

    const result = service.hasRole(role);

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).toHaveBeenCalledExactlyOnceWith(permission);
  });

  it('denies an unknown role without checking permissions', () => {
    const { permissionService, service } = createService([Perm.RightGroup.READ]);

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).not.toHaveBeenCalled();
  });
});
