import { BaseModel } from '@models/base.model';

import { AuthService } from '@services/access/auth.service';
import { ConfigRoleWrapperService } from '@services/roles/config/config-role-wrapper.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';

import { HeaderComponent } from '@src/app/layout/header/header.component';
import { HeaderMenuAction, HeaderMenuLabel } from '@src/app/layout/header/header.constants';

interface TestableHeader {
  menuItemClicked(event: ActionMenuEvent<BaseModel | undefined>): void;
  authService: jasmine.SpyObj<AuthService>;
  rebuildMenu: jasmine.Spy;
}

function makeComponent() {
  const mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['logOut']);

  const component = Object.create(HeaderComponent.prototype) as TestableHeader;
  component['authService'] = mockAuthService;
  component['rebuildMenu'] = jasmine.createSpy('rebuildMenu');

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

    expect(mockAuthService.logOut).toHaveBeenCalledOnceWith();
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
  function configMenu(backgroundJobRead: boolean) {
    const wrapper = jasmine.createSpyObj<ConfigRoleWrapperService>('ConfigRoleWrapperService', [
      'hasSettingsRole',
      'hasHashTypesRole',
      'hasHealthCheckRole',
      'hasLogRole',
      'hasNotificationRole',
      'hasBackgroundJobRole'
    ]);
    wrapper.hasLogRole.and.returnValue(true);
    wrapper.hasBackgroundJobRole.and.callFake((role: string) => role === 'read' && backgroundJobRead);

    const component = Object.create(HeaderComponent.prototype) as HeaderComponent;
    (component as unknown as { configRoleWrapper: ConfigRoleWrapperService }).configRoleWrapper = wrapper;
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
});
