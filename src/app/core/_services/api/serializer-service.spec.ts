import { zAccessGroupListResponse, zUserListResponse, zUserResponse } from '@generated/api/zod';

import { JsonAPISerializer } from '@services/api/serializer-service';

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

  const singleUserBody = {
    jsonapi,
    data: {
      id: 1,
      type: 'user',
      attributes: userAttributes
    }
  };

  const userListBody = {
    jsonapi,
    data: [
      {
        id: 1,
        type: 'user',
        attributes: userAttributes
      },
      {
        id: 2,
        type: 'user',
        attributes: {
          ...userAttributes,
          name: 'testuser',
          email: 'test@example.com'
        }
      }
    ]
  };

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
      expect(user[0]).toBeUndefined();
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
    it('throws when user data is validated against access group schema', () => {
      // Bug 2: using zAccessGroupListResponse for user data should fail validation
      expect(() => {
        serializer.deserialize(userListBody, zAccessGroupListResponse);
      }).toThrow();
    });
  });
});
