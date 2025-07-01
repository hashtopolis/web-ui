import { ContextMenuCondition, ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';
import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';
import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';

export class SuperHashListContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): SuperHashListContextMenuService {
    const permSuperHashListCreate: Array<PermissionValues> = [Perm.SuperHashlist.CREATE];
    const permSuperHashListRead: Array<PermissionValues> = [Perm.SuperHashlist.READ];
    const permSuperHashListUpdate: Array<PermissionValues> = [Perm.Hashlist.UPDATE];
    const permSuperHashListDelete: Array<PermissionValues> = [Perm.Hashlist.DELETE];

    this.addCtxEditItem(RowActionMenuLabel.EDIT_SUPERHASHLIST, permSuperHashListUpdate);
    this.addCtxImportItem(RowActionMenuLabel.IMPORT_HASHLISTS, permSuperHashListCreate);
    this.addCtxExportItem(RowActionMenuLabel.EXPORT_HASHLISTS, permSuperHashListRead);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_SUPERHASHLIST, permSuperHashListDelete);

    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_SUPERHASHLIST, permSuperHashListDelete);

    return this;
  }
}
