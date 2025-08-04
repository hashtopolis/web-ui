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
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
