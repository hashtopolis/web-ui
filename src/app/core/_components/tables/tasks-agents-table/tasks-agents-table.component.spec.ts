import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { TasksAgentsTableComponent } from '@components/tables/tasks-agents-table/tasks-agents-table.component';
import { TasksAgentsTableColumnLabel } from '@components/tables/tasks-agents-table/tasks-agents-table.constants';

import { AgentsDataSource } from '@datasources/agents.datasource';

import { JAgent } from '@src/app/core/_models/agent.model';
import { ExportService } from '@src/app/core/_services/export/export.service';

class MockTasksAgentsDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestTasksAgentsTableComponent extends TasksAgentsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(TasksAgentsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockTasksAgentsDataSource() as unknown as AgentsDataSource;
  }
}

describe('TasksAgentsTableComponent', () => {
  let component: TestTasksAgentsTableComponent;
  let fixture: ComponentFixture<TestTasksAgentsTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestTasksAgentsTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestTasksAgentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for tasks/agents', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1, agentName: 'A1' }] as JAgent[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgent[]>;
      component.table.displayedColumns = component.tableColumns.map((col) => col.id.toString());

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        TasksAgentsTableColumnLabel,
        'hashtopolis-agents'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items = [
        { id: 1, agentName: 'A1' },
        { id: 2, agentName: 'A2' }
      ] as JAgent[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgent[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        TasksAgentsTableColumnLabel,
        'hashtopolis-agents'
      );
    });
  });
});
