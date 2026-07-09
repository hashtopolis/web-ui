import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { SearchHashModel } from '@models/hash.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { SearchHashTableComponent } from '@components/tables/search-hash-table/search-hash-table.component';
import {
  SearchHashTableCol,
  SearchHashTableColumnLabel
} from '@components/tables/search-hash-table/search-hash-table.constants';

import { SearchHashDataSource } from '@datasources/search-hash.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockSearchHashDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestSearchHashTableComponent extends SearchHashTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(SearchHashTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockSearchHashDataSource() as unknown as SearchHashDataSource;
  }
}

describe('SearchHashTableComponent', () => {
  let component: TestSearchHashTableComponent;
  let fixture: ComponentFixture<TestSearchHashTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestSearchHashTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestSearchHashTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for search hash', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items: SearchHashModel[] = [
        { id: 1, type: 'hash', hash: 'abc', plaintext: '', hashlists: [], hashInfo: '' }
      ];
      const event: ActionMenuEvent<SearchHashModel[]> = {
        menuItem: { label: '', action: 'excel' },
        data: items
      };
      component.table.displayedColumns = component.tableColumns.map((col) => String(col.id));

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        SearchHashTableColumnLabel,
        'hashtopolis-search-hash'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      const visibleIds: number[] = [SearchHashTableCol.HASH, SearchHashTableCol.PLAINTEXT];
      component.table.displayedColumns = visibleIds.map(String);
      const items: SearchHashModel[] = [
        { id: 1, type: 'hash', hash: 'abc', plaintext: '', hashlists: [], hashInfo: '' },
        { id: 2, type: 'hash', hash: 'def', plaintext: '', hashlists: [], hashInfo: '' }
      ];
      const event: ActionMenuEvent<SearchHashModel[]> = {
        menuItem: { label: '', action: 'excel' },
        data: items
      };

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col) => visibleIds.includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        SearchHashTableColumnLabel,
        'hashtopolis-search-hash'
      );
    });
  });
});
