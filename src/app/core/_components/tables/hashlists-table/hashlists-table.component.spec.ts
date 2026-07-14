import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { BaseModel } from '@models/base.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { HashlistsTableComponent } from '@components/tables/hashlists-table/hashlists-table.component';
import {
  HashlistsTableCol,
  HashlistsTableColumnLabel
} from '@components/tables/hashlists-table/hashlists-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { JHashlist } from '@src/app/core/_models/hashlist.model';
import { ExportService } from '@src/app/core/_services/export/export.service';
import { GlobalService } from '@src/app/core/_services/main.service';

class MockDataSource {
  loadAll = jasmine.createSpy('loadAll');
  setColumns = jasmine.createSpy('setColumns');
  clearFilter = jasmine.createSpy('clearFilter');
  reload = jasmine.createSpy('reload');
  setIsArchived = jasmine.createSpy('setIsArchived');
  reset = jasmine.createSpy('reset');
  setSuperHashListID = jasmine.createSpy('setSuperHashListID');
  filterError$ = { subscribe: jasmine.createSpy('subscribe') };
}

class TestHashlistsTableComponent extends HashlistsTableComponent {
  mockDataSource = new MockDataSource();

  override ngOnInit(): void {
    this.setColumnLabels(HashlistsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = this.mockDataSource as unknown as typeof this.dataSource;
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setIsArchived(this.isArchived);

    if (this.shashlistId) {
      this.dataSource.setSuperHashListID(this.shashlistId);
    }

    this.setupFilterErrorSubscription(this.dataSource);
  }

  override ngAfterViewInit(): void {}

  override ngOnDestroy(): void {
    this.subscriptions = [];
  }
}

describe('HashlistsTableComponent', () => {
  let component: TestHashlistsTableComponent;
  let fixture: ComponentFixture<TestHashlistsTableComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    mockGlobalService = jasmine.createSpyObj('GlobalService', [
      'bulkUpdate',
      'bulkDelete',
      'delete',
      'update',
      'chelper'
    ]);
    mockGlobalService.update.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.update>);
    mockGlobalService.chelper.and.returnValue(of({}).pipe() as unknown as ReturnType<typeof mockGlobalService.chelper>);
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);

