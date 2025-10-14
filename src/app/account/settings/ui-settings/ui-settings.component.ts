import { Setting, dateFormats, layouts, themes } from 'src/app/core/_constants/settings.config';
import { UIConfig } from 'src/app/core/_models/config-ui.model';
import { LocalStorageService } from 'src/app/core/_services/storage/local-storage.service';
import { UISettingsUtilityClass } from 'src/app/shared/utils/config';

import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ReloadService } from '@services/reload.service';
import { AlertService } from '@services/shared/alert.service';

import { UiSettingsFormGroup } from '@src/app/account/settings/ui-settings/ui-settings.form';

@Component({
  selector: 'app-ui-settings',
  templateUrl: './ui-settings.component.html',
  standalone: false
})
export class UiSettingsComponent implements OnInit {
  form!: FormGroup;
  util: UISettingsUtilityClass;

  pageTitle = 'UI Settings';

  /** On form update show a spinner loading */
  isUpdatingLoading = false;

  formats: Setting[] = dateFormats;
  layouts: Setting[] = layouts;
  themes: Setting[] = themes;

  constructor(
    private service: LocalStorageService<UIConfig>,
    private alertService: AlertService,
    private reloadService: ReloadService
  ) {
    this.form = new UiSettingsFormGroup();
  }

  ngOnInit(): void {
    this.util = new UISettingsUtilityClass(this.service);
    this.loadSettings();
  }

  /**
   * Patch the form with the current UI settings from the utility class.
   */
  loadSettings(): void {
    this.form.patchValue({
      timefmt: this.util.uiConfig.timefmt,
      layout: this.util.uiConfig.layout,
      theme: this.util.uiConfig.theme,
      refreshPage: this.util.uiConfig.refreshPage,
      refreshInterval: this.util.uiConfig.refreshInterval
    });
  }

  /**
   * Handles form submission to update UI settings.
   * Updates the settings using the utility class and shows an alert message.
   */
  onSubmit(): void {
    this.isUpdatingLoading = true;

    const changedValues = this.util.updateSettings(this.form.value);
    const message = changedValues > 0 ? 'Reloading settings ...' : 'No changes were saved';

    this.alertService.showInfoMessage(message);
    this.isUpdatingLoading = false;

    this.reloadService.reloadPage();
  }

  protected readonly UiSettingsFormGroup = UiSettingsFormGroup;
}
