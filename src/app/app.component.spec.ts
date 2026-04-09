import { Idle } from '@ng-idle/core';

import { ReloadService } from '@services/reload.service';

import { AppComponent } from '@src/app/app.component';

interface TestableAppComponent {
  reloadService: jasmine.SpyObj<ReloadService>;
  idle: jasmine.SpyObj<Idle>;
  checkLogin(): void;
}

function makeComponent() {
  const mockReloadService = jasmine.createSpyObj('ReloadService', ['reloadPage']);
  const mockIdle = jasmine.createSpyObj('Idle', ['stop']);

  const component = Object.create(AppComponent.prototype) as TestableAppComponent;
  component.reloadService = mockReloadService;
  component.idle = mockIdle;

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
