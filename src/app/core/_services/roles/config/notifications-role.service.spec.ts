import type { PermissionValues } from '@constants/userpermissions.config';
import { Perm } from '@constants/userpermissions.config';
import type { MockedObject } from 'vitest';

import { PermissionService } from '@services/permission/permission.service';
import { NotificationsRoleService } from '@services/roles/config/notifications-role.service';

describe('NotificationsRoleService', () => {
  function createService(grantedPermissions: PermissionValues[] = []) {
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    } as MockedObject<PermissionService>;
    permissionService.hasPermissionSync.mockImplementation((permission) => grantedPermissions.includes(permission));

    return { permissionService, service: new NotificationsRoleService(permissionService) };
  }

  it.each([
    { role: 'read', permissions: [Perm.Notif.READ] },
    { role: 'create', permissions: [Perm.Notif.CREATE] },
    { role: 'createAgentNotification', permissions: [Perm.Notif.CREATE, Perm.Agent.READ] },
    { role: 'createTaskNotification', permissions: [Perm.Notif.CREATE, Perm.Task.READ] },
    { role: 'createHashListNotification', permissions: [Perm.Notif.CREATE, Perm.Hashlist.READ] },
    { role: 'createUserNotification', permissions: [Perm.Notif.CREATE, Perm.User.READ] },
    { role: 'createLogNotification', permissions: [Perm.Notif.CREATE, Perm.Logs.READ] }
  ])('grants $role when all required permissions are granted', ({ role, permissions }) => {
    const { permissionService, service } = createService(permissions);

    const result = service.hasRole(role);

    expect(result).toBe(true);
    expect(permissionService.hasPermissionSync).toHaveBeenCalledTimes(permissions.length);
    permissions.forEach((permission, index) => {
      expect(permissionService.hasPermissionSync).toHaveBeenNthCalledWith(index + 1, permission);
    });
  });

  it('denies a notification role when its target permission is missing', () => {
    const { permissionService, service } = createService([Perm.Notif.CREATE]);

    const result = service.hasRole('createTaskNotification');

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).toHaveBeenNthCalledWith(1, Perm.Notif.CREATE);
    expect(permissionService.hasPermissionSync).toHaveBeenNthCalledWith(2, Perm.Task.READ);
  });

  it('denies an unknown role without checking permissions', () => {
    const { permissionService, service } = createService([Perm.Notif.READ]);

    const result = service.hasRole('unknown');

    expect(result).toBe(false);
    expect(permissionService.hasPermissionSync).not.toHaveBeenCalled();
  });
});
