import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JAgentErrors } from '@models/agent-errors.model';
import { BaseModel } from '@models/base.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { AgentErrorTableComponent } from '@components/tables/agent-error-table/agent-error-table.component';
import { AgentErrorTableColumnLabel } from '@components/tables/agent-error-table/agent-error-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { AgentErrorDatasource } from '@datasources/agent-error.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockAgentErrorDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestAgentErrorTableComponent extends AgentErrorTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(AgentErrorTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockAgentErrorDataSource() as unknown as AgentErrorDatasource;
  }
}

describe('AgentErrorTableComponent', () => {
  let component: TestAgentErrorTableComponent;
  let fixture: ComponentFixture<TestAgentErrorTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestAgentErrorTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestAgentErrorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for agent errors', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1 }] as JAgentErrors[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgentErrors[]>;
      component.table.displayedColumns = ['0', '1', '2', '3', '4', '5'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        AgentErrorTableColumnLabel,
        'hashtopolis-task-errors'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items = [{ id: 1 }, { id: 2 }] as JAgentErrors[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgentErrors[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        AgentErrorTableColumnLabel,
        'hashtopolis-task-errors'
      );
    });
  });
});
