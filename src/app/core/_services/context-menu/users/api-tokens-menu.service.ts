import { ContextMenuCondition, ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';
import {
  ApiTokensRowAction,
  ApiTokensRowActionIcon,
  ApiTokensRowActionLabel
} from '@components/tables/api-tokens-table/api-tokens-table.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class ApiTokensContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): ApiTokensContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.JwtApiKey.UPDATE];
    const permDelete: Array<PermissionValues> = [Perm.JwtApiKey.DELETE];

    // only allow revoke if not already revoked
    const revokeCondition: ContextMenuCondition = { key: 'isActive', value: true };
    // We can only delete expired tokens therefore only show in this case
    const deleteCondition: ContextMenuCondition = { key: 'isExpired', value: true };

    this.addCtxCustomItem({
      label: ApiTokensRowActionLabel.REVOKE,
      action: ApiTokensRowAction.REVOKE,
      icon: ApiTokensRowActionIcon.REVOKE,
      permissions: permUpdate,
      condition: revokeCondition,
      groupIndex: 1,
      warning: true
    });
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_API_TOKEN, permDelete, deleteCondition);

    return this;
  }
}
