import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JPreprocessor } from '@models/preprocessor.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { PreprocessorsTableComponent } from '@components/tables/preprocessors-table/preprocessors-table.component';
import { PreprocessorsTableColumnLabel } from '@components/tables/preprocessors-table/preprocessors-table.constants';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockPreprocessorsDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestPreprocessorsTableComponent extends PreprocessorsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(PreprocessorsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockPreprocessorsDataSource() as unknown as typeof this.dataSource;
  }
}

describe('PreprocessorsTableComponent', () => {
  let component: TestPreprocessorsTableComponent;
  let fixture: ComponentFixture<TestPreprocessorsTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestPreprocessorsTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestPreprocessorsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for preprocessors', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1 }] as JPreprocessor[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JPreprocessor[]>;
      component.table.displayedColumns = ['0', '1'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        PreprocessorsTableColumnLabel,
        'hashtopolis-preprocessors'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0'];
      const items = [{ id: 1 }, { id: 2 }] as JPreprocessor[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JPreprocessor[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        PreprocessorsTableColumnLabel,
        'hashtopolis-preprocessors'
      );
    });
  });
});
