import type { PermissionValues } from '@constants/userpermissions.config';
import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { TasksRoleService } from '@services/roles/tasks/tasks-role.service';

describe('TasksRoleService', () => {
  const rolePermissions = [
    ['create', [Perm.Task.CREATE, Perm.TaskWrapper.CREATE, Perm.Hashlist.READ, Perm.AgentBinary.READ]],
    ['read', [Perm.Task.READ, Perm.TaskWrapper.READ, Perm.Chunk.READ]],
    ['edit', [Perm.Task.UPDATE, Perm.TaskWrapper.UPDATE]],
    ['editTaskInfoHashlist', [Perm.Hashlist.READ, Perm.Hashtype.READ]],
    ['editTaskInfoCracker', [Perm.CrackerBinary.READ, Perm.CrackerBinaryType.READ]],
    ['editTaskAgents', [Perm.Agent.READ, Perm.AgentAssignment.READ]],
    ['editTaskAssignAgents', [Perm.AgentAssignment.CREATE, Perm.AgentAssignment.DELETE]],
    ['editTaskFiles', [Perm.File.READ]],
    ['editTaskSpeed', [Perm.Speed.READ]],
    ['editTaskChunks', [Perm.Chunk.READ, Perm.Agent.READ]]
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

    return { permissionService, service: new TasksRoleService(permissionService) };
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
    const { permissionService, service } = createService([Perm.Task.READ]);

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).not.toHaveBeenCalled();
  });
});
