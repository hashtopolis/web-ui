import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class CrackersContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): CrackersContextMenuService {
    const permCreate: Array<PermissionValues> = [Perm.CrackerBinary.CREATE];
    const permDelete: Array<PermissionValues> = [Perm.CrackerBinary.DELETE];

    this.addCtxNewItem(RowActionMenuLabel.NEW_VERSION, permCreate);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_CRACKER, permDelete);

    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_CRACKERS, permDelete);

    return this;
  }
}
