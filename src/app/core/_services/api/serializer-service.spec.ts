import { zAccessGroupListResponse, zApiTokenListResponse, zUserListResponse, zUserResponse } from '@generated/api/zod';

import { JsonAPISerializer } from '@services/api/serializer-service';

import { mockResource, mockResponse } from '@src/app/testing/mock-response';

describe('JsonAPISerializer', () => {
  let serializer: JsonAPISerializer;

  const jsonapi = { version: '1.1' };

  const userAttributes = {
    name: 'admin',
    email: 'admin@localhost',
    isValid: true,
    isComputedPassword: true,
    lastLoginDate: 1752647017,
    registeredSince: 1744086356,
    sessionLifetime: 3600,
    globalPermissionGroupId: 1,
    yubikey: '0',
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: ''
  };

  const USER_RELATIONS = ['accessGroups', 'globalPermissionGroup'] as const;

  const singleUserBody = { jsonapi, links: {}, data: mockResource('user', 1, userAttributes, USER_RELATIONS) };

  const userListBody = mockResponse({
    data: [
      mockResource('user', 1, userAttributes, USER_RELATIONS),
      mockResource('user', 2, { ...userAttributes, name: 'testuser', email: 'test@example.com' }, USER_RELATIONS)
    ]
  });

  beforeEach(() => {
    serializer = new JsonAPISerializer();
  });

  describe('single-object response (zUserResponse)', () => {
    it('returns a single flat object, not an array', () => {
      const result = serializer.deserialize(singleUserBody, zUserResponse);

      // Must be a plain object, NOT an array
      expect(Array.isArray(result)).toBe(false);
      expect(typeof result).toBe('object');
    });

    it('flattens attributes onto the root object', () => {
      const user = serializer.deserialize(singleUserBody, zUserResponse);

      expect(user.id).toBe(1);
      expect(user.name).toBe('admin');
      expect(user.email).toBe('admin@localhost');
      expect(user.registeredSince).toBe(1744086356);
    });

    it('should not be indexable as an array', () => {
      const user = serializer.deserialize(singleUserBody, zUserResponse);

      // This is the Bug 1 pattern: code does user[0] expecting array behavior
      // On a flat object, [0] is undefined
      expect((user as Record<number, unknown>)[0]).toBeUndefined();
    });
  });

  describe('list response (zUserListResponse)', () => {
    it('returns an array of flat user objects', () => {
      const result = serializer.deserialize(userListBody, zUserListResponse);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('flattens attributes onto each array element', () => {
      const users = serializer.deserialize(userListBody, zUserListResponse);

      expect(users[0].name).toBe('admin');
      expect(users[1].name).toBe('testuser');
    });
  });

  describe('schema mismatch detection', () => {
    it('logs an error but does not throw when user data is validated against access group schema', () => {
      // Validation is intentionally non-fatal: schema mismatches are reported via
      // console.error (and an alert in dev mode), but deserialization still proceeds.
      const consoleSpy = spyOn(console, 'error');

      expect(() => {
        serializer.deserialize(userListBody, zAccessGroupListResponse);
      }).not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith('API response validation failed', jasmine.anything());
    });

    it('logs an error when an attribute is present but has the wrong type', () => {
      const consoleSpy = spyOn(console, 'error');
      const wrongTypeBody = {
        jsonapi,
        data: {
          id: 1,
          type: 'user',
          attributes: { ...userAttributes, sessionLifetime: 'not-a-number' }
        }
      };

      serializer.deserialize(wrongTypeBody, zUserResponse);

      expect(consoleSpy).toHaveBeenCalledWith('API response validation failed', jasmine.anything());
    });
  });

  describe('permission-stripped user responses', () => {
    // A permission-stripped resource keeps its full JSON:API plumbing (`links` + `relationships`);
    // the server only drops non-public *attributes*. See the server's AbstractBaseAPI::obj2Resource(),
    // where permission filtering happens inside the attribute loop and never touches links/relationships.
    const strippedUser = mockResource('user', 1, { name: 'admin' }, USER_RELATIONS);

    it('does not log an error for a stripped single-object response', () => {
      const consoleSpy = spyOn(console, 'error');

      const user = serializer.deserialize(mockResponse({ data: strippedUser }), zUserResponse);

      expect(consoleSpy).not.toHaveBeenCalled();
      expect(user.name).toBe('admin');
    });

    it('does not log an error for a stripped list response', () => {
      const consoleSpy = spyOn(console, 'error');

      const users = serializer.deserialize(mockResponse({ data: [strippedUser] }), zUserListResponse);

      expect(consoleSpy).not.toHaveBeenCalled();
      expect(users[0].name).toBe('admin');
    });

    it('does not log an error for a stripped user included by another entity', () => {
      const consoleSpy = spyOn(console, 'error');
      const apiToken = mockResource(
        'apiToken',
        22,
        { startValid: 1785743381, endValid: 1785829781, userId: 1, tokenName: 'ci', isRevoked: false },
        ['user']
      );
      const body = mockResponse({ data: [apiToken], included: [strippedUser] });

      serializer.deserialize(body, zApiTokenListResponse);

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('still logs an error when a stripped user misses its public attribute', () => {
      const consoleSpy = spyOn(console, 'error');
      const body = mockResponse({ data: [mockResource('user', 1, {}, USER_RELATIONS)] });

      serializer.deserialize(body, zUserListResponse);

      expect(consoleSpy).toHaveBeenCalledWith('API response validation failed', jasmine.anything());
    });
  });
});
