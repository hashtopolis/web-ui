import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JHealthCheckAgent } from '@models/health-check.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HealthCheckAgentsTableComponent } from '@components/tables/health-check-agents-table/health-check-agents-table.component';
import { HealthCheckAgentsTableColColumnLabel } from '@components/tables/health-check-agents-table/health-check-agents-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { HealthCheckAgentsDataSource } from '@datasources/health-check-agents.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockHealthCheckAgentsDataSource {
  loadAll() {}
  setColumns() {}
  setHealthCheckId() {}
  clearFilter() {}
  reload() {}
}

class TestHealthCheckAgentsTableComponent extends HealthCheckAgentsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(HealthCheckAgentsTableColColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockHealthCheckAgentsDataSource() as unknown as HealthCheckAgentsDataSource;
  }
}

describe('HealthCheckAgentsTableComponent', () => {
  let component: TestHealthCheckAgentsTableComponent;
  let fixture: ComponentFixture<TestHealthCheckAgentsTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestHealthCheckAgentsTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHealthCheckAgentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose exactly six columns', () => {
      const ids = component.tableColumns.map((c) => c.id);
      expect(ids.length).toBe(6);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1, agentName: 'A1' }] as unknown as JHealthCheckAgent[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHealthCheckAgent[]>;
      component.table.displayedColumns = ['0', '1', '2', '3', '4', '5'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        HealthCheckAgentsTableColColumnLabel,
        'hashtopolis-health-checks-view'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items = [{ id: 1 }, { id: 2 }] as unknown as JHealthCheckAgent[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHealthCheckAgent[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        HealthCheckAgentsTableColColumnLabel,
        'hashtopolis-health-checks-view'
      );
    });
  });
});
