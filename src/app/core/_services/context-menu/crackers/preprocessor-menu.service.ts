import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class PreProContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): PreProContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.Prepro.UPDATE];
    const permDelete: Array<PermissionValues> = [Perm.Prepro.DELETE];

    this.addCtxEditItem(RowActionMenuLabel.EDIT_PREPROCESSOR, RowActionMenuAction.EDIT, permUpdate);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_PREPROCESSOR, permDelete);

    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_PREPROCESSORS, permDelete);

    return this;
  }
}
