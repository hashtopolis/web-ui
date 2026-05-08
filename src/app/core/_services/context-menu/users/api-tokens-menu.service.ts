import { ContextMenuCondition, ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class ApiTokensContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): ApiTokensContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.JwtApiKey.UPDATE];
    const permDelete: Array<PermissionValues> = [Perm.JwtApiKey.DELETE];

    // Revoke shows only for active rows; once revoked the action is meaningless.
    const revokeCondition: ContextMenuCondition = { key: 'isActive', value: true };
    // Backend only permits hard delete after the validity window has lapsed —
    // the row datasource sets `isExpired` from `endValid` so we never offer a
    // delete that the server is going to 403.
    const deleteCondition: ContextMenuCondition = { key: 'isExpired', value: true };

    this.addCtxRevokeItem(RowActionMenuLabel.REVOKE_API_TOKEN, permUpdate, revokeCondition);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_API_TOKEN, permDelete, deleteCondition);

    return this;
  }
}
