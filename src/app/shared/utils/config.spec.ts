import { z } from 'zod';

import { TableConfig, UIConfig, uiConfigDefault } from '@models/config-ui.model';

import { LocalStorageService } from '@services/storage/local-storage.service';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

/**
 * Verifies that the constructor loads a complete `tableSettings` map even when the stored value lacks
 * newly-added default keys. The merge itself is performed by `tableSettingsSchema.transform(...)`; this
 * suite exercises the integration through the utility class so consumers (`getTableSettings`,
 * `getTableConfig`) never see a partial map.
 */
describe('UISettingsUtilityClass — tableSettings backfill via schema', () => {
  /**
   * Mocks `LocalStorageService` so it routes `getItem` through the provided Zod schema, matching the
   * real implementation. Without this, the utility would receive the raw partial object and bypass the
   * schema-level merge entirely.
   */
  function makeStorage(stored: UIConfig): LocalStorageService<UIConfig> {
    return {
      getItem: jasmine.createSpy('getItem').and.callFake((_key: string, schema?: z.ZodType<UIConfig>) => {
        if (!schema) {
          return stored;
        }
        const result = schema.safeParse(stored);
        return result.success ? result.data : stored;
      }),
      setItem: jasmine.createSpy('setItem')
    } as unknown as LocalStorageService<UIConfig>;
  }

  function cloneDefault(): UIConfig {
    return JSON.parse(JSON.stringify(uiConfigDefault));
  }

  it('backfills a missing default key so getTableSettings returns the default columns', () => {
    const errorSpy = spyOn(console, 'error');
    const stored = cloneDefault();
    delete (stored.tableSettings as Record<string, unknown>)['apiTokensTable'];

    const utility = new UISettingsUtilityClass(makeStorage(stored));

    const expected = (uiConfigDefault.tableSettings['apiTokensTable'] as TableConfig).columns;
    expect(utility.getTableSettings('apiTokensTable')).toEqual([...expected]);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('preserves user-customised entries when their key already exists in storage', () => {
    const stored = cloneDefault();
    const customColumns = [99, 7, 3];
    (stored.tableSettings as Record<string, TableConfig>)['usersTable'] = {
      columns: customColumns,
      page: 25,
      search: ''
    };

    const utility = new UISettingsUtilityClass(makeStorage(stored));

    expect(utility.getTableSettings('usersTable')).toEqual(customColumns);
  });
});

/**
 * Every holder of `UISettingsUtilityClass` (each `ht-table`, each data source, `AutoRefreshService`,
 * ...) keeps its own snapshot of the whole UI config, and a write persists that entire snapshot.
 * These cover the read-modify-write that stops the last writer from reverting everyone else.
 */
describe('UISettingsUtilityClass — concurrent holders', () => {
  /** Mock storage backed by one shared object, so two utilities see each other's writes. */
  function makeSharedStorage(): { service: LocalStorageService<UIConfig>; read: () => UIConfig } {
    let stored: UIConfig = JSON.parse(JSON.stringify(uiConfigDefault));
    const service = {
      getItem: jasmine.createSpy('getItem').and.callFake(() => JSON.parse(JSON.stringify(stored))),
      setItem: jasmine.createSpy('setItem').and.callFake((_key: string, value: UIConfig) => {
        stored = JSON.parse(JSON.stringify(value));
      })
    } as unknown as LocalStorageService<UIConfig>;
    return { service, read: () => stored };
  }

  it('does not revert another holder’s view mode when writing a top-level setting', () => {
    const { service, read } = makeSharedStorage();
    // Constructed first, so its snapshot predates every change below — this is `AutoRefreshService`.
    const autoRefreshHolder = new UISettingsUtilityClass(service);
    const tableHolder = new UISettingsUtilityClass(service);

    tableHolder.updateTableView('tasksTable', 'cards');
    autoRefreshHolder.updateSettings({ refreshPage: true });

    expect((read().tableSettings['tasksTable'] as TableConfig).view).toBe('cards');
    expect(read().refreshPage).toBeTrue();
  });

  it('does not revert another holder’s column selection', () => {
    const { service, read } = makeSharedStorage();
    const autoRefreshHolder = new UISettingsUtilityClass(service);
    const tableHolder = new UISettingsUtilityClass(service);

    tableHolder.updateTableSettings('tasksTable', { columns: [1, 2, 3], page: 25 });
    autoRefreshHolder.updateSettings({ refreshPage: true });

    expect((read().tableSettings['tasksTable'] as TableConfig).columns).toEqual([1, 2, 3]);
  });

  it('does not revert a top-level setting when another holder writes table settings', () => {
    const { service, read } = makeSharedStorage();
    const tableHolder = new UISettingsUtilityClass(service);
    const settingsHolder = new UISettingsUtilityClass(service);

    settingsHolder.updateSettings({ refreshInterval: 42 });
    tableHolder.updateTableSettings('tasksTable', { page: 50 });

    expect(read().refreshInterval).toBe(42);
    expect((read().tableSettings['tasksTable'] as TableConfig).page).toBe(50);
  });
});
