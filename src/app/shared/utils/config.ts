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
   * @param {string} key - The key for the table settings.
   * @param {object} settings - The settings object containing properties to update.
   * @param {number} [settings.page] - The page number to set.
   * @param {number} [settings.start] - The start index to set.
   * @param {number[]} [settings.columns] - An array of column numbers to set.
   * @param {number[]} [settings.search] - An array of column numbers to set.
   * @param {any[]} [settings.order] - An array defining the order of columns.
   */
  updateTableSettings(
    key: string,
    settings: {
      page?: number;
      index?: number;
      start?: number;
      before?: number;
      totalItems?: number;
      columns?: number[];
      order?: any[];
      search?: string;
    }
  ): void {
    try {
      const existingTableSettings = this.uiConfig.tableSettings[key];

      if (existingTableSettings) {
        // Update the settings based on the provided parameters
        if (settings.page !== undefined) {
          existingTableSettings['page'] = settings.page;
        }
        existingTableSettings['start'] = settings.start;
        existingTableSettings['before'] = settings.before;
        if (settings.index !== undefined) {
          existingTableSettings['index'] = settings.index;
        }
        if (settings.columns !== undefined) {
          // Save columns
          existingTableSettings['columns'] = settings.columns;
          // Check if the value saved in order is visible; if not, remove it
          const orderValue: number = existingTableSettings['order']['id'];
          const numericColumns: number[] =
            existingTableSettings['columns'].map(Number);
          if (!numericColumns.includes(orderValue)) {
            existingTableSettings['order'] = undefined;
          }
        }
        if (settings.order !== undefined) {
          existingTableSettings['order'] = settings.order;
        }
        if (settings.search !== undefined) {
          existingTableSettings['search'] = settings.search;
        }

        this.storage.setItem(UISettingsUtilityClass.KEY, this.uiConfig, 0);
      } else {
        // If the key doesn't exist, log an error or handle it accordingly
        console.error(`Table settings not found for key: ${key}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Retrieves the table settings for a specific key from the UI configuration.
   *
   * @param key - The key for the table settings.
   * @returns An array of column names as table settings for the key.
   */
  getTableSettings(key: string): number[] {
    try {
      const tableConfig = this.uiConfig.tableSettings[key];

      if (Array.isArray(tableConfig)) {
        // If it's an array (number[]), return it
        return tableConfig;
      } else if ('columns' in tableConfig) {
        // If it's a TableConfig, extract and return the columns property
        return tableConfig.columns;
      } else {
        // If it's neither, log an error and return an empty array
        console.error(`Unexpected table configuration for key: ${key}`);
        return [];
      }
    } catch (error) {
      console.error(error);
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
