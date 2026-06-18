import { Setting, dateFormats, layouts, themes } from '@constants/settings.config';

import { Component, OnInit, inject } from '@angular/core';

import { UIConfig } from '@models/config-ui.model';

import { ReloadService } from '@services/reload.service';
import { AlertService } from '@services/shared/alert.service';
import { RuntimeThemeOption, ThemeCatalogService } from '@services/shared/theme-catalog.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { UiSettingsFormGroup } from '@src/app/account/settings/ui-settings/ui-settings.form';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

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

  formats: Setting[] = dateFormats;
  layouts: Setting[] = layouts;
  themes: RuntimeThemeOption[] = themes.map((theme) => ({
    ...theme,
    icon: 'palette',
    source: 'builtin',
    isDark: theme.value === 'dark'
  }));

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
