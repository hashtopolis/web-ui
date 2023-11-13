/* eslint-disable @angular-eslint/component-selector */
import {
  ChangeDetectorRef,
  Component,
  Input,
  Renderer2,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  UIConfig,
  uiConfigDefault
} from 'src/app/core/_models/config-ui.model';

import { ExportService } from 'src/app/core/_services/export/export.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { HTTableComponent } from '../ht-table/ht-table.component';
import { LocalStorageService } from 'src/app/core/_services/storage/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { UISettingsUtilityClass } from 'src/app/shared/utils/config';

@Component({
  selector: 'base-table',
  template: ''
})
export class BaseTableComponent {
  protected uiSettings: UISettingsUtilityClass;
  protected dateFormat: string;
  protected subscriptions: Subscription[] = [];

  @ViewChild('table') table: HTTableComponent;

  constructor(
    protected gs: GlobalService,
    protected renderer: Renderer2,
    protected router: Router,
    protected settingsService: LocalStorageService<UIConfig>,
    protected sanitizer: DomSanitizer,
    protected snackBar: MatSnackBar,
    protected uiService: UIConfigService,
    protected exportService: ExportService,
    protected cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    this.uiSettings = new UISettingsUtilityClass(settingsService);
    this.dateFormat = this.getDateFormat();
  }

  /**
   * Retrieves the date format for rendering timestamps.
   * @returns The date format string.
   */
  private getDateFormat(): string {
    const fmt = this.uiSettings.getSetting<string>('timefmt');

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

  reload(): void {
    if (this.table) {
      this.table.reload();
    }
  }
}
