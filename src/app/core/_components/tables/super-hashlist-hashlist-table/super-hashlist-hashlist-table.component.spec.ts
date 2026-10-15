import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JHashlist } from '@models/hashlist.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { SuperHashlistsHashlistsTableComponent } from '@components/tables/super-hashlist-hashlist-table/super-hashlist-hashlist-table.component';
import { SuperHashlistHashlistTableColumnLabel } from '@components/tables/super-hashlist-hashlist-table/super-hashlist-hashlist-table.constants';

import { HashlistsDataSource } from '@datasources/hashlists.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockSuperHashlistHashlistDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestSuperHashlistsHashlistsTableComponent extends SuperHashlistsHashlistsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(SuperHashlistHashlistTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockSuperHashlistHashlistDataSource() as unknown as HashlistsDataSource;
  }
}

describe('SuperHashlistsHashlistsTableComponent', () => {
  let component: TestSuperHashlistsHashlistsTableComponent;
  let fixture: ComponentFixture<TestSuperHashlistsHashlistsTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestSuperHashlistsHashlistsTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestSuperHashlistsHashlistsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for super hashlist hashlist', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1 }] as JHashlist[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHashlist[]>;
      component.table.displayedColumns = ['0', '1', '3', '4', '5', '6'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        SuperHashlistHashlistTableColumnLabel,
        'hashtopolis-hashlists'
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
        SuperHashlistHashlistTableColumnLabel,
        'hashtopolis-hashlists'
      );
    });
  });
});
