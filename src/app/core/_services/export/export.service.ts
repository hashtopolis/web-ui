import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import { unparse } from 'papaparse';
import { HTTableColumn } from '../../_components/ht-table/ht-table.models';
import { ExportUtil } from './export.util';
import { ExcelColumn } from './export.model';
import { Clipboard } from '@angular/cdk/clipboard';

/**
 * Service for exporting data to Excel, CSV formats and to the clipboard.
 */
@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor(private exportUtil: ExportUtil, private clipboard: Clipboard) { }

  /**
   * Exports data to an Excel file and triggers a download.
   * 
   * @param fileName - The name of the Excel file without ext.
   * @param tableColumns - Columns configuration for the export.
   * @param rawData - The data to export.
   */
  async toExcel<T>(fileName: string, tableColumns: HTTableColumn[], rawData: T[]): Promise<void> {
    try {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');
      const columns: ExcelColumn[] = this.exportUtil.toExcelColumns(tableColumns);

      const data = await this.exportUtil.toExcelRows(tableColumns, rawData);

      if (data && data.length) {
        worksheet.columns = columns;
        worksheet.addRows(data);

        const buffer = await workbook.xlsx.writeBuffer();
        this.saveExcelFile(buffer, fileName);
      }
    } catch (error) {
      console.error('Error during Excel export:', error);
    }
  }

  /**
   * Exports data to a CSV file and triggers a download.
   * 
   * @param fileName - The name of the CSV file without ext.
   * @param tableColumns - Columns configuration for the export.
   * @param rawData - The data to export.
   */
  async toCsv<T>(fileName: string, tableColumns: HTTableColumn[], rawData: T[]): Promise<void> {
    try {
      const columns: string[] = this.exportUtil.toCsvColumns(tableColumns);
      const data = await this.exportUtil.toCsvRows(tableColumns, rawData);

      if (data && data.length) {
        const csv = unparse([columns, ...data]);
        this.saveCsvFile(csv, fileName);
      }
    } catch (error) {
      console.error('Error during CSV export:', error);
    }
  }

  /**
   * Copies data to the clipboard.
   * 
   * @param tableColumns - Columns configuration for the export.
   * @param rawData - The data to export.
   */
  async toClipboard<T>(tableColumns: HTTableColumn[], rawData: T[]): Promise<void> {
    try {
      const columns: string[] = this.exportUtil.toCsvColumns(tableColumns);
      const data = await this.exportUtil.toCsvRows(tableColumns, rawData);

      const textToCopy = [columns, ...data].map((row: string[]) => row.join('\t')).join('\n');

      this.clipboard.copy(textToCopy);
    } catch (error) {
      console.error('Error during Clipboard export:', error);
    }
  }

  private saveExcelFile(data: ArrayBuffer, fileName: string): void {
    this.exportUtil.download(data, `${fileName}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }

  private saveCsvFile(data: ArrayBuffer, fileName: string): void {
    this.exportUtil.download(data, `${fileName}.csv`, 'text/csv');
  }
}
