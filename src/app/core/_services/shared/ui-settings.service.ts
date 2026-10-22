import { DateFormat } from '@constants/settings.config';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  Sorting,
  TableConfig,
  TableSettingsKey,
  UIConfig,
  UIConfigKeys,
  uiConfigDefault
} from '@models/config-ui.model';
import { uiConfigSchema } from '@models/config-ui.schema';

import { ThemeService } from '@services/shared/theme.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { TimePrecision, dateTimeFormat, timeFormat } from '@src/app/shared/utils/datetime';

/** The key the UI configuration is stored under in local storage. */
export const UI_SETTINGS_KEY = 'ui-config';

/** Table settings that can be changed through {@link UiSettingsService.updateTableSettings}. */
export interface TableSettingsPatch {
  page?: number;
  index?: number;
  start?: number | string | undefined;
  before?: number | string | undefined;
  totalItems?: number;
  columns?: number[];
  order?: Sorting | Sorting[];
  search?: string;
}

/**
 * Single source of the user's UI settings (layout, theme, date/time formats, auto-refresh and
 * per-table settings), persisted to local storage under {@link UI_SETTINGS_KEY}.
 *
 * There is exactly one in-memory copy of the config, so a write from one consumer can no longer
 * revert what another consumer wrote. Every update builds a new config object instead of mutating
 * the current one, so {@link config} and the derived signals notify their readers. Writes from
 * other browser tabs are picked up through the `storage` event.
 */
@Injectable({ providedIn: 'root' })
export class UiSettingsService {
  private storage = inject<LocalStorageService<UIConfig>>(LocalStorageService);
  private themeService = inject(ThemeService);

  private readonly state = signal<UIConfig>(this.load());

  /** The complete UI configuration. */
  readonly config = this.state.asReadonly();
  readonly theme = computed(() => this.state().theme);
  readonly refreshInterval = computed(() => this.state().refreshInterval);

  constructor() {
    const theme = this.state().theme;
    if (theme) {
      this.themeService.theme = theme;
    }

    if (typeof window !== 'undefined') {
      fromEvent<StorageEvent>(window, 'storage')
        .pipe(
          filter((event) => event.key === UI_SETTINGS_KEY),
          takeUntilDestroyed()
        )
        .subscribe(() => this.state.set(this.load()));
    }
  }

  /**
   * Retrieves a single UI setting.
   *
   * @param key - The key of the UI setting.
   * @returns The value of the UI setting.
   */
  getSetting<K extends UIConfigKeys>(key: K): UIConfig[K] {
    return this.state()[key];
  }

  /**
   * Retrieves the full TableConfig for a specific table.
   *
   * @param key - The key for the table settings.
   * @returns The TableConfig for the key, or null if the entry is a legacy number array.
   */
  getTableConfig(key: TableSettingsKey): TableConfig | null {
    const setting = this.state().tableSettings[key];
    return setting && !Array.isArray(setting) ? setting : null;
  }

  /**
   * Retrieves the visible columns of a specific table.
   *
   * @param key - The key for the table settings.
   * @returns The column ids stored for the table, or an empty array if there are none.
   */
  getTableSettings(key: TableSettingsKey): number[] {
    const tableConfig = this.state().tableSettings[key];
    if (Array.isArray(tableConfig)) {
      return tableConfig;
    } else if (tableConfig && 'columns' in tableConfig) {
      return tableConfig.columns;
    }
    console.error(`Unexpected table configuration for key: ${key}`);
    return [];
  }

  getDateFormat(): DateFormat {
    return this.state().dateFmt;
  }

  getTimeFormat(precision: TimePrecision): string {
    return timeFormat(this.state().timeFmt, precision);
  }

  getDateTimeFormat(precision: TimePrecision): string {
    const { dateFmt, timeFmt } = this.state();
    return dateTimeFormat(dateFmt, timeFmt, precision);
  }

  /**
   * Updates top-level UI settings. Keys that are not part of the config, or whose value did not
   * change, are ignored. A changed theme is applied right away.
   *
   * @param patch - The settings to update.
   * @returns The number of settings that were changed.
   */
  updateSettings(patch: Partial<UIConfig>): number {
    const current = this.state();
    const changedKeys = (Object.keys(patch) as UIConfigKeys[]).filter(
      (key) => key in current && current[key] !== patch[key]
    );
    if (changedKeys.length === 0) {
      return 0;
    }

    const next: UIConfig = { ...current };
    for (const key of changedKeys) {
      Object.assign(next, { [key]: patch[key] });
    }
    this.commit(next);

    if (changedKeys.includes('theme')) {
      this.themeService.theme = next.theme;
    }
    return changedKeys.length;
  }

  /**
   * Updates the settings of a specific table. The pagination cursors (`start`, `before`) are always
   * replaced; every other field only when it is part of the patch. When the visible columns change
   * and the sorted column is no longer among them, the sort order is dropped.
   *
   * @param key - The key for the table settings.
   * @param patch - The table settings to update.
   */
  updateTableSettings(key: TableSettingsKey, patch: TableSettingsPatch): void {
    const existing = this.getTableConfig(key);
    if (!existing) {
      console.error(`Table settings not found for key: ${key}`);
      return;
    }

    const next: TableConfig = { ...existing, start: patch.start, before: patch.before };
    if (patch.page !== undefined) {
      next.page = patch.page;
    }
    if (patch.index !== undefined) {
      next.index = patch.index;
    }
    if (patch.columns !== undefined) {
      next.columns = patch.columns;
      if (next.order !== undefined) {
        const order = Array.isArray(next.order) ? next.order[0] : next.order;
        if (!patch.columns.map(Number).includes(order?.id ?? -1)) {
          next.order = undefined;
        }
      }
    }
    if (patch.order !== undefined) {
      next.order = patch.order;
    }
    if (patch.search !== undefined) {
      next.search = patch.search;
    }

    const current = this.state();
    this.commit({ ...current, tableSettings: { ...current.tableSettings, [key]: next } });
  }

  private load(): UIConfig {
    return this.storage.getItem(UI_SETTINGS_KEY, uiConfigSchema, uiConfigDefault);
  }

  private commit(next: UIConfig): void {
    this.state.set(next);
    try {
      this.storage.setItem(UI_SETTINGS_KEY, next, 0, uiConfigSchema);
    } catch (error) {
      console.error(error);
    }
  }
}
