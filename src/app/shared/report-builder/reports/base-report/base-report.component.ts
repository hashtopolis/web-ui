import { Subscription } from 'rxjs';
import { UIConfig, uiConfigDefault } from '@models/config-ui.model';
import { ExportService } from '@services/export/export.service';
import { GlobalService } from '@services/main.service';
import { ConfigService } from '@services/shared/config.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'base-report',
  template: '',
  standalone: false
})
export class BaseReportComponent {
  protected uiSettings: UISettingsUtilityClass;
  protected dateFormat: string;
  protected subscriptions: Subscription[] = [];

  protected gs = inject(GlobalService);
  protected cs = inject(ConfigService);
  protected router = inject(Router);
  protected settingsService = inject(LocalStorageService) as LocalStorageService<UIConfig>;
  protected sanitizer = inject(DomSanitizer);
  protected uiService = inject(UIConfigService);
  protected exportService = inject(ExportService);
  protected cdr = inject(ChangeDetectorRef);
  public dialog = inject(MatDialog);

  constructor() {
    this.uiSettings = new UISettingsUtilityClass(this.settingsService);
    this.dateFormat = this.getDateFormat();
  }

  /**
   * Retrieves the date format for rendering timestamps.
   * @returns The date format string.
   */
  private getDateFormat(): string {
    const fmt = this.uiSettings.getSetting('timefmt');

    return fmt ? fmt : uiConfigDefault.timefmt;
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
