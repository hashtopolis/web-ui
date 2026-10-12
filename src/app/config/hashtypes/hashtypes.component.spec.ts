import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HashTypesRoleService } from '@services/roles/config/hashtypes-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { HashtypesComponent } from '@src/app/config/hashtypes/hashtypes.component';

@Component({ selector: 'app-page', template: '<ng-content></ng-content>', standalone: false })
class StubPageComponent {
  @Input() title: string;
  @Input() actionTitle?: string;
  @Input() actionLink?: string;
  @Input() showAction?: boolean;
}

@Component({ selector: 'app-table', template: '<ng-content></ng-content>', standalone: false })
class StubTableComponent {}

@Component({ selector: 'app-hashtypes-table', template: '', standalone: false })
class StubHashtypesTableComponent {}

describe('HashtypesComponent', () => {
  let fixture: ComponentFixture<HashtypesComponent>;

  beforeEach(async () => {
    const roles = jasmine.createSpyObj('HashTypesRoleService', ['hasRole']);
    roles.hasRole.and.returnValue(true);
    await TestBed.configureTestingModule({
      declarations: [HashtypesComponent, StubPageComponent, StubTableComponent, StubHashtypesTableComponent],
      providers: [
        { provide: AutoTitleService, useValue: jasmine.createSpyObj('AutoTitleService', ['set']) },
        { provide: HashTypesRoleService, useValue: roles }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(HashtypesComponent);
    fixture.detectChanges();
  });

  it('offers no action to create hashtypes, also with the create role', () => {
    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;
    expect(page.title).toBe('Hashtypes');
    expect(page.actionTitle).toBeUndefined();
    expect(page.actionLink).toBeUndefined();
    expect(page.showAction).toBeFalsy();
  });

  it('shows the hashtypes table', () => {
    expect(fixture.debugElement.query(By.directive(StubHashtypesTableComponent))).not.toBeNull();
  });
});
