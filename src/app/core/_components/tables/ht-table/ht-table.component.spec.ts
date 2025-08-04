import { COL_ROW_ACTION, COL_SELECT, HTTableColumn } from './ht-table.models';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { BaseDataSource } from '@datasources/base.datasource';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { HTTableComponent } from './ht-table.component';
import { LocalStorageService } from '@services/storage/local-storage.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { of } from 'rxjs';

describe('HTTableComponent', () => {
  let component: HTTableComponent;
  let fixture: ComponentFixture<HTTableComponent>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService<any>>;
  let mockContextMenuService: jasmine.SpyObj<ContextMenuService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockDataSource: jasmine.SpyObj<BaseDataSource<any>>;
  let mockUISettings: jasmine.SpyObj<UISettingsUtilityClass>;

  beforeEach(async () => {
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['get', 'set']);
    mockContextMenuService = jasmine.createSpyObj('ContextMenuService', ['getHasContextMenu']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDataSource = jasmine.createSpyObj('BaseDataSource', [
      'filterData',
      'isSelected',
      'isAllSelected',
      'toggleAll',
      'hasSelected',
      'indeterminate',
      'toggleRow',
      'reload',
      'reset',
      'setPaginationConfig',
      'getOriginalData'
    ]);

    // Setup mockDataSource properties
    mockDataSource.filter = '';
/*     mockDataSource.sort = { _direction: 'asc' };
    mockDataSource.sortingColumn = { id: '1', direction: 'asc' }; */
    mockDataSource.pageSize = 25;
    mockDataSource.pageAfter = undefined;
    mockDataSource.pageBefore = undefined;
    mockDataSource.index = 0;
    mockDataSource.totalItems = 100;

    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatDialogModule, MatPaginatorModule, MatSortModule],
      declarations: [HTTableComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: LocalStorageService, useValue: mockLocalStorageService }
      ]
    }).compileComponents();

    // Mock UISettingsUtilityClass
    mockUISettings = jasmine.createSpyObj('UISettingsUtilityClass', ['getTableSettings', 'updateTableSettings']);
/*     mockUISettings.uiConfig = {
      tableSettings: {
        testTable: {
          page: 25,
          start: undefined,
          before: undefined,
          index: 0,
          totalItems: 100,
          search: '',
          order: { id: '1', direction: 'asc' },
          columns: [1, 2, 3]
        }
      }
    }; */
    mockUISettings.getTableSettings.and.returnValue([1, 2, 3]);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HTTableComponent);
    component = fixture.componentInstance;

    // Setup component input properties
    component.name = 'testTable';
    component.columnLabels = { 1: 'Column 1', 2: 'Column 2', 3: 'Column 3' };
    component.dataSource = mockDataSource;
/*     component.tableColumns = [
      { id: 1, label: 'Column 1', dataKey: 'col1', isSearchable: true },
      { id: 2, label: 'Column 2', dataKey: 'col2', isSearchable: false },
      { id: 3, label: 'Column 3', dataKey: 'col3', isSearchable: true }
    ] as HTTableColumn[]; */
    component.contextMenuService = mockContextMenuService;
/*     component.uiSettings = mockUISettings;
 */
    // Set up dialog return value
    mockDialog.open.and.returnValue({ afterClosed: () => of([1, 2]) } as any);

    // Mock context menu service behavior
    mockContextMenuService.getHasContextMenu.and.returnValue(true);
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

/*   it('should initialize filterable columns on ngOnInit', () => {
    component.ngOnInit();
    expect(component.filterableColumns.length).toBe(2);
    expect(component.filterableColumns[0].dataKey).toBe('col1');
    expect(component.filterableColumns[1].dataKey).toBe('col3');
  }); */

/*   it('should set displayed columns correctly with selectable and context menu', () => {
    component.isSelectable = true;
    component.setDisplayedColumns([1, 2, 3]);

    expect(component.displayedColumns).toContain(COL_SELECT + '');
    expect(component.displayedColumns).toContain('1');
    expect(component.displayedColumns).toContain('2');
    expect(component.displayedColumns).toContain('3');
    expect(component.displayedColumns).toContain(COL_ROW_ACTION + '');
  }); */

/*   it('should not add COL_SELECT if isSelectable is false', () => {
    component.isSelectable = false;
    component.setDisplayedColumns([1, 2, 3]);

    expect(component.displayedColumns).not.toContain(COL_SELECT + '');
    expect(component.displayedColumns).toContain('1');
  }); */
