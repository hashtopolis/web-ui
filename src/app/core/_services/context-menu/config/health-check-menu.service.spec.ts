import { HealthCheckContextMenuService } from '@services/context-menu/config/health-check-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('HealthCheckContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new HealthCheckContextMenuService(permissionService),
      ['View Health Check', 'Delete Health Check'],
      ['Delete Health Checks']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new HealthCheckContextMenuService(permissionService));
  });
});
