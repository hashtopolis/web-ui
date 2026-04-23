import { TestBed } from '@angular/core/testing';

import { AlertService } from '@services/shared/alert.service';

import { PermissionGuard } from '@src/app/core/_guards/permission.guard';

describe('PermissionGuard.humanizeRoleName', () => {
  let guard: PermissionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PermissionGuard,
        { provide: AlertService, useValue: { showErrorMessage: jasmine.createSpy('showErrorMessage') } }
      ]
    });
    guard = TestBed.inject(PermissionGuard);
  });

  it('does not add an extra "s" when the scope name already ends in "s"', () => {
    const humanize = (guard as unknown as { humanizeRoleName: (d: string, r: string) => string }).humanizeRoleName.bind(
      guard
    );
    expect(humanize('HashTypes', 'read')).toBe('read HashTypes');
    expect(humanize('Tasks', 'read')).toBe('read Tasks');
    expect(humanize('Settings', 'read')).toBe('read Settings');
    expect(humanize('Notifications', 'read')).toBe('read Notifications');
    expect(humanize('PreconfiguredTasks', 'read')).toBe('read PreconfiguredTasks');
    expect(humanize('Supertasks', 'read')).toBe('read Supertasks');
  });

  it('adds "s" when the scope name is singular', () => {
    const humanize = (guard as unknown as { humanizeRoleName: (d: string, r: string) => string }).humanizeRoleName.bind(
      guard
    );
    expect(humanize('Agent', 'read')).toBe('read Agents');
    expect(humanize('Log', 'read')).toBe('read Logs');
  });
});
