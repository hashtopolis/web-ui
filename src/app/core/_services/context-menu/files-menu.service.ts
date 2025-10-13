import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class FilesContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): FilesContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.File.UPDATE];
    const permRead: Array<PermissionValues> = [Perm.File.READ];
    const permDelete: Array<PermissionValues> = [Perm.File.DELETE];

    this.addCtxEditItem(RowActionMenuLabel.EDIT_FILE, RowActionMenuAction.EDIT, permUpdate);
    this.addCtxDownloadItem(RowActionMenuLabel.DOWNLOAD_FILE, permRead);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_FILE, permDelete);

    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_FILES, permDelete);

    return this;
  }
}
