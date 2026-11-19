import type { PermissionValues } from '@constants/userpermissions.config';
import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { LogRoleService } from '@services/roles/config/log-role.service';

describe('LogRoleService', () => {
  function createService(grantedPermissions: PermissionValues[] = []) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return { permissionService, service: new LogRoleService(permissionService) };
  }

  it('grants read when the log read permission is granted', () => {
    const { permissionService, service } = createService([Perm.Logs.READ]);

    const result = service.hasRole('read');

    expect(result).toBe(true);
    expect(permissionService.hasPermissionSync).toHaveBeenCalledExactlyOnceWith(Perm.Logs.READ);
  });

  it('denies read when the log read permission is missing', () => {
    const { permissionService, service } = createService([]);

    const result = service.hasRole('read');

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).toHaveBeenCalledExactlyOnceWith(Perm.Logs.READ);
  });

  it('denies an unknown role without checking permissions', () => {
    const { permissionService, service } = createService([Perm.Logs.READ]);

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).not.toHaveBeenCalled();
  });
});
