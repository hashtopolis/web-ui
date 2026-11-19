import { Workbook } from 'exceljs';
import type { MockedObject } from 'vitest';

import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';

import { ExportService } from '@services/export/export.service';
import { ExportUtil } from '@services/export/export.util';
import { AlertService } from '@services/shared/alert.service';

import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';

import { wait } from '@src/app/testing/wait';

describe('ExportService', () => {
  let util: MockedObject<ExportUtil>;
  let clipboard: MockedObject<Clipboard>;
  let alert: MockedObject<AlertService>;
  let service: ExportService;

  beforeEach(() => {
    util = {
      toExcelColumns: vi.fn().mockName('ExportUtil.toExcelColumns'),
      toExcelRows: vi.fn().mockName('ExportUtil.toExcelRows'),
      download: vi.fn().mockName('ExportUtil.download'),
      toCsvColumns: vi.fn().mockName('ExportUtil.toCsvColumns'),
      toCsvRows: vi.fn().mockName('ExportUtil.toCsvRows')
    } as MockedObject<ExportUtil>;
    clipboard = { copy: vi.fn().mockName('Clipboard.copy') } as MockedObject<Clipboard>;
    alert = {
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage'),
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage')
    } as MockedObject<AlertService>;
    TestBed.configureTestingModule({
      providers: [
        ExportService,
        { provide: ExportUtil, useValue: util },
        { provide: Clipboard, useValue: clipboard },
        { provide: AlertService, useValue: alert }
      ]
    });
    service = TestBed.inject(ExportService);
  });

  it('exports CSV and clipboard data with headers', async () => {
    const columns = [{ id: 1, dataKey: 'name' }];
    const rows = [{ id: 1, type: 'user' }];
    util.toCsvColumns.mockReturnValue(['Name']);
    util.toCsvRows.mockResolvedValue([['Alice, A']]);
    await service.toCsv('users', columns, rows, { 1: 'Name' });
    expect(util.download).toHaveBeenCalledExactlyOnceWith(expect.any(ArrayBuffer), 'users.csv', 'text/csv');
    expect(new TextDecoder().decode(util.download.mock.calls[0][0])).toBe('Name\r\n"Alice, A"');
    await service.toClipboard(columns, rows, { 1: 'Name' });
    expect(clipboard.copy).toHaveBeenCalledExactlyOnceWith('Name\nAlice, A');
  });

  it('does not download an empty CSV', async () => {
    util.toCsvColumns.mockReturnValue([]);
    util.toCsvRows.mockResolvedValue([]);
    await service.toCsv('empty', [], [], {});
    expect(util.download).not.toHaveBeenCalled();
  });

  it('downloads a workbook containing exported data', async () => {
    const columns = [{ id: 1, dataKey: 'name' }];
    const rows = [{ id: 1, type: 'user' }];
    util.toExcelColumns.mockReturnValue([{ key: 'name', header: 'Name' }]);
    util.toExcelRows.mockResolvedValue([{ name: 'Alice' }]);
    await service.toExcel('users', columns, rows, { 1: 'Name' });
    expect(util.toExcelColumns).toHaveBeenCalledExactlyOnceWith(columns, { 1: 'Name' });
    expect(util.toExcelRows).toHaveBeenCalledExactlyOnceWith(columns, rows);
    expect(util.download).toHaveBeenCalledExactlyOnceWith(
      expect.anything(),
      'users.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    const workbook = new Workbook();
    await workbook.xlsx.load(util.download.mock.calls[0][0] as never);
    expect(workbook.getWorksheet('Sheet 1')?.getCell('A1').value).toBe('Name');
    expect(workbook.getWorksheet('Sheet 1')?.getCell('A2').value).toBe('Alice');
  });

  it('does not download an empty workbook', async () => {
    util.toExcelColumns.mockReturnValue([]);
    util.toExcelRows.mockResolvedValue([]);
    await service.toExcel('users', [], [], {});
    expect(util.download).not.toHaveBeenCalled();
  });

  it('logs Excel export errors', async () => {
    const error = new Error('export failed');
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    util.toExcelColumns.mockReturnValue([]);
    util.toExcelRows.mockRejectedValue(error);
    await service.toExcel('users', [], [], {});
    expect(log).toHaveBeenCalledExactlyOnceWith('Error during Excel export:', error);
    expect(util.download).not.toHaveBeenCalled();
  });

  it.each([
    [ExportMenuAction.EXCEL, 'toExcel', 'The selected rows were saved as users.xlsx in your download folder'],
    [ExportMenuAction.CSV, 'toCsv', 'The selected rows were saved as users.csv in your download folder'],
    [ExportMenuAction.COPY, 'toClipboard', 'The selected rows were copied to the clipboard']
  ] as const)('dispatches %s and reports success', async (action, method, message) => {
    const dispatch = vi.spyOn(service, method).mockResolvedValue();
    const columns = [{ id: 1, dataKey: 'name' }];
    const rows = [{ id: 1, type: 'user' }];
    service.handleExportAction({ menuItem: { label: 'Export', action }, data: rows }, columns, { 1: 'Name' }, 'users');
    await wait();
    if (method === 'toClipboard') expect(dispatch).toHaveBeenCalledExactlyOnceWith(columns, rows, { 1: 'Name' });
    else expect(dispatch).toHaveBeenCalledExactlyOnceWith('users', columns, rows, { 1: 'Name' });
    expect(alert.showSuccessMessage).toHaveBeenCalledExactlyOnceWith(message);
    expect(alert.showErrorMessage).not.toHaveBeenCalled();
  });

  it.each([
    [ExportMenuAction.EXCEL, 'toExcel', 'Could not save data to Excel file: Error: failed'],
    [ExportMenuAction.CSV, 'toCsv', 'Could not save data to CSV file: Error: failed'],
    [ExportMenuAction.COPY, 'toClipboard', 'Could not copy data to clipboard: Error: failed']
  ] as const)('reports %s action errors', async (action, method, message) => {
    vi.spyOn(service, method).mockRejectedValue(new Error('failed'));
    service.handleExportAction({ menuItem: { label: 'Export', action }, data: [] }, [], {}, 'users');
    await wait();
    expect(alert.showErrorMessage).toHaveBeenCalledExactlyOnceWith(message);
    expect(alert.showSuccessMessage).not.toHaveBeenCalled();
  });
});
