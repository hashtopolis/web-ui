import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JUser } from '@models/user.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { UsersTableComponent } from '@components/tables/users-table/users-table.component';
import { UsersTableColumnLabel } from '@components/tables/users-table/users-table.constants';

import { UsersDataSource } from '@datasources/users.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockUsersDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestUsersTableComponent extends UsersTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(UsersTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockUsersDataSource() as unknown as UsersDataSource;
  }
}

describe('UsersTableComponent', () => {
  let component: TestUsersTableComponent;
  let fixture: ComponentFixture<TestUsersTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestUsersTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestUsersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for users', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      component.table.displayedColumns = ['0', '1', '2', '3', '4', '5', '6', '7'];
      const items = [{ id: 1 }] as unknown as JUser[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JUser[]>;

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        UsersTableColumnLabel,
        'hashtopolis-users'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items = [{ id: 1 }, { id: 2 }] as unknown as JUser[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JUser[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => ['0', '1'].includes(col.id + ''));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        UsersTableColumnLabel,
        'hashtopolis-users'
      );
    });
  });
});