/* 
  it('should not add COL_ROW_ACTION if contextMenuService has no context menu', () => {
    mockContextMenuService.getHasContextMenu.and.returnValue(false);
    component.setDisplayedColumns([1, 2, 3]);

    expect(component.displayedColumns).not.toContain(COL_ROW_ACTION + '');
  }); */

/*   it('should apply filter and update settings', () => {
    component.filterFn = (item, filterValue) => true;
    component.applyFilter();

    expect(mockDataSource.filterData).toHaveBeenCalled();
    expect(mockUISettings.updateTableSettings).toHaveBeenCalled();
  }); */

/*   it('should clear filter correctly', () => {
    component.clearFilter();

    expect(mockDataSource.filter).toBe('');
    expect(mockDataSource.filterData).toHaveBeenCalled();
    expect(mockUISettings.updateTableSettings).toHaveBeenCalled();
  }); */

/*   it('should check if row is selected using dataSource', () => {
    const row = { id: 1 };
    mockDataSource.isSelected.and.returnValue(true);

    expect(component.isSelected(row)).toBeTrue();
    expect(mockDataSource.isSelected).toHaveBeenCalledWith(row);
  }); */

/*   it('should check if row is selected using isCmdFiles when available', () => {
    const row = { _id: 'file1' };
    component.isCmdFiles = ['file1', 'file2'];

    expect(component.isSelected(row)).toBeTrue();
  }); */

/*   it('should delegate isAllSelected to dataSource', () => {
    mockDataSource.isAllSelected.and.returnValue(true);
    expect(component.isAllSelected()).toBeTrue();
    expect(mockDataSource.isAllSelected).toHaveBeenCalled();
  }); */

/*   it('should delegate toggleAll to dataSource', () => {
    component.toggleAll();
    expect(mockDataSource.toggleAll).toHaveBeenCalled();
  }); */

/*   it('should delegate hasSelected to dataSource', () => {
    mockDataSource.hasSelected.and.returnValue(true);
    expect(component.hasSelected()).toBeTrue();
    expect(mockDataSource.hasSelected).toHaveBeenCalled();
  }); */

/*   it('should delegate indeterminate to dataSource', () => {
    mockDataSource.indeterminate.and.returnValue(true);
    expect(component.indeterminate()).toBeTrue();
    expect(mockDataSource.indeterminate).toHaveBeenCalled();
  }); */

/*   it('should toggle selection for a row if isSelectable is true', () => {
    const row = { id: 1 };
    component.isSelectable = true;
    component.toggleSelect(row);
    expect(mockDataSource.toggleRow).toHaveBeenCalledWith(row);
  }); */

/*   it('should not toggle selection if isSelectable is false', () => {
    const row = { id: 1 };
    component.isSelectable = false;
    component.toggleSelect(row);
    expect(mockDataSource.toggleRow).not.toHaveBeenCalled();
  }); */

/*   it('should open column selection dialog', fakeAsync(() => {
    component.openColumnSelectionDialog();

    expect(mockDialog.open).toHaveBeenCalled();
    tick();
    expect(mockUISettings.updateTableSettings).toHaveBeenCalledWith('testTable', { columns: [1, 2] });
  })); */

/*   it('should emit checkbox change event', () => {
    const row = { id: 1 };
    const event = { checked: true } as MatCheckboxChange;
    spyOn(component.checkboxChanged, 'emit');

    component.toggleAttack(event, row, 'CMD');

    expect(component.checkboxChanged.emit).toHaveBeenCalledWith({
      row,
      columnType: 'CMD',
      checked: true
    });
  }); */

/*   it('should emit temperature information click', () => {
    spyOn(component.temperatureInformationClicked, 'emit');
    component.temperatureInformationEmit();
    expect(component.temperatureInformationClicked.emit).toHaveBeenCalled();
  }); */

/*   it('should emit link clicked', () => {
    spyOn(component.linkClicked, 'emit');
    component.onLinkClicked();
    expect(component.linkClicked.emit).toHaveBeenCalled();
  }); */

/*   it('should emit copy row data', () => {
    const row = { id: 1 } as any;
    spyOn(component.emitCopyRowData, 'emit');
    component.copyRowDataEmit(row);
    expect(component.emitCopyRowData.emit).toHaveBeenCalledWith(row);
  }); */

