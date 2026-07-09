import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JHealthCheck } from '@models/health-check.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HealthChecksTableComponent } from '@components/tables/health-checks-table/health-checks-table.component';
import {
  HealthChecksTableCol,
  HealthChecksTableColumnLabel
} from '@components/tables/health-checks-table/health-checks-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { HealthChecksDataSource } from '@datasources/health-checks.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockHealthChecksDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestHealthChecksTableComponent extends HealthChecksTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(HealthChecksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockHealthChecksDataSource() as unknown as HealthChecksDataSource;
  }
}

describe('HealthChecksTableComponent', () => {
  let component: TestHealthChecksTableComponent;
  let fixture: ComponentFixture<TestHealthChecksTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestHealthChecksTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHealthChecksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as unknown as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose exactly four columns', () => {
      expect(component.tableColumns.length).toBe(4);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1 }] as JHealthCheck[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHealthCheck[]>;
      component.table.displayedColumns = [
        String(HealthChecksTableCol.ID),
        String(HealthChecksTableCol.CREATED),
        String(HealthChecksTableCol.TYPE),
        String(HealthChecksTableCol.STATUS)
      ];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        HealthChecksTableColumnLabel,
        'hashtopolis-health-checks'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = [String(HealthChecksTableCol.ID), String(HealthChecksTableCol.CREATED)];
      const items = [{ id: 1 }, { id: 2 }] as JHealthCheck[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHealthCheck[]>;

      component.exportActionClicked(event);

      const visibleColumnIds = [HealthChecksTableCol.ID, HealthChecksTableCol.CREATED];
      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => visibleColumnIds.includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        HealthChecksTableColumnLabel,
        'hashtopolis-health-checks'
      );
    });
  });
});
