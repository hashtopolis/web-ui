import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { PreprocessorRoleService } from '@services/roles/binaries/preprocessor-role.service';

describe('PreprocessorRoleService', () => {
  const rolePermissions = [
    ['read', Perm.Prepro.READ],
    ['create', Perm.Prepro.CREATE],
    ['update', Perm.Prepro.UPDATE]
  ] as const;

  function createService(grantedPermissions: string[]) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return new PreprocessorRoleService(permissionService);
  }

  it.each(rolePermissions)('grants the %s role when its permission is granted', (role, permission) => {
    const service = createService([permission]);

    const result = service.hasRole(role);

    expect(result).toBe(true);
  });

  it.each(rolePermissions)('denies the %s role when its permission is missing', (role, missingPermission) => {
    const grantedPermissions = rolePermissions
      .map(([, permission]) => permission)
      .filter((permission) => permission !== missingPermission);
    const service = createService(grantedPermissions);

    const result = service.hasRole(role);

    expect(result).toBe(false);
  });

  it('denies every role when no permissions are granted', () => {
    const service = createService([]);

    const results = rolePermissions.map(([role]) => service.hasRole(role));

    expect(results).toStrictEqual([false, false, false]);
  });

  it('denies an unknown role', () => {
    const service = createService(rolePermissions.map(([, permission]) => permission));

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
  });
});