/*   it('should emit full hash modal', () => {
    const hash = { id: 1 } as any;
    spyOn(component.emitFullHashModal, 'emit');
    component.showFullHashModalEmit(hash);
    expect(component.emitFullHashModal.emit).toHaveBeenCalledWith(hash);
  }); */

/*   it('should handle page change event', () => {
    const pageEvent: PageEvent = {
      pageIndex: 1,
      previousPageIndex: 0,
      pageSize: 25,
      length: 100
    };

    spyOn(component, 'clearFilter');
    component.onPageChange(pageEvent);

    expect(component.clearFilter).toHaveBeenCalled();
    expect(mockUISettings.updateTableSettings).toHaveBeenCalled();
    expect(mockDataSource.setPaginationConfig).toHaveBeenCalled();
    expect(mockDataSource.reload).toHaveBeenCalled();
  }); */

/*   it('should handle page size change in page event', () => {
    const pageEvent: PageEvent = {
      pageIndex: 0,
      previousPageIndex: 0,
      pageSize: 50, // Changed from default 25
      length: 100
    };

    component.onPageChange(pageEvent);

    // Check that pagination is reset when page size changes
    expect(mockDataSource.setPaginationConfig).toHaveBeenCalledWith(50, jasmine.any(Number), undefined, undefined, 0);
  }); */

/*   it('should reload table data and bulk menu', () => {
    component.reload();

    expect(mockDataSource.reset).toHaveBeenCalledWith(true);
    expect(mockDataSource.reload).toHaveBeenCalled();
  });
 */
/*   it('should emit row action event', () => {
    const event = { type: 'edit', data: { id: 1 } };
    spyOn(component.rowActionClicked, 'emit');

    component.rowAction(event);

    expect(component.rowActionClicked.emit).toHaveBeenCalledWith(event);
  }); */

/*   it('should emit bulk action event', () => {
    const event = { type: 'delete', data: [{ id: 1 }] };
    spyOn(component.bulkActionClicked, 'emit');

    component.bulkAction(event);

    expect(component.bulkActionClicked.emit).toHaveBeenCalledWith(event);
  }); */

/*   it('should emit export action event', () => {
    const event = { type: 'export', data: null };
    spyOn(component.exportActionClicked, 'emit');

    component.exportAction(event);

    expect(component.exportActionClicked.emit).toHaveBeenCalledWith(event);
  }); */

/*   it('should emit editable input saved event', () => {
    const editable = { row: { id: 1 }, column: 'name', value: 'New Name' };
    spyOn(component.editableSaved, 'emit');

    component.editableInputSaved(editable);

    expect(component.editableSaved.emit).toHaveBeenCalledWith(editable);
  }); */

/*   it('should emit editable checkbox saved event', () => {
    const editable = { row: { id: 1 }, column: 'active', value: true };
    spyOn(component.editableCheckbox, 'emit');

    component.editableCheckboxSaved(editable);

    expect(component.editableCheckbox.emit).toHaveBeenCalledWith(editable);
  }); */

/*   it('should set column sorting correctly', () => {
    const column = { id: '1' };
    expect(component.setColumnSorting(column)).toBe('before'); // asc = before

    mockDataSource.sortingColumn = { id: '1', direction: 'desc' };
    expect(component.setColumnSorting(column)).toBe('after'); // desc = after

    mockDataSource.sortingColumn = { id: '2', direction: 'asc' };
    expect(component.setColumnSorting(column)).toBeNull(); // Different column = null
  }); */

/*   it('should handle filter column change', () => {
    spyOn(component, 'applyFilter');
    spyOn(component.selectedFilterColumnChanged, 'emit');

    component.selectedFilterColumn = 'col1';
    mockDataSource.filter = 'test';
    component.onFilterColumnChange();

    expect(component.selectedFilterColumnChanged.emit).toHaveBeenCalledWith('col1');
    expect(component.applyFilter).toHaveBeenCalled();
  }); */

/*   it('should filter keys correctly', () => {
    const original = { '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four' };
    const include = ['1', '3'];

    const result = (component as any).filterKeys(original, include);

    expect(result['1']).toBe('One');
    expect(result['3']).toBe('Three');
    expect(result['2']).toBeUndefined();
    expect(result['4']).toBeUndefined();
  }); */
});
