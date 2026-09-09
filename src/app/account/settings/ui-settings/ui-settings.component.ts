import { DateFormat, Setting, TimeFormat, dateFormats, layouts, themes, timeFormats } from '@constants/settings.config';

import { Component, OnInit, inject } from '@angular/core';

import { UIConfig } from '@models/config-ui.model';
import { BuiltInTheme } from '@models/config-ui.model';

import { ReloadService } from '@services/reload.service';
import { AlertService } from '@services/shared/alert.service';
import { RuntimeThemeOption, ThemeCatalogService } from '@services/shared/theme-catalog.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { UiSettingsFormGroup } from '@src/app/account/settings/ui-settings/ui-settings.form';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { TimePrecision, dateTimeFormat, formatDate } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-ui-settings',
  templateUrl: './ui-settings.component.html',
  styleUrls: ['./ui-settings.component.scss'],
  standalone: false
})
export class UiSettingsComponent implements OnInit {
  private service = inject<LocalStorageService<UIConfig>>(LocalStorageService);
  private alertService = inject(AlertService);
  private reloadService = inject(ReloadService);
  private themeCatalog = inject(ThemeCatalogService);

  form = new UiSettingsFormGroup();
  util: UISettingsUtilityClass;

  pageTitle = 'UI Settings';

  /** On form update show a spinner loading */
  isUpdatingLoading = false;

  dateFormats: Setting<DateFormat>[] = dateFormats;
  timeFormats: Setting<TimeFormat>[] = timeFormats;
  layouts: Setting[] = layouts;
  themes: RuntimeThemeOption[] = themes.map((theme) => ({
    ...theme,
    icon: 'palette',
    source: 'builtin',
    isDark: theme.value === BuiltInTheme.DARK
  }));

  private readonly previewDate = new Date();

  get datePreview(): string {
    return formatDate(this.previewDate, this.form.controls.dateFmt.value);
  }

  get dateTimePreview(): string {
    return formatDate(
      this.previewDate,
      dateTimeFormat(this.form.controls.dateFmt.value, this.form.controls.timeFmt.value, TimePrecision.SECONDS)
    );
  }

  ngOnInit(): void {
    this.util = new UISettingsUtilityClass(this.service);
    this.themeCatalog.getThemes().subscribe((themeOptions) => {
      this.themes = themeOptions;
    });
    this.loadSettings();
  }

  /**
   * Patch the form with the current UI settings from the utility class.
   */
  loadSettings(): void {
    this.form.patchValue({
      dateFmt: this.util.uiConfig.dateFmt,
      timeFmt: this.util.uiConfig.timeFmt,
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
