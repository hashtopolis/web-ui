import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { AgentRoleService } from '@services/roles/agents/agent-role.service';

describe('AgentRoleService', () => {
  const rolePermissions = [
    ['read', [Perm.Agent.READ]],
    ['readStat', [Perm.Agent.READ, Perm.AgentStat.READ]],
    ['readAssignment', [Perm.AgentAssignment.READ, Perm.Task.READ, Perm.TaskWrapper.READ]],
    ['readChunk', [Perm.Task.READ, Perm.TaskWrapper.READ, Perm.Chunk.READ]],
    ['readAccessGroup', [Perm.GroupAccess.READ]],
    ['readError', [Perm.AgentError.READ]],
    ['create', [Perm.Agent.CREATE, Perm.Agent.READ, Perm.Voucher.READ, Perm.AgentBinary.READ]],
    ['update', [Perm.Agent.UPDATE]],
    [
      'updateAssignment',
      [Perm.AgentAssignment.UPDATE, Perm.AgentAssignment.READ, Perm.Task.READ, Perm.TaskWrapper.READ]
    ]
  ] as const;

  function createService(granted: string[]) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((key) => granted.includes(key));

    return new AgentRoleService(permissionService);
  }

  it.each(rolePermissions)('grants the %s role when all required permissions are granted', (role, permissions) => {
    expect(createService([...permissions]).hasRole(role)).toBe(true);
  });

  it.each(rolePermissions)('denies the %s role when any required permission is missing', (role, permissions) => {
    for (const missingPermission of permissions) {
      const granted = permissions.filter((permission) => permission !== missingPermission);

      expect(createService(granted).hasRole(role)).toBe(false);
    }
  });

  it('denies an unknown role', () => {
    expect(createService([]).hasRole('unknown')).toBe(false);
  });
});
