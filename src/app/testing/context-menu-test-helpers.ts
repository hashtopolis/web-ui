import type { MockedObject } from 'vitest';

import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

type ContextMenuFactory = (permissionService: PermissionService) => ContextMenuService;

function createPermissionService(hasPermission: boolean): MockedObject<PermissionService> {
  return {
    hasAllPermissionsSync: vi.fn().mockName('PermissionService.hasAllPermissionsSync').mockReturnValue(hasPermission)
  } as MockedObject<PermissionService>;
}

export function expectAllowedContextMenuConfiguration(
  createService: ContextMenuFactory,
  rowLabels: string[],
  bulkLabels: string[]
): void {
  const service = createService(createPermissionService(true));

  expect(service.addContextMenu()).toBe(service);
  expect(service.getMenuItems().map(({ menuItem }) => menuItem.label)).toStrictEqual(rowLabels);
  expect(service.getBulkMenuItems().map(({ menuItem }) => menuItem.label)).toStrictEqual(bulkLabels);
  expect(service.getHasContextMenu()).toBe(rowLabels.length > 0);
  expect(service.getHasBulkMenu()).toBe(bulkLabels.length > 0);
}

export function expectDeniedContextMenuConfiguration(createService: ContextMenuFactory): void {
  const service = createService(createPermissionService(false));

  service.addContextMenu();

  expect(service.getMenuItems()).toStrictEqual([]);
  expect(service.getBulkMenuItems()).toStrictEqual([]);
  expect(service.getHasContextMenu()).toBe(false);
  expect(service.getHasBulkMenu()).toBe(false);
}
