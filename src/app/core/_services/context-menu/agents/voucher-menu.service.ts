import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class VoucherContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): VoucherContextMenuService {
    const permDelete: Array<PermissionValues> = [Perm.Voucher.DELETE];

    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_VOUCHER, permDelete);
    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_VOUCHERS, permDelete);

    return this;
  }
}
