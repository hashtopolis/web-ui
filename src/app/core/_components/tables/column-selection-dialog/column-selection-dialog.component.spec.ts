import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ColumnSelectionDialogComponent } from '@components/tables/column-selection-dialog/column-selection-dialog.component';
import { COL_ROW_ACTION, COL_SELECT } from '@components/tables/ht-table/ht-table.models';

interface DialogData {
  availableColumns: { [key: number]: string };
  selectedColumns: string[];
}

describe('ColumnSelectionDialogComponent', () => {
  function createComponent(data: DialogData): ColumnSelectionDialogComponent {
    TestBed.configureTestingModule({
      declarations: [ColumnSelectionDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: data }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    return TestBed.createComponent(ColumnSelectionDialogComponent).componentInstance;
  }

  describe('constructor', () => {
    it('should preselect the given columns without the select and row action columns', () => {
      const data: DialogData = {
        availableColumns: { 0: 'ID', 1: 'Name' },
        selectedColumns: [String(COL_SELECT), '0', '1', String(COL_ROW_ACTION)]
      };

      const component = createComponent(data);

      expect(component.selectedColumns).toStrictEqual(['0', '1']);
    });

    it('should keep the order of the selected columns', () => {
      const data: DialogData = {
        availableColumns: { 0: 'ID', 1: 'Name', 2: 'Status' },
        selectedColumns: ['2', '0', '1']
      };

      const component = createComponent(data);

      expect(component.selectedColumns).toStrictEqual(['2', '0', '1']);
    });

    it('should select no columns when the dialog data contains no selected columns', () => {
      const data: DialogData = { availableColumns: { 0: 'ID' }, selectedColumns: [] };

      const component = createComponent(data);

      expect(component.selectedColumns).toStrictEqual([]);
    });

    it('should copy the dialog data so that changes in the dialog do not affect the caller', () => {
      const data: DialogData = { availableColumns: { 0: 'ID' }, selectedColumns: ['0'] };

      const component = createComponent(data);
      component.selectedColumns.push('1');
      component.availableColumns['1'] = 'Name';

      expect(data.selectedColumns).toStrictEqual(['0']);
      expect(data.availableColumns).toStrictEqual({ 0: 'ID' });
    });
  });

  describe('getKeys', () => {
    it('should return the keys of the available columns as strings', () => {
      const component = createComponent({
        availableColumns: { 0: 'ID', 3: 'Name', 7: 'Status' },
        selectedColumns: []
      });

      const keys = component.getKeys();

      expect(keys).toStrictEqual(['0', '3', '7']);
    });

    it('should return an empty list when no columns are available', () => {
      const component = createComponent({ availableColumns: {}, selectedColumns: [] });

      const keys = component.getKeys();

      expect(keys).toStrictEqual([]);
    });
  });
});
