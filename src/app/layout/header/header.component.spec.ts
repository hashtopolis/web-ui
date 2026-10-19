import type { Mock, MockedObject } from 'vitest';

import { BaseModel } from '@models/base.model';

import { AuthService } from '@services/access/auth.service';
import { ConfigRoleWrapperService } from '@services/roles/config/config-role-wrapper.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';

import { HeaderComponent } from '@src/app/layout/header/header.component';
import { HeaderMenuAction, HeaderMenuLabel } from '@src/app/layout/header/header.constants';

interface TestableHeader {
  menuItemClicked(event: ActionMenuEvent<BaseModel | undefined>): void;
  authService: MockedObject<AuthService>;
  rebuildMenu: Mock;
}

function makeComponent() {
  const mockAuthService = {
    logOut: vi.fn().mockName('AuthService.logOut')
  } as MockedObject<AuthService>;

  const component = Object.create(HeaderComponent.prototype) as TestableHeader;
  component['authService'] = mockAuthService;
  component['rebuildMenu'] = vi.fn().mockName('rebuildMenu');

  return { component, mockAuthService };
}

describe('HeaderComponent logout', () => {
  const logoutEvent: ActionMenuEvent<BaseModel | undefined> = {
    menuItem: { label: '', action: HeaderMenuAction.LOGOUT },
    data: undefined
  };
  const otherEvent: ActionMenuEvent<BaseModel | undefined> = {
    menuItem: { label: '', action: 'some-other-action' },
    data: undefined
  };

  it('calls logOut when the logout action is triggered', () => {
    const { component, mockAuthService } = makeComponent();

    component.menuItemClicked(logoutEvent);

    expect(mockAuthService.logOut).toHaveBeenCalledExactlyOnceWith();
  });

  it('does not rebuild the menu on logout', () => {
    const { component } = makeComponent();

    component.menuItemClicked(logoutEvent);

    expect(component.rebuildMenu).not.toHaveBeenCalled();
  });

  it('does not call logOut for other menu actions', () => {
    const { component, mockAuthService } = makeComponent();

    component.menuItemClicked(otherEvent);

    expect(mockAuthService.logOut).not.toHaveBeenCalled();
  });
});

describe('HeaderComponent config menu', () => {
  function configMenu(backgroundJobRead: boolean, hashtypeRoles: string[] = []) {
    const wrapper = {
      hasSettingsRole: vi.fn().mockName('ConfigRoleWrapperService.hasSettingsRole'),
      hasHashTypesRole: vi.fn().mockName('ConfigRoleWrapperService.hasHashTypesRole'),
      hasHealthCheckRole: vi.fn().mockName('ConfigRoleWrapperService.hasHealthCheckRole'),
      hasLogRole: vi.fn().mockName('ConfigRoleWrapperService.hasLogRole'),
      hasNotificationRole: vi.fn().mockName('ConfigRoleWrapperService.hasNotificationRole'),
      hasBackgroundJobRole: vi.fn().mockName('ConfigRoleWrapperService.hasBackgroundJobRole')
    } as MockedObject<ConfigRoleWrapperService>;
    wrapper.hasLogRole.mockReturnValue(true);
    wrapper.hasHashTypesRole.mockImplementation((role: string) => hashtypeRoles.includes(role));
    wrapper.hasBackgroundJobRole.mockImplementation((role: string) => role === 'read' && backgroundJobRead);

    const component = Object.create(HeaderComponent.prototype) as HeaderComponent;
    (
      component as unknown as {
        configRoleWrapper: ConfigRoleWrapperService;
      }
    ).configRoleWrapper = wrapper;
    return component.getConfigMenu().actions[0];
  }

  it('shows Background Jobs after Log with the read role', () => {
    const labels = configMenu(true).map((action) => action.label);
    expect(labels).toEqual([HeaderMenuLabel.LOG, HeaderMenuLabel.BACKGROUND_JOBS]);
    expect(configMenu(true)[1].routerLink).toEqual(['config', 'background-jobs']);
  });

  it('hides Background Jobs without the read role', () => {
    expect(configMenu(false).map((action) => action.label)).toEqual([HeaderMenuLabel.LOG]);
  });

  it('shows Hashtypes with the update role', () => {
    const labels = configMenu(false, ['read', 'update']).map((action) => action.label);
    expect(labels).toContain(HeaderMenuLabel.HASHTYPES);
  });

  it('hides Hashtypes with the read role only', () => {
    const labels = configMenu(false, ['read']).map((action) => action.label);
    expect(labels).not.toContain(HeaderMenuLabel.HASHTYPES);
  });
});
