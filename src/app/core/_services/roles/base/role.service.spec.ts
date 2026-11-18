import type { PermissionValues } from '@constants/userpermissions.config';
import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import type { RoleMapping } from '@services/roles/base/role.service';
import { RoleService } from '@services/roles/base/role.service';

class TestRoleService extends RoleService {
  constructor(permissionService: PermissionService, roles: RoleMapping) {
    super(permissionService, roles);
  }
}

describe('RoleService', () => {
  function createService(roles: RoleMapping, grantedPermissions: PermissionValues[] = []) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return { permissionService, service: new TestRoleService(permissionService, roles) };
  }

  it('grants a role when all its permissions are granted', () => {
    const roles = { read: [Perm.Agent.READ, Perm.AgentStat.READ] };
    const { permissionService, service } = createService(roles, [Perm.Agent.READ, Perm.AgentStat.READ]);

    const result = service.hasRole('read');

    expect(result).toBe(true);
    expect(permissionService.hasPermissionSync).toHaveBeenNthCalledWith(1, Perm.Agent.READ);
    expect(permissionService.hasPermissionSync).toHaveBeenNthCalledWith(2, Perm.AgentStat.READ);
  });

  it('denies a role as soon as one of its permissions is missing', () => {
    const roles = { read: [Perm.Agent.READ, Perm.AgentStat.READ] };
    const { permissionService, service } = createService(roles, [Perm.AgentStat.READ]);

    const result = service.hasRole('read');

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).toHaveBeenCalledExactlyOnceWith(Perm.Agent.READ);
  });

  it('denies an unknown role and a role with no required permissions', () => {
    const roles = { empty: [] };
    const { permissionService, service } = createService(roles, [Perm.Agent.READ]);

    const unknownRoleResult = service.hasRole('unknown');
    const emptyRoleResult = service.hasRole('empty');

    expect(unknownRoleResult).toBe(false);
    expect(emptyRoleResult).toBe(false);
    expect(permissionService.hasPermissionSync).not.toHaveBeenCalled();
  });
});
