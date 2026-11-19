import { HELPER_ENDPOINTS, RelationshipType, SERV, ValidationPatterns } from '@services/main.config';

describe('service configuration', () => {
  it('defines API resources, helpers and relationships', () => {
    expect(SERV.FILES).toStrictEqual({ URL: '/ui/files', RESOURCE: 'Files' });
    expect(SERV.HELPER).toStrictEqual({ URL: '/helper', RESOURCE: 'Helper' });
    expect(HELPER_ENDPOINTS).toContain('importFile');
    expect(new Set(HELPER_ENDPOINTS).size).toBe(HELPER_ENDPOINTS.length);
    expect(RelationshipType.ACCESSGROUPS).toBe('accessGroups');
  });
  it('accepts HTTP URLs only', () => {
    const pattern = new RegExp(ValidationPatterns.URL);
    expect(pattern.test('https://example.org')).toBe(true);
    expect(pattern.test('ftp://example.org')).toBe(false);
  });
});
