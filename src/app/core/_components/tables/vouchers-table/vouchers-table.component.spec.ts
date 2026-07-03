import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JVoucher } from '@models/voucher.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { VouchersTableComponent } from '@components/tables/vouchers-table/vouchers-table.component';
import { VouchersTableCol, VouchersTableColumnLabel } from '@components/tables/vouchers-table/vouchers-table.constants';

import { VouchersDataSource } from '@datasources/vouchers.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockVouchersDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestVouchersTableComponent extends VouchersTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(VouchersTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockVouchersDataSource() as unknown as VouchersDataSource;
  }
}

describe('VouchersTableComponent', () => {
  let component: TestVouchersTableComponent;
  let fixture: ComponentFixture<TestVouchersTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestVouchersTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestVouchersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for vouchers', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      component.table.displayedColumns = [
        String(VouchersTableCol.ID),
        String(VouchersTableCol.KEY),
        String(VouchersTableCol.CREATED)
      ];
      const items = [{ id: 1 }] as JVoucher[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JVoucher[]>;

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        VouchersTableColumnLabel,
        'hashtopolis-vouchers'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = [String(VouchersTableCol.ID), String(VouchersTableCol.KEY)];
      const items = [{ id: 1 }, { id: 2 }] as JVoucher[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JVoucher[]>;

      component.exportActionClicked(event);

      const visibleColumnIds = [VouchersTableCol.ID, VouchersTableCol.KEY];
      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => visibleColumnIds.includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        VouchersTableColumnLabel,
        'hashtopolis-vouchers'
      );
    });
  });
});
