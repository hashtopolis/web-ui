import { TableConfig, UIConfig, uiConfigDefault } from '@models/config-ui.model';
import { uiConfigSchema } from '@models/config-ui.schema';

import { LocalStorageService } from '@services/storage/local-storage.service';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

/**
 * Unit tests for the constructor's `tableSettings` backfill: when a stored
 * `ui-config` lacks keys present in `uiConfigDefault.tableSettings` (because
 * the user's localStorage predates a freshly-added table entry), the missing
 * keys must be populated from defaults so consumers (`getTableSettings`,
 * `getTableConfig`) don't render empty data tables.
 */
describe('UISettingsUtilityClass — backfillMissingTableSettings', () => {
  let setItemSpy: jasmine.Spy;

  function makeStorage(stored: UIConfig): LocalStorageService<UIConfig> {
    setItemSpy = jasmine.createSpy('setItem');
    return {
      getItem: jasmine.createSpy('getItem').and.returnValue(stored),
      setItem: setItemSpy
    } as unknown as LocalStorageService<UIConfig>;
  }

  function cloneDefault(): UIConfig {
    return JSON.parse(JSON.stringify(uiConfigDefault));
  }

  it('backfills a missing default key so getTableSettings returns the default columns and does not log', () => {
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

  it('persists the merged config exactly once when keys were missing', () => {
    const stored = cloneDefault();
    delete (stored.tableSettings as Record<string, unknown>)['apiTokensTable'];

    new UISettingsUtilityClass(makeStorage(stored));

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(
      UISettingsUtilityClass.KEY,
      jasmine.objectContaining({
        tableSettings: jasmine.objectContaining({ apiTokensTable: jasmine.anything() })
      }),
      0,
      uiConfigSchema
    );
  });

  it('does not call setItem when storage already contains every default key', () => {
    new UISettingsUtilityClass(makeStorage(cloneDefault()));

    expect(setItemSpy).not.toHaveBeenCalled();
  });
});
