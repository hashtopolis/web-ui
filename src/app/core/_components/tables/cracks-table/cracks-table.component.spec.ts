import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JHash } from '@models/hash.model';

import { CrackerBinaryTypesService } from '@services/crackers/cracker-binary-types.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { CracksTableComponent } from '@components/tables/cracks-table/cracks-table.component';
import { CracksTableColumnLabel } from '@components/tables/cracks-table/cracks-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { CracksDataSource } from '@datasources/cracks.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockCracksDataSource {
  loadAll() {
    return Promise.resolve(undefined);
  }
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestCracksTableComponent extends CracksTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(CracksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockCracksDataSource() as unknown as CracksDataSource;
  }
}

describe('CracksTableComponent', () => {
  let component: TestCracksTableComponent;
  let fixture: ComponentFixture<TestCracksTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;
  let gs: jasmine.SpyObj<GlobalService>;
  let crackerBinaryTypes: jasmine.SpyObj<CrackerBinaryTypesService>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);
    gs = jasmine.createSpyObj('GlobalService', ['delete']);
    gs.delete.and.returnValue(of({}));
    crackerBinaryTypes = jasmine.createSpyObj('CrackerBinaryTypesService', ['invalidate']);

    await TestBed.configureTestingModule({
      declarations: [TestCracksTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService },
        { provide: GlobalService, useValue: gs },
        { provide: CrackerBinaryTypesService, useValue: crackerBinaryTypes },
        {
          provide: AlertService,
          useValue: jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage'])
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestCracksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as unknown as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose exactly seven columns', () => {
      expect(component.tableColumns.length).toBe(7);
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1 }] as JHash[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHash[]>;
      component.table.displayedColumns = ['1', '2', '3', '5', '6', '7', '8'];

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        CracksTableColumnLabel,
        'hashtopolis-cracks'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['1', '2'];
      const items = [{ id: 1 }, { id: 2 }] as JHash[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JHash[]>;

      component.exportActionClicked(event);

      const visibleColumnIds = [1, 2];
      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => visibleColumnIds.includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        CracksTableColumnLabel,
        'hashtopolis-cracks'
      );
    });
  });

  describe('deleting cracker types', () => {
    type DeleteMethods = { rowActionDelete(cracks: JHash[]): void; bulkActionDelete(cracks: JHash[]): void };

    it('invalidates the cracker types after deleting one', () => {
      (component as unknown as DeleteMethods).rowActionDelete([{ id: 3 } as JHash]);
      expect(gs.delete).toHaveBeenCalledWith(SERV.CRACKERS_TYPES, 3);
      expect(crackerBinaryTypes.invalidate).toHaveBeenCalled();
    });

    it('invalidates the cracker types after a bulk delete', () => {
      (component as unknown as DeleteMethods).bulkActionDelete([{ id: 3 } as JHash, { id: 4 } as JHash]);
      expect(gs.delete).toHaveBeenCalledTimes(2);
      expect(crackerBinaryTypes.invalidate).toHaveBeenCalledTimes(1);
    });
  });
});
