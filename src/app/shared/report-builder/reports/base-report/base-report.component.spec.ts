import type { MockedObject } from 'vitest';

import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ExportService } from '@services/export/export.service';
import { GlobalService } from '@services/main.service';
import { ConfigService } from '@services/shared/config.service';
import { UIConfigService } from '@services/shared/storage.service';
import { UiSettingsService } from '@services/shared/ui-settings.service';

import { BaseReportComponent } from '@src/app/shared/report-builder/reports/base-report/base-report.component';
import { TimePrecision } from '@src/app/shared/utils/datetime';

describe('BaseReportComponent', () => {
  let mockUiSettings: MockedObject<UiSettingsService>;
  let mockSanitizer: MockedObject<DomSanitizer>;

  beforeEach(() => {
    mockUiSettings = {
      getDateTimeFormat: vi.fn().mockName('UiSettingsService.getDateTimeFormat')
    } as MockedObject<UiSettingsService>;
    mockUiSettings.getDateTimeFormat.mockReturnValue('yyyy-MM-dd HH:mm:ss');

    mockSanitizer = {
      bypassSecurityTrustHtml: vi.fn().mockName('DomSanitizer.bypassSecurityTrustHtml')
    } as MockedObject<DomSanitizer>;

    TestBed.configureTestingModule({
      declarations: [BaseReportComponent],
      providers: [
        { provide: UiSettingsService, useValue: mockUiSettings },
        { provide: DomSanitizer, useValue: mockSanitizer },
        { provide: GlobalService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: UIConfigService, useValue: {} },
        { provide: ExportService, useValue: {} },
        { provide: MatDialog, useValue: {} }
      ]
    });
  });

  it('initializes the date-time format with seconds precision', () => {
    const component = TestBed.createComponent(BaseReportComponent).componentInstance;

    expect(mockUiSettings.getDateTimeFormat).toHaveBeenCalledExactlyOnceWith(TimePrecision.SECONDS);
    expect(component['dateTimeFormat']).toBe('yyyy-MM-dd HH:mm:ss');
  });

  it.each(['<p>Report & details</p>', ''])('passes HTML unchanged to the sanitizer: %j', (html) => {
    const component = TestBed.createComponent(BaseReportComponent).componentInstance;
    const trustedHtml = {} as SafeHtml;
    mockSanitizer.bypassSecurityTrustHtml.mockReturnValue(trustedHtml);

    const result = component['sanitize'](html);

    expect(mockSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledExactlyOnceWith(html);
    expect(result).toBe(trustedHtml);
  });

  it('propagates errors from the sanitizer', () => {
    const component = TestBed.createComponent(BaseReportComponent).componentInstance;
    const error = new Error('Sanitizer failed');
    mockSanitizer.bypassSecurityTrustHtml.mockImplementation(() => {
      throw error;
    });

    expect(() => component['sanitize']('<p>Report</p>')).toThrow(error);
    expect(mockSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledExactlyOnceWith('<p>Report</p>');
  });
});
