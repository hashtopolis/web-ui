import type { MockedObject } from 'vitest';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ExportService } from '@services/export/export.service';
import { GlobalService } from '@services/main.service';
import { ConfigService } from '@services/shared/config.service';
import { UIConfigService } from '@services/shared/storage.service';
import { UiSettingsService } from '@services/shared/ui-settings.service';

import { HashlistReportDataSource } from '@src/app/shared/report-builder/datasources/hashlists.datasource';
import { HashlistReportComponent } from '@src/app/shared/report-builder/reports/hashlist-report/hashlist-report.component';

describe('HashlistReportComponent', () => {
  beforeEach(() => {
    const mockUiSettings = {
      getDateTimeFormat: vi.fn().mockName('UiSettingsService.getDateTimeFormat').mockReturnValue('yyyy-MM-dd HH:mm:ss')
    } as MockedObject<UiSettingsService>;

    TestBed.configureTestingModule({
      declarations: [HashlistReportComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: UiSettingsService, useValue: mockUiSettings },
        { provide: DomSanitizer, useValue: {} },
        { provide: GlobalService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: UIConfigService, useValue: {} },
        { provide: ExportService, useValue: {} },
        { provide: MatDialog, useValue: {} }
      ]
    });
  });

  it('sets the hashlist ID before loading the report', () => {
    const setHashlistId = vi.spyOn(HashlistReportDataSource.prototype, 'setHashlistId');
    const reload = vi.spyOn(HashlistReportDataSource.prototype, 'reload').mockReturnValue(undefined);
    const fixture = TestBed.createComponent(HashlistReportComponent);
    fixture.componentRef.setInput('hashlistId', 42);

    fixture.componentInstance.ngOnInit();

    expect(fixture.componentInstance.dataSource).toBeInstanceOf(HashlistReportDataSource);
    expect(setHashlistId).toHaveBeenCalledExactlyOnceWith(42);
    expect(reload).toHaveBeenCalledExactlyOnceWith();
    expect(setHashlistId.mock.contexts[0]).toBe(fixture.componentInstance.dataSource);
    expect(reload.mock.contexts[0]).toBe(fixture.componentInstance.dataSource);
    expect(setHashlistId.mock.invocationCallOrder[0]).toBeLessThan(reload.mock.invocationCallOrder[0]);
  });

  it('loads the report without setting an ID when the default ID is zero', () => {
    const setHashlistId = vi.spyOn(HashlistReportDataSource.prototype, 'setHashlistId');
    const reload = vi.spyOn(HashlistReportDataSource.prototype, 'reload').mockReturnValue(undefined);
    const fixture = TestBed.createComponent(HashlistReportComponent);

    fixture.componentInstance.ngOnInit();

    expect(setHashlistId).not.toHaveBeenCalled();
    expect(reload).toHaveBeenCalledExactlyOnceWith();
    expect(reload.mock.contexts[0]).toBe(fixture.componentInstance.dataSource);
  });

  it('propagates an error thrown while loading the report', () => {
    const error = new Error('Report loading failed');
    const reload = vi.spyOn(HashlistReportDataSource.prototype, 'reload').mockImplementation(() => {
      throw error;
    });
    const fixture = TestBed.createComponent(HashlistReportComponent);

    expect(() => fixture.componentInstance.ngOnInit()).toThrow(error);
    expect(reload).toHaveBeenCalledExactlyOnceWith();
  });
});
