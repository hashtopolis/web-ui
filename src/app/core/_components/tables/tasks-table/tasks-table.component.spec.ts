import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { JTaskWrapperDisplay, TaskStatus, TaskType } from '@models/task.model';

import { ExportService } from '@services/export/export.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { TasksRoleService } from '@services/roles/tasks/tasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { ConfigService } from '@services/shared/config.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { TasksTableComponent } from '@components/tables/tasks-table/tasks-table.component';
import {
  TaskTableCol,
  TaskTableColumnLabel,
  TaskTableEditableAction
} from '@components/tables/tasks-table/tasks-table.constants';

class MockDataSource {
  loadAll = jasmine.createSpy('loadAll').and.callFake(() => {});
  setColumns = jasmine.createSpy('setColumns');
  clearFilter = jasmine.createSpy('clearFilter');
  reload = jasmine.createSpy('reload');
  setIsArchived = jasmine.createSpy('setIsArchived');
  setHashlistID = jasmine.createSpy('setHashlistID');
  setFilterQuery = jasmine.createSpy('setFilterQuery');
  reset = jasmine.createSpy('reset');
  stopAutoRefresh = jasmine.createSpy('stopAutoRefresh');
  startAutoRefresh = jasmine.createSpy('startAutoRefresh');
  filterError$ = { subscribe: jasmine.createSpy('subscribe') };
}

class TestTasksTableComponent extends TasksTableComponent {
  mockDataSource = new MockDataSource();

