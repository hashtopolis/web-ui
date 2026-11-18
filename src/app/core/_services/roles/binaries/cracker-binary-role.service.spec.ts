import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { CrackerBinaryRoleService } from '@services/roles/binaries/cracker-binary-role.service';

describe('CrackerBinaryRoleService', () => {
  const rolePermissions = [
    ['read', Perm.CrackerBinary.READ, Perm.CrackerBinaryType.READ],
    ['create', Perm.CrackerBinary.CREATE, Perm.CrackerBinaryType.CREATE],
    ['update', Perm.CrackerBinary.UPDATE, Perm.CrackerBinaryType.UPDATE]
  ] as const;
  const incompleteRolePermissions: Array<[string, string]> = rolePermissions.flatMap(
    ([role, binaryPermission, typePermission]): Array<[string, string]> => [
      [role, binaryPermission],
      [role, typePermission]
    ]
  );

  function createService(grantedPermissions: string[]) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return new CrackerBinaryRoleService(permissionService);
  }

  it.each(rolePermissions)(
    'grants the %s role when both permissions are granted',
    (role, binaryPermission, typePermission) => {
      const service = createService([binaryPermission, typePermission]);

      const result = service.hasRole(role);

      expect(result).toBe(true);
    }
  );

  it.each(incompleteRolePermissions)(
    'denies the %s role when only one required permission is granted',
    (role, permission) => {
      const service = createService([permission]);

      const result = service.hasRole(role);

      expect(result).toBe(false);
    }
  );

  it('denies every role when no permissions are granted', () => {
    const service = createService([]);

    const results = rolePermissions.map(([role]) => service.hasRole(role));

    expect(results).toStrictEqual([false, false, false]);
  });

  it('denies an unknown role', () => {
    const service = createService([Perm.CrackerBinary.READ, Perm.CrackerBinaryType.READ]);

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
  });
});
