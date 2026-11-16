import type { MockedObject } from 'vitest';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SuperHashListRoleService } from '@services/roles/hashlists/superhashlist-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { SuperhashlistComponent } from '@src/app/hashlists/superhashlist/superhashlist.component';

@Component({
  selector: 'app-page',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockPageComponent {
  @Input() title = '';
  @Input() actionTitle?: string;
  @Input() actionLink?: string;
  @Input() showAction?: boolean;
}

@Component({
  selector: 'app-table',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockTableComponent {}

@Component({
  selector: 'app-super-hashlists-table',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockSuperHashlistsTableComponent {}

describe('SuperhashlistComponent', () => {
  let fixture: ComponentFixture<SuperhashlistComponent>;
  let titleServiceSpy: MockedObject<Pick<AutoTitleService, 'set'>>;
  let roleServiceSpy: MockedObject<Pick<SuperHashListRoleService, 'hasRole'>>;

  const getPage = (): MockPageComponent =>
    fixture.debugElement.query(By.directive(MockPageComponent)).injector.get(MockPageComponent);

  beforeEach(async () => {
    titleServiceSpy = {
      set: vi.fn<AutoTitleService['set']>().mockName('AutoTitleService.set')
    };
    roleServiceSpy = {
      hasRole: vi.fn<SuperHashListRoleService['hasRole']>().mockName('SuperHashListRoleService.hasRole')
    };
    roleServiceSpy.hasRole.mockReturnValue(true);

    await TestBed.configureTestingModule({
      declarations: [SuperhashlistComponent, MockPageComponent, MockTableComponent, MockSuperHashlistsTableComponent],
      providers: [
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: SuperHashListRoleService, useValue: roleServiceSpy }
      ]
    }).compileComponents();
  });

  describe('best cases', () => {
    it('should create the component and check the create role during construction', () => {
      fixture = TestBed.createComponent(SuperhashlistComponent);

      expect(fixture.componentInstance).toBeInstanceOf(SuperhashlistComponent);
      expect(roleServiceSpy.hasRole).toHaveBeenCalledExactlyOnceWith('create');
      expect(titleServiceSpy.set).not.toHaveBeenCalled();
    });

    it('should set the page title on ngOnInit', () => {
      fixture = TestBed.createComponent(SuperhashlistComponent);

      fixture.detectChanges();

      expect(titleServiceSpy.set).toHaveBeenCalledExactlyOnceWith(['Show Superhashlist']);
    });

    it('should render the page with title, action and the super hashlists table nested in the table', () => {
      fixture = TestBed.createComponent(SuperhashlistComponent);

      fixture.detectChanges();

      const pageDebug = fixture.debugElement.query(By.directive(MockPageComponent));
      expect(pageDebug).not.toBeNull();
      const page = getPage();
      expect(page.title).toBe('Superhashlists');
      expect(page.actionTitle).toBe('New Superhashlist');
      expect(page.actionLink).toBe('/hashlists/new-superhashlist');
      const table = pageDebug.query(By.directive(MockTableComponent));
      expect(table).not.toBeNull();
      expect(table.queryAll(By.directive(MockSuperHashlistsTableComponent))).toHaveLength(1);
    });

    it('should show the create action when the user has the create role', () => {
      roleServiceSpy.hasRole.mockReturnValue(true);
      fixture = TestBed.createComponent(SuperhashlistComponent);

      fixture.detectChanges();

      expect(getPage().showAction).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should hide the create action when the user lacks the create role', () => {
      roleServiceSpy.hasRole.mockReturnValue(false);
      fixture = TestBed.createComponent(SuperhashlistComponent);

      fixture.detectChanges();

      expect(getPage().showAction).toBe(false);
      expect(fixture.debugElement.query(By.directive(MockSuperHashlistsTableComponent))).not.toBeNull();
    });
  });
});
