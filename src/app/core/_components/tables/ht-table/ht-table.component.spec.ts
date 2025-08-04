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
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { TableSettings } from '@models/config-ui.model';
import { UIConfig } from '@models/config-ui.model';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { mock } from 'node:test';
import { of } from 'rxjs';

describe('HTTableComponent', () => {
  let component: HTTableComponent;
  let fixture: ComponentFixture<HTTableComponent>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService<UIConfig>>;
  let mockDataSource: jasmine.SpyObj<BaseDataSource<any>>;
  enum MockTestTableCol {
    COL1,
    COL2,
    COL3,
    COL4
  }
  const MockTestTableColumnLabel = {
    [MockTestTableCol.COL1]: 'Column 1',
    [MockTestTableCol.COL2]: 'Column 2',
    [MockTestTableCol.COL3]: 'Column 3',
    [MockTestTableCol.COL4]: 'Column 4'
  };
  const mockModifiedUIConfig = {
    layout: 'fixed',
    theme: 'light',
    timefmt: 'dd/MM/yyyy h:mm:ss',
    tableSettings: {
      testTable: {
        start: undefined,
        page: 25,
        columns: [0, 1, 2, 3],
        order: {
          id: 0,
          dataKey: '',
          isSortable: true,
          direction: 'asc'
        },
        search: ''
      }
    },
    refreshPage: false,
    refreshInterval: 10
  } as UIConfig;

  beforeEach(async () => {
    mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
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
      'setPaginationConfig'
    ]);
    mockDataSource.filter = '';
    mockDataSource.pageSize = 25;
    mockDataSource.index = 0;
    mockDataSource.totalItems = 0;
    mockLocalStorageService.getItem.and.returnValue(mockModifiedUIConfig);

    await TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [HTTableComponent],
      providers: [{ provide: LocalStorageService, useValue: mockLocalStorageService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HTTableComponent);
    component = fixture.componentInstance;

    component.name = 'testTable';
    component.columnLabels = MockTestTableColumnLabel;
    component.dataSource = mockDataSource;
    component.tableColumns = [
      {
        id: 0,
        dataKey: 'col1',
        isSearchable: false
      },
      {
        id: 1,
        dataKey: 'col2',
        isSearchable: true
      },
      {
        id: 2,
        dataKey: 'col3',
        isSearchable: false
      },
      {
        id: 3,
        dataKey: 'col4',
        isSearchable: true
      }
    ] as HTTableColumn[];
    // fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize filterable columns on ngOnInit', () => {
    component.ngOnInit();
    expect(component.filterableColumns.length).toBe(2);
    expect(component.filterableColumns[0].dataKey).toBe('col2');
    expect(component.filterableColumns[1].dataKey).toBe('col4');
  });
});
