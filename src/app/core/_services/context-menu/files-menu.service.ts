import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';
import {
  FilesRowAction,
  FilesRowActionIcon,
  FilesRowActionLabel
} from '@components/tables/files-table/files-table.constants';

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

    // Secret toggle: only the entry matching the current state is shown per row.
    this.addCtxCustomItem({
      label: FilesRowActionLabel.SET_SECRET,
      action: FilesRowAction.TOGGLE_SECRET,
      icon: FilesRowActionIcon.SET_SECRET,
      permissions: permUpdate,
      condition: { key: 'isSecret', value: false }
    });
    this.addCtxCustomItem({
      label: FilesRowActionLabel.UNSET_SECRET,
      action: FilesRowAction.TOGGLE_SECRET,
      icon: FilesRowActionIcon.UNSET_SECRET,
      permissions: permUpdate,
      condition: { key: 'isSecret', value: true }
    });
    this.addCtxCustomItem({
      label: FilesRowActionLabel.RECOUNT_LINES,
      action: FilesRowAction.RECOUNT_LINES,
      icon: FilesRowActionIcon.RECOUNT_LINES,
      permissions: permUpdate
    });

    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_FILE, permDelete);

    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_FILES, permDelete);

    return this;
  }
}
