import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { AgentBinaryRoleService } from '@services/roles/binaries/agent-binary-role.service';

describe('AgentBinaryRoleService', () => {
  const rolePermissions = [
    ['read', Perm.AgentBinary.READ, Perm.AgentBinary.CREATE],
    ['create', Perm.AgentBinary.CREATE, Perm.AgentBinary.READ]
  ] as const;

  function createService(grantedPermissions: string[]) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return new AgentBinaryRoleService(permissionService);
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
    const service = createService([Perm.AgentBinary.READ, Perm.AgentBinary.CREATE]);

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
  });
});
