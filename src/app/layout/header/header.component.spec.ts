import { HeaderComponent } from '@src/app/layout/header/header.component';
import { HeaderMenuAction } from '@src/app/layout/header/header.constants';

function makeComponent() {
  const mockAuthService = jasmine.createSpyObj('AuthService', ['logOut']);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: any = Object.create(HeaderComponent.prototype);
  component['authService'] = mockAuthService;
  component['rebuildMenu'] = jasmine.createSpy('rebuildMenu');

  return { component, mockAuthService };
}

describe('HeaderComponent logout', () => {
  const logoutEvent = { menuItem: { action: HeaderMenuAction.LOGOUT }, data: null };
  const otherEvent = { menuItem: { action: 'some-other-action' }, data: null };

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
