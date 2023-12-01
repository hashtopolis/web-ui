import {
  UIConfig,
  uiConfigDefault
} from 'src/app/core/_models/config-ui.model';

import { LocalStorageService } from 'src/app/core/_services/storage/local-storage.service';

/**
 * Utility class for managing user interface settings and configurations.
 */
export class UISettingsUtilityClass {
  /** The key used for storing UI configuration in local storage. */
  static readonly KEY = 'ui-config';

  /** The UI configuration object. */
  uiConfig: UIConfig;

  /**
   * Creates an instance of the UISettingsUtilityClass.
   *
   * @param storage - The LocalStorageService used for managing UI configuration storage.
   */
  constructor(private storage: LocalStorageService<UIConfig>) {
    this.uiConfig = storage.getItem(UISettingsUtilityClass.KEY);
    if (!this.uiConfig) {
      this.uiConfig = uiConfigDefault;
    }
  }

  /**
   * Updates the table settings for a specific key in the UI configuration.
   *
   * @param key - The key for the table settings.
   * @param columns - An array of column names to set as table settings for the key.
   */
  updateTableSettings(key: string, columns: number[]): void {
    this.uiConfig.tableSettings[key] = columns;
    this.storage.setItem(UISettingsUtilityClass.KEY, this.uiConfig, 0);
  }

  /**
   * Retrieves the table settings for a specific key from the UI configuration.
   *
   * @param key - The key for the table settings.
   * @returns An array of column names as table settings for the key.
   */
  getTableSettings(key: string): number[] {
    try {
      return this.uiConfig.tableSettings[key];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  /**
   * Retrieves a specific user interface setting from the UI configuration.
   *
   * @param key - The key for the UI setting.
   * @returns The value of the UI setting, or undefined if not found.
   */
  getSetting<T>(key: string): T | undefined {
    try {
      return this.uiConfig[key];
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  /**
   * Updates multiple user interface settings in the UI configuration.
   *
   * @param settings - An object containing key-value pairs of settings to update.
   * @returns The number of settings that were successfully changed.
   */
  updateSettings(settings: { [key: string]: any }): number {
    const keys = Object.keys(settings);
    let changedValues = 0;

    for (const key of keys) {
      if (key in this.uiConfig && this.uiConfig[key] !== settings[key]) {
        this.uiConfig[key] = settings[key];
        changedValues += 1;
      }
    }

    if (changedValues > 0) {
      this.storage.setItem(UISettingsUtilityClass.KEY, this.uiConfig, 0);
    }

    return changedValues;
  }
}
