import { HealthCheckContextMenuService } from '@services/context-menu/config/health-check-menu.service';
import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';

describe('HealthCheckContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new HealthCheckContextMenuService(permissionService),
      ['View Health Check', 'Delete Health Check'],
      ['Delete Health Checks']
    );
  });
});
