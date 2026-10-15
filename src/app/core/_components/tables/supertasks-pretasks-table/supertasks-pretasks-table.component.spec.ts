import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JPretask } from '@models/pretask.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { SuperTasksPretasksTableComponent } from '@components/tables/supertasks-pretasks-table/supertasks-pretasks-table.component';
import {
  SupertasksPretasksTableCol,
  SupertasksPretasksTableColumnLabel
} from '@components/tables/supertasks-pretasks-table/supertasks-pretasks-table.constants';

import { SuperTasksPretasksDataSource } from '@datasources/supertasks-pretasks.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockSuperTasksPretasksDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestSuperTasksPretasksTableComponent extends SuperTasksPretasksTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(SupertasksPretasksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockSuperTasksPretasksDataSource() as unknown as SuperTasksPretasksDataSource;
  }
}

function createMockPretask(id: number): JPretask {
  return {
    id,
    type: 'pretask',
    attackCmd: '',
    chunkTime: 0,
    color: '',
    crackerBinaryTypeId: 0,
    isCpuTask: false,
    isMaskImport: false,
    isSmall: false,
    maxAgents: 0,
    priority: 0,
    statusTimer: 0,
    taskName: `Pretask ${id}`,
    useNewBench: false
  };
}

describe('SuperTasksPretasksTableComponent', () => {
  let component: TestSuperTasksPretasksTableComponent;
  let fixture: ComponentFixture<TestSuperTasksPretasksTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestSuperTasksPretasksTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestSuperTasksPretasksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for super tasks/pretasks', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [createMockPretask(1)];
      const event: ActionMenuEvent<JPretask[]> = { data: items, menuItem: { action: 'excel', label: '' } };
      component.table.displayedColumns = Object.values(SupertasksPretasksTableCol)
        .filter((v): v is number => typeof v === 'number')
        .map(String);

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        SupertasksPretasksTableColumnLabel,
        'hashtopolis-supertasks-pretasks'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      const visibleIds = [SupertasksPretasksTableCol.ID, SupertasksPretasksTableCol.NAME];
      component.table.displayedColumns = visibleIds.map(String);
      const items = [createMockPretask(1), createMockPretask(2)];
      const event: ActionMenuEvent<JPretask[]> = { data: items, menuItem: { action: 'excel', label: '' } };

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => visibleIds.includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        SupertasksPretasksTableColumnLabel,
        'hashtopolis-supertasks-pretasks'
      );
    });
  });
});
