import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreconfiguredTasksRoleService } from '@services/roles/tasks/preconfiguredTasks-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { PreconfiguredTasksComponent } from '@src/app/tasks/preconfigured-tasks/preconfigured-tasks.component';

describe('PreconfiguredTasksComponent', () => {
  let component: PreconfiguredTasksComponent;
  let fixture: ComponentFixture<PreconfiguredTasksComponent>;
  let mockTitleService: jasmine.SpyObj<AutoTitleService>;
  let mockRoleService: jasmine.SpyObj<PreconfiguredTasksRoleService>;

  describe('with create role', () => {
    beforeEach(async () => {
      mockTitleService = jasmine.createSpyObj('AutoTitleService', ['set']);
      mockRoleService = jasmine.createSpyObj('PreconfiguredTasksRoleService', ['hasRole']);

      mockRoleService.hasRole.and.returnValue(true);

      await TestBed.configureTestingModule({
        declarations: [PreconfiguredTasksComponent],
        providers: [
          { provide: AutoTitleService, useValue: mockTitleService },
          { provide: PreconfiguredTasksRoleService, useValue: mockRoleService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(PreconfiguredTasksComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set page title to "Show Preconfigured Task"', () => {
      expect(mockTitleService.set).toHaveBeenCalledWith(['Show Preconfigured Task']);
    });

    it('should set showCreateButton to true when user has create role', () => {
      expect(component.showCreateButton).toBeTrue();
      expect(mockRoleService.hasRole).toHaveBeenCalledWith('create');
    });
  });

  describe('without create role', () => {
    beforeEach(async () => {
      mockTitleService = jasmine.createSpyObj('AutoTitleService', ['set']);
      mockRoleService = jasmine.createSpyObj('PreconfiguredTasksRoleService', ['hasRole']);

      mockRoleService.hasRole.and.returnValue(false);

      await TestBed.configureTestingModule({
        declarations: [PreconfiguredTasksComponent],
        providers: [
          { provide: AutoTitleService, useValue: mockTitleService },
          { provide: PreconfiguredTasksRoleService, useValue: mockRoleService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(PreconfiguredTasksComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should set showCreateButton to false when user lacks create role', () => {
      expect(component.showCreateButton).toBeFalse();
      expect(mockRoleService.hasRole).toHaveBeenCalledWith('create');
    });
  });
});
