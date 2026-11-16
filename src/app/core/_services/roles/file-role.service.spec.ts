import type { PermissionValues } from '@constants/userpermissions.config';
import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { FileRoleService } from '@services/roles/file-role.service';

describe('FileRoleService', () => {
  const rolePermissions = [
    ['read', Perm.File.READ, Perm.File.CREATE],
    ['create', Perm.File.CREATE, Perm.File.READ]
  ] as const;

  function createService(grantedPermissions: PermissionValues[]) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return new FileRoleService(permissionService);
  }

  it.each(rolePermissions)('grants the %s role when its permission is granted', (role, permission) => {
    const service = createService([permission]);

    const result = service.hasRole(role);

    expect(result).toBe(true);
  });

  it.each(rolePermissions)(
    'denies the %s role when only the other permission is granted',
    (role, _permission, otherPermission) => {
      const service = createService([otherPermission]);

      const result = service.hasRole(role);

      expect(result).toBe(false);
    }
  );

  it('denies an unknown role', () => {
    const service = createService([Perm.File.READ, Perm.File.CREATE]);

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
  });
});
