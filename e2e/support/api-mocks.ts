import { Page } from '@playwright/test';

/**
 * Builds a syntactically valid JWT with a fake signature.
 *
 * The payload includes `userId` and `username` so that
 * `getCanonicalUsernameFromJwt` returns a value and the app skips the
 * secondary `/ui/users/{id}` fetch. The signature is intentionally fake —
 * the app never verifies it client-side.
 *
 * @param userId - Numeric user ID to embed in the token payload
 * @param username - Username string to embed in the token payload
 * @returns A dot-separated JWT string with a fake signature segment
 */
function buildFakeJwt(userId = 1, username = 'e2e-test'): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ userId, username, exp: 9_999_999_999 })).toString('base64url');
  return `${header}.${payload}.fakesig`;
}

/** Pre-built fake JWT used in E2E tests that require an authenticated session. */
export const FAKE_JWT = buildFakeJwt();

/**
 * Builds a JSON:API collection response body.
 *
 * @param type - The JSON:API resource type string (e.g. `'HashTypes'`)
 * @param items - Array of attribute objects; each becomes one resource object
 * @returns Serialised JSON string ready to pass to `route.fulfill`
 */
function buildJsonApiList(type: string, items: Record<string, unknown>[]): string {
  return JSON.stringify({
    data: items.map((attributes, index) => ({
      type,
      id: String(index + 1),
      attributes
    })),
    included: [],
    meta: { page: { total_elements: items.length } },
    links: { next: null, prev: null }
  });
}

/**
 * Builds a JSON:API single-resource response body.
 *
 * @param type - The JSON:API resource type string
 * @param id - The string ID of the resource
 * @param attributes - The attribute object for the resource
 * @returns Serialised JSON string ready to pass to `route.fulfill`
 */
function buildJsonApiItem(type: string, id: string, attributes: Record<string, unknown>): string {
  return JSON.stringify({ data: { type, id, attributes }, included: [] });
}

/**
 * Injects a fake auth session into `localStorage` before the page loads so that
 * tests can navigate directly to protected routes without going through the login form.
 *
 * @remarks
 * Must be called before `page.goto()`. Uses `addInitScript` so the data is
 * present before Angular's `autoLogin()` runs on every navigation.
 *
 * When `permissions` is provided it is written to the `user_permissions` cache
 * key that `PermissionService` reads synchronously on startup. This eliminates
 * the race condition between `CheckRole` running and the async
 * `getUserPermission` HTTP call completing.
 *
 * @param page - The Playwright `Page` instance to inject the session into
 * @param permissions - Optional permission flags to seed into the permissions cache
 * @returns Resolves when the init script has been registered
 */
export async function seedAuthStorage(page: Page, permissions: Record<string, boolean> = {}): Promise<void> {
  await page.addInitScript(
    ({ token, permissions }) => {
      localStorage.setItem(
        'userData',
        JSON.stringify({
          expires: 0,
          value: {
            _token: token,
            _expires: new Date(9_999_999_999 * 1000).toISOString(),
            userId: 1,
            canonicalUsername: 'e2e-test'
          }
        })
      );
      if (Object.keys(permissions).length > 0) {
        localStorage.setItem('user_permissions', JSON.stringify({ expires: 0, value: permissions }));
      }
    },
    { token: FAKE_JWT, permissions }
  );
}

/**
 * Registers Playwright route mocks for every API call made during the login flow.
 *
 * @remarks
 * Call this before `page.goto()` in any test that submits the login form.
 * A wildcard catch-all intercepts secondary API calls after redirect so the
 * app does not throw on unanswered requests.
 *
 * @param page - The Playwright `Page` instance to register routes on
 * @returns Resolves when all route handlers have been registered
 */
export async function mockLoginFlow(page: Page): Promise<void> {
  // Wildcard catch-all registered first so specific handlers below take priority.
  // Keeps the app from throwing on any secondary calls made after redirect.
  await page.route('**/api/v2/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/vnd.api+json',
      body: JSON.stringify({
        data: [],
        included: [],
        meta: { page: { total_elements: 0 } },
        links: { next: null, prev: null }
      })
    })
  );

  // Auth token — the primary login endpoint.
  await page.route('**/auth/token', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: FAKE_JWT, expires: 9_999_999_999 })
    })
  );

  // User permissions — loaded by PermissionService immediately after login.
  await page.route('**/helper/getUserPermission', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/vnd.api+json',
      body: JSON.stringify({
        data: {
          type: 'Helper',
          id: '1',
          attributes: { permissions: {} }
        },
        included: []
      })
    })
  );
}

/**
 * Registers route mocks and seeds auth storage for the hashlist section.
 *
 * @remarks
 * Bypasses the login form by pre-populating `localStorage` via `seedAuthStorage`.
 * Returns appropriate permissions so the `CheckRole` guard allows both the list
 * and create routes. Also mocks the form dependencies (hashtypes, access groups,
 * brain config) and the hashlist collection endpoint for GET and POST.
 *
 * @param page - The Playwright `Page` instance to configure
 * @returns Resolves when all route handlers and the init script have been registered
 */
export async function mockHashlistsFlow(page: Page): Promise<void> {
  await seedAuthStorage(page, {
    permHashlistRead: true,
    permHashlistCreate: true,
    permHashTypeRead: true,
    permAccessGroupRead: true
  });

  // Catch-all — lowest priority
  await page.route('**/api/v2/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/vnd.api+json',
      body: JSON.stringify({
        data: [],
        included: [],
        meta: { page: { total_elements: 0 } },
        links: { next: null, prev: null }
      })
    })
  );

  // Permissions — grants read and create access to hashlists.
  await page.route('**/helper/getUserPermission', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/vnd.api+json',
      body: JSON.stringify({
        data: {
          type: 'Helper',
          id: '1',
          attributes: {
            permissions: {
              permHashlistRead: true,
              permHashlistCreate: true,
              permHashTypeRead: true,
              permAccessGroupRead: true
            }
          }
        },
        included: []
      })
    })
  );

  // Hash types — populates the hashtype multiselect on the create form.
  await page.route('**/ui/hashtypes*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/vnd.api+json',
      body: buildJsonApiList('HashTypes', [
        { description: 'MD5', isSalted: false },
        { description: 'SHA1', isSalted: false }
      ])
    })
  );

  // Access groups — the create form loads these via the user relationship endpoint.
  await page.route('**/ui/users/*/accessGroups*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/vnd.api+json',
      body: buildJsonApiList('AccessGroups', [{ groupName: 'Default' }])
    })
  );

  // Config 66 — the brain-enabled flag; 0 means disabled.
  await page.route('**/ui/configs/66*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/vnd.api+json',
      body: buildJsonApiItem('Configs', '66', { value: '0' })
    })
  );

  // Hashlists — GET returns empty list; POST returns the newly created resource.
  await page.route('**/ui/hashlists*', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/vnd.api+json',
        body: buildJsonApiItem('HashLists', '1', { name: 'test', hashTypeId: 0 })
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/vnd.api+json',
        body: buildJsonApiList('HashLists', [])
      });
    }
  });
}
