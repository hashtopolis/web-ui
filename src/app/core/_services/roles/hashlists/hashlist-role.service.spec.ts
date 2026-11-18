import type { PermissionValues } from '@constants/userpermissions.config';
import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { HashListRoleService } from '@services/roles/hashlists/hashlist-role.service';

describe('HashListRoleService', () => {
  const rolePermissions = [
    ['create', [Perm.Hashlist.CREATE, Perm.Hashtype.READ]],
    ['read', [Perm.Hashlist.READ]],
    ['update', [Perm.Hashlist.UPDATE]],
    ['tasks', [Perm.TaskWrapper.READ]],
    ['pretaskBuilder', [Perm.Pretask.READ, Perm.Task.CREATE, Perm.CrackerBinary.READ]],
    [
      'supertaskBuilder',
      [
        Perm.SuperTask.READ,
        Perm.TaskWrapper.CREATE,
        Perm.Task.CREATE,
        Perm.Hashlist.READ,
        Perm.CrackerBinary.READ,
        Perm.CrackerBinaryType.READ
      ]
    ],
    ['groups', [Perm.GroupAccess.READ]],
    ['wordlist', [Perm.Hash.READ, Perm.File.CREATE]]
  ] as const;

  function createService(grantedPermissions: readonly PermissionValues[] = []) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return { permissionService, service: new HashListRoleService(permissionService) };
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
