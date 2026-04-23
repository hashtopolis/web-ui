/**
 * Role service definition for tasks
 */
import { Perm } from '@constants/userpermissions.config';

import { Injectable } from '@angular/core';

import { PermissionService } from '@services/permission/permission.service';
import { RoleService } from '@services/roles/base/role.service';

export const SupertaskRole = {
  Create: 'create',
  Read: 'read',
  Edit: 'edit',
  Delete: 'delete',
  EditSupertaskPreTasks: 'editSupertaskPreTasks',
  EditSupertaskApplyHashlist: 'editSupertaskApplyHashlist',
  CreateSupertaskBuilder: 'createSupertaskBuilder'
} as const;

export type SupertaskRole = (typeof SupertaskRole)[keyof typeof SupertaskRole];

@Injectable({
  providedIn: 'root'
})
export class SupertasksRoleService extends RoleService {
  constructor(permissionService: PermissionService) {
    super(permissionService, {
      [SupertaskRole.Create]: [Perm.SuperTask.CREATE],
      [SupertaskRole.Read]: [Perm.SuperTask.READ],
      [SupertaskRole.Edit]: [Perm.SuperTask.UPDATE, Perm.Pretask.READ],
      [SupertaskRole.Delete]: [Perm.SuperTask.DELETE],
      [SupertaskRole.EditSupertaskPreTasks]: [Perm.Pretask.READ],
      [SupertaskRole.EditSupertaskApplyHashlist]: [Perm.Hashlist.READ, Perm.Task.READ, Perm.CrackerBinaryType.READ],
      [SupertaskRole.CreateSupertaskBuilder]: [
        Perm.SuperTask.CREATE,
        Perm.Pretask.CREATE,
        Perm.CrackerBinaryType.READ,
        Perm.File.READ
      ]
    });
  }
}
