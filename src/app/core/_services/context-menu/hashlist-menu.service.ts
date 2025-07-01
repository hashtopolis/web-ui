import { ContextMenuCondition, ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';
import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';
import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';

export class HashListContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): HashListContextMenuService {
    const permHashListCreate: Array<PermissionValues> = [Perm.Hashlist.CREATE];
    const permHashListRead: Array<PermissionValues> = [Perm.Hashlist.READ];
    const permHashListUpdate: Array<PermissionValues> = [Perm.Hashlist.UPDATE];
    const permHashListDelete: Array<PermissionValues> = [Perm.Hashlist.DELETE];

    const isArchiveCondition: ContextMenuCondition = { key: 'isArchived', value: false };

    this.addCtxEditItem(RowActionMenuLabel.EDIT_HASHLIST, permHashListUpdate, isArchiveCondition);
    this.addCtxImportItem(RowActionMenuLabel.IMPORT_HASHLIST, permHashListCreate, isArchiveCondition);
    this.addCtxExportItem(RowActionMenuLabel.EXPORT_HASHLIST, permHashListRead, isArchiveCondition);
    this.addCtxDeleteMenuItem(RowActionMenuLabel.DELETE_HASHLIST, permHashListDelete);

    this.addBulkArchiveMenuItem(BulkActionMenuLabel.ARCHIVE_HASHLISTS, permHashListUpdate, isArchiveCondition);
    this.addBulkDeleteMenuItem(BulkActionMenuLabel.DELETE_HASHLISTS, permHashListDelete);

    return this;
  }
}
