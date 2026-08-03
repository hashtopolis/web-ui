import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { BaseModel } from '@models/base.model';
import { JFile } from '@models/file.model';

import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { FilesTableComponent } from '@components/tables/files-table/files-table.component';
import { FilesRowAction, FilesTableColumnLabel } from '@components/tables/files-table/files-table.constants';
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

  describe('rowActionClicked', () => {
    let gs: { update: jasmine.Spy; chelper: jasmine.Spy };

    beforeEach(() => {
      gs = component['gs'] as unknown as typeof gs;
      spyOn(gs, 'update').and.returnValue(of({}));
      spyOn(gs, 'chelper').and.returnValue(of({}));
      spyOn(component['alertService'], 'showSuccessMessage');
      spyOn(component, 'reload');
    });

    it('should set a non-secret file to secret', () => {
      const file = { id: 7, filename: 'a.txt', isSecret: false } as JFile;
      component.rowActionClicked({ data: file, menuItem: { action: FilesRowAction.TOGGLE_SECRET, label: '' } });

      expect(gs.update).toHaveBeenCalledWith(SERV.FILES, 7, { isSecret: true });
      expect(component.reload).toHaveBeenCalled();
    });

    it('should unset a secret file', () => {
      const file = { id: 7, filename: 'a.txt', isSecret: true } as JFile;
      component.rowActionClicked({ data: file, menuItem: { action: FilesRowAction.TOGGLE_SECRET, label: '' } });

      expect(gs.update).toHaveBeenCalledWith(SERV.FILES, 7, { isSecret: false });
    });

    it('should call the recountFileLines helper', () => {
      const file = { id: 7, filename: 'a.txt', isSecret: false } as JFile;
      component.rowActionClicked({ data: file, menuItem: { action: FilesRowAction.RECOUNT_LINES, label: '' } });

      expect(gs.chelper).toHaveBeenCalledWith(SERV.HELPER, 'recountFileLines', { fileId: 7 });
      expect(component.reload).toHaveBeenCalled();
    });

    it('should not update or recount on a plain edit action', () => {
      spyOn(component as unknown as { rowActionEdit: () => void }, 'rowActionEdit');
      const file = { id: 7, filename: 'a.txt', isSecret: false } as JFile;
      component.rowActionClicked({ data: file, menuItem: { action: RowActionMenuAction.EDIT, label: '' } });

      expect(gs.update).not.toHaveBeenCalled();
      expect(gs.chelper).not.toHaveBeenCalled();
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
