import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class HashTypesContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): HashTypesContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.Hashtype.UPDATE];
    const permDelete: Array<PermissionValues> = [Perm.Hashtype.DELETE];

    this.addCtxEditItem(RowActionMenuLabel.EDIT_HASHTYPE, RowActionMenuAction.EDIT, permUpdate);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_HASHTYPE, permDelete);

    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_HASHTYPES, permDelete);

    return this;
  }
}
