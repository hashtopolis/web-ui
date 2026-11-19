import type { MockedObject } from 'vitest';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AccessGroupRoleService } from '@services/roles/user/accessgroup-role.service';

import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';
import { GroupsComponent } from '@src/app/users/groups/groups.component';

@Component({
  selector: 'app-page',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockTableComponent {}

@Component({
  selector: 'app-access-groups-table',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockAccessGroupsTableComponent {}

describe('GroupsComponent', () => {
  let fixture: ComponentFixture<GroupsComponent>;

  // Mocks
  let titleServiceSpy: MockedObject<AutoTitleService>;
  let accessGroupRoleServiceSpy: MockedObject<AccessGroupRoleService>;

  const getPage = (): MockPageComponent =>
    fixture.debugElement.query(By.directive(MockPageComponent)).componentInstance as MockPageComponent;

  beforeEach(async () => {
    titleServiceSpy = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;
    accessGroupRoleServiceSpy = {
      hasRole: vi.fn().mockName('AccessGroupRoleService.hasRole')
    } as MockedObject<AccessGroupRoleService>;

    accessGroupRoleServiceSpy.hasRole.mockReturnValue(true);

    await TestBed.configureTestingModule({
      declarations: [GroupsComponent, MockPageComponent, MockTableComponent, MockAccessGroupsTableComponent],
      providers: [
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: AccessGroupRoleService, useValue: accessGroupRoleServiceSpy }
      ]
    }).compileComponents();
  });

  describe('best cases', () => {
    it('should set the page title on construction', () => {
      fixture = TestBed.createComponent(GroupsComponent);

      expect(titleServiceSpy.set).toHaveBeenCalledExactlyOnceWith(['Show Groups']);
    });

    it('should check the "create" role exactly once', () => {
      fixture = TestBed.createComponent(GroupsComponent);

      expect(accessGroupRoleServiceSpy.hasRole).toHaveBeenCalledExactlyOnceWith('create');
    });

    it('should show the create action when the user has the create role', () => {
      fixture = TestBed.createComponent(GroupsComponent);

      fixture.detectChanges();

      expect(getPage().showAction).toBe(true);
    });

    it('should pass static page inputs to app-page', () => {
      fixture = TestBed.createComponent(GroupsComponent);

      fixture.detectChanges();

      const page = getPage();
      expect(page.title).toBe('Access Groups');
      expect(page.actionTitle).toBe('New Access Group');
      expect(page.actionLink).toBe('/users/access-groups/new');
    });

    it('should render the access groups table inside app-table', () => {
      fixture = TestBed.createComponent(GroupsComponent);

      fixture.detectChanges();

      const table = fixture.debugElement.query(By.directive(MockTableComponent));
      expect(table).toBeTruthy();
      expect(table.query(By.directive(MockAccessGroupsTableComponent))).not.toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should hide the create action when the user lacks the create role', () => {
      accessGroupRoleServiceSpy.hasRole.mockReturnValue(false);
      fixture = TestBed.createComponent(GroupsComponent);

      fixture.detectChanges();

      expect(getPage().showAction).toBe(false);
    });
  });
});