    await TestBed.configureTestingModule({
      declarations: [TestHashlistsTableComponent],
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDialogModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHashlistsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = { reload: () => {} } as HTTableComponent<BaseModel>;
    (component as unknown as { table: unknown }).table = {
      clearFilterError: jasmine.createSpy('clearFilterError'),
      reload: jasmine.createSpy('reload')
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getColumns', () => {
    it('should return columns including HASH_COUNT, NAME, CRACKED, FORMAT', () => {
      const columns = component.getColumns();
      const columnIds = columns.map((col) => col.id);

      expect(columnIds).toContain(HashlistsTableCol.HASH_COUNT);
      expect(columnIds).toContain(HashlistsTableCol.NAME);
      expect(columnIds).toContain(HashlistsTableCol.CRACKED);
      expect(columnIds).toContain(HashlistsTableCol.FORMAT);
    });

    it('should include ID column with correct properties', () => {
      const columns = component.getColumns();
      const idColumn = columns.find((col) => col.id === HashlistsTableCol.ID);

      expect(idColumn).toBeDefined();
      expect(idColumn?.isSortable).toBe(true);
      expect(idColumn?.isSearchable).toBe(true);
    });

    it('should include NAME column with routerLink function', () => {
      const columns = component.getColumns();
      const nameColumn = columns.find((col) => col.id === HashlistsTableCol.NAME);

      expect(nameColumn).toBeDefined();
      expect(nameColumn?.routerLink).toBeDefined();
      expect(typeof nameColumn?.routerLink).toBe('function');
    });

    it('should include FORMAT column with render function', () => {
      const columns = component.getColumns();
      const formatColumn = columns.find((col) => col.id === HashlistsTableCol.FORMAT);

      expect(formatColumn).toBeDefined();
      expect(formatColumn?.render).toBeDefined();
    });

    it('should not include HASHTYPE column when shashlistId is set', () => {
      component.shashlistId = 1;
      const columns = component.getColumns();
      const hashTypeColumn = columns.find((col) => col.id === HashlistsTableCol.HASHTYPE);

      expect(hashTypeColumn).toBeUndefined();
    });

    it('should include HASHTYPE column when shashlistId is not set', () => {
      component.shashlistId = 0;
      const columns = component.getColumns();
      const hashTypeColumn = columns.find((col) => col.id === HashlistsTableCol.HASHTYPE);

      expect(hashTypeColumn).toBeDefined();
    });
  });

  describe('rowActionClicked', () => {
    const testHashlist = { id: 5, name: 'Test Hashlist' } as JHashlist;

    beforeEach(() => {
      component.shashlistId = 0;
      mockDialog.open.and.returnValue({
        afterClosed: () => of(null)
      } as unknown as ReturnType<typeof mockDialog.open>);
    });

    it('should open dialog for DELETE action', () => {
      const event = {
        menuItem: { label: 'Delete', action: RowActionMenuAction.DELETE },
        data: testHashlist
      };

      component.rowActionClicked(event);

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should navigate to hashlist edit page for EDIT action', () => {
      const event = {
        menuItem: { label: 'Edit', action: RowActionMenuAction.EDIT },
        data: testHashlist
      };

      component.rowActionClicked(event);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/hashlists', 'hashlist', 5, 'edit']);
    });

    it('should call rowActionExport for EXPORT action', () => {
      const event = {
        menuItem: { label: 'Export', action: RowActionMenuAction.EXPORT },
        data: testHashlist
      };

      component.rowActionClicked(event);

      expect(mockGlobalService.chelper).toHaveBeenCalled();
    });

    it('should navigate to import cracked hashes page for IMPORT action', () => {
      const event = {
        menuItem: { label: 'Import', action: RowActionMenuAction.IMPORT },
        data: testHashlist
      };

      component.rowActionClicked(event);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/hashlists/hashlist/5/import-cracked-hashes']);
    });

    it('should call rowActionArchive for ARCHIVE action', () => {
      const event = {
        menuItem: { label: 'Archive', action: RowActionMenuAction.ARCHIVE },
        data: testHashlist
      };

      component.rowActionClicked(event);

      expect(mockGlobalService.update).toHaveBeenCalled();
    });

    it('should call rowActionUnarchive for UNARCHIVE action', () => {
      const event = {
        menuItem: { label: 'Unarchive', action: RowActionMenuAction.UNARCHIVE },
        data: testHashlist
      };

      component.rowActionClicked(event);

      expect(mockGlobalService.update).toHaveBeenCalled();
    });
  });

  describe('bulkActionClicked', () => {
    beforeEach(() => {
      component.shashlistId = 0;
      mockDialog.open.and.returnValue({
        afterClosed: () => of(null)
      } as unknown as ReturnType<typeof mockDialog.open>);
    });

    it('should open dialog for ARCHIVE action', () => {
      const event = {
        menuItem: { label: 'Archive', action: BulkActionMenuAction.ARCHIVE },
        data: [{ id: 1, name: 'Test' }] as JHashlist[]
      };

      component.bulkActionClicked(event);

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should open dialog for DELETE action', () => {
      const event = {
        menuItem: { label: 'Delete', action: BulkActionMenuAction.DELETE },
        data: [{ id: 1, name: 'Test' }] as JHashlist[]
      };

      component.bulkActionClicked(event);

      expect(mockDialog.open).toHaveBeenCalled();
    });
  });

  describe('openDialog', () => {
    beforeEach(() => {
      mockDialog.open.and.returnValue({
        afterClosed: () => of(null)
      } as unknown as ReturnType<typeof mockDialog.open>);
    });

    it('should open dialog with correct configuration', () => {
      component.openDialog({
        rows: [{ id: 1 }] as JHashlist[],
        title: 'Test Title',
        icon: 'warning',
        body: 'Test body',
        warn: true,
        action: RowActionMenuAction.DELETE
      });

      expect(mockDialog.open).toHaveBeenCalledWith(jasmine.anything(), {
        data: jasmine.any(Object),
        width: '450px'
      });
    });
  });

  describe('exportActionClicked', () => {
    it('should call exportService.handleExportAction', () => {
      component.tableColumns = [];
      component.table.displayedColumns = ['0', '1', '2', '3', '4', '5', '6'];
      const event = {
        menuItem: { label: 'Export' },
        data: [{ id: 1, name: 'Test' }]
      } as ActionMenuEvent<JHashlist[]>;

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        component.tableColumns,
        HashlistsTableColumnLabel,
        'hashtopolis-hashlists'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const event = {
        menuItem: { label: 'Export' },
        data: [{ id: 1 }, { id: 2 }]
      } as ActionMenuEvent<JHashlist[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        HashlistsTableColumnLabel,
        'hashtopolis-hashlists'
      );
    });
  });

  describe('setIsArchived', () => {
    it('should call dataSource methods with correct parameters', () => {
      component.mockDataSource.reset.calls.reset();
      component.mockDataSource.setIsArchived.calls.reset();
      component.mockDataSource.loadAll.calls.reset();

      component.setIsArchived(true);

      expect(component.mockDataSource.reset).toHaveBeenCalledWith(true);
      expect(component.mockDataSource.setIsArchived).toHaveBeenCalledWith(true);
      expect(component.mockDataSource.loadAll).toHaveBeenCalled();
    });

    it('should update isArchived property', () => {
      component.isArchived = false;

      component.setIsArchived(true);

      expect(component.isArchived).toBe(true);
    });
  });

  describe('filter', () => {
    it('should call dataSource.loadAll with filter when input has value', () => {
      component.selectedFilterColumn = { dataKey: 'name' } as HTTableColumn;

      component.filter('test');

      expect(component.mockDataSource.loadAll).toHaveBeenCalledWith({
        value: 'test',
        field: 'name',
        operator: jasmine.anything(),
        parent: undefined
      });
    });

    it('should call dataSource.loadAll without filter when input is empty', () => {
      component.selectedFilterColumn = null as unknown as HTTableColumn;

      component.filter('');

      expect(component.mockDataSource.loadAll).toHaveBeenCalledWith();
    });

    it('should call dataSource.loadAll without filter when input is whitespace only', () => {
      component.selectedFilterColumn = { dataKey: 'name' } as HTTableColumn;

      component.filter('   ');

      expect(component.mockDataSource.loadAll).toHaveBeenCalledWith({
        value: '   ',
        field: 'name',
        operator: jasmine.anything(),
        parent: undefined
      });
    });
  });

  describe('handleBackendSqlFilter', () => {
    it('should call filter when event has value', () => {
      component.selectedFilterColumn = { dataKey: 'name' } as HTTableColumn;
      const filterSpy = spyOn(component, 'filter');

      component.handleBackendSqlFilter('search term');

      expect(filterSpy).toHaveBeenCalledWith('search term');
      expect(component.table.clearFilterError).toHaveBeenCalled();
    });

    it('should call dataSource.clearFilter when event is empty', () => {
      component.handleBackendSqlFilter('');

      expect(component.mockDataSource.clearFilter).toHaveBeenCalled();
    });

    it('should call dataSource.clearFilter when event is whitespace only', () => {
      component.handleBackendSqlFilter('   ');

      expect(component.mockDataSource.clearFilter).toHaveBeenCalled();
    });
  });
});
