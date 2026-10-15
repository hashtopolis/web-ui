import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JAgentBinary } from '@models/agent-binary.model';
import { BaseModel } from '@models/base.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { AgentBinariesTableComponent } from '@components/tables/agent-binaries-table/agent-binaries-table.component';
import {
  AgentBinariesTableCol,
  AgentBinariesTableColumnLabel
} from '@components/tables/agent-binaries-table/agent-binaries-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { AgentBinariesDataSource } from '@datasources/agent-binaries.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockAgentBinariesDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestAgentBinariesTableComponent extends AgentBinariesTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(AgentBinariesTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockAgentBinariesDataSource() as unknown as AgentBinariesDataSource;
  }
}

describe('AgentBinariesTableComponent', () => {
  let component: TestAgentBinariesTableComponent;
  let fixture: ComponentFixture<TestAgentBinariesTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestAgentBinariesTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestAgentBinariesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for agent binaries', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1 }] as JAgentBinary[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgentBinary[]>;
      component.table.displayedColumns = [
        AgentBinariesTableCol.ID + '',
        AgentBinariesTableCol.TYPE + '',
        AgentBinariesTableCol.OS + '',
        AgentBinariesTableCol.FILENAME + '',
        AgentBinariesTableCol.VERSION + '',
        AgentBinariesTableCol.UPDATE_TRACK + ''
      ];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        AgentBinariesTableColumnLabel,
        'hashtopolis-agent-binaries'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = [AgentBinariesTableCol.ID + '', AgentBinariesTableCol.TYPE + ''];
      const items = [{ id: 1 }, { id: 2 }] as JAgentBinary[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgentBinary[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        AgentBinariesTableColumnLabel,
        'hashtopolis-agent-binaries'
      );
    });
  });
});
