/**
 * Role service definition for notifications
 */
import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      read: [Perm.Notif.READ],
      create: [Perm.Notif.CREATE],
      createAgentNotification: [Perm.Notif.CREATE, Perm.Agent.READ],
      createTaskNotification: [Perm.Notif.CREATE, Perm.Task.READ],
      createHashListNotification: [Perm.Notif.CREATE, Perm.Hashlist.READ],
      createUserNotification: [Perm.Notif.CREATE, Perm.User.READ],
      createLogNotification: [Perm.Notif.CREATE, Perm.Logs.READ]
    });
  }
}
