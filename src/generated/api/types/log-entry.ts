import type { ErrorResponse } from './common';

export type LogEntryResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'logEntry';
    attributes: {
      issuer: 'API' | 'User';
      issuerId: string;
      level: 'warning' | 'error' | 'fatal error' | 'information';
      message: string;
      time: number;
    };
    links: {
      self: string;
    };
  };
};

export type LogEntryListResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
    first: string;
    last: string | null;
    next: string | null;
    prev: string | null;
  };
  meta: {
    page: {
      total_elements: number;
    };
  };
  data: Array<{
    id: string;
    type: 'logEntry';
    attributes: {
      issuer: 'API' | 'User';
      issuerId: string;
      level: 'warning' | 'error' | 'fatal error' | 'information';
      message: string;
      time: number;
    };
    links: {
      self: string;
    };
  }>;
};

export type LogEntryCountResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    /**
     * Number of objects matching the given filters
     */
    count: number;
    /**
     * Number of objects without any filter applied, only present when `include_total=true` was requested
     */
    total_count?: number;
  };
  /**
   * Always empty: the count is reported under meta.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type GetLogentriesData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Pointer to paginate to retrieve the data after the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"logEntryId": 123}}` -> `eyJwcmltYXJ5Ijp7ImxvZ0VudHJ5SWQiOiAxMjN9fQ==`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"logEntryId": 123}}` -> `eyJwcmltYXJ5Ijp7ImxvZ0VudHJ5SWQiOiAxMjN9fQ==`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[logEntryId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options:
     */
    include?: Array<string>;
  };
  url: '/api/v2/ui/logentries';
};

export type GetLogentriesErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetLogentriesError = GetLogentriesErrors[keyof GetLogentriesErrors];

export type GetLogentriesResponses = {
  /**
   * successful operation
   */
  200: LogEntryListResponse;
};

export type GetLogentriesResponse = GetLogentriesResponses[keyof GetLogentriesResponses];

export type GetLogentriesCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[logEntryId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/logentries/count';
};

export type GetLogentriesCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetLogentriesCountError = GetLogentriesCountErrors[keyof GetLogentriesCountErrors];

export type GetLogentriesCountResponses = {
  /**
   * successful operation
   */
  200: LogEntryCountResponse;
};

export type GetLogentriesCountResponse = GetLogentriesCountResponses[keyof GetLogentriesCountResponses];

export type GetLogentriesByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options:
     */
    include?: Array<string>;
  };
  url: '/api/v2/ui/logentries/{id}';
};

export type GetLogentriesByIdErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetLogentriesByIdError = GetLogentriesByIdErrors[keyof GetLogentriesByIdErrors];

export type GetLogentriesByIdResponses = {
  /**
   * successful operation
   */
  200: LogEntryResponse;
};

export type GetLogentriesByIdResponse = GetLogentriesByIdResponses[keyof GetLogentriesByIdResponses];
