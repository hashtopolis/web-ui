import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class AgentBinariesMenuServiceContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): AgentBinariesMenuServiceContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.AgentBinary.UPDATE];
    const permRead: Array<PermissionValues> = [Perm.AgentBinary.READ];
    const permDelete: Array<PermissionValues> = [Perm.AgentBinary.DELETE];

    this.addCtxEditItem(RowActionMenuLabel.EDIT_AGENTBINARY, RowActionMenuAction.EDIT, permUpdate);
    this.addCtxDownloadItem(RowActionMenuLabel.DOWNLOAD_AGENT, permRead);
    this.addCtxCopyItem(RowActionMenuLabel.COPY_LINK_BINARY, RowActionMenuAction.COPY_LINK, permRead);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_AGENTBINARY, permDelete);

    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_AGENTBINARIES, permDelete);

    return this;
  }
}
