import type { MockedObject } from 'vitest';

import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

export function expectContextMenuConfiguration(
  createService: (permissionService: PermissionService) => ContextMenuService,
  rowLabels: string[],
  bulkLabels: string[]
): void {
  const permissionService = {
    hasAllPermissionsSync: vi.fn().mockReturnValue(true)
  } as MockedObject<PermissionService>;
  const service = createService(permissionService);
  expect((service as unknown as { addContextMenu: () => ContextMenuService }).addContextMenu()).toBe(service);
  expect(service.getMenuItems().map(({ menuItem }) => menuItem.label)).toEqual(rowLabels);
  expect(service.getBulkMenuItems().map(({ menuItem }) => menuItem.label)).toEqual(bulkLabels);
  expect(service.getHasContextMenu()).toBe(rowLabels.length > 0);
  expect(service.getHasBulkMenu()).toBe(bulkLabels.length > 0);
  expect(permissionService.hasAllPermissionsSync).toHaveBeenCalled();

  permissionService.hasAllPermissionsSync.mockReturnValue(false);
  const deniedService = createService(permissionService);
  (deniedService as unknown as { addContextMenu: () => ContextMenuService }).addContextMenu();
  expect(deniedService.getMenuItems()).toEqual([]);
  expect(deniedService.getBulkMenuItems()).toEqual([]);
  expect(deniedService.getHasContextMenu()).toBe(false);
  expect(deniedService.getHasBulkMenu()).toBe(false);
}
