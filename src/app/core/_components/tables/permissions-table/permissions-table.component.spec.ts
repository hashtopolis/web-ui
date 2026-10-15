import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JGlobalPermissionGroup } from '@models/global-permission-group.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { PermissionsTableComponent } from '@components/tables/permissions-table/permissions-table.component';
import {
  PermissionsTableCol,
  PermissionsTableColumnLabel
} from '@components/tables/permissions-table/permissions-table.constants';

import { PermissionsDataSource } from '@datasources/permissions.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockPermissionsDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestPermissionsTableComponent extends PermissionsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(PermissionsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockPermissionsDataSource() as unknown as PermissionsDataSource;
  }
}

describe('PermissionsTableComponent', () => {
  let component: TestPermissionsTableComponent;
  let fixture: ComponentFixture<TestPermissionsTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestPermissionsTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestPermissionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for permissions', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1 }] as JGlobalPermissionGroup[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<
        JGlobalPermissionGroup[]
      >;
      component.table.displayedColumns = [
        String(PermissionsTableCol.ID),
        String(PermissionsTableCol.NAME),
        String(PermissionsTableCol.MEMBERS)
      ];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        PermissionsTableColumnLabel,
        'hashtopolis-permissions'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = [String(PermissionsTableCol.ID), String(PermissionsTableCol.NAME)];
      const items = [{ id: 1 }, { id: 2 }] as JGlobalPermissionGroup[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<
        JGlobalPermissionGroup[]
      >;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) =>
        [PermissionsTableCol.ID, PermissionsTableCol.NAME].includes(col.id)
      );
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        PermissionsTableColumnLabel,
        'hashtopolis-permissions'
      );
    });
  });
});
