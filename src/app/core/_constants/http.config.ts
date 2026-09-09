/**
 * HTTP status codes the frontend reacts to explicitly.
 * `NETWORK_ERROR` is Angular's status for a request that never reached the server.
 */
export const HttpStatus = {
  NETWORK_ERROR: 0,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const;
export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];

/**
 * HTTP methods the frontend issues.
 */
export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
} as const;
export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

/**
 * Custom request headers interpreted by the app's HTTP interceptors.
 * - `SKIP_ERROR_DIALOG` suppresses the global error modal/snackbar (`HttpResInterceptor`)
 * - `SKIP_CACHE` bypasses the stale-while-revalidate cache (`HttpCacheInterceptor`)
 */
export const HttpHeaderName = {
  SKIP_ERROR_DIALOG: 'X-Skip-Error-Dialog',
  SKIP_CACHE: 'X-Cache-Skip'
} as const;
export type HttpHeaderName = (typeof HttpHeaderName)[keyof typeof HttpHeaderName];

/** Header config that suppresses the global error dialog for a single request. */
export const HTTP_SKIP_ERROR_HEADER_CONFIG = {
  [HttpHeaderName.SKIP_ERROR_DIALOG]: 'true'
} as const;

/** Header config that bypasses the stale-while-revalidate cache for a single request. */
export const HTTP_SKIP_CACHE_HEADER_CONFIG = {
  [HttpHeaderName.SKIP_CACHE]: 'true'
} as const;
