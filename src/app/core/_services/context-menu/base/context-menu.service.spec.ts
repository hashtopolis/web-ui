import type { MockedObject } from 'vitest';

import { ContextMenuService, ContextMenuType } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuIcon } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm } from '@src/app/core/_constants/userpermissions.config';
import { expectDeniedContextMenuConfiguration } from '@src/app/testing/context-menu-test-helpers';

class ContextMenuHarness extends ContextMenuService {
  constructor(permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): this {
    const permission = [Perm.Agent.READ];
    this.addCtxEditItem('Edit', 'edit-action', permission);
    this.addCtxAddItem('Add', 'add-action', permission);
    this.addCtxDeactivateItem('Deactivate', permission);
    this.addBulkDeactivateItem('Bulk Deactivate', permission);
    this.addBulkAddItem('Bulk Add', permission);
    this.addCtxActivateItem('Activate', permission);
    this.addBulkActivateItem('Bulk Activate', permission);
    this.addCtxDeleteItem('Delete', permission);
    this.addBulkDeleteItem('Bulk Delete', permission);
    this.addCtxResetItem('Reset', permission);
    this.addCtxResetItem('Abort', permission, { key: 'running', value: true });
    this.addCtxCopyItem('Copy', 'copy-action', permission);
    this.addCtxArchiveItem('Archive', permission);
    this.addCtxUnArchiveItem('Unarchive', permission);
    this.addBulkArchiveItem('Bulk Archive', permission);
    this.addCtxImportItem('Import', permission);
    this.addCtxExportItem('Export', permission);
    this.addCtxDownloadItem('Download', permission);
    this.addCtxNewItem('New', permission);
    this.addCtxViewItem('View', permission);
    this.addCtxUnassignItem('Unassign', permission);
    this.addBulkUnassignItem('Bulk Unassign', permission);
    this.addCtxCustomItem({ label: 'Custom', action: 'custom', icon: 'custom', permissions: permission });
    return this;
  }
}

const row = (
  label: string,
  action: string,
  icon: string,
  index = 0,
  red = false,
  condition = { key: '', value: false }
): ContextMenuType => ({ index, menuItem: { label, action, icon, red }, condition });

describe('ContextMenuService', () => {
  it('creates row and bulk entries with the configured actions, icons, conditions, indices, and warning states', () => {
    const service = new ContextMenuHarness({
      hasAllPermissionsSync: vi.fn().mockName('PermissionService.hasAllPermissionsSync').mockReturnValue(true)
    } as MockedObject<PermissionService>);

    expect(service.addContextMenu()).toBe(service);
    expect(service.getMenuItems()).toStrictEqual([
      row('Edit', 'edit-action', RowActionMenuIcon.EDIT),
      row('Add', 'add-action', RowActionMenuIcon.ADD),
      row('Deactivate', RowActionMenuAction.DEACTIVATE, RowActionMenuIcon.DEACTIVATE),
      row('Activate', RowActionMenuAction.ACTIVATE, RowActionMenuIcon.ACTIVATE),
      row('Delete', RowActionMenuAction.DELETE, RowActionMenuIcon.DELETE, 1, true),
      row('Reset', RowActionMenuAction.RESET, RowActionMenuIcon.RESET),
      row('Abort', RowActionMenuAction.RESET, RowActionMenuIcon.CANCEL, 0, false, { key: 'running', value: true }),
      row('Copy', 'copy-action', RowActionMenuIcon.COPY),
      row('Archive', RowActionMenuAction.ARCHIVE, RowActionMenuIcon.ARCHIVE),
      row('Unarchive', RowActionMenuAction.UNARCHIVE, RowActionMenuIcon.UNARCHIVE),
      row('Import', RowActionMenuAction.IMPORT, RowActionMenuIcon.IMPORT),
      row('Export', RowActionMenuAction.EXPORT, RowActionMenuIcon.EXPORT),
      row('Download', RowActionMenuAction.DOWNLOAD, RowActionMenuIcon.DOWNLOAD),
      row('New', RowActionMenuAction.NEW, RowActionMenuIcon.NEW),
      row('View', RowActionMenuAction.VIEW, RowActionMenuIcon.VIEW),
      row('Unassign', RowActionMenuAction.UNASSIGN, RowActionMenuIcon.DELETE, 1),
      row('Custom', 'custom', 'custom')
    ]);
    expect(service.getBulkMenuItems()).toStrictEqual([
      row('Bulk Deactivate', BulkActionMenuAction.DEACTIVATE, RowActionMenuIcon.DEACTIVATE),
      row('Bulk Add', BulkActionMenuAction.ADD, RowActionMenuIcon.ADD),
      row('Bulk Activate', BulkActionMenuAction.ACTIVATE, RowActionMenuIcon.ACTIVATE),
      row('Bulk Delete', BulkActionMenuAction.DELETE, RowActionMenuIcon.DELETE, 0, true),
      row('Bulk Archive', BulkActionMenuAction.ARCHIVE, RowActionMenuIcon.ARCHIVE),
      row('Bulk Unassign', BulkActionMenuAction.UNASSIGN, RowActionMenuIcon.DELETE, 0, true)
    ]);
    expect(service.getHasContextMenu()).toBe(true);
    expect(service.getHasBulkMenu()).toBe(true);
  });

  it('omits entries when the required permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new ContextMenuHarness(permissionService));
  });
});
