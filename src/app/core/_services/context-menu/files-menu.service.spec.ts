import type { MockedObject } from 'vitest';

import { FilesContextMenuService } from '@services/context-menu/files-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import {
  FilesRowAction,
  FilesRowActionIcon,
  FilesRowActionLabel
} from '@components/tables/files-table/files-table.constants';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('FilesContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new FilesContextMenuService(permissionService),
      [
        'Edit File',
        'Preview File',
        'Download File',
        'Set Secret',
        'Unset Secret',
        'Recount Lines',
        'Recompute Checksum',
        'Delete File'
      ],
      ['Delete Files']
    );
  });

  it('configures checksum recomputation as a fingerprint row action', () => {
    const permissionService = {
      hasAllPermissionsSync: vi.fn().mockName('PermissionService.hasAllPermissionsSync').mockReturnValue(true)
    } as MockedObject<PermissionService>;
    const service = new FilesContextMenuService(permissionService).addContextMenu();

    expect(
      service.getMenuItems().find(({ menuItem }) => menuItem.label === FilesRowActionLabel.RECOMPUTE_CHECKSUM)
    ).toStrictEqual({
      index: 0,
      menuItem: {
        label: FilesRowActionLabel.RECOMPUTE_CHECKSUM,
        action: FilesRowAction.RECOMPUTE_CHECKSUM,
        icon: FilesRowActionIcon.RECOMPUTE_CHECKSUM,
        red: false
      },
      condition: { key: '', value: false }
    });
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new FilesContextMenuService(permissionService));
  });
});
