import { AuthService } from '@services/access/auth.service';
import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HeaderComponent } from '@src/app/layout/header/header.component';
import { HeaderMenuAction } from '@src/app/layout/header/header.constants';

interface TestableHeader {
  menuItemClicked(event: ActionMenuEvent<unknown>): void;
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
  const logoutEvent: ActionMenuEvent<null> = { menuItem: { label: '', action: HeaderMenuAction.LOGOUT }, data: null };
  const otherEvent: ActionMenuEvent<null> = { menuItem: { label: '', action: 'some-other-action' }, data: null };

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
