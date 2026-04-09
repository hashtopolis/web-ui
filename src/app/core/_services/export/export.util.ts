import { Injectable } from '@angular/core';

import { BaseModel } from '@models/base.model';

import { ExcelColumn } from '@services/export/export.model';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

@Injectable({
  providedIn: 'root'
})
export class ExportUtil {
  /**
   * Converts table columns to Excel columns.
   *
   * @param tableColumns The table columns.
   * @returns Excel columns.
   */
  toExcelColumns(tableColumns: HTTableColumn[], columnLabels: { [key: number]: string }): ExcelColumn[] {
    return tableColumns.map((col: HTTableColumn) => {
      return {
        key: col.dataKey ?? '',
        header: columnLabels[col.id]
      };
    });
  }

  /**
   * Converts table columns to CSV columns.
   *
   * @param tableColumns The table columns.
   * @returns CSV columns.
   */
  toCsvColumns(tableColumns: HTTableColumn[], columnLabels: { [key: number]: string }): string[] {
    return tableColumns.map((col: HTTableColumn) => columnLabels[col.id]);
  }

  /**
   * Converts data to rows for Excel export.
   *
   * @param tableColumns The table columns.
   * @param rawData The data to be exported.
   * @returns Rows for Excel export.
   */
  async toExcelRows<T extends BaseModel>(
    tableColumns: HTTableColumn[],
    rawData: T[]
  ): Promise<Record<string, string>[]> {
    const data: Record<string, string>[] = [];

    for (const row of rawData) {
      const rowData: Record<string, string> = {};
      for (const column of tableColumns) {
        rowData[column.dataKey!] = column.export ? await column.export(row) : '';
      }
      data.push(rowData);
    }

    return data;
  }

  /**
   * Converts data to rows for CSV export.
   *
   * @param tableColumns The table columns.
   * @param rawData The data to be exported.
   * @returns Rows for CSV export.
   */
  async toCsvRows<T extends BaseModel>(tableColumns: HTTableColumn[], rawData: T[]): Promise<string[][]> {
    const data: string[][] = [];

    for (const row of rawData) {
      const rowData: string[] = [];
      for (const column of tableColumns) {
        rowData.push(column.export ? await column.export(row) : '');
      }
      data.push(rowData);
    }

    return data;
  }

  /**
   * Downloads data as a file.
   *
   * @param data The data to download.
   * @param fileName The name of the file.
   * @param fileType The type of the file (e.g., 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' for Excel).
   */
  download(data: ArrayBuffer, fileName: string, fileType: string): void {
    const blob = new Blob([data], { type: fileType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    try {
      document.body.removeChild(a);
    } catch (_error) {
      // Do nothing
    }
  }
}
