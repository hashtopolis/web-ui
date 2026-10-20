import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JHash } from '@models/hash.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { CracksTableComponent } from '@components/tables/cracks-table/cracks-table.component';
import { CracksTableColumnLabel } from '@components/tables/cracks-table/cracks-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { CracksDataSource } from '@datasources/cracks.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockCracksDataSource {
  loadAll() {
    return Promise.resolve(undefined);
  }
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestCracksTableComponent extends CracksTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(CracksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockCracksDataSource() as unknown as CracksDataSource;
  }
}

describe('CracksTableComponent', () => {
  let component: TestCracksTableComponent;
  let fixture: ComponentFixture<TestCracksTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestCracksTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestCracksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as unknown as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose exactly seven columns', () => {
      expect(component.tableColumns.length).toBe(7);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1 }] as JHash[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHash[]>;
      component.table.displayedColumns = ['1', '2', '3', '5', '6', '7', '8'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        CracksTableColumnLabel,
        'hashtopolis-cracks'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['1', '2'];
      const items = [{ id: 1 }, { id: 2 }] as JHash[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHash[]>;

      component.exportActionClicked(event);

      const visibleColumnIds = [1, 2];
      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => visibleColumnIds.includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        CracksTableColumnLabel,
        'hashtopolis-cracks'
      );
    });
  });
});
