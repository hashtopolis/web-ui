import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JTask } from '@models/task.model';

import { ExportService } from '@services/export/export.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { TasksSupertasksTableComponent } from '@components/tables/tasks-supertasks-table/tasks-supertasks-table.component';
import { TasksSupertasksDataSourceTableColumnLabel } from '@components/tables/tasks-supertasks-table/tasks-supertasks-table.constants';

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
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1, type: 'tasks' }] as JTask[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JTask[]>;
      component.table.displayedColumns = ['0', '1', '2', '3', '4', '5', '6'];

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
