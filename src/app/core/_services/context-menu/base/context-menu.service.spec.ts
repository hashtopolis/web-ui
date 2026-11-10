import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { PermissionService } from '@services/permission/permission.service';

import { PermissionValues } from '@src/app/core/_constants/userpermissions.config';

class ContextMenuHarness extends ContextMenuService {
  constructor(permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): this {
    const permission = ['permAgentRead'] as PermissionValues[];
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

describe('ContextMenuService', () => {
  it('creates each supported row and bulk action and respects permission checks', () => {
    expectContextMenuConfiguration(
      (permissionService) => new ContextMenuHarness(permissionService),
      [
        'Edit',
        'Add',
        'Deactivate',
        'Activate',
        'Delete',
        'Reset',
        'Abort',
        'Copy',
        'Archive',
        'Unarchive',
        'Import',
        'Export',
        'Download',
        'New',
        'View',
        'Unassign',
        'Custom'
      ],
      ['Bulk Deactivate', 'Bulk Add', 'Bulk Activate', 'Bulk Delete', 'Bulk Archive', 'Bulk Unassign']
    );
  });
});
