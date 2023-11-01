/* eslint-disable @angular-eslint/component-selector */
import { Component, Renderer2 } from '@angular/core';
import { GlobalService } from '../../_services/main.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UISettingsUtilityClass } from 'src/app/shared/utils/config';
import { LocalStorageService } from '../../_services/storage/local-storage.service';
import { UIConfig, uiConfigDefault } from '../../_models/config-ui.model';
import { UIConfigService } from '../../_services/shared/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'base-table',
  template: ''
})
export class BaseTableComponent {

  protected uiSettings: UISettingsUtilityClass
  protected dateFormat: string
  protected subscriptions: Subscription[] = []

  constructor(
    protected gs: GlobalService,
    protected renderer: Renderer2,
    protected router: Router,
    protected settingsService: LocalStorageService<UIConfig>,
    protected sanitizer: DomSanitizer,
    protected snackBar: MatSnackBar,
    protected uiService: UIConfigService,
    public dialog: MatDialog,
  ) {
    this.uiSettings = new UISettingsUtilityClass(settingsService)
    this.dateFormat = this.getDateFormat()
  }

  /**
   * Retrieves the date format for rendering timestamps.
   * @todo Change to localstorage
   * @returns The date format string.
   */
  private getDateFormat(): string {
    const fmt = this.uiSettings.getSetting<string>('timefmt')

    return fmt ? fmt : uiConfigDefault.timefmt
  }

  /**
   * Sanitizes the given HTML string to create a safe HTML value.
   * @param html - The HTML string to be sanitized.
   * @returns A SafeHtml object that represents the sanitized HTML.
   */
  protected sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

}