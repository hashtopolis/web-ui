import type { PermissionValues } from '@constants/userpermissions.config';
import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { HealthCheckRoleService } from '@services/roles/config/healthcheck-role.service';

describe('HealthCheckRoleService', () => {
  function createService(grantedPermissions: PermissionValues[] = []) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return new HealthCheckRoleService(permissionService);
  }

  it('grants read when the health check read permission is granted', () => {
    const service = createService([Perm.HealthCheck.READ]);

    const result = service.hasRole('read');

    expect(result).toBe(true);
  });

  it('denies read when the health check read permission is missing', () => {
    const service = createService([]);

    const result = service.hasRole('read');

    expect(result).toBe(false);
  });

  it('grants create when both required permissions are granted', () => {
    const service = createService([Perm.HealthCheck.CREATE, Perm.AgentBinary.READ]);

    const result = service.hasRole('create');

    expect(result).toBe(true);
  });

  it.each([Perm.HealthCheck.CREATE, Perm.AgentBinary.READ])(
    'denies create when the %s permission is missing',
    (missingPermission) => {
      const requiredPermissions = [Perm.HealthCheck.CREATE, Perm.AgentBinary.READ];
      const grantedPermissions = requiredPermissions.filter((permission) => permission !== missingPermission);
      const service = createService(grantedPermissions);

      const result = service.hasRole('create');

      expect(result).toBe(false);
    }
  );

  it('denies an unknown role', () => {
    const service = createService([Perm.HealthCheck.READ, Perm.HealthCheck.CREATE, Perm.AgentBinary.READ]);

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
  });
});
