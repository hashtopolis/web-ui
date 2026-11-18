import type { PermissionValues } from '@constants/userpermissions.config';
import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { HashRoleService } from '@services/roles/hashlists/hash-role.service';

describe('HashRoleService', () => {
  function createService(grantedPermissions: PermissionValues[] = []) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return { permissionService, service: new HashRoleService(permissionService) };
  }

  it('grants read when the hash read permission is granted', () => {
    const { permissionService, service } = createService([Perm.Hash.READ]);

    const result = service.hasRole('read');

    expect(result).toBe(true);
    expect(permissionService.hasPermissionSync).toHaveBeenCalledExactlyOnceWith(Perm.Hash.READ);
  });

  it('denies read when the hash read permission is missing', () => {
    const { permissionService, service } = createService([]);

    const result = service.hasRole('read');

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).toHaveBeenCalledExactlyOnceWith(Perm.Hash.READ);
  });

  it('denies an unknown role without checking permissions', () => {
    const { permissionService, service } = createService([Perm.Hash.READ]);

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).not.toHaveBeenCalled();
  });
});
