import type { MockedObject } from 'vitest';

import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UserRoleService } from '@services/roles/user/user-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { AllUsersComponent } from '@src/app/users/all-users/all-users.component';

@Component({
  selector: 'app-page',
  template: '<ng-content></ng-content>',
  standalone: false
})
class MockPageComponent {
  @Input() title = '';
  @Input() actionTitle = '';
  @Input() actionLink = '';
  @Input() showAction = false;
}

@Component({
  selector: 'app-table',
  template: '<ng-content></ng-content>',
  standalone: false
})
class MockTableComponent {}

@Component({
  selector: 'app-users-table',
  template: '',
  standalone: false
})
class MockUsersTableComponent {}

describe('AllUsersComponent', () => {
  let titleServiceSpy: MockedObject<AutoTitleService>;
  let userRoleServiceSpy: MockedObject<UserRoleService>;

  beforeEach(async () => {
    titleServiceSpy = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;
    userRoleServiceSpy = {
      hasRole: vi.fn().mockName('UserRoleService.hasRole')
    } as MockedObject<UserRoleService>;
    userRoleServiceSpy.hasRole.mockReturnValue(true);

    await TestBed.configureTestingModule({
      declarations: [AllUsersComponent, MockPageComponent, MockTableComponent, MockUsersTableComponent],
      providers: [
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: UserRoleService, useValue: userRoleServiceSpy }
      ]
    }).compileComponents();
  });

  it('sets the page title and displays the create action for users with the create role', () => {
    const fixture: ComponentFixture<AllUsersComponent> = TestBed.createComponent(AllUsersComponent);
    fixture.detectChanges();

    expect(titleServiceSpy.set).toHaveBeenCalledExactlyOnceWith(['Show Users']);
    expect(userRoleServiceSpy.hasRole).toHaveBeenCalledExactlyOnceWith('create');
    expect(fixture.debugElement.query(By.directive(MockPageComponent)).componentInstance.showAction).toBe(true);
  });

  it('hides the create action when the user does not have the create role', () => {
    userRoleServiceSpy.hasRole.mockReturnValue(false);

    const fixture = TestBed.createComponent(AllUsersComponent);
    const page = fixture.debugElement.query(By.directive(MockPageComponent)).componentInstance as MockPageComponent;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(MockPageComponent)).componentInstance.showAction).toBe(false);
    expect(userRoleServiceSpy.hasRole).toHaveBeenCalledExactlyOnceWith('create');
    expect(page.title).toBe('Users');
    expect(page.actionTitle).toBe('New User');
    expect(page.actionLink).toBe('/users');
  });
});
