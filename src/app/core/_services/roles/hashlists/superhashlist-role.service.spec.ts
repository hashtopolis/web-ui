import type { PermissionValues } from '@constants/userpermissions.config';
import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { SuperHashListRoleService } from '@services/roles/hashlists/superhashlist-role.service';

describe('SuperHashListRoleService', () => {
  const rolePermissions = [
    ['read', [Perm.Hashlist.READ, Perm.SuperHashlist.READ]],
    ['create', [Perm.SuperHashlist.CREATE, Perm.Hashlist.CREATE, Perm.Hashlist.READ]]
  ] as const;

  function createService(grantedPermissions: readonly PermissionValues[] = []) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return { permissionService, service: new SuperHashListRoleService(permissionService) };
  }

  it.each(rolePermissions)('grants the %s role when all required permissions are granted', (role, permissions) => {
    const { permissionService, service } = createService(permissions);

    const result = service.hasRole(role);

    expect(result).toBe(true);
    expect(permissionService.hasPermissionSync.mock.calls.map(([permission]) => permission)).toStrictEqual(permissions);
  });

  it.each(rolePermissions)('denies the %s role when any required permission is missing', (role, permissions) => {
    for (const missingPermission of permissions) {
      const grantedPermissions = permissions.filter((permission) => permission !== missingPermission);
      const { service } = createService(grantedPermissions);

      const result = service.hasRole(role);

      expect(result).toBe(false);
    }
  });

  it('denies an unknown role without checking permissions', () => {
    const { permissionService, service } = createService([Perm.Hashlist.READ]);

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).not.toHaveBeenCalled();
  });
});
