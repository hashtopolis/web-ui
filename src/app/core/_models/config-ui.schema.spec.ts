import { TableConfig, uiConfigDefault } from '@models/config-ui.model';
import { sortingSchema, uiConfigSchema, uisSettingsSchema } from '@models/config-ui.schema';

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
      expect('unknownFeatureFlag' in result.data).toBeFalse();
      expect('beta' in result.data).toBeFalse();
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
      const table = result.data.tableSettings['myTable'] as TableConfig;
      expect(table.before).toBe(5);
      expect(table.index).toBe(3);
    }
  });

  it('should preserve the parent field in sorting order (relationship sort)', () => {
    const config = {
      ...defaults,
      tableSettings: {
        tasksTable: {
          columns: [1, 2],
          page: 25,
          search: '',
          order: { id: 2, dataKey: 'taskName', isSortable: true, direction: 'asc', parent: 'task' }
        }
      }
    };

    const result = uiConfigSchema.safeParse(config);
    expect(result.success).toBeTrue();
    if (result.success) {
      const table = result.data.tableSettings['tasksTable'] as TableConfig;
      expect(table.order).toBeDefined();
      expect((table.order as { parent?: string }).parent).toBe('task');
    }
  });

  it('should accept base64 cursor strings in start and before fields', () => {
    const cursor = 'eyJwcmltYXJ5Ijp7InRhc2tXcmFwcGVySWQiOjE4fX0=';
    const config = {
      ...defaults,
      tableSettings: {
        tasksTable: {
          columns: [0, 1, 2],
          page: 5,
          search: '',
          order: { id: 0, dataKey: 'taskWrapperId', isSortable: true, direction: 'desc' as const },
          start: cursor,
          before: cursor,
          index: 1
        }
      }
    };

    const result = uiConfigSchema.safeParse(config);
    expect(result.success).toBeTrue();
    if (result.success) {
      const table = result.data.tableSettings['tasksTable'] as TableConfig;
      expect(table.start).toBe(cursor);
      expect(table.before).toBe(cursor);
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
      const table = result.data.tableSettings['testTable'] as TableConfig;
      expect(table.columns).toEqual([1, 2, 3]);
      expect(table.page).toBe(25);
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

/**
 * Replicates the sort parameter construction from
 * RequestParamBuilder.addSorting (builder-implementation.service.ts).
 */
function buildSortParam(col: { dataKey: string; direction: string; parent?: string }): string {
  const direction = col.direction === 'asc' ? '' : '-';
  const parent = col.parent ? `${col.parent}.` : '';
  return `${direction}${parent}${col.dataKey}`;
}

describe('sortingSchema – sort parameter round-trip', () => {
  /**
   * Every sortable column across all tables. Columns with a `parent` field
   * produce a relationship sort like "task.taskName"; the rest produce a
   * simple sort like "priority".
   */
  const sortableColumns: { table: string; dataKey: string; id: number; parent?: string }[] = [
    // tasks-table (the only table with parent-based sort columns)
    { table: 'tasks', dataKey: 'taskWrapperId', id: 0 },
    { table: 'tasks', dataKey: 'taskType', id: 1 },
    { table: 'tasks', dataKey: 'taskName', id: 2, parent: 'task' },
    { table: 'tasks', dataKey: 'hashlistId', id: 5, parent: 'hashlist' },
    { table: 'tasks', dataKey: 'cracked', id: 7 },
    { table: 'tasks', dataKey: 'groupName', id: 9, parent: 'accessGroup' },
    { table: 'tasks', dataKey: 'isSmall', id: 10, parent: 'task' },
    { table: 'tasks', dataKey: 'isCpuTask', id: 11, parent: 'task' },
    { table: 'tasks', dataKey: 'priority', id: 12 },
    { table: 'tasks', dataKey: 'maxAgents', id: 13 },
    // Representative columns from other tables (no parent)
    { table: 'agents', dataKey: 'id', id: 0 },
    { table: 'agents', dataKey: 'agentName', id: 1 },
    { table: 'users', dataKey: 'name', id: 1 },
    { table: 'hashlists', dataKey: 'id', id: 0 },
    { table: 'files', dataKey: 'filename', id: 1 },
    { table: 'cracks', dataKey: 'timeCracked', id: 0 }
  ];

  for (const direction of ['asc', 'desc'] as const) {
    for (const col of sortableColumns) {
      const label = col.parent ? `${col.parent}.${col.dataKey}` : col.dataKey;

      it(`[${col.table}] sort=${direction === 'desc' ? '-' : ''}${label} should survive schema round-trip`, () => {
        // 1. Build the sorting object as onColumnHeaderClick would
        const initial = {
          id: col.id,
          dataKey: col.dataKey,
          isSortable: true as const,
          direction,
          ...(col.parent ? { parent: col.parent } : {})
        };

        // 2. Round-trip through sortingSchema (simulates localStorage save + restore)
        const result = sortingSchema.safeParse(initial);
        expect(result.success).toBeTrue();

        // 3. The sort parameter sent to the API must be identical
        const expected = buildSortParam(initial);
        const actual = buildSortParam(result.data as typeof initial);
        expect(actual).toBe(expected);
      });
    }
  }

  it('should strip unknown fields on the sorting object', () => {
    const withExtra = {
      id: 1,
      dataKey: 'taskName',
      isSortable: true,
      direction: 'asc' as const,
      parent: 'task',
      render: 'should not survive',
      routerLink: 'should not survive'
    };

    const result = sortingSchema.safeParse(withExtra);
    expect(result.success).toBeTrue();
    if (result.success) {
      expect((result.data as Record<string, unknown>)['render']).toBeUndefined();
      expect((result.data as Record<string, unknown>)['routerLink']).toBeUndefined();
      expect(result.data.parent).toBe('task');
    }
  });
});
