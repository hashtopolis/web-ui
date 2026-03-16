import { uiConfigDefault } from '@models/config-ui.model';
import { uiConfigSchema } from '@models/config-ui.schema';

describe('uiConfigSchema', () => {
  // Use a deep copy to avoid interference from other tests that mutate the
  // shared `uiConfigDefault` object (e.g. UISettingsUtilityClass.updateSettings).
  let defaults: typeof uiConfigDefault;

  beforeEach(() => {
    defaults = JSON.parse(JSON.stringify(uiConfigDefault));
  });

  it('should parse valid uiConfigDefault successfully', () => {
    const result = uiConfigSchema.safeParse(defaults);
    expect(result.success).toBeTrue();
    if (result.success) {
      expect(result.data.layout).toBeDefined();
      expect(result.data.theme).toBeDefined();
      expect(typeof result.data.refreshPage).toBe('boolean');
      expect(typeof result.data.refreshInterval).toBe('number');
    }
  });

  it('should fill in defaults for missing top-level fields (additive change resilience)', () => {
    // Simulate stored data from a previous version that lacks some fields
    const partial = {
      layout: 'full' as const,
      theme: 'dark' as const,
      tableSettings: {}
    };

    const result = uiConfigSchema.safeParse(partial);
    expect(result.success).toBeTrue();
    if (result.success) {
      expect(result.data.layout).toBe('full');
      expect(result.data.theme).toBe('dark');
      // Missing fields get defaults (type checks — exact values may vary)
      expect(typeof result.data.timefmt).toBe('string');
      expect(typeof result.data.refreshPage).toBe('boolean');
      expect(typeof result.data.refreshInterval).toBe('number');
    }
  });

  it('should fail on invalid layout value', () => {
    const invalid = { ...defaults, layout: 'wide' };
    const result = uiConfigSchema.safeParse(invalid);
    expect(result.success).toBeFalse();
  });

  it('should fail on invalid theme value', () => {
    const invalid = { ...defaults, theme: 'blue' };
    const result = uiConfigSchema.safeParse(invalid);
    expect(result.success).toBeFalse();
  });

  it('should fail on garbled data (string)', () => {
    expect(uiConfigSchema.safeParse('not an object').success).toBeFalse();
  });

  it('should fail on garbled data (number)', () => {
    expect(uiConfigSchema.safeParse(42).success).toBeFalse();
  });

  it('should fail on garbled data (null)', () => {
    expect(uiConfigSchema.safeParse(null).success).toBeFalse();
  });

  it('should strip extra unknown top-level keys (forward compat)', () => {
    const withExtra = { ...defaults, unknownFeatureFlag: true, beta: 'yes' };
    const result = uiConfigSchema.safeParse(withExtra);
    expect(result.success).toBeTrue();
    if (result.success) {
      expect(result.data['unknownFeatureFlag']).toBeUndefined();
      expect(result.data['beta']).toBeUndefined();
    }
  });

  it('should allow extra unknown table keys in tableSettings', () => {
    const config = {
      ...defaults,
      tableSettings: {
        ...defaults.tableSettings,
        brandNewTable: {
          columns: [0, 1, 2],
          page: 25,
          search: '',
          order: { id: 0, dataKey: '', isSortable: true, direction: 'asc' }
        }
      }
    };

    const result = uiConfigSchema.safeParse(config);
    expect(result.success).toBeTrue();
    if (result.success) {
      expect(result.data.tableSettings['brandNewTable']).toBeDefined();
    }
  });

  it('should fail on invalid tableSettings entry', () => {
    const config = {
      ...defaults,
      tableSettings: {
        brokenTable: { columns: 'not-an-array', page: 'bad' }
      }
    };

    const result = uiConfigSchema.safeParse(config);
    expect(result.success).toBeFalse();
  });

  it('should accept an empty object and fill all defaults', () => {
    const result = uiConfigSchema.safeParse({});
    expect(result.success).toBeTrue();
    if (result.success) {
      expect(['full', 'fixed']).toContain(result.data.layout);
      expect(['light', 'dark']).toContain(result.data.theme);
      expect(typeof result.data.timefmt).toBe('string');
      expect(typeof result.data.refreshPage).toBe('boolean');
      expect(typeof result.data.refreshInterval).toBe('number');
    }
  });

  it('should preserve extra fields inside tableConfig entries (passthrough)', () => {
    const config = {
      ...defaults,
      tableSettings: {
        myTable: {
          columns: [1, 2],
          page: 10,
          search: '',
          order: { id: 1, dataKey: 'name', isSortable: true, direction: 'asc' },
          before: 5,
          index: 3
        }
      }
    };

    const result = uiConfigSchema.safeParse(config);
    expect(result.success).toBeTrue();
    if (result.success) {
      const table = result.data.tableSettings['myTable'];
      expect(table['before']).toBe(5);
      expect(table['index']).toBe(3);
    }
  });

  it('should coerce string numbers to actual numbers in columns', () => {
    const config = {
      ...defaults,
      tableSettings: {
        testTable: {
          columns: ['1', '2', '3'],
          page: '25',
          search: '',
          order: { id: '0', dataKey: '', isSortable: true, direction: 'asc' }
        }
      }
    };

    const result = uiConfigSchema.safeParse(config);
    expect(result.success).toBeTrue();
    if (result.success) {
      const table = result.data.tableSettings['testTable'];
      expect(table['columns']).toEqual([1, 2, 3]);
      expect(table['page']).toBe(25);
    }
  });

  it('should coerce refreshInterval from string to number', () => {
    const config = { ...defaults, refreshInterval: '30' };
    const result = uiConfigSchema.safeParse(config);
    expect(result.success).toBeTrue();
    if (result.success) {
      expect(result.data.refreshInterval).toBe(30);
    }
  });
});
