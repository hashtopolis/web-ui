import { RequestParamBuilder } from './builder-implementation.service';
import { setParameter } from '@src/app/core/_services/buildparams';
import { uiConfigDefault, TableConfig } from '@models/config-ui.model';
import { SortingColumn } from '@components/tables/ht-table/ht-table.models';

function isTableConfig(value: number[] | TableConfig): value is TableConfig {
  return !Array.isArray(value) && typeof value === 'object' && 'order' in value;
}

/**
 * Collects all tables from uiConfigDefault that have a single sort `order`
 * object (not an array). This covers the standard case used by most tables.
 */
function getTablesWithSortOrder(): Array<{ name: string; config: TableConfig }> {
  return Object.entries(uiConfigDefault.tableSettings)
    .filter(([, cfg]) => isTableConfig(cfg) && !Array.isArray(cfg.order))
    .map(([name, cfg]) => ({ name, config: cfg as TableConfig }));
}

describe('RequestParamBuilder – default sort serialization', () => {
  // ── 1. Sanity checks on uiConfigDefault ─────────────────────────────

  describe('uiConfigDefault table orders', () => {
    const tables = getTablesWithSortOrder();

    tables.forEach(({ name, config }) => {
      it(`${name}: dataKey should be non-empty`, () => {
        const order = config.order as SortingColumn;
        expect(order.dataKey).toBeTruthy();
      });

      it(`${name}: isSortable should be true`, () => {
        const order = config.order as SortingColumn;
        expect(order.isSortable).toBe(true);
      });
    });
  });

  // ── 2. Builder output (addSorting → create → params.sort) ──────────

  describe('addSorting + create', () => {
    const tables = getTablesWithSortOrder();

    tables.forEach(({ name, config }) => {
      it(`${name}: produces correct sort string`, () => {
        const order = config.order as SortingColumn;
        const params = new RequestParamBuilder().addSorting(order).create();

        const prefix = order.direction === 'asc' ? '' : '-';
        expect(params.sort).toEqual([`${prefix}${order.dataKey}`]);
      });
    });

    it('tasksTable: sorts by -priority (descending)', () => {
      const order = (uiConfigDefault.tableSettings.tasksTable as TableConfig).order as SortingColumn;
      const params = new RequestParamBuilder().addSorting(order).create();
      expect(params.sort).toEqual(['-priority']);
    });

    it('cracksTable: sorts by -timeCracked (descending)', () => {
      const order = (uiConfigDefault.tableSettings.cracksTable as TableConfig).order as SortingColumn;
      const params = new RequestParamBuilder().addSorting(order).create();
      expect(params.sort).toEqual(['-timeCracked']);
    });
  });

  // ── 3. End-to-end through setParameter → HttpParams ────────────────

  describe('setParameter produces correct HttpParams', () => {
    const tables = getTablesWithSortOrder();

    tables.forEach(({ name, config }) => {
      it(`${name}: httpParams.get('sort') matches expected value`, () => {
        const order = config.order as SortingColumn;
        const params = new RequestParamBuilder().addSorting(order).create();
        const httpParams = setParameter(params);

        const prefix = order.direction === 'asc' ? '' : '-';
        expect(httpParams.get('sort')).toBe(`${prefix}${order.dataKey}`);
      });
    });
  });

  // ── 4. Regression guards ───────────────────────────────────────────

  describe('regression: empty dataKey or isSortable=false skips sorting', () => {
    it('empty dataKey produces no sort param', () => {
      const column: SortingColumn = {
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      };
      const params = new RequestParamBuilder().addSorting(column).create();
      expect(params.sort).toBeUndefined();
    });

    it('isSortable=false produces no sort param', () => {
      const column: SortingColumn = {
        dataKey: 'id',
        isSortable: false,
        direction: 'asc'
      };
      const params = new RequestParamBuilder().addSorting(column).create();
      expect(params.sort).toBeUndefined();
    });

    it('empty dataKey + isSortable=false produces no sort param', () => {
      const column: SortingColumn = {
        dataKey: '',
        isSortable: false,
        direction: 'asc'
      };
      const params = new RequestParamBuilder().addSorting(column).create();
      expect(params.sort).toBeUndefined();
    });

    it('empty dataKey produces no sort in HttpParams', () => {
      const column: SortingColumn = {
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      };
      const params = new RequestParamBuilder().addSorting(column).create();
      const httpParams = setParameter(params);
      expect(httpParams.has('sort')).toBe(false);
    });
  });
});
