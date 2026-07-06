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

    it('should render AGENTS using activeAgents, then totalAssignedAgents, then chunk agents length', () => {
      const agentsColumn = component.tableColumns.find(
        (c) => c.id === TasksSupertasksDataSourceTableCol.AGENTS
      ) as HTTableColumn;

      const withActiveAgents = { activeAgents: 3 } as unknown as JTask;
      const withAssignedAgents = { activeAgents: undefined, totalAssignedAgents: 4 } as unknown as JTask;
      const withChunkFallback = { activeAgents: undefined, chunkData: { agents: [10, 11] } } as unknown as JTask;

      expect(agentsColumn.render?.(withActiveAgents) as string).toContain('3');
      expect(agentsColumn.render?.(withAssignedAgents) as string).toContain('4');
      expect(agentsColumn.render?.(withChunkFallback) as string).toContain('2');
    });

    it('should render STATUS as Active when running or when chunk speed is greater than 0', () => {
      const statusColumn = component.tableColumns.find(
        (c) => c.id === TasksSupertasksDataSourceTableCol.STATUS
      ) as HTTableColumn;

      const runningTask = { status: TaskStatus.RUNNING } as unknown as JTask;
      const speedFallbackTask = {
        status: undefined,
        currentSpeed: undefined,
        chunkData: { speed: 123 }
      } as unknown as JTask;

      expect(statusColumn.render?.(runningTask) as string).toContain('Active');
      expect(statusColumn.render?.(speedFallbackTask) as string).toContain('Active');
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
