import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupertasksRoleService } from '@services/roles/tasks/supertasks-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { SupertasksComponent } from '@src/app/tasks/supertasks/supertasks.component';

describe('SupertasksComponent', () => {
  let component: SupertasksComponent;
  let fixture: ComponentFixture<SupertasksComponent>;

  let titleService: jasmine.SpyObj<AutoTitleService>;
  let roleService: jasmine.SpyObj<SupertasksRoleService>;

  beforeEach(async () => {
    titleService = jasmine.createSpyObj('AutoTitleService', ['set']);
    roleService = jasmine.createSpyObj('SupertasksRoleService', ['hasRole']);

    await TestBed.configureTestingModule({
      declarations: [SupertasksComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AutoTitleService, useValue: titleService },
        { provide: SupertasksRoleService, useValue: roleService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupertasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set page title to "Show Preconfigured Task" on init', () => {
    expect(titleService.set).toHaveBeenCalledWith(['Show Preconfigured Task']);
  });

  describe('showCreateButton', () => {
    it('should be true when user has create role', () => {
      roleService.hasRole.withArgs('create').and.returnValue(true);
      const compWithRole = TestBed.createComponent(SupertasksComponent).componentInstance;
      expect(compWithRole.showCreateButton).toBeTrue();
    });

    it('should be false when user does not have create role', () => {
      roleService.hasRole.withArgs('create').and.returnValue(false);
      const compWithoutRole = TestBed.createComponent(SupertasksComponent).componentInstance;
      expect(compWithoutRole.showCreateButton).toBeFalse();
    });
  });
});
