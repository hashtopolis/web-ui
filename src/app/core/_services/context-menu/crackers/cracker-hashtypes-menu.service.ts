import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class CrackerHashtypesContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): CrackerHashtypesContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.CrackerBinary.UPDATE];

    this.addCtxDeleteItem(RowActionMenuLabel.REMOVE_CRACKER_HASHTYPE, permUpdate);
    this.addBulkDeleteItem(BulkActionMenuLabel.REMOVE_CRACKER_HASHTYPES, permUpdate);

    return this;
  }
}
