import type { Mock } from 'vitest';

import { ExportUtil } from '@services/export/export.util';

describe('ExportUtil', () => {
  let create: Mock;
  let revoke: Mock;

  beforeEach(() => {
    create = vi.fn().mockName('URL.createObjectURL').mockReturnValue('blob:test');
    revoke = vi.fn().mockName('URL.revokeObjectURL');
  });
  it('maps labels and exported values in column order', async () => {
    const util = new ExportUtil();
    const columns = [
      { id: 2, dataKey: 'name', export: async (row: { id: number }) => `User ${row.id}` },
      { id: 1, dataKey: 'empty' }
    ];
    const rows = [
      { id: 1, type: 'user' },
      { id: 2, type: 'user' }
    ];
    expect(util.toExcelColumns(columns, { 1: 'Blank', 2: 'Name' })).toStrictEqual([
      { key: 'name', header: 'Name' },
      { key: 'empty', header: 'Blank' }
    ]);
    expect(util.toCsvColumns(columns, { 1: 'Blank', 2: 'Name' })).toStrictEqual(['Name', 'Blank']);
    await expect(util.toExcelRows(columns, rows)).resolves.toStrictEqual([
      { name: 'User 1', empty: '' },
      { name: 'User 2', empty: '' }
    ]);
    await expect(util.toCsvRows(columns, rows)).resolves.toStrictEqual([
      ['User 1', ''],
      ['User 2', '']
    ]);
  });

  it('downloads a blob and revokes its URL', () => {
    vi.stubGlobal('URL', { createObjectURL: create, revokeObjectURL: revoke });
    const anchor = document.createElement('a');
    const click = vi.spyOn(anchor, 'click').mockImplementation(() => {});
    vi.spyOn(document, 'createElement').mockReturnValue(anchor);
    try {
      new ExportUtil().download(new Uint8Array([1, 2]).buffer, 'users.csv', 'text/csv');
      expect(create).toHaveBeenCalledExactlyOnceWith(expect.any(Blob));
      const blob = create.mock.calls[0][0];
      expect(blob.type).toBe('text/csv');
      expect(blob.size).toBe(2);
      expect(anchor.download).toBe('users.csv');
      expect(anchor.href).toBe('blob:test');
      expect(click).toHaveBeenCalledExactlyOnceWith();
      expect(revoke).toHaveBeenCalledExactlyOnceWith('blob:test');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
