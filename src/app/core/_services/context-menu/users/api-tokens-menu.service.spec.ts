import { ApiTokensContextMenuService } from '@services/context-menu/users/api-tokens-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('ApiTokensContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new ApiTokensContextMenuService(permissionService),
      ['Revoke API Key', 'Delete API Key'],
      []
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new ApiTokensContextMenuService(permissionService));
  });
});
