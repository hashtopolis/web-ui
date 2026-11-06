import type { MockedObject } from 'vitest';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AccessGroupRoleService } from '@services/roles/user/accessgroup-role.service';

import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';
import { GroupsComponent } from '@src/app/users/groups/groups.component';

// Mock components for child selectors used in the template
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
    it('should create the component', () => {
      fixture = TestBed.createComponent(GroupsComponent);

      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should set the page title on construction', () => {
      fixture = TestBed.createComponent(GroupsComponent);

      expect(titleServiceSpy.set).toHaveBeenCalledTimes(1);
      expect(titleServiceSpy.set).toHaveBeenCalledWith(['Show Groups']);
    });

    it('should check the "create" role exactly once', () => {
      fixture = TestBed.createComponent(GroupsComponent);

      expect(accessGroupRoleServiceSpy.hasRole).toHaveBeenCalledTimes(1);
      expect(accessGroupRoleServiceSpy.hasRole).toHaveBeenCalledWith('create');
    });

    it('should show the create action when the user has the create role', () => {
      fixture = TestBed.createComponent(GroupsComponent);

      fixture.detectChanges();

      expect(fixture.componentInstance['showCreateButton']).toBe(true);
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
      expect(table.query(By.directive(MockAccessGroupsTableComponent))).toBeTruthy();
    });

    it('should set the title before checking the role', () => {
      fixture = TestBed.createComponent(GroupsComponent);

      const titleOrder = titleServiceSpy.set.mock.invocationCallOrder[0];
      const roleOrder = accessGroupRoleServiceSpy.hasRole.mock.invocationCallOrder[0];
      expect(titleOrder).toBeLessThan(roleOrder);
    });
  });

  describe('edge cases', () => {
    it('should hide the create action when the user lacks the create role', () => {
      accessGroupRoleServiceSpy.hasRole.mockReturnValue(false);
      fixture = TestBed.createComponent(GroupsComponent);

      fixture.detectChanges();

      expect(fixture.componentInstance['showCreateButton']).toBe(false);
      expect(getPage().showAction).toBe(false);
    });

    it.each([
      ['undefined', undefined],
      ['null', null]
    ])('should not show the create action when hasRole returns %s', (_label, value) => {
      accessGroupRoleServiceSpy.hasRole.mockReturnValue(value as unknown as boolean);
      fixture = TestBed.createComponent(GroupsComponent);

      fixture.detectChanges();

      expect(fixture.componentInstance['showCreateButton']).toBeFalsy();
      expect(getPage().showAction).toBeFalsy();
    });

    it('should evaluate the role only on construction and not on subsequent change detection', () => {
      fixture = TestBed.createComponent(GroupsComponent);
      fixture.detectChanges();
      accessGroupRoleServiceSpy.hasRole.mockReturnValue(false);

      fixture.detectChanges();

      expect(accessGroupRoleServiceSpy.hasRole).toHaveBeenCalledTimes(1);
      expect(getPage().showAction).toBe(true);
    });
  });

  describe('error cases', () => {
    it('should propagate errors thrown while setting the page title and skip the role check', () => {
      const error = new Error('Unable to set page title');
      titleServiceSpy.set.mockImplementation(() => {
        throw error;
      });

      expect(() => TestBed.createComponent(GroupsComponent)).toThrow(error);
      expect(accessGroupRoleServiceSpy.hasRole).not.toHaveBeenCalled();
    });

    it('should propagate errors thrown while checking the create role', () => {
      const error = new Error('Unable to check access group role');
      accessGroupRoleServiceSpy.hasRole.mockImplementation(() => {
        throw error;
      });

      expect(() => TestBed.createComponent(GroupsComponent)).toThrow(error);
      expect(titleServiceSpy.set).toHaveBeenCalledWith(['Show Groups']);
    });
  });
});
