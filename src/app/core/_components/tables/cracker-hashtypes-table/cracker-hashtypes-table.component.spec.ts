import { of, throwError } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { BaseModel } from '@models/base.model';
import { JHashtype } from '@models/hashtype.model';
import { Filter, FilterType } from '@models/request-params.model';

import { RelationshipType, SERV } from '@services/main.config';

import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { CrackerHashtypesTableComponent } from '@components/tables/cracker-hashtypes-table/cracker-hashtypes-table.component';
import {
  CrackerHashtypesTableCol,
  CrackerHashtypesTableColumnLabel
} from '@components/tables/cracker-hashtypes-table/cracker-hashtypes-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';

import { CrackerHashtypesDataSource } from '@datasources/cracker-hashtypes.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockCrackerHashtypesDataSource {
  loadAll(_query?: Filter) {}
  setColumns() {}
  setCrackerBinaryId() {}
  clearFilter() {}
  reload() {}
}

class TestCrackerHashtypesTableComponent extends CrackerHashtypesTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(CrackerHashtypesTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockCrackerHashtypesDataSource() as unknown as CrackerHashtypesDataSource;
  }
}

function hashtype(id: number, description: string): JHashtype {
  return { id, type: 'hashType', description, isSalted: false, isSlowHash: false };
}

describe('CrackerHashtypesTableComponent', () => {
  let component: TestCrackerHashtypesTableComponent;
  let fixture: ComponentFixture<TestCrackerHashtypesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestCrackerHashtypesTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: jasmine.createSpyObj('ExportService', ['handleExportAction']) }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestCrackerHashtypesTableComponent);
    component = fixture.componentInstance;
    component.crackerBinaryId = 12;
    fixture.detectChanges();
    component.table = jasmine.createSpyObj('HTTableComponent', ['reload']) as unknown as HTTableComponent<BaseModel>;
  });

  it('exposes hashtype, description, salted and slow hash columns', () => {
    expect(component.tableColumns.map((col) => col.id)).toEqual([
      CrackerHashtypesTableCol.HASHTYPE,
      CrackerHashtypesTableCol.DESCRIPTION,
      CrackerHashtypesTableCol.SALTED,
      CrackerHashtypesTableCol.SLOW_HASH
    ]);
  });

  describe('server side filter', () => {
    it('loads the matching hashtypes for a search', () => {
      const ds = component.dataSource as unknown as MockCrackerHashtypesDataSource;
      spyOn(ds, 'loadAll');
      component.selectedFilterColumn = component.tableColumns[1];

      component.handleBackendSqlFilter('md5');

      expect(ds.loadAll).toHaveBeenCalledWith({
        value: 'md5',
        field: 'description',
        operator: FilterType.ICONTAINS,
        parent: undefined
      });
    });

    it('clears the filter for an empty search', () => {
      const ds = component.dataSource as unknown as MockCrackerHashtypesDataSource;
      spyOn(ds, 'clearFilter');

      component.handleBackendSqlFilter('');

      expect(ds.clearFilter).toHaveBeenCalled();
    });
  });

  describe('remove actions', () => {
    let deleteRelationships: jasmine.Spy;
    let dialogOpen: jasmine.Spy;
    let showSuccess: jasmine.Spy;
    let reload: jasmine.Spy;

    function confirmDialog(action: string, data: JHashtype[]) {
      dialogOpen.and.returnValue({ afterClosed: () => of({ action, data }) } as unknown as MatDialogRef<unknown>);
    }

    let removed: jasmine.Spy;

    beforeEach(() => {
      removed = jasmine.createSpy('removed');
      component.hashtypesRemoved.subscribe(removed);
      deleteRelationships = spyOn(component['gs'], 'deleteRelationships').and.returnValue(of({}));
      dialogOpen = spyOn(component.dialog, 'open');
      showSuccess = spyOn(component['alertService'], 'showSuccessMessage');
      reload = spyOn(component, 'reload');
    });

    it('removes a hashtype after confirmation', () => {
      const row = hashtype(1000, 'NTLM');
      confirmDialog(RowActionMenuAction.DELETE, [row]);

      component.rowActionClicked({ data: row, menuItem: { action: RowActionMenuAction.DELETE, label: '' } });

      expect(deleteRelationships).toHaveBeenCalledWith(SERV.CRACKERS, 12, RelationshipType.HASHTYPES, {
        data: [{ type: 'hashType', id: 1000 }]
      });
      expect(showSuccess).toHaveBeenCalledWith('Removed 1 hashtype');
      expect(reload).toHaveBeenCalled();
      expect(removed).toHaveBeenCalled();
    });

    it('removes several hashtypes in bulk', () => {
      const rows = [hashtype(0, 'MD5'), hashtype(1000, 'NTLM')];
      confirmDialog(BulkActionMenuAction.DELETE, rows);

      component.bulkActionClicked({ data: rows, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } });

      expect(deleteRelationships).toHaveBeenCalledWith(SERV.CRACKERS, 12, RelationshipType.HASHTYPES, {
        data: [
          { type: 'hashType', id: 0 },
          { type: 'hashType', id: 1000 }
        ]
      });
      expect(showSuccess).toHaveBeenCalledWith('Removed 2 hashtypes');
    });

    it('reloads without success toast when removing fails', () => {
      spyOn(console, 'error');
      const row = hashtype(1000, 'NTLM');
      confirmDialog(RowActionMenuAction.DELETE, [row]);
      deleteRelationships.and.returnValue(throwError(() => ({ status: 403 })));

      component.rowActionClicked({ data: row, menuItem: { action: RowActionMenuAction.DELETE, label: '' } });

      expect(showSuccess).not.toHaveBeenCalled();
      expect(reload).toHaveBeenCalled();
    });

    it('does nothing when the dialog is cancelled', () => {
      dialogOpen.and.returnValue({ afterClosed: () => of(undefined) } as unknown as MatDialogRef<unknown>);

      component.rowActionClicked({
        data: hashtype(0, 'MD5'),
        menuItem: { action: RowActionMenuAction.DELETE, label: '' }
      });

      expect(deleteRelationships).not.toHaveBeenCalled();
    });
  });

  it('has no context menu when not editable', () => {
    fixture = TestBed.createComponent(TestCrackerHashtypesTableComponent);
    const readonly = fixture.componentInstance;
    readonly.crackerBinaryId = 12;
    readonly.editable = false;
    // the real ngOnInit decides about the context menu, call the part that does it
    readonly['setupContextMenu']();
    expect(readonly['contextMenuService']).toBeUndefined();
  });

  it('offers remove actions when editable', () => {
    component.editable = true;
    component['setupContextMenu']();
    expect(component['contextMenuService']).toBeDefined();
  });
});
