import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class ChunkContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): ChunkContextMenuService {
    const permissions: Array<PermissionValues> = [Perm.Chunk.UPDATE, Perm.Task.UPDATE];
    this.addCtxResetItem(RowActionMenuLabel.RESET_CHUNK, permissions, { key: 'isRunning', value: false });
    this.addCtxResetItem(RowActionMenuLabel.ABORT_CHUNK, permissions, { key: 'isRunning', value: true });
    return this;
  }
}
