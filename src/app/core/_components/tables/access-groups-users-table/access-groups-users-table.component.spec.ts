import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JUser } from '@models/user.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { AccessGroupsUserTableComponent } from '@components/tables/access-groups-users-table/access-groups-users-table.component';
import {
  AccessGroupsUsersTableCol,
  AccessGroupsUsersTableColumnLabel
} from '@components/tables/access-groups-users-table/access-groups-users-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';

import { AccessGroupsExpandDataSource } from '@datasources/access-groups-expand.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockAccessGroupsExpandDataSource {
  loadAll() {}
  setColumns() {}
  setAccessGroupId() {}
  setAccessGroupExpand() {}
  clearFilter() {}
  reload() {}
}

class TestAccessGroupsUserTableComponent extends AccessGroupsUserTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(AccessGroupsUsersTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockAccessGroupsExpandDataSource() as unknown as InstanceType<
      typeof AccessGroupsExpandDataSource
    >;
  }
}

describe('AccessGroupsUsersTableComponent', () => {
  let component: TestAccessGroupsUserTableComponent;
  let fixture: ComponentFixture<TestAccessGroupsUserTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestAccessGroupsUserTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestAccessGroupsUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose exactly three columns: ID, NAME, STATUS', () => {
      const ids = component.tableColumns.map((c) => c.id);
      expect(ids).toEqual([
        AccessGroupsUsersTableCol.ID,
        AccessGroupsUsersTableCol.NAME,
        AccessGroupsUsersTableCol.STATUS
      ]);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const users = [{ id: 1, name: 'U1' }] as JUser[];
      const event = { data: users, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JUser[]>;
      component.table.displayedColumns = ['0', '1', '2'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        AccessGroupsUsersTableColumnLabel,
        'hashtopolis-access-groups-users'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items = [{ id: 1, name: 'u1', isValid: true }] as JUser[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JUser[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        AccessGroupsUsersTableColumnLabel,
        'hashtopolis-access-groups-users'
      );
    });
  });
});
