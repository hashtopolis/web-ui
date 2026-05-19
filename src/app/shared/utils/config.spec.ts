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
