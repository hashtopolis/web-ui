import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { UserPermissions } from '@models/global-permission-group.model';
import { JUser } from '@models/user.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { AccessPermissionGroupsUserTableComponent } from '@components/tables/access-permission-groups-user-table/access-permission-groups-user-table.component';
import { AccessPermissionGroupsUserTableColumnLabel } from '@components/tables/access-permission-groups-user-table/access-permission-groups-user-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';

import { AccessPermissionGroupsExpandDataSource } from '@datasources/access-permission-groups-expand.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockAccessPermissionGroupsUserDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestAccessPermissionGroupsUserTableComponent extends AccessPermissionGroupsUserTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(AccessPermissionGroupsUserTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource =
      new MockAccessPermissionGroupsUserDataSource() as unknown as AccessPermissionGroupsExpandDataSource;
  }
}

describe('AccessPermissionGroupsUserTableComponent', () => {
  let component: TestAccessPermissionGroupsUserTableComponent;
  let fixture: ComponentFixture<TestAccessPermissionGroupsUserTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestAccessPermissionGroupsUserTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestAccessPermissionGroupsUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for access permission groups user', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items: (JUser | UserPermissions)[] = [{ id: 1 }] as (JUser | UserPermissions)[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<
        (JUser | UserPermissions)[]
      >;
      component.table.displayedColumns = ['0', '1', '2', '3', '4'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        AccessPermissionGroupsUserTableColumnLabel,
        'hashtopolis-access-permission-groups-user'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items: (JUser | UserPermissions)[] = [{ id: 1 }, { id: 2 }] as (JUser | UserPermissions)[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<
        (JUser | UserPermissions)[]
      >;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        AccessPermissionGroupsUserTableColumnLabel,
        'hashtopolis-access-permission-groups-user'
      );
    });
  });
});
