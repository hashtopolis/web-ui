import { AppComponent } from '@src/app/app.component';

function makeComponent() {
  const mockReloadService = jasmine.createSpyObj('ReloadService', ['reloadPage']);
  const mockIdle = jasmine.createSpyObj('Idle', ['stop']);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: any = Object.create(AppComponent.prototype);
  component['reloadService'] = mockReloadService;
  component['idle'] = mockIdle;

  return { component, mockReloadService, mockIdle };
}

describe('AppComponent.checkLogin', () => {
  afterEach(() => {
    localStorage.removeItem('userData');
  });

  it('reloads the page when the session has expired', () => {
    const { component, mockReloadService } = makeComponent();
    const expired = new Date(Date.now() - 1000).toISOString();
    localStorage.setItem('userData', JSON.stringify({ _token: 'token', _expires: expired }));

    component.checkLogin();

    expect(mockReloadService.reloadPage).toHaveBeenCalledOnceWith();
  });

  it('does not reload when the session is still valid', () => {
    const { component, mockReloadService } = makeComponent();
    const future = new Date(Date.now() + 60_000).toISOString();
    localStorage.setItem('userData', JSON.stringify({ _token: 'token', _expires: future }));

    component.checkLogin();

    expect(mockReloadService.reloadPage).not.toHaveBeenCalled();
  });

  it('does not reload when there is no session data', () => {
    const { component, mockReloadService } = makeComponent();

    component.checkLogin();

    expect(mockReloadService.reloadPage).not.toHaveBeenCalled();
  });
});
