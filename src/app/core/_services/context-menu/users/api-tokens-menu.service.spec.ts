import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { ApiTokensContextMenuService } from '@services/context-menu/users/api-tokens-menu.service';

describe('ApiTokensContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new ApiTokensContextMenuService(permissionService),
      ['Revoke API Key', 'Delete API Key'],
      []
    );
  });
});
