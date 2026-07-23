import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JTask, TaskStatus } from '@models/task.model';

import { ExportService } from '@services/export/export.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { TasksSupertasksTableComponent } from '@components/tables/tasks-supertasks-table/tasks-supertasks-table.component';
import {
  TasksSupertasksDataSourceTableCol,
  TasksSupertasksDataSourceTableColumnLabel
} from '@components/tables/tasks-supertasks-table/tasks-supertasks-table.constants';

class MockTasksSupertasksDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestTasksSupertasksTableComponent extends TasksSupertasksTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(TasksSupertasksDataSourceTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockTasksSupertasksDataSource() as unknown as typeof this.dataSource;
  }
}

describe('TasksSupertasksTableComponent', () => {
  let component: TestTasksSupertasksTableComponent;
  let fixture: ComponentFixture<TestTasksSupertasksTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestTasksSupertasksTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestTasksSupertasksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for tasks/supertasks', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });

    it('should include AGENTS, STATUS and SPEED columns', () => {
      const ids = component.tableColumns.map((c) => c.id);
      expect(ids).toContain(TasksSupertasksDataSourceTableCol.AGENTS);
      expect(ids).toContain(TasksSupertasksDataSourceTableCol.STATUS);
      expect(ids).toContain(TasksSupertasksDataSourceTableCol.SPEED);
    });

    it('should render AGENTS using totalAssignedAgents, then chunk agents length, then 0', () => {
      const agentsColumn = component.tableColumns.find(
        (c) => c.id === TasksSupertasksDataSourceTableCol.AGENTS
      ) as HTTableColumn;

      const withAssignedAgents = { totalAssignedAgents: 4 } as unknown as JTask;
      const withChunkFallback = { totalAssignedAgents: undefined, chunkData: { agents: [10, 11] } } as unknown as JTask;
      const withNothing = {} as unknown as JTask;

      expect(agentsColumn.render?.(withAssignedAgents) as string).toContain('4');
      expect(agentsColumn.render?.(withChunkFallback) as string).toContain('2');
      expect(agentsColumn.render?.(withNothing) as string).toContain('0');
    });

    it('should render STATUS as an icon reflecting the task status', () => {
      const statusColumn = component.tableColumns.find(
        (c) => c.id === TasksSupertasksDataSourceTableCol.STATUS
      ) as HTTableColumn;

      const runningTask = { status: TaskStatus.RUNNING } as unknown as JTask;
      const idleTask = { status: TaskStatus.IDLE } as unknown as JTask;
      const skippedTask = { status: TaskStatus.SKIPPED } as unknown as JTask;
      const completedTask = { status: TaskStatus.COMPLETED } as unknown as JTask;

      expect(statusColumn.icon?.(runningTask)?.name).toBe('radio_button_checked');
      expect(statusColumn.icon?.(idleTask)?.name).toBe('schedule');
      expect(statusColumn.icon?.(skippedTask)?.name).toBe('fast_forward');
      expect(statusColumn.icon?.(completedTask)?.name).toBe('check_circle');
    });

    it('should render SPEED from chunk fallback when currentSpeed is missing', () => {
      const speedColumn = component.tableColumns.find(
        (c) => c.id === TasksSupertasksDataSourceTableCol.SPEED
      ) as HTTableColumn;

      const speedFallbackTask = { currentSpeed: undefined, chunkData: { speed: 13000 } } as unknown as JTask;

      expect(speedColumn.render?.(speedFallbackTask) as string).toContain('13');
      expect(speedColumn.render?.(speedFallbackTask) as string).toContain('kH/s');
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1, type: 'tasks' }] as JTask[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JTask[]>;
      component.table.displayedColumns = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        TasksSupertasksDataSourceTableColumnLabel,
        'hashtopolis-tasks-supertasks'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items = [
        { id: 1, type: 'tasks' },
        { id: 2, type: 'tasks' }
      ] as JTask[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JTask[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        TasksSupertasksDataSourceTableColumnLabel,
        'hashtopolis-tasks-supertasks'
      );
    });
  });
});
