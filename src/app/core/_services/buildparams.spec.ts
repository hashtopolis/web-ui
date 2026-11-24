import { setParameter } from '@services/buildparams';

describe('setParameter', () => {
  it('serializes every supported request parameter', () => {
    const params = setParameter({
      page: { size: 0, after: 'cursor' },
      include: ['files', 'speeds'],
      filter: [
        { field: 'state', operator: 'eq', value: 'cracked' },
        { parent: 'task', field: 'name', operator: 'contains', value: ['alpha', 'beta'] },
        { field: 'enabled', operator: 'eq', value: false }
      ],
      aggregate: [
        { field: 'task', values: ['searched', 'dispatched'] },
        { field: 'pretask', values: [] }
      ],
      sort: ['-timeCracked', 'id'],
      include_total: true
    });

    expect(params.get('page[size]')).toBe('0');
    expect(params.get('page[after]')).toBe('cursor');
    expect(params.has('page[before]')).toBe(false);
    expect(params.get('include')).toBe('files,speeds');
    expect(params.get('filter[state__eq]')).toBe('cracked');
    expect(params.get('filter[task.name__contains]')).toBe('alpha,beta');
    expect(params.get('filter[enabled__eq]')).toBe('false');
    expect(params.get('aggregate[task]')).toBe('searched,dispatched');
    expect(params.has('aggregate[pretask]')).toBe(true);
    expect(params.get('aggregate[pretask]')).toBe('');
    expect(params.get('sort')).toBe('-timeCracked,id');
    expect(params.get('include_total')).toBe('true');
  });

  it('returns no query parameters when all optional collections are empty', () => {
    const params = setParameter({
      page: {},
      include: [],
      filter: [],
      aggregate: [],
      sort: [],
      include_total: false
    });

    expect(params.keys()).toStrictEqual([]);
  });

  it('omits absent optional parameters but preserves zero page values', () => {
    const params = setParameter({
      page: { after: 0 }
    });

    expect(params.get('page[after]')).toBe('0');
    expect(params.has('page[size]')).toBe(false);
    expect(params.has('include')).toBe(false);
    expect(params.has('sort')).toBe(false);
    expect(params.has('include_total')).toBe(false);
  });
});
