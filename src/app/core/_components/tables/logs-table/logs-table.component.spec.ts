import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JLog } from '@models/log.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { LogsTableComponent } from '@components/tables/logs-table/logs-table.component';
import { LogsTableCol, LogsTableColumnLabel } from '@components/tables/logs-table/logs-table.constants';

import { LogsDataSource } from '@datasources/logs.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockLogsDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestLogsTableComponent extends LogsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(LogsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockLogsDataSource() as unknown as LogsDataSource;
  }
}

describe('LogsTableComponent', () => {
  let component: TestLogsTableComponent;
  let fixture: ComponentFixture<TestLogsTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestLogsTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestLogsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for logs', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items: JLog[] = [
        { id: 1, type: 'log', level: 'information', issuer: 'API', issuerId: '1', message: 'test', time: 0 }
      ];
      const event: ActionMenuEvent<JLog[]> = { data: items, menuItem: { action: 'excel', label: '' } };
      component.table.displayedColumns = component.tableColumns.map((col) => col.id.toString());

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        LogsTableColumnLabel,
        'hashtopolis-logs'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      const visibleIds = [LogsTableCol.ID, LogsTableCol.TIME];
      component.table.displayedColumns = visibleIds.map(String);
      const items: JLog[] = [
        { id: 1, type: 'log', level: 'information', issuer: 'API', issuerId: '1', message: 'test', time: 0 },
        { id: 2, type: 'log', level: 'error', issuer: 'User', issuerId: '2', message: 'error', time: 0 }
      ];
      const event: ActionMenuEvent<JLog[]> = { data: items, menuItem: { action: 'excel', label: '' } };

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => visibleIds.includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        LogsTableColumnLabel,
        'hashtopolis-logs'
      );
    });
  });
});
