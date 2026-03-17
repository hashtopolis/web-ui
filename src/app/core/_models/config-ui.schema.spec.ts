import { uiConfigDefault } from '@models/config-ui.model';
import { uiConfigSchema, uisSettingsSchema } from '@models/config-ui.schema';

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

describe('uisSettingsSchema', () => {
  /** A complete valid UiSettings object for baseline assertions. */
  const validSettings = {
    chunktime: 600,
    agentStatLimit: 10,
    agentStatTension: 0.4,
    agentTempThreshold1: 75,
    agentTempThreshold2: 90,
    agentUtilThreshold1: 80,
    agentUtilThreshold2: 95,
    statustimer: 5,
    agenttimeout: 30,
    maxSessionLength: 0,
    hashcatBrainEnable: 0,
    hashlistAlias: '#HL#',
    blacklistChars: '?/',
    _timestamp: Date.now(),
    _expiresin: 72 * 60 * 60 * 1000
  };

  it('should parse a valid complete object unchanged', () => {
    const result = uisSettingsSchema.safeParse(validSettings);
    expect(result.success).toBeTrue();
    if (result.success) {
      expect(result.data.chunktime).toBe(600);
      expect(result.data.hashlistAlias).toBe('#HL#');
      expect(result.data.blacklistChars).toBe('?/');
      expect(result.data._timestamp).toBe(validSettings._timestamp);
      expect(result.data._expiresin).toBe(validSettings._expiresin);
    }
  });

  it('should migrate old [{name, value}] array format to object', () => {
    const oldFormat = [
      { name: 'chunktime', value: '600' },
      { name: 'agentStatLimit', value: '10' },
      { name: 'agentStatTension', value: '0.4' },
      { name: 'agentTempThreshold1', value: '75' },
      { name: 'agentTempThreshold2', value: '90' },
      { name: 'agentUtilThreshold1', value: '80' },
      { name: 'agentUtilThreshold2', value: '95' },
      { name: 'statustimer', value: '5' },
      { name: 'agenttimeout', value: '30' },
      { name: 'maxSessionLength', value: '0' },
      { name: 'hashcatBrainEnable', value: '0' },
      { name: 'hashlistAlias', value: '#HL#' },
      { name: 'blacklistChars', value: '' },
      { name: '_timestamp', value: 1000 },
      { name: '_expiresin', value: 259200000 }
    ];

    const result = uisSettingsSchema.safeParse(oldFormat);
    expect(result.success).toBeTrue();
    if (result.success) {
      expect(result.data.chunktime).toBe(600);
      expect(result.data.hashlistAlias).toBe('#HL#');
      expect(result.data._timestamp).toBe(1000);
    }
  });

  it('should fill defaults for missing fields in partial old-format array', () => {
    const partialOld = [
      { name: 'chunktime', value: '600' },
      { name: 'statustimer', value: '5' }
    ];

    const result = uisSettingsSchema.safeParse(partialOld);
    expect(result.success).toBeTrue();
    if (result.success) {
      expect(result.data.chunktime).toBe(600);
      expect(result.data.statustimer).toBe(5);
      // Missing fields filled with defaults
      expect(result.data.agentStatLimit).toBe(0);
      expect(result.data.hashlistAlias).toBe('#HL#');
      expect(result.data.blacklistChars).toBe('');
      expect(result.data._timestamp).toBe(0);
      expect(result.data._expiresin).toBe(72 * 60 * 60 * 1000);
    }
  });

  it('should skip malformed entries in array and fill defaults', () => {
    const malformed = [
      { name: 'chunktime', value: '600' },
      { noname: true },
      { name: 'statustimer' }, // missing value
      42,
      null,
      { name: 'agenttimeout', value: '10' }
    ];

    const result = uisSettingsSchema.safeParse(malformed);
    expect(result.success).toBeTrue();
    if (result.success) {
      expect(result.data.chunktime).toBe(600);
      expect(result.data.agenttimeout).toBe(10);
      // Malformed entries skipped, defaults filled
      expect(result.data.statustimer).toBe(0);
      expect(result.data.agentStatLimit).toBe(0);
    }
  });

  it('should fill all defaults for empty array', () => {
    const result = uisSettingsSchema.safeParse([]);
    expect(result.success).toBeTrue();
    if (result.success) {
      expect(result.data.chunktime).toBe(0);
      expect(result.data.hashlistAlias).toBe('#HL#');
      expect(result.data.blacklistChars).toBe('');
      expect(result.data._timestamp).toBe(0);
      expect(result.data._expiresin).toBe(72 * 60 * 60 * 1000);
    }
  });

  it('should fail validation for non-array non-object input', () => {
    expect(uisSettingsSchema.safeParse('garbage').success).toBeFalse();
    expect(uisSettingsSchema.safeParse(42).success).toBeFalse();
    expect(uisSettingsSchema.safeParse(null).success).toBeFalse();
  });

  it('should preserve _timestamp and _expiresin metadata through migration', () => {
    const oldFormat = [
      { name: '_timestamp', value: 1700000000000 },
      { name: '_expiresin', value: 86400000 }
    ];

    const result = uisSettingsSchema.safeParse(oldFormat);
    expect(result.success).toBeTrue();
    if (result.success) {
      expect(result.data._timestamp).toBe(1700000000000);
      expect(result.data._expiresin).toBe(86400000);
    }
  });

  it('should coerce string numbers to actual numbers', () => {
    const withStrings = {
      ...validSettings,
      chunktime: '600',
      statustimer: '5',
      agentTempThreshold1: '75'
    };

    const result = uisSettingsSchema.safeParse(withStrings);
    expect(result.success).toBeTrue();
    if (result.success) {
      expect(result.data.chunktime).toBe(600);
      expect(result.data.statustimer).toBe(5);
      expect(result.data.agentTempThreshold1).toBe(75);
    }
  });
});
