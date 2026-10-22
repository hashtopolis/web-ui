import type { MockedObject } from 'vitest';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { TasksRoleService } from '@services/roles/tasks/tasks-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { TasksTableComponent } from '@components/tables/tasks-table/tasks-table.component';

import { ShowTasksComponent } from '@src/app/tasks/show-tasks/show-tasks.component';

describe('ShowTasksComponent', () => {
  let component: ShowTasksComponent;
  let fixture: ComponentFixture<ShowTasksComponent>;
  let mockTitleService: MockedObject<AutoTitleService>;
  let mockRoleService: MockedObject<TasksRoleService>;
  let mockTable: MockedObject<TasksTableComponent>;

  describe('with create role', () => {
    beforeEach(async () => {
      mockTitleService = {
        set: vi.fn().mockName('AutoTitleService.set')
      } as MockedObject<AutoTitleService>;
      mockRoleService = {
        hasRole: vi.fn().mockName('TasksRoleService.hasRole')
      } as MockedObject<TasksRoleService>;
      mockTable = {
        setIsArchived: vi.fn().mockName('TasksTableComponent.setIsArchived')
      } as MockedObject<TasksTableComponent>;

      mockRoleService.hasRole.mockReturnValue(true);

      await TestBed.configureTestingModule({
        declarations: [ShowTasksComponent],
        providers: [
          { provide: AutoTitleService, useValue: mockTitleService },
          { provide: TasksRoleService, useValue: mockRoleService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(ShowTasksComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      (
        component as unknown as {
          table: MockedObject<TasksTableComponent>;
        }
      ).table = mockTable;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set pageTitle to "Tasks"', () => {
      expect(component.pageTitle).toBe('Tasks');
    });

    it('should call titleService.set with ["Tasks"]', () => {
      expect(mockTitleService.set).toHaveBeenCalledWith(['Tasks']);
    });

    it('should set showCreateButton to true when user has create role', () => {
      expect(component.showCreateButton).toBe(true);
      expect(mockRoleService.hasRole).toHaveBeenCalledWith('create');
    });

    it('should expose the table ViewChild', () => {
      expect(component.table).toBeDefined();
    });

    describe('toggleIsArchived', () => {
      it('should call table.setIsArchived with true when toggle is checked', () => {
        const event = { checked: true } as MatSlideToggleChange;

        component.toggleIsArchived(event);

        expect(mockTable.setIsArchived).toHaveBeenCalledWith(true);
        expect(component.pageTitle).toBe('Tasks (archived)');
      });

      it('should call table.setIsArchived with false when toggle is unchecked', () => {
        const event = { checked: false } as MatSlideToggleChange;

        component.toggleIsArchived(event);

        expect(mockTable.setIsArchived).toHaveBeenCalledWith(false);
        expect(component.pageTitle).toBe('Tasks');
      });
    });
  });

  describe('without create role', () => {
    beforeEach(async () => {
      mockTitleService = {
        set: vi.fn().mockName('AutoTitleService.set')
      } as MockedObject<AutoTitleService>;
      mockRoleService = {
        hasRole: vi.fn().mockName('TasksRoleService.hasRole')
      } as MockedObject<TasksRoleService>;
      mockTable = {
        setIsArchived: vi.fn().mockName('TasksTableComponent.setIsArchived')
      } as MockedObject<TasksTableComponent>;

      mockRoleService.hasRole.mockReturnValue(false);

      await TestBed.configureTestingModule({
        declarations: [ShowTasksComponent],
        providers: [
          { provide: AutoTitleService, useValue: mockTitleService },
          { provide: TasksRoleService, useValue: mockRoleService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(ShowTasksComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      (
        component as unknown as {
          table: MockedObject<TasksTableComponent>;
        }
      ).table = mockTable;
    });

    it('should set showCreateButton to false when user lacks create role', () => {
      expect(component.showCreateButton).toBe(false);
      expect(mockRoleService.hasRole).toHaveBeenCalledWith('create');
    });
  });
});
