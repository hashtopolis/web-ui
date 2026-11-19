import type { PermissionValues } from '@constants/userpermissions.config';
import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { SupertasksRoleService } from '@services/roles/tasks/supertasks-role.service';

describe('SupertasksRoleService', () => {
  const rolePermissions = [
    ['create', [Perm.SuperTask.CREATE, Perm.CrackerBinaryType.READ]],
    ['read', [Perm.SuperTask.READ]],
    ['edit', [Perm.SuperTask.UPDATE, Perm.Pretask.READ]],
    ['delete', [Perm.SuperTask.DELETE]],
    ['editSupertaskPreTasks', [Perm.Pretask.READ]],
    ['editSupertaskApplyHashlist', [Perm.Hashlist.READ, Perm.Task.READ, Perm.CrackerBinaryType.READ]],
    [
      'createSupertaskBuilder',
      [Perm.SuperTask.CREATE, Perm.Pretask.CREATE, Perm.CrackerBinaryType.READ, Perm.File.READ]
    ]
  ] as const;
  const incompleteRolePermissions: Array<[string, readonly PermissionValues[], PermissionValues]> =
    rolePermissions.flatMap(([role, permissions]): Array<[string, readonly PermissionValues[], PermissionValues]> =>
      permissions.map((missingPermission): [string, readonly PermissionValues[], PermissionValues] => [
        role,
        permissions,
        missingPermission
      ])
    );

  function createService(grantedPermissions: readonly PermissionValues[] = []) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return { permissionService, service: new SupertasksRoleService(permissionService) };
  }

  it.each(rolePermissions)('grants the %s role when all required permissions are granted', (role, permissions) => {
    const { permissionService, service } = createService(permissions);

    const result = service.hasRole(role);

    expect(result).toBe(true);
    expect(permissionService.hasPermissionSync.mock.calls.map(([permission]) => permission)).toStrictEqual(permissions);
  });

  it.each(incompleteRolePermissions)(
    'denies the %s role when the %s permission is missing',
    (role, requiredPermissions, missingPermission) => {
      const grantedPermissions = requiredPermissions.filter((permission) => permission !== missingPermission);
      const { service } = createService(grantedPermissions);

      const result = service.hasRole(role);

      expect(result).toBe(false);
    }
  );

  it('denies an unknown role without checking permissions', () => {
    const { permissionService, service } = createService([Perm.SuperTask.READ]);

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).not.toHaveBeenCalled();
  });
});
