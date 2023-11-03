import { Injectable } from "@angular/core";
import { HTTableColumn } from "../../_components/ht-table/ht-table.models";
import { ExcelColumn } from "./export.model";


@Injectable({
  providedIn: 'root',
})
export class ExportUtil {

  /**
   * Converts table columns to Excel columns.
   * 
   * @param tableColumns The table columns.
   * @returns Excel columns.
   */
  toExcelColumns(tableColumns: HTTableColumn[]): ExcelColumn[] {
    return tableColumns.map((col: HTTableColumn) => {
      return {
        key: col.dataKey,
        header: col.name,
      }
    })
  }

  /**
   * Converts table columns to CSV columns.
   * 
   * @param tableColumns The table columns.
   * @returns CSV columns.
   */
  toCsvColumns(tableColumns: HTTableColumn[]): string[] {
    return tableColumns.map((col: HTTableColumn) => col.name)
  }

  /**
   * Converts data to rows for Excel export.
   * 
   * @param tableColumns The table columns.
   * @param rawData The data to be exported.
   * @returns Rows for Excel export.
   */
  async toExcelRows<T>(tableColumns: HTTableColumn[], rawData: T[]): Promise<any> {
    let rowNum = 0
    const data: any[] = []

    for (const row of rawData) {
      data[rowNum] = {}
      for (const column of tableColumns) {
        data[rowNum][column.dataKey] = column.export ? await column.export(row) : ''
      }
      rowNum += 1
    }

    return data
  }

  /**
   * Converts data to rows for CSV export.
   * 
   * @param tableColumns The table columns.
   * @param rawData The data to be exported.
   * @returns Rows for CSV export.
   */
  async toCsvRows<T>(tableColumns: HTTableColumn[], rawData: T[]): Promise<any> {
    const data: string[][] = []

    for (const row of rawData) {
      const rowData: string[] = [];
      for (const column of tableColumns) {
        rowData.push(column.export ? await column.export(row) : '');
      }
      data.push(rowData);
    }

    return data
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
    document.body.removeChild(a);
  }
}