  override ngOnInit(): void {
    this.setColumnLabels(TaskTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = this.mockDataSource as unknown as typeof this.dataSource;
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setIsArchived(this.isArchived);
    this.dataSource.setHashlistID(this.hashlistId);
    this.setupFilterErrorSubscription(this.dataSource);
  }

  override ngAfterViewInit(): void {
    if (this.dataSource.autoRefreshService?.refreshPage) {
      this.dataSource.startAutoRefresh();
    }
  }

  override ngOnDestroy(): void {
    this.subscriptions = [];
  }
}

describe('TasksTableComponent', () => {
  let component: TestTasksTableComponent;
  let fixture: ComponentFixture<TestTasksTableComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTasksRoleService: jasmine.SpyObj<TasksRoleService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockConfigService: jasmine.SpyObj<ConfigService>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['bulkUpdate', 'bulkDelete', 'delete', 'update']);
    mockGlobalService.update.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.update>);
    mockGlobalService.bulkUpdate.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.bulkUpdate>);
    mockGlobalService.bulkDelete.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.bulkDelete>);
    mockGlobalService.delete.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.delete>);
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockTasksRoleService = jasmine.createSpyObj('TasksRoleService', ['hasRole']);
    mockAlertService = jasmine.createSpyObj('AlertService', [
      'showSuccessMessage',
      'showErrorMessage',
      'showInfoMessage'
    ]);

    mockTasksRoleService.hasRole.and.returnValue(false);
    mockConfigService = jasmine.createSpyObj('ConfigService', ['getEndpoint']);
    mockConfigService.getEndpoint.and.returnValue('http://localhost:4200');

    await TestBed.configureTestingModule({
      declarations: [TestTasksTableComponent],
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: ExportService, useValue: mockExportService },
        { provide: TasksRoleService, useValue: mockTasksRoleService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: ConfigService, useValue: mockConfigService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDialogModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestTasksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    (component as unknown as { table: unknown }).table = {
      clearFilterError: jasmine.createSpy('clearFilterError'),
      reload: jasmine.createSpy('reload')
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getColumns', () => {
    it('should return columns with ID, TASK_TYPE, NAME, STATUS, TASK_SPEED, DISPATCHED_SEARCHED, IS_SMALL, IS_CPU_TASK, PREPROCESSOR, HASHTYPE, HASHLISTS, CRACKED, AGENTS, PRIORITY, MAX_AGENTS, ACCESS_GROUP', () => {
      const columns = component.getColumns();
      const columnIds = columns.map((col) => col.id);

      expect(columnIds).toContain(TaskTableCol.ID);
      expect(columnIds).toContain(TaskTableCol.TASK_TYPE);
      expect(columnIds).toContain(TaskTableCol.NAME);
      expect(columnIds).toContain(TaskTableCol.STATUS);
      expect(columnIds).toContain(TaskTableCol.TASK_SPEED);
      expect(columnIds).toContain(TaskTableCol.DISPATCHED_SEARCHED);
      expect(columnIds).toContain(TaskTableCol.IS_SMALL);
      expect(columnIds).toContain(TaskTableCol.IS_CPU_TASK);
      expect(columnIds).toContain(TaskTableCol.PREPROCESSOR);
      expect(columnIds).toContain(TaskTableCol.HASHTYPE);
      expect(columnIds).toContain(TaskTableCol.HASHLISTS);
      expect(columnIds).toContain(TaskTableCol.CRACKED);
      expect(columnIds).toContain(TaskTableCol.AGENTS);
      expect(columnIds).toContain(TaskTableCol.PRIORITY);
      expect(columnIds).toContain(TaskTableCol.MAX_AGENTS);
      expect(columnIds).toContain(TaskTableCol.ACCESS_GROUP);
    });

    it('should include ID column with correct properties for TASK type', () => {
      const columns = component.getColumns();
      const idColumn = columns.find((col) => col.id === TaskTableCol.ID);
      const testWrapper = {
        taskType: TaskType.TASK,
        taskId: 123
      } as JTaskWrapperDisplay;

      expect(idColumn).toBeDefined();
      expect(idColumn?.isSortable).toBe(true);
      expect(idColumn?.isSearchable).toBe(true);
      expect(idColumn?.render!(testWrapper)).toBe('123');
    });

    it('should return empty string for ID column render when taskType is SUPERTASK', () => {
      const columns = component.getColumns();
      const idColumn = columns.find((col) => col.id === TaskTableCol.ID);
      const testWrapper = {
        taskType: TaskType.SUPERTASK,
        taskId: 123
      } as JTaskWrapperDisplay;

      expect(idColumn?.render!(testWrapper)).toBe('');
    });

    it('should render TASK_TYPE column correctly for TASK', () => {
      const columns = component.getColumns();
      const typeColumn = columns.find((col) => col.id === TaskTableCol.TASK_TYPE);
      const taskWrapper = { taskType: TaskType.TASK } as JTaskWrapperDisplay;

      expect(typeColumn?.render!(taskWrapper)).toBe('Task');
    });

    it('should render TASK_TYPE column correctly for SUPERTASK with HTML', () => {
      const columns = component.getColumns();
      const typeColumn = columns.find((col) => col.id === TaskTableCol.TASK_TYPE);
      const taskWrapper = { taskType: TaskType.SUPERTASK } as JTaskWrapperDisplay;

      expect(typeColumn?.render!(taskWrapper)).toBe('<b>Supertask</b>');
    });

    it('should include NAME column with routerLink function', () => {
      const columns = component.getColumns();
      const nameColumn = columns.find((col) => col.id === TaskTableCol.NAME);

      expect(nameColumn).toBeDefined();
      expect(nameColumn?.routerLink).toBeDefined();
      expect(typeof nameColumn?.routerLink).toBe('function');
    });

    it('should render NAME column routerLink correctly for TASK', (done) => {
      const columns = component.getColumns();
      const nameColumn = columns.find((col) => col.id === TaskTableCol.NAME);
      const taskWrapper = {
        taskType: TaskType.TASK,
        taskId: 1,
        displayName: 'Test Task'
      } as JTaskWrapperDisplay;

      nameColumn?.routerLink!(taskWrapper).subscribe((links) => {
        expect(links[0].label).toBe('Test Task');
        expect(links[0].routerLink).toEqual(['/tasks', 'show-tasks', 1, 'edit']);
        done();
      });
    });

    it('should truncate long task names in NAME column routerLink', (done) => {
      const columns = component.getColumns();
      const nameColumn = columns.find((col) => col.id === TaskTableCol.NAME);
      const longName = 'A'.repeat(50);
      const taskWrapper = {
        taskType: TaskType.TASK,
        taskId: 1,
        displayName: longName
      } as JTaskWrapperDisplay;

      nameColumn?.routerLink!(taskWrapper).subscribe((links) => {
        expect(links[0].label).toBe('A'.repeat(40) + '...');
        expect(links[0].routerLink).toEqual(['/tasks', 'show-tasks', 1, 'edit']);
        done();
      });
    });

    it('should render NAME column for SUPERTASK with an onClick that opens the subtasks dialog', (done) => {
      const columns = component.getColumns();
      const nameColumn = columns.find((col) => col.id === TaskTableCol.NAME);
      const taskWrapper = {
        id: 42,
        taskType: TaskType.SUPERTASK,
        displayName: 'Test Supertask'
      } as JTaskWrapperDisplay;

      mockDialog.open.and.returnValue({
        afterClosed: () => of(undefined)
      } as unknown as ReturnType<typeof mockDialog.open>);

      nameColumn?.routerLink!(taskWrapper).subscribe((links) => {
        expect(links[0].label).toBe('Test Supertask');
        expect(links[0].routerLink).toBeNull();
        expect(links[0].onClick).toBeDefined();

        links[0].onClick!();
        expect(mockDialog.open).toHaveBeenCalledWith(
          jasmine.anything(),
          jasmine.objectContaining({
            data: { supertaskId: 42, supertaskName: 'Test Supertask' }
          })
        );
        done();
      });
    });

    it('should include TASK_SPEED column with correct properties', () => {
      const columns = component.getColumns();
      const speedColumn = columns.find((col) => col.id === TaskTableCol.TASK_SPEED);

      expect(speedColumn).toBeDefined();
      expect(speedColumn?.isSortable).toBe(false);
      expect(speedColumn?.isSearchable).toBe(false);
      expect(speedColumn?.render).toBeDefined();
    });

    it('should render TASK_SPEED as formatted string when currentSpeed is set', () => {
      const columns = component.getColumns();
      const speedColumn = columns.find((col) => col.id === TaskTableCol.TASK_SPEED);
      const taskWrapper = { currentSpeed: 500, taskType: TaskType.TASK } as JTaskWrapperDisplay;

      const result = speedColumn?.render!(taskWrapper) as string;

      expect(result).toContain('H/s');
      expect(result).not.toBe('0 H/s');
    });

    it('should render TASK_SPEED as "0 H/s" when currentSpeed is undefined', () => {
      const columns = component.getColumns();
      const speedColumn = columns.find((col) => col.id === TaskTableCol.TASK_SPEED);
      const taskWrapper = { currentSpeed: undefined, taskType: TaskType.TASK } as unknown as JTaskWrapperDisplay;

      expect(speedColumn?.render!(taskWrapper)).toBe('0 H/s');
    });

    it('should render TASK_SPEED as "0 H/s" when currentSpeed is 0', () => {
      const columns = component.getColumns();
      const speedColumn = columns.find((col) => col.id === TaskTableCol.TASK_SPEED);
      const taskWrapper = { currentSpeed: 0, taskType: TaskType.TASK } as JTaskWrapperDisplay;

      expect(speedColumn?.render!(taskWrapper)).toBe('0 H/s');
    });

    it('should render TASK_SPEED with kH/s for speed >= 1000', () => {
      const columns = component.getColumns();
      const speedColumn = columns.find((col) => col.id === TaskTableCol.TASK_SPEED);
      const taskWrapper = { currentSpeed: 1000, taskType: TaskType.TASK } as JTaskWrapperDisplay;

      const result = speedColumn?.render!(taskWrapper) as string;

      expect(result).toContain('kH/s');
    });

    it('should include DISPATCHED_SEARCHED column with correct properties', () => {
      const columns = component.getColumns();
      const dispatchedCol = columns.find((col) => col.id === TaskTableCol.DISPATCHED_SEARCHED);

      expect(dispatchedCol).toBeDefined();
      expect(dispatchedCol?.isSortable).toBe(false);
      expect(dispatchedCol?.isSearchable).toBe(false);
      expect(dispatchedCol?.render).toBeDefined();
    });

    it('should render DISPATCHED_SEARCHED with both values when set', () => {
      const columns = component.getColumns();
      const dispatchedCol = columns.find((col) => col.id === TaskTableCol.DISPATCHED_SEARCHED);
      const taskWrapper = { dispatched: '50', searched: '25', taskType: TaskType.TASK } as JTaskWrapperDisplay;

      expect(dispatchedCol?.render!(taskWrapper)).toBe('50% / 25%');
    });

    it('should render DISPATCHED_SEARCHED with "0" fallback when dispatched is undefined', () => {
      const columns = component.getColumns();
      const dispatchedCol = columns.find((col) => col.id === TaskTableCol.DISPATCHED_SEARCHED);
      const taskWrapper = {
        dispatched: undefined,
        searched: '10',
        taskType: TaskType.TASK
      } as unknown as JTaskWrapperDisplay;

      expect(dispatchedCol?.render!(taskWrapper)).toBe('0% / 10%');
    });

    it('should render DISPATCHED_SEARCHED with "0" fallback when searched is undefined', () => {
      const columns = component.getColumns();
      const dispatchedCol = columns.find((col) => col.id === TaskTableCol.DISPATCHED_SEARCHED);
      const taskWrapper = {
        dispatched: '30',
        searched: undefined,
        taskType: TaskType.TASK
      } as unknown as JTaskWrapperDisplay;

      expect(dispatchedCol?.render!(taskWrapper)).toBe('30% / 0%');
    });

    it('should render DISPATCHED_SEARCHED as "0% / 0%" when both are undefined', () => {
      const columns = component.getColumns();
      const dispatchedCol = columns.find((col) => col.id === TaskTableCol.DISPATCHED_SEARCHED);
      const taskWrapper = {
        dispatched: undefined,
        searched: undefined,
        taskType: TaskType.TASK
      } as unknown as JTaskWrapperDisplay;

      expect(dispatchedCol?.render!(taskWrapper)).toBe('0% / 0%');
    });

    it('should render HASHTYPE column correctly when hashTypeId and description exist', () => {
      const columns = component.getColumns();
      const hashTypeColumn = columns.find((col) => col.id === TaskTableCol.HASHTYPE);
      const taskWrapper = {
        hashTypeId: 1000,
        hashTypeDescription: 'MD5'
      } as JTaskWrapperDisplay;

      expect(hashTypeColumn?.render!(taskWrapper)).toBe('1000 - MD5');
    });

    it('should return empty string for HASHTYPE column when hashTypeId is undefined', () => {
      const columns = component.getColumns();
      const hashTypeColumn = columns.find((col) => col.id === TaskTableCol.HASHTYPE);
      const taskWrapper = {
        hashTypeId: undefined,
        hashTypeDescription: 'MD5'
      } as unknown as JTaskWrapperDisplay;

      expect(hashTypeColumn?.render!(taskWrapper)).toBe('');
    });

    it('should return empty string for HASHTYPE column when hashTypeDescription is undefined', () => {
      const columns = component.getColumns();
      const hashTypeColumn = columns.find((col) => col.id === TaskTableCol.HASHTYPE);
      const taskWrapper = {
        hashTypeId: 1000,
        hashTypeDescription: undefined
      } as unknown as JTaskWrapperDisplay;

      expect(hashTypeColumn?.render!(taskWrapper)).toBe('');
    });

    it('should render HASHLISTS column with check icon when all hashes are cracked', () => {
      const columns = component.getColumns();
      const hashlistsColumn = columns.find((col) => col.id === TaskTableCol.HASHLISTS);
      const taskWrapper = {
        hashCount: 100,
        hashlistCracked: 100
      } as JTaskWrapperDisplay;

      const icon = hashlistsColumn?.icon!(taskWrapper);
      expect(icon?.name).toBe('check');
      expect(icon?.tooltip).toBe('All hashes cracked');
    });

    it('should return empty icon for HASHLISTS column when not all hashes cracked', () => {
      const columns = component.getColumns();
      const hashlistsColumn = columns.find((col) => col.id === TaskTableCol.HASHLISTS);
      const taskWrapper = {
        hashCount: 100,
        hashlistCracked: 50
      } as JTaskWrapperDisplay;

      const icon = hashlistsColumn?.icon!(taskWrapper);
      expect(icon?.name).toBe('');
    });

    it('should render HASHLISTS column routerLink correctly', (done) => {
      const columns = component.getColumns();
      const hashlistsColumn = columns.find((col) => col.id === TaskTableCol.HASHLISTS);
      const taskWrapper = {
        hashlistId: 5,
        hashlistName: 'Test Hashlist'
      } as JTaskWrapperDisplay;

      hashlistsColumn?.routerLink!(taskWrapper).subscribe((links) => {
        expect(links[0].label).toBe('Test Hashlist');
        expect(links[0].routerLink).toEqual(['/hashlists', 'hashlist', 5, 'edit']);
        done();
      });
    });

    it('should truncate long HASHLISTS label and keep full name in tooltip', (done) => {
      const columns = component.getColumns();
      const hashlistsColumn = columns.find((col) => col.id === TaskTableCol.HASHLISTS);
      const longName = 'This is a very long hashlist name that should be truncated';
      const taskWrapper = {
        hashlistId: 11,
        hashlistName: longName
      } as JTaskWrapperDisplay;

      hashlistsColumn?.routerLink!(taskWrapper).subscribe((links) => {
        expect(links[0].label).toBe('This is a very long ...');
        expect(links[0].tooltip).toBe(longName);
        expect(links[0].routerLink).toEqual(['/hashlists', 'hashlist', 11, 'edit']);
        done();
      });
    });

    it('should render HASHLISTS column routerLink with id as label when name is empty', (done) => {
      const columns = component.getColumns();
      const hashlistsColumn = columns.find((col) => col.id === TaskTableCol.HASHLISTS);
      const taskWrapper = {
        hashlistId: 10,
        hashlistName: undefined
      } as unknown as JTaskWrapperDisplay;

      hashlistsColumn?.routerLink!(taskWrapper).subscribe((links) => {
        expect(links[0].label).toBe('10');
        expect(links[0].routerLink).toEqual(['/hashlists', 'hashlist', 10, 'edit']);
        done();
      });
    });

    it('should render AGENTS column for TASK type using totalAssignedAgents', () => {
      const columns = component.getColumns();
      const agentsColumn = columns.find((col) => col.id === TaskTableCol.AGENTS);
      const taskWrapper = {
        taskType: TaskType.TASK,
        totalAssignedAgents: 3
      } as JTaskWrapperDisplay;

      expect(agentsColumn?.render!(taskWrapper)).toBe('3');
    });

    it('should return empty string for AGENTS column for SUPERTASK type', () => {
      const columns = component.getColumns();
      const agentsColumn = columns.find((col) => col.id === TaskTableCol.AGENTS);
      const taskWrapper = {
        taskType: TaskType.SUPERTASK,
        totalAssignedAgents: 3
      } as JTaskWrapperDisplay;

      expect(agentsColumn?.render!(taskWrapper)).toBe('');
    });

    it('should render PREPROCESSOR column for TASK with preprocessor', () => {
      const columns = component.getColumns();
      const preprocessorColumn = columns.find((col) => col.id === TaskTableCol.PREPROCESSOR);
      const taskWrapper = {
        taskType: TaskType.TASK,
        taskUsePreprocessor: 1
      } as JTaskWrapperDisplay;

      expect(preprocessorColumn?.render!(taskWrapper)).toBe('Prince');
    });

    it('should return empty string for PREPROCESSOR column for TASK without preprocessor', () => {
      const columns = component.getColumns();
      const preprocessorColumn = columns.find((col) => col.id === TaskTableCol.PREPROCESSOR);
      const taskWrapper = {
        taskType: TaskType.TASK,
        taskUsePreprocessor: 0
      } as JTaskWrapperDisplay;

      expect(preprocessorColumn?.render!(taskWrapper)).toBe('');
    });

    it('should return empty string for PREPROCESSOR column for SUPERTASK', () => {
      const columns = component.getColumns();
      const preprocessorColumn = columns.find((col) => col.id === TaskTableCol.PREPROCESSOR);
      const taskWrapper = {
        taskType: TaskType.SUPERTASK,
        taskUsePreprocessor: 1
      } as JTaskWrapperDisplay;

      expect(preprocessorColumn?.render!(taskWrapper)).toBe('');
    });

    it('should include IS_SMALL column with icon', () => {
      const columns = component.getColumns();
      const isSmallColumn = columns.find((col) => col.id === TaskTableCol.IS_SMALL);

      expect(isSmallColumn).toBeDefined();
      expect(isSmallColumn?.icon).toBeDefined();
      expect(isSmallColumn?.isSortable).toBe(true);
    });

    it('should include IS_CPU_TASK column with icon', () => {
      const columns = component.getColumns();
      const isCpuTaskColumn = columns.find((col) => col.id === TaskTableCol.IS_CPU_TASK);

      expect(isCpuTaskColumn).toBeDefined();
      expect(isCpuTaskColumn?.icon).toBeDefined();
      expect(isCpuTaskColumn?.isSortable).toBe(true);
    });

    it('should include ACCESS_GROUP column with routerLink', () => {
      const columns = component.getColumns();
      const accessGroupColumn = columns.find((col) => col.id === TaskTableCol.ACCESS_GROUP);

      expect(accessGroupColumn).toBeDefined();
      expect(accessGroupColumn?.routerLink).toBeDefined();
      expect(accessGroupColumn?.isSortable).toBe(true);
    });

    it('should render ACCESS_GROUP column routerLink correctly', (done) => {
      const columns = component.getColumns();
      const accessGroupColumn = columns.find((col) => col.id === TaskTableCol.ACCESS_GROUP);
      const taskWrapper = {
        accessGroupId: 7,
        groupName: 'Test Group'
      } as JTaskWrapperDisplay;

      accessGroupColumn?.routerLink!(taskWrapper).subscribe((links) => {
        expect(links[0].label).toBe('Test Group');
        expect(links[0].routerLink).toEqual(['/users', 'access-groups', 7, 'edit']);
        done();
      });
    });

    it('should include PRIORITY and MAX_AGENTS columns without editable when user lacks edit role', () => {
      mockTasksRoleService.hasRole.withArgs('edit').and.returnValue(false);
      component.ngOnInit();
      const columns = component.getColumns();

      const priorityColumn = columns.find((col) => col.id === TaskTableCol.PRIORITY);
      const maxAgentsColumn = columns.find((col) => col.id === TaskTableCol.MAX_AGENTS);

      expect(priorityColumn?.editable).toBeUndefined();
      expect(maxAgentsColumn?.editable).toBeUndefined();
      expect(priorityColumn?.render).toBeDefined();
      expect(maxAgentsColumn?.render).toBeDefined();
    });

    it('should include PRIORITY and MAX_AGENTS columns with editable when user has edit role', () => {
      mockTasksRoleService.hasRole.withArgs('edit').and.returnValue(true);
      component.ngOnInit();
      const columns = component.getColumns();

      const priorityColumn = columns.find((col) => col.id === TaskTableCol.PRIORITY);
      const maxAgentsColumn = columns.find((col) => col.id === TaskTableCol.MAX_AGENTS);

      expect(priorityColumn?.editable).toBeDefined();
      expect(maxAgentsColumn?.editable).toBeDefined();
    });

    it('should render priority correctly for TASK type', () => {
      const columns = component.getColumns();
      const priorityColumn = columns.find((col) => col.id === TaskTableCol.PRIORITY);
      const taskWrapper = {
        taskType: TaskType.TASK,
        taskPriority: 10
      } as JTaskWrapperDisplay;

      expect(priorityColumn?.render!(taskWrapper)).toBe('10');
    });

    it('should render priority correctly for SUPERTASK type', () => {
      const columns = component.getColumns();
      const priorityColumn = columns.find((col) => col.id === TaskTableCol.PRIORITY);
      const taskWrapper = {
        taskType: TaskType.SUPERTASK,
        taskWrapperPriority: 20
      } as JTaskWrapperDisplay;

      expect(priorityColumn?.render!(taskWrapper)).toBe('20');
    });

    it('should render maxAgents correctly for TASK type', () => {
      const columns = component.getColumns();
      const maxAgentsColumn = columns.find((col) => col.id === TaskTableCol.MAX_AGENTS);
      const taskWrapper = {
        taskType: TaskType.TASK,
        taskMaxAgents: 5
      } as JTaskWrapperDisplay;

      expect(maxAgentsColumn?.render!(taskWrapper)).toBe('5');
    });

    it('should render maxAgents correctly for SUPERTASK type', () => {
      const columns = component.getColumns();
      const maxAgentsColumn = columns.find((col) => col.id === TaskTableCol.MAX_AGENTS);
      const taskWrapper = {
        taskType: TaskType.SUPERTASK,
        taskWrapperMaxAgents: 10
      } as JTaskWrapperDisplay;

      expect(maxAgentsColumn?.render!(taskWrapper)).toBe('10');
    });
  });

  describe('getRowClass', () => {
    it('should return "row-cracked" for cracked rows', () => {
      const wrapper = { cracked: 100 } as JTaskWrapperDisplay;
      expect(component.getRowClass(wrapper)).toBe('row-cracked');
    });

    it('should return empty string for non-cracked rows', () => {
      const wrapper = { cracked: 0 } as JTaskWrapperDisplay;
      expect(component.getRowClass(wrapper)).toBe('');
    });

    it('should return empty string when cracked is undefined', () => {
      const wrapper = { cracked: undefined } as unknown as JTaskWrapperDisplay;
      expect(component.getRowClass(wrapper)).toBe('');
    });
  });

  describe('rowActionClicked', () => {
    beforeEach(() => {
      mockDialog.open.and.returnValue({
        afterClosed: () => of(null)
      } as unknown as ReturnType<typeof mockDialog.open>);
    });

    it('should navigate to task edit page for EDIT_TASKS action on TASK', () => {
      const event = {
        menuItem: { label: 'Edit', action: RowActionMenuAction.EDIT_TASKS },
        data: { taskType: TaskType.TASK, taskId: 123 } as JTaskWrapperDisplay
      };

      component.rowActionClicked(event);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['tasks', 'show-tasks', 123, 'edit']);
    });

    it('should not navigate for EDIT_TASKS action on SUPERTASK', () => {
      const event = {
        menuItem: { label: 'Edit', action: RowActionMenuAction.EDIT_TASKS },
        data: { taskType: TaskType.SUPERTASK, taskId: 123 } as JTaskWrapperDisplay
      };

      component.rowActionClicked(event);

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should open modal subtasks dialog for SHOW_SUBTASKS action', () => {
      const event = {
        menuItem: { label: 'Subtasks', action: RowActionMenuAction.SHOW_SUBTASKS },
        data: { id: 1, displayName: 'Test Supertask' } as JTaskWrapperDisplay
      };

      component.rowActionClicked(event);

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should navigate to copy task page for COPY_TO_TASK action', () => {
      const event = {
        menuItem: { label: 'Copy', action: RowActionMenuAction.COPY_TO_TASK },
        data: { taskType: TaskType.TASK, taskId: 123 } as JTaskWrapperDisplay
      };

      component.rowActionClicked(event);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['tasks', 'new-tasks', 123, 'copy']);
    });

    it('should navigate to copy pretask page for COPY_TO_PRETASK action', () => {
      const event = {
        menuItem: { label: 'Copy to Pretask', action: RowActionMenuAction.COPY_TO_PRETASK },
        data: { taskType: TaskType.TASK, taskId: 123 } as JTaskWrapperDisplay
      };

      component.rowActionClicked(event);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['tasks', 'preconfigured-tasks', 123, 'copytask']);
    });

    it('should call updateIsArchived for ARCHIVE action', () => {
      const event = {
        menuItem: { label: 'Archive', action: RowActionMenuAction.ARCHIVE },
        data: { taskType: TaskType.TASK, taskId: 123 } as JTaskWrapperDisplay
      };
      const updateIsArchivedSpy = spyOn(component as unknown as { updateIsArchived: jasmine.Spy }, 'updateIsArchived');

      component.rowActionClicked(event);

      expect(updateIsArchivedSpy).toHaveBeenCalledWith(123, true);
    });

    it('should call updateIsArchived for UNARCHIVE action', () => {
      const event = {
        menuItem: { label: 'Unarchive', action: RowActionMenuAction.UNARCHIVE },
        data: { taskType: TaskType.TASK, taskId: 123 } as JTaskWrapperDisplay
      };
      const updateIsArchivedSpy = spyOn(component as unknown as { updateIsArchived: jasmine.Spy }, 'updateIsArchived');

      component.rowActionClicked(event);

      expect(updateIsArchivedSpy).toHaveBeenCalledWith(123, false);
    });

    it('should call updateTaskWrapperIsArchived for ARCHIVE action on SUPERTASK', () => {
      const event = {
        menuItem: { label: 'Archive', action: RowActionMenuAction.ARCHIVE },
        data: { taskType: TaskType.SUPERTASK, taskWrapperId: 456 } as JTaskWrapperDisplay
      };
      const updateTaskWrapperIsArchivedSpy = spyOn(
        component as unknown as { updateTaskWrapperIsArchived: jasmine.Spy },
        'updateTaskWrapperIsArchived'
      );

      component.rowActionClicked(event);

      expect(updateTaskWrapperIsArchivedSpy).toHaveBeenCalledWith(456, true);
    });

    it('should call updateTaskWrapperIsArchived for UNARCHIVE action on SUPERTASK', () => {
      const event = {
        menuItem: { label: 'Unarchive', action: RowActionMenuAction.UNARCHIVE },
        data: { taskType: TaskType.SUPERTASK, taskWrapperId: 456 } as JTaskWrapperDisplay
      };
      const updateTaskWrapperIsArchivedSpy = spyOn(
        component as unknown as { updateTaskWrapperIsArchived: jasmine.Spy },
        'updateTaskWrapperIsArchived'
      );

      component.rowActionClicked(event);

      expect(updateTaskWrapperIsArchivedSpy).toHaveBeenCalledWith(456, false);
    });

    it('should open delete dialog for DELETE action', () => {
      const event = {
        menuItem: { label: 'Delete', action: RowActionMenuAction.DELETE },
        data: { taskName: 'TestTask', displayName: 'TestTask' } as JTaskWrapperDisplay
      };

      component.rowActionClicked(event);

      expect(mockDialog.open).toHaveBeenCalled();
    });
  });

  describe('getRowDeleteLabel', () => {
    it('should set taskName from displayName when displayName is defined', () => {
      const data = { displayName: 'Test Task', taskName: undefined } as unknown as JTaskWrapperDisplay;
      const result = component.getRowDeleteLabel(data);

      expect(result.taskName).toBe('Test Task');
    });

    it('should preserve existing taskName when displayName is undefined', () => {
      const data = { displayName: undefined, taskName: 'Existing Name' } as unknown as JTaskWrapperDisplay;
      const result = component.getRowDeleteLabel(data);

      expect(result.taskName).toBe('Existing Name');
    });

    it('should preserve other properties', () => {
      const data = { displayName: 'Test Task', id: 123, taskId: 456 } as JTaskWrapperDisplay;
      const result = component.getRowDeleteLabel(data);

      expect(result.id).toBe(123);
      expect(result.taskId).toBe(456);
    });
  });

  describe('bulkActionClicked', () => {
    beforeEach(() => {
      mockDialog.open.and.returnValue({
        afterClosed: () => of(null)
      } as unknown as ReturnType<typeof mockDialog.open>);
    });

    it('should open archive dialog for ARCHIVE action', () => {
      const event = {
        menuItem: { label: 'Archive', action: BulkActionMenuAction.ARCHIVE },
        data: [
          { taskType: TaskType.TASK, displayName: 'Task 1' },
          { taskType: TaskType.TASK, displayName: 'Task 2' }
        ] as JTaskWrapperDisplay[]
      };

      component.bulkActionClicked(event);

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should call bulkActionArchive when ARCHIVE dialog is confirmed', () => {
      const event = {
        menuItem: { label: 'Archive', action: BulkActionMenuAction.ARCHIVE },
        data: [
          { taskType: TaskType.TASK, taskId: 1, displayName: 'Task 1' },
          { taskType: TaskType.TASK, taskId: 2, displayName: 'Task 2' }
        ] as JTaskWrapperDisplay[]
      };

      mockDialog.open.and.returnValue({
        afterClosed: () => of({ action: BulkActionMenuAction.ARCHIVE, data: event.data })
      } as unknown as ReturnType<typeof mockDialog.open>);

      const bulkActionArchiveSpy = spyOn(
        component as unknown as { bulkActionArchive: jasmine.Spy },
        'bulkActionArchive'
      );

      component.bulkActionClicked(event);

      expect(bulkActionArchiveSpy).toHaveBeenCalledWith(event.data, true);
    });

    it('should call bulkActionDelete when DELETE dialog is confirmed', () => {
      const event = {
        menuItem: { label: 'Delete', action: BulkActionMenuAction.DELETE },
        data: [{ taskWrapperId: 1, displayName: 'Task 1' }] as JTaskWrapperDisplay[]
      };

      mockDialog.open.and.returnValue({
        afterClosed: () => of({ action: BulkActionMenuAction.DELETE, data: event.data })
      } as unknown as ReturnType<typeof mockDialog.open>);

      const bulkActionDeleteSpy = spyOn(component as unknown as { bulkActionDelete: jasmine.Spy }, 'bulkActionDelete');

      component.bulkActionClicked(event);

      expect(bulkActionDeleteSpy).toHaveBeenCalledWith(event.data);
    });

    it('should open delete dialog for DELETE action', () => {
      const event = {
        menuItem: { label: 'Delete', action: BulkActionMenuAction.DELETE },
        data: [{ taskType: TaskType.TASK, displayName: 'Task 1' }] as JTaskWrapperDisplay[]
      };

      component.bulkActionClicked(event);

      expect(mockDialog.open).toHaveBeenCalled();
    });
  });

  describe('openDialog', () => {
    it('should open dialog with provided data', () => {
      mockDialog.open.and.returnValue({
        afterClosed: () => of(null)
      } as unknown as ReturnType<typeof mockDialog.open>);

      component.openDialog({
        rows: [{ taskName: 'Test' }] as JTaskWrapperDisplay[],
        title: 'Test Title',
        icon: 'warning',
        body: 'Test body',
        warn: true,
        action: RowActionMenuAction.DELETE
      });

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should subscribe to afterClosed and call rowActionDelete for DELETE action', () => {
      mockDialog.open.and.returnValue({
        afterClosed: () => of({ action: RowActionMenuAction.DELETE, data: [{ id: 1 }] })
      } as unknown as ReturnType<typeof mockDialog.open>);

      component.openDialog({
        rows: [{ id: 1 }] as JTaskWrapperDisplay[],
        title: 'Delete',
        action: RowActionMenuAction.DELETE
      });

      expect(mockGlobalService.delete).toHaveBeenCalled();
      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('Successfully deleted task!');
    });

    it('should call bulkActionArchive for ARCHIVE action', () => {
      mockDialog.open.and.returnValue({
        afterClosed: () =>
          of({
            action: BulkActionMenuAction.ARCHIVE,
            data: [{ taskType: TaskType.TASK, taskId: 1 }]
          })
      } as unknown as ReturnType<typeof mockDialog.open>);

      component.openDialog({
        rows: [{ taskType: TaskType.TASK, taskId: 1 }] as JTaskWrapperDisplay[],
        title: 'Archive',
        action: BulkActionMenuAction.ARCHIVE
      });

      expect(mockGlobalService.bulkUpdate).toHaveBeenCalled();
      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('Successfully archived tasks!');
    });

    it('should call gs.bulkUpdate for TASKS_WRAPPER when archiving a SUPERTASK', () => {
      mockDialog.open.and.returnValue({
        afterClosed: () =>
          of({
            action: BulkActionMenuAction.ARCHIVE,
            data: [{ taskType: TaskType.SUPERTASK, taskWrapperId: 10 }]
          })
      } as unknown as ReturnType<typeof mockDialog.open>);

      component.openDialog({
        rows: [{ taskType: TaskType.SUPERTASK, taskWrapperId: 10 }] as JTaskWrapperDisplay[],
        title: 'Archive',
        action: BulkActionMenuAction.ARCHIVE
      });

      expect(mockGlobalService.bulkUpdate).toHaveBeenCalledWith(SERV.TASKS_WRAPPER, jasmine.any(Array), {
        isArchived: true
      });
      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('Successfully archived tasks!');
    });

    it('should call bulkActionDelete for bulk DELETE action', () => {
      mockDialog.open.and.returnValue({
        afterClosed: () =>
          of({
            action: BulkActionMenuAction.DELETE,
            data: [{ taskWrapperId: 1 }]
          })
      } as unknown as ReturnType<typeof mockDialog.open>);

      component.openDialog({
        rows: [{ taskWrapperId: 1 }] as JTaskWrapperDisplay[],
        title: 'Delete',
        action: BulkActionMenuAction.DELETE
      });

      expect(mockGlobalService.bulkDelete).toHaveBeenCalled();
      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('Successfully deleted task!');
    });

    it('should not call action if result is falsy', () => {
      mockDialog.open.and.returnValue({
        afterClosed: () => of(null)
      } as unknown as ReturnType<typeof mockDialog.open>);

      component.openDialog({
        rows: [{ id: 1 }] as JTaskWrapperDisplay[],
        title: 'Delete',
        action: RowActionMenuAction.DELETE
      });

      expect(mockGlobalService.delete).not.toHaveBeenCalled();
    });
  });

  describe('updateTaskWrapperIsArchived', () => {
    it('should call gs.update with TASKS_WRAPPER endpoint when archiving', () => {
      (
        component as unknown as { updateTaskWrapperIsArchived: (id: number, b: boolean) => void }
      ).updateTaskWrapperIsArchived(456, true);

      expect(mockGlobalService.update).toHaveBeenCalledWith(SERV.TASKS_WRAPPER, 456, { isArchived: true });
    });

    it('should call gs.update with TASKS_WRAPPER endpoint when unarchiving', () => {
      (
        component as unknown as { updateTaskWrapperIsArchived: (id: number, b: boolean) => void }
      ).updateTaskWrapperIsArchived(456, false);

      expect(mockGlobalService.update).toHaveBeenCalledWith(SERV.TASKS_WRAPPER, 456, { isArchived: false });
    });

    it('should show "Successfully archived supertask!" on archive success', () => {
      (
        component as unknown as { updateTaskWrapperIsArchived: (id: number, b: boolean) => void }
      ).updateTaskWrapperIsArchived(456, true);

      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('Successfully archived supertask!');
    });

    it('should show "Successfully unarchived supertask!" on unarchive success', () => {
      (
        component as unknown as { updateTaskWrapperIsArchived: (id: number, b: boolean) => void }
      ).updateTaskWrapperIsArchived(456, false);

      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('Successfully unarchived supertask!');
    });
  });

  describe('setIsArchived', () => {
    it('should call dataSource methods with correct parameters', () => {
      component.mockDataSource.reset.calls.reset();
      component.mockDataSource.setIsArchived.calls.reset();
      component.mockDataSource.loadAll.calls.reset();

      component.setIsArchived(true);

      expect(component.mockDataSource.reset).toHaveBeenCalledWith(true);
      expect(component.mockDataSource.setIsArchived).toHaveBeenCalledWith(true);
      expect(component.mockDataSource.loadAll).toHaveBeenCalled();
    });

    it('should update isArchived property', () => {
      component.isArchived = false;

      component.setIsArchived(true);

      expect(component.isArchived).toBe(true);
    });

    it('should handle false parameter', () => {
      component.isArchived = true;

      component.setIsArchived(false);

      expect(component.isArchived).toBe(false);
    });
  });

  describe('includeArchived input', () => {
    it('should default to false', () => {
      expect(component.includeArchived).toBe(false);
    });

    it('should pass null to dataSource when includeArchived is true', () => {
      component.mockDataSource.setIsArchived.calls.reset();
      component.includeArchived = true;
      component.isArchived = false;

      component.setIsArchived(false);

      expect(component.mockDataSource.setIsArchived).toHaveBeenCalledWith(null);
    });

    it('should pass false to dataSource when includeArchived is false', () => {
      component.mockDataSource.setIsArchived.calls.reset();
      component.includeArchived = false;
      component.isArchived = false;

      component.setIsArchived(false);

      expect(component.mockDataSource.setIsArchived).toHaveBeenCalledWith(false);
    });

    it('should pass true to dataSource when includeArchived is false and isArchived is true', () => {
      component.mockDataSource.setIsArchived.calls.reset();
      component.includeArchived = false;
      component.isArchived = true;

      component.setIsArchived(true);

      expect(component.mockDataSource.setIsArchived).toHaveBeenCalledWith(true);
    });
  });

  describe('filter', () => {
    it('should call dataSource.loadAll with filter when input has value', () => {
      component.selectedFilterColumn = { dataKey: 'name' } as unknown as HTTableColumn;
      component.mockDataSource.loadAll.calls.reset();

      component.filter('test');

      expect(component.mockDataSource.loadAll).toHaveBeenCalledWith({
        value: 'test',
        field: 'name',
        operator: jasmine.anything(),
        parent: undefined
      });
    });

    it('should call dataSource.loadAll without filter when input is empty', () => {
      component.selectedFilterColumn = { dataKey: 'name' } as unknown as HTTableColumn;
      component.mockDataSource.loadAll.calls.reset();

      component.filter('');

      expect(component.mockDataSource.loadAll).toHaveBeenCalledWith();
    });

    it('should filter the ID column by taskId while it sorts by taskWrapperId', () => {
      component.selectedFilterColumn = { id: TaskTableCol.ID, dataKey: 'taskWrapperId' } as unknown as HTTableColumn;
      component.mockDataSource.loadAll.calls.reset();

      component.filter('123');

      expect(component.mockDataSource.loadAll).toHaveBeenCalledWith({
        value: '123',
        field: 'taskId',
        operator: jasmine.anything(),
        parent: undefined
      });
    });

    it('should filter the hashlist column by hashlistName', () => {
      component.selectedFilterColumn = {
        id: TaskTableCol.HASHLISTS,
        dataKey: 'hashlistName'
      } as unknown as HTTableColumn;
      component.mockDataSource.loadAll.calls.reset();

      component.filter('123');

      expect(component.mockDataSource.loadAll).toHaveBeenCalledWith({
        value: '123',
        field: 'hashlistName',
        operator: jasmine.anything(),
        parent: undefined
      });
    });

    it('should pass parent from selectedFilterColumn to filter', () => {
      component.selectedFilterColumn = {
        dataKey: 'name',
        parent: 'accessGroup'
      } as unknown as HTTableColumn;
      component.mockDataSource.loadAll.calls.reset();

      component.filter('search');

      expect(component.mockDataSource.loadAll).toHaveBeenCalled();
    });
  });

  describe('handleBackendSqlFilter', () => {
    it('should call filter and setFilterQuery when event has value', () => {
      component.selectedFilterColumn = { dataKey: 'name' } as unknown as HTTableColumn;
      component.mockDataSource.setFilterQuery.calls.reset();
      const filterSpy = spyOn(component, 'filter');

      component.handleBackendSqlFilter('search term');

      expect(filterSpy).toHaveBeenCalledWith('search term');
      expect(component.mockDataSource.setFilterQuery).toHaveBeenCalled();
    });

    it('should call filter and setFilterQuery when event is empty', () => {
      component.selectedFilterColumn = { dataKey: 'name' } as unknown as HTTableColumn;
      component.mockDataSource.setFilterQuery.calls.reset();
      const filterSpy = spyOn(component, 'filter');

      component.handleBackendSqlFilter('');

      expect(filterSpy).toHaveBeenCalledWith('');
      expect(component.mockDataSource.setFilterQuery).toHaveBeenCalledWith({
        value: '',
        field: 'name',
        operator: jasmine.anything(),
        parent: undefined
      });
    });

    it('should set the filter query to taskId for the ID column', () => {
      component.selectedFilterColumn = { id: TaskTableCol.ID, dataKey: 'taskWrapperId' } as unknown as HTTableColumn;
      component.mockDataSource.setFilterQuery.calls.reset();
      spyOn(component, 'filter');

      component.handleBackendSqlFilter('123');

      expect(component.mockDataSource.setFilterQuery).toHaveBeenCalledWith({
        value: '123',
        field: 'taskId',
        operator: jasmine.anything(),
        parent: undefined
      });
    });
  });

  describe('renderStatusIcons', () => {
    it('should return pulsing icon for RUNNING status', () => {
      const wrapper = { status: TaskStatus.RUNNING } as JTaskWrapperDisplay;

      const icon = component.renderStatusIcons(wrapper);

      expect(icon.name).toBe('radio_button_checked');
      expect(icon.cls).toBe('pulsing-progress');
      expect(icon.tooltip).toBe('In Progress');
    });

    it('should return check icon for COMPLETED status', () => {
      const wrapper = { status: TaskStatus.COMPLETED } as JTaskWrapperDisplay;

      const icon = component.renderStatusIcons(wrapper);

      expect(icon.name).toBe('check_circle');
      expect(icon.cls).toBe('text-ok');
      expect(icon.tooltip).toBe('Completed');
    });

    it('should return waiting icon for IDLE status', () => {
      const wrapper = { status: TaskStatus.IDLE } as JTaskWrapperDisplay;

      const icon = component.renderStatusIcons(wrapper);

      expect(icon.name).toBe('schedule');
      expect(icon.cls).toBe('text-warning');
      expect(icon.tooltip).toBe('Waiting');
    });

    it('should return empty icon when status is undefined', () => {
      const wrapper = { status: undefined } as unknown as JTaskWrapperDisplay;

      const icon = component.renderStatusIcons(wrapper);

      expect(icon.name).toBe('');
    });
  });

  describe('editableSaved', () => {
    it('should call changePriority for CHANGE_PRIORITY action', () => {
      const editable = {
        data: { taskType: TaskType.TASK, taskId: 1 } as JTaskWrapperDisplay,
        value: '10',
        action: TaskTableEditableAction.CHANGE_PRIORITY
      };
      const changePrioritySpy = spyOn(component as unknown as { changePriority: jasmine.Spy }, 'changePriority');

      component.editableSaved(editable);

      expect(changePrioritySpy).toHaveBeenCalledWith(editable.data, editable.value);
    });

    it('should call changeMaxAgents for CHANGE_MAX_AGENTS action', () => {
      const editable = {
        data: { taskType: TaskType.TASK, taskId: 1 } as JTaskWrapperDisplay,
        value: '5',
        action: TaskTableEditableAction.CHANGE_MAX_AGENTS
      };
      const changeMaxAgentsSpy = spyOn(component as unknown as { changeMaxAgents: jasmine.Spy }, 'changeMaxAgents');

      component.editableSaved(editable);

      expect(changeMaxAgentsSpy).toHaveBeenCalledWith(editable.data, editable.value);
    });
  });

  describe('exportActionClicked', () => {
    it('should call exportService.handleExportAction with filtered columns based on displayedColumns', () => {
      component.tableColumns = [{ id: TaskTableCol.ID }, { id: TaskTableCol.NAME }];
      component.table.displayedColumns = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15'
      ];
      const event = {
        menuItem: { label: 'Export' },
        data: [{ id: 1, taskName: 'Test' }]
      } as ActionMenuEvent<JTaskWrapperDisplay[]>;

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        [{ id: TaskTableCol.ID }, { id: TaskTableCol.NAME }],
        TaskTableColumnLabel,
        'hashtopolis-tasks'
      );
    });

    it('should filter out columns not in displayedColumns', () => {
      component.tableColumns = [{ id: TaskTableCol.ID }, { id: TaskTableCol.NAME }, { id: TaskTableCol.STATUS }];
      component.table.displayedColumns = ['0'];
      const event = {
        menuItem: { label: 'Export' },
        data: [{ id: 1, taskName: 'Test' }]
      } as ActionMenuEvent<JTaskWrapperDisplay[]>;

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        [{ id: TaskTableCol.ID }],
        TaskTableColumnLabel,
        'hashtopolis-tasks'
      );
    });

    it('should pass all columns when all are displayed', () => {
      component.tableColumns = [{ id: TaskTableCol.ID }, { id: TaskTableCol.NAME }];
      component.table.displayedColumns = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14'
      ];
      const event = {
        menuItem: { label: 'Export' },
        data: [{ id: 1, taskName: 'Test' }]
      } as ActionMenuEvent<JTaskWrapperDisplay[]>;

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        [{ id: TaskTableCol.ID }, { id: TaskTableCol.NAME }],
        TaskTableColumnLabel,
        'hashtopolis-tasks'
      );
    });
  });

  describe('hashlistId setter', () => {
    it('should set _hashlistId when different value provided', () => {
      (component as unknown as { _hashlistId: number })._hashlistId = 0;

      component.hashlistId = 5;

      expect((component as unknown as { _hashlistId: number })._hashlistId).toBe(5);
    });

    it('should not set _hashlistId when same value provided', () => {
      (component as unknown as { _hashlistId: number })._hashlistId = 5;

      component.hashlistId = 5;

      expect((component as unknown as { _hashlistId: number })._hashlistId).toBe(5);
    });

    it('should return 0 when _hashlistId is undefined', () => {
      (component as unknown as { _hashlistId: number })._hashlistId = undefined as unknown as number;

      expect(component.hashlistId).toBe(0);
    });

    it('should return _hashlistId value when set', () => {
      (component as unknown as { _hashlistId: number })._hashlistId = 10;

      expect(component.hashlistId).toBe(10);
    });
  });

  describe('renderBoolIcon', () => {
    it('should return check icon for TASK with isSmall=true', () => {
      const wrapper = { taskType: TaskType.TASK, isSmall: true } as JTaskWrapperDisplay;

      const icon = (
        component as unknown as {
          renderBoolIcon: (w: JTaskWrapperDisplay, k: string) => { name: string; cls?: string };
        }
      ).renderBoolIcon(wrapper, 'isSmall');

      expect(icon.name).toBe('check');
      expect(icon.cls).toBe('text-ok');
    });

    it('should return empty icon for TASK with isSmall=false', () => {
      const wrapper = { taskType: TaskType.TASK, isSmall: false } as JTaskWrapperDisplay;

      const icon = (
        component as unknown as {
          renderBoolIcon: (w: JTaskWrapperDisplay, k: string) => { name: string; cls?: string };
        }
      ).renderBoolIcon(wrapper, 'isSmall');

      expect(icon.name).toBe('');
    });

    it('should return check icon for SUPERTASK with isSmall=true', () => {
      const wrapper = { taskType: TaskType.SUPERTASK, isSmall: true } as JTaskWrapperDisplay;

      const icon = (
        component as unknown as {
          renderBoolIcon: (w: JTaskWrapperDisplay, k: string) => { name: string; cls?: string };
        }
      ).renderBoolIcon(wrapper, 'isSmall');

      expect(icon.name).toBe('check');
    });
  });
});
