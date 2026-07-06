import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JHashlist } from '@models/hashlist.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { SuperHashlistsTableComponent } from '@components/tables/super-hashlists-table/super-hashlists-table.component';
import { SuperHashlistsTableColumnLabel } from '@components/tables/super-hashlists-table/super-hashlists-table.constants';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockSuperHashlistsDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestSuperHashlistsTableComponent extends SuperHashlistsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(SuperHashlistsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockSuperHashlistsDataSource() as unknown as typeof this.dataSource;
  }
}

describe('SuperHashlistsTableComponent', () => {
  let component: TestSuperHashlistsTableComponent;
  let fixture: ComponentFixture<TestSuperHashlistsTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestSuperHashlistsTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestSuperHashlistsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for super hashlists', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1 }] as JHashlist[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHashlist[]>;
      component.table.displayedColumns = ['0', '1', '3', '5', '6'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        SuperHashlistsTableColumnLabel,
        'hashtopolis-super-hashlists'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items = [{ id: 1 }, { id: 2 }] as JHashlist[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHashlist[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        SuperHashlistsTableColumnLabel,
        'hashtopolis-super-hashlists'
      );
    });
  });
});
