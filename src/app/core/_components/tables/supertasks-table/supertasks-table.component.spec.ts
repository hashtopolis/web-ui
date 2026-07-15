import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JSuperTask } from '@models/supertask.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { SuperTasksTableComponent } from '@components/tables/supertasks-table/supertasks-table.component';
import {
  SupertasksTableCol,
  SupertasksTableColumnLabel
} from '@components/tables/supertasks-table/supertasks-table.constants';

import { SuperTasksDataSource } from '@datasources/supertasks.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockSuperTasksDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestSuperTasksTableComponent extends SuperTasksTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(SupertasksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockSuperTasksDataSource() as unknown as SuperTasksDataSource;
  }
}

describe('SuperTasksTableComponent', () => {
  let component: TestSuperTasksTableComponent;
  let fixture: ComponentFixture<TestSuperTasksTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestSuperTasksTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestSuperTasksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for super tasks', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items: JSuperTask[] = [{ id: 1, type: 'supertask', supertaskName: 'test' }];
      const event: ActionMenuEvent<JSuperTask[]> = { data: items, menuItem: { action: 'excel', label: '' } };
      component.table.displayedColumns = component.tableColumns.map((col) => String(col.id));

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        SupertasksTableColumnLabel,
        'hashtopolis-supertasks'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      const visibleIds = [SupertasksTableCol.ID, SupertasksTableCol.NAME];
      component.table.displayedColumns = visibleIds.map(String);
      const items: JSuperTask[] = [
        { id: 1, type: 'supertask', supertaskName: 'test1' },
        { id: 2, type: 'supertask', supertaskName: 'test2' }
      ];
      const event: ActionMenuEvent<JSuperTask[]> = { data: items, menuItem: { action: 'excel', label: '' } };

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => visibleIds.includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        SupertasksTableColumnLabel,
        'hashtopolis-supertasks'
      );
    });
  });
});
