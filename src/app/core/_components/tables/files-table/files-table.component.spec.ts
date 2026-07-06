import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JFile } from '@models/file.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { FilesTableComponent } from '@components/tables/files-table/files-table.component';
import { FilesTableColumnLabel } from '@components/tables/files-table/files-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { FilesDataSource } from '@datasources/files.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockFilesDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestFilesTableComponent extends FilesTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(FilesTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockFilesDataSource() as unknown as FilesDataSource;
  }
}

describe('FilesTableComponent', () => {
  let component: TestFilesTableComponent;
  let fixture: ComponentFixture<TestFilesTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestFilesTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestFilesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for files', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      component.table.displayedColumns = component.tableColumns.map((col) => col.id.toString());
      const items = [{ id: 1 }] as JFile[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JFile[]>;

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        FilesTableColumnLabel,
        'hashtopolis-files'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items = [{ id: 1 }, { id: 2 }] as JFile[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JFile[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        FilesTableColumnLabel,
        'hashtopolis-files'
      );
    });
  });
});
