import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class BenchmarkContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): BenchmarkContextMenuService {
    // The benchmark cache is server configuration, so it is gated on the config
    // permission, matching the server-side serverConfigAccess on the API.
    const permDelete: Array<PermissionValues> = [Perm.Config.DELETE];

    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_BENCHMARK, permDelete);
    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_BENCHMARKS, permDelete);

    return this;
  }
}
