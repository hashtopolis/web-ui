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
import { of } from 'rxjs';

describe('HTTableComponent', () => {
  let component: HTTableComponent;
  let fixture: ComponentFixture<HTTableComponent>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService<UIConfig>>;

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
    await TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [HTTableComponent],
      providers: [{ provide: LocalStorageService, useValue: mockLocalStorageService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HTTableComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
