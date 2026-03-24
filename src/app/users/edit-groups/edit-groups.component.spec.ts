import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { zAccessGroupListResponse, zUserListResponse } from '@generated/api/zod.gen';

/**
 * Focused tests for the deserialization bug in EditGroupsComponent.loadSelectUsers().
 *
 * The bug: `loadSelectUsers()` fetches from SERV.USERS but validates
 * the response against `zAccessGroupListResponse` instead of `zUserListResponse`.
 *
 * We test the serializer directly to isolate the exact schema mismatch.
 */
describe('EditGroupsComponent deserialization', () => {
  let serializer: JsonAPISerializer;

  const jsonapi = { version: '1.1' };

  const userListBody = {
    jsonapi,
    data: [
      {
        id: 10,
        type: 'user',
        attributes: {
          name: 'alice',
          email: 'alice@example.com',
          isValid: true,
          isComputedPassword: false,
          lastLoginDate: 1752647000,
          registeredSince: 1744086300,
          sessionLifetime: 3600,
          globalPermissionGroupId: 2,
          yubikey: '0',
          otp1: '',
          otp2: '',
          otp3: '',
          otp4: ''
        }
      },
      {
        id: 20,
        type: 'user',
        attributes: {
          name: 'bob',
          email: 'bob@example.com',
          isValid: true,
          isComputedPassword: false,
          lastLoginDate: 1752647100,
          registeredSince: 1744086400,
          sessionLifetime: 7200,
          globalPermissionGroupId: 1,
          yubikey: '0',
          otp1: '',
          otp2: '',
          otp3: '',
          otp4: ''
        }
      }
    ]
  };

  beforeEach(() => {
    serializer = new JsonAPISerializer();
  });

  it('should throw when user data is deserialized with zAccessGroupListResponse (the bug)', () => {
    // This is the current (buggy) code path:
    //   const users: JAccessGroup[] = serializer.deserialize(response, zAccessGroupListResponse);
    // It should throw because user-shaped data does not match access group schema.
    expect(() => {
      serializer.deserialize(userListBody, zAccessGroupListResponse);
    }).toThrow();
  });

  it('should correctly deserialize user data with zUserListResponse (the fix)', () => {
    // After the fix, the code should use zUserListResponse
    const users = serializer.deserialize(userListBody, zUserListResponse);

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(2);
    expect(users[0].name).toBe('alice');
    expect(users[1].name).toBe('bob');
  });
});
