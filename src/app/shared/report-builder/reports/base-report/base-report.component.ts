import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { UIConfig } from '@models/config-ui.model';

import { ExportService } from '@services/export/export.service';
import { GlobalService } from '@services/main.service';
import { ConfigService } from '@services/shared/config.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { TimePrecision } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'base-report',
  template: '',
  standalone: false
})
export class BaseReportComponent {
  protected uiSettings: UISettingsUtilityClass;
  protected dateTimeFormat: string;

  protected gs = inject(GlobalService);
  protected cs = inject(ConfigService);
  protected router = inject(Router);
  protected settingsService = inject<LocalStorageService<UIConfig>>(LocalStorageService);
  protected sanitizer = inject(DomSanitizer);
  protected uiService = inject(UIConfigService);
  protected exportService = inject(ExportService);
  protected cdr = inject(ChangeDetectorRef);
  public dialog = inject(MatDialog);

  constructor() {
    this.uiSettings = new UISettingsUtilityClass(this.settingsService);
    this.dateTimeFormat = this.uiSettings.getDateTimeFormat(TimePrecision.SECONDS);
  }

  /**
   * Sanitizes the given HTML string to create a safe HTML value.
   * @param html - The HTML string to be sanitized.
   * @returns A SafeHtml object that represents the sanitized HTML.
   */
  protected sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
