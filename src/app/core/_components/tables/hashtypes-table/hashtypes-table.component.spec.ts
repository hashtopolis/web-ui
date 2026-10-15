import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JHashtype } from '@models/hashtype.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HashtypesTableComponent } from '@components/tables/hashtypes-table/hashtypes-table.component';
import { HashtypesTableColumnLabel } from '@components/tables/hashtypes-table/hashtypes-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { HashtypesDataSource } from '@datasources/hashtypes.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockHashtypesDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestHashtypesTableComponent extends HashtypesTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(HashtypesTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockHashtypesDataSource() as unknown as HashtypesDataSource;
  }
}

describe('HashtypesTableComponent', () => {
  let component: TestHashtypesTableComponent;
  let fixture: ComponentFixture<TestHashtypesTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestHashtypesTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHashtypesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for hash types', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items: JHashtype[] = [{ id: 1, type: 'hashtype', description: '', isSalted: false, isSlowHash: false }];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHashtype[]>;
      component.table.displayedColumns = ['0', '1', '2', '3'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        HashtypesTableColumnLabel,
        'hashtopolis-hashtypes'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items: JHashtype[] = [
        { id: 1, type: 'hashtype', description: '', isSalted: false, isSlowHash: false },
        { id: 2, type: 'hashtype', description: '', isSalted: false, isSlowHash: false }
      ];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHashtype[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        HashtypesTableColumnLabel,
        'hashtopolis-hashtypes'
      );
    });
  });
});
