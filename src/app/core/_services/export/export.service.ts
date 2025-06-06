import { Workbook } from 'exceljs';
import { unparse } from 'papaparse';

import { Clipboard } from '@angular/cdk/clipboard';
import { Injectable } from '@angular/core';

import { ExcelColumn } from '@services/export/export.model';
import { ExportUtil } from '@services/export/export.util';
import { AlertService } from '@services/shared/alert.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

/**
 * Service for exporting data to Excel, CSV formats and to the clipboard.
 */
@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(
    private exportUtil: ExportUtil,
    private clipboard: Clipboard,
    private alertService: AlertService
  ) {}

  /**
   * Save input data as Excel file
   * @param data - data to save
   * @param fileName - filename to save data to
   * @private
   */
  private saveExcelFile(data: ArrayBuffer, fileName: string): void {
    this.exportUtil.download(
      data,
      `${fileName}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  }

  /**
   * Save input data to a CSV file
   * @param inputString - input data as string
   * @param fileName - name of file to save data to
   * @private
   */
  private saveCsvFile(inputString: string, fileName: string): void {
    const byteArray = new Uint8Array(inputString.length);
    for (let i = 0; i < inputString.length; i++) {
      byteArray[i] = inputString.codePointAt(i);
    }
    this.exportUtil.download(byteArray, `${fileName}.csv`, 'text/csv');
  }

  /**
   * Exports data to an Excel file and triggers a download.
   *
   * @param fileName - The name of the Excel file without ext.
   * @param tableColumns - Columns configuration for the export.
   * @param rawData - The data to export.
   * @param columnLabels - column labels for header row
   */
  async toExcel<T>(
    fileName: string,
    tableColumns: HTTableColumn[],
    rawData: T[],
    columnLabels: { [key: number]: string }
  ): Promise<void> {
    try {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Sheet 1');
      const columns: ExcelColumn[] = this.exportUtil.toExcelColumns(tableColumns, columnLabels);

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
   * @param columnLabels - column labels for header row
   */
  async toCsv<T>(
    fileName: string,
    tableColumns: HTTableColumn[],
    rawData: T[],
    columnLabels: { [key: number]: string }
  ): Promise<void> {
    const columns: string[] = this.exportUtil.toCsvColumns(tableColumns, columnLabels);
    const data = await this.exportUtil.toCsvRows(tableColumns, rawData);

    if (data && data.length) {
      const csv = unparse([columns, ...data]);
      this.saveCsvFile(csv, fileName);
    }
  }

  /**
   * Copies data to the clipboard.
   *
   * @param tableColumns - Columns configuration for the export.
   * @param rawData - The data to export.
   * @param columnLabels - column labels for header row
   */
  async toClipboard<T>(
    tableColumns: HTTableColumn[],
    rawData: T[],
    columnLabels: { [key: number]: string }
  ): Promise<void> {
    const columns: string[] = this.exportUtil.toCsvColumns(tableColumns, columnLabels);
    const data = await this.exportUtil.toCsvRows(tableColumns, rawData);
    const textToCopy = [columns, ...data].map((row: string[]) => row.join('\t')).join('\n');
    this.clipboard.copy(textToCopy);
  }

  /**
   * Handles an expoprt data event inside a table component
   * @param event - event data to handle
   * @param tableColumns - table columns
   * @param columnLabels - column labels
   * @param fileName - name of file to export data to
   */
  handleExportAction<T>(
    event: ActionMenuEvent<T[]>,
    tableColumns: HTTableColumn[],
    columnLabels: { [key: number]: string },
    fileName: string
  ): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.toExcel<T>(fileName, tableColumns, event.data, columnLabels)
          .then(() => {
            this.alertService.showSuccessMessage(
              `The selected rows were saved as ${fileName}.xlsx in your download folder`
            );
          })
          .catch((error) => {
            this.alertService.showErrorMessage(`Could not save data to Excel save: ${error}`);
          });
        break;
      case ExportMenuAction.CSV:
        this.toCsv<T>(fileName, tableColumns, event.data, columnLabels)
          .then(() => {
            this.alertService.showSuccessMessage(
              `The selected rows were saved as ${fileName}.csv in your download folder`
            );
          })
          .catch((error) => {
            this.alertService.showErrorMessage(`Could not save data to CSV save: ${error}`);
          });
        break;
      case ExportMenuAction.COPY:
        this.toClipboard<T>(tableColumns, event.data, columnLabels)
          .then(() => {
            this.alertService.showSuccessMessage('The selected rows were copied to the clipboard');
          })
          .catch((error) => {
            this.alertService.showErrorMessage(`Could not copy data to clipboard save: ${error}`);
          });
        break;
    }
  }
}
