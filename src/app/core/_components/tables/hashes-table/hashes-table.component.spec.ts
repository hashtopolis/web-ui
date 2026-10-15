import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JHash } from '@models/hash.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { HashesTableComponent } from '@components/tables/hashes-table/hashes-table.component';
import { HashesTableCol, HashesTableColColumnLabel } from '@components/tables/hashes-table/hashes-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { HashesDataSource } from '@datasources/hashes.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockHashesDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestHashesTableComponent extends HashesTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(HashesTableColColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockHashesDataSource() as unknown as HashesDataSource;
  }
}

describe('HashesTableComponent', () => {
  let component: TestHashesTableComponent;
  let fixture: ComponentFixture<TestHashesTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<{ reload: () => void }>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestHashesTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHashesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as unknown as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose exactly six columns', () => {
      expect(component.tableColumns.length).toBe(6);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1 }] as JHash[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHash[]>;
      (component.table as HTTableComponent<BaseModel>).displayedColumns = [
        String(HashesTableCol.HASHES),
        String(HashesTableCol.PLAINTEXT),
        String(HashesTableCol.SALT),
        String(HashesTableCol.CRACK_POSITION),
        String(HashesTableCol.ISCRACKED),
        String(HashesTableCol.TIMECRACKED)
      ];
      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        HashesTableColColumnLabel,
        'hashtopolis-hashes'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      (component.table as HTTableComponent<BaseModel>).displayedColumns = [
        String(HashesTableCol.HASHES),
        String(HashesTableCol.PLAINTEXT)
      ];
      const items = [{ id: 1 }, { id: 2 }] as JHash[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHash[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) =>
        [HashesTableCol.HASHES, HashesTableCol.PLAINTEXT].includes(col.id)
      );
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        HashesTableColColumnLabel,
        'hashtopolis-hashes'
      );
    });
  });
});
