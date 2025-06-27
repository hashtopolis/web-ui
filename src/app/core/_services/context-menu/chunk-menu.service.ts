import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

export class ChunkContextMenuService extends ContextMenuService {
  constructor(private permissionService: PermissionService) {
    super();
  }

  addChunkContextMenu(): ChunkContextMenuService {
    this.addCtxResetMenuItem(RowActionMenuLabel.RESET_CHUNK);
    return this;
  }
}
