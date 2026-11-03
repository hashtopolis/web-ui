import { z } from 'zod';

import { TestBed } from '@angular/core/testing';

import { BuiltInTheme, TableConfig, TableSortDirection, UIConfig, uiConfigDefault } from '@models/config-ui.model';

import { ThemeService } from '@services/shared/theme.service';
import { UI_SETTINGS_KEY, UiSettingsService } from '@services/shared/ui-settings.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

function cloneDefault(): UIConfig {
  return JSON.parse(JSON.stringify(uiConfigDefault));
}

/**
 * Mock `LocalStorageService` backed by one stored object. `getItem` routes through the provided Zod
 * schema like the real implementation does, so schema-level merges (e.g. the `tableSettings`
 * backfill) are exercised too.
 */
function makeStorage(initial: UIConfig) {
  let stored = JSON.parse(JSON.stringify(initial)) as UIConfig;
  const service = {
    getItem: jasmine.createSpy('getItem').and.callFake((_key: string, schema?: z.ZodType<UIConfig>) => {
      const copy = JSON.parse(JSON.stringify(stored)) as UIConfig;
      if (!schema) {
        return copy;
      }
      const result = schema.safeParse(copy);
      return result.success ? result.data : copy;
    }),
    setItem: jasmine.createSpy('setItem').and.callFake((_key: string, value: UIConfig) => {
      stored = JSON.parse(JSON.stringify(value));
    })
  };
  return {
    service,
    read: () => stored,
    /** Simulates another browser tab writing the config. */
    write: (value: UIConfig) => (stored = JSON.parse(JSON.stringify(value)))
  };
}

describe('UiSettingsService', () => {
  let storage: ReturnType<typeof makeStorage>;
  let themeService: { theme: string | null };

  function setup(initial: UIConfig = cloneDefault()): UiSettingsService {
    storage = makeStorage(initial);
    themeService = { theme: null };
    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useValue: storage.service },
        { provide: ThemeService, useValue: themeService }
      ]
    });
    return TestBed.inject(UiSettingsService);
  }

  describe('loading', () => {
    it('backfills a missing default table key so getTableSettings returns the default columns', () => {
      const errorSpy = spyOn(console, 'error');
      const stored = cloneDefault();
      delete (stored.tableSettings as Record<string, unknown>)['apiTokensTable'];

      const service = setup(stored);

      const expected = (uiConfigDefault.tableSettings['apiTokensTable'] as TableConfig).columns;
      expect(service.getTableSettings('apiTokensTable')).toEqual([...expected]);
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it('preserves user-customised table entries that already exist in storage', () => {
      const stored = cloneDefault();
      const customColumns = [99, 7, 3];
      (stored.tableSettings as Record<string, TableConfig>)['usersTable'] = {
        columns: customColumns,
        page: 25,
        search: ''
      };

      const service = setup(stored);

      expect(service.getTableSettings('usersTable')).toEqual(customColumns);
    });

    it('applies the stored theme on creation', () => {
      setup({ ...cloneDefault(), theme: BuiltInTheme.DARK });

      expect(themeService.theme).toBe(BuiltInTheme.DARK);
    });
  });

  describe('updateSettings', () => {
    it('persists changed values and returns how many changed', () => {
      const service = setup();

      const changed = service.updateSettings({ refreshInterval: 42, refreshPage: !uiConfigDefault.refreshPage });

      expect(changed).toBe(2);
      expect(storage.read().refreshInterval).toBe(42);
      expect(service.getSetting('refreshInterval')).toBe(42);
      expect(service.refreshInterval()).toBe(42);
    });

    it('does not write when nothing changed', () => {
      const service = setup();

      const changed = service.updateSettings({ refreshInterval: uiConfigDefault.refreshInterval });

      expect(changed).toBe(0);
      expect(storage.service.setItem).not.toHaveBeenCalled();
    });

    it('replaces the config object instead of mutating it', () => {
      const service = setup();
      const before = service.config();

      service.updateSettings({ refreshInterval: 42 });

      expect(service.config()).not.toBe(before);
      expect(before.refreshInterval).toBe(uiConfigDefault.refreshInterval);
    });

    it('applies a changed theme right away', () => {
      const service = setup();

      service.updateSettings({ theme: BuiltInTheme.DARK });

      expect(themeService.theme).toBe(BuiltInTheme.DARK);
      expect(service.theme()).toBe(BuiltInTheme.DARK);
    });
  });

  describe('updateTableSettings', () => {
    function tasksTable(): TableConfig {
      return storage.read().tableSettings['tasksTable'] as TableConfig;
    }

    it('merges the patch into the stored table settings', () => {
      const service = setup();
      const before = tasksTable();

      service.updateTableSettings('tasksTable', { columns: [1, 2, 3], page: 50 });

      expect(tasksTable().columns).toEqual([1, 2, 3]);
      expect(tasksTable().page).toBe(50);
      expect(tasksTable().search).toBe(before.search);
      expect(service.getTableConfig('tasksTable')).toEqual(jasmine.objectContaining({ columns: [1, 2, 3], page: 50 }));
    });

    it('drops the sort order when its column is hidden', () => {
      const service = setup();
      service.updateTableSettings('tasksTable', {
        columns: [1, 2, 3],
        order: { id: 2, dataKey: 'name', isSortable: true, direction: TableSortDirection.ASC }
      });

      service.updateTableSettings('tasksTable', { columns: [1, 3] });

      expect(tasksTable().order).toBeUndefined();
    });

    it('keeps the sort order while its column stays visible', () => {
      const service = setup();
      const order = { id: 2, dataKey: 'name', isSortable: true, direction: TableSortDirection.ASC };
      service.updateTableSettings('tasksTable', { columns: [1, 2, 3], order });

      service.updateTableSettings('tasksTable', { columns: [2, 3] });

      expect(tasksTable().order).toEqual(order);
    });

    it('keeps top-level settings written before it', () => {
      const service = setup();

      service.updateSettings({ refreshInterval: 42 });
      service.updateTableSettings('tasksTable', { page: 50 });

      expect(storage.read().refreshInterval).toBe(42);
      expect(tasksTable().page).toBe(50);
    });
  });

  it('picks up settings written by another browser tab', () => {
    const service = setup();

    storage.write({ ...cloneDefault(), refreshInterval: 42 });
    window.dispatchEvent(new StorageEvent('storage', { key: UI_SETTINGS_KEY }));

    expect(service.getSetting('refreshInterval')).toBe(42);
  });
});
