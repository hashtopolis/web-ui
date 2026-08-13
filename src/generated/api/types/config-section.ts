import type { ErrorResponse } from './common';

export type ConfigSectionResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'configSection';
    attributes: {
      sectionName: string;
    };
    links: {
      self: string;
    };
  };
};

export type ConfigSectionListResponse = {
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
    type: 'configSection';
    attributes: {
      sectionName: string;
    };
    links: {
      self: string;
    };
  }>;
};

export type ConfigSectionCountResponse = {
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

export type GetConfigsectionsData = {
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
     * Example: `{"primary":{"configSectionId": 123}}` -> `eyJwcmltYXJ5Ijp7ImNvbmZpZ1NlY3Rpb25JZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"configSectionId": 123}}` -> `eyJwcmltYXJ5Ijp7ImNvbmZpZ1NlY3Rpb25JZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[configSectionId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options:
     */
    include?: Array<string>;
  };
  url: '/api/v2/ui/configsections';
};

export type GetConfigsectionsErrors = {
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

export type GetConfigsectionsError = GetConfigsectionsErrors[keyof GetConfigsectionsErrors];

export type GetConfigsectionsResponses = {
  /**
   * successful operation
   */
  200: ConfigSectionListResponse;
};

export type GetConfigsectionsResponse = GetConfigsectionsResponses[keyof GetConfigsectionsResponses];

export type GetConfigsectionsCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[configSectionId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/configsections/count';
};

export type GetConfigsectionsCountErrors = {
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

export type GetConfigsectionsCountError = GetConfigsectionsCountErrors[keyof GetConfigsectionsCountErrors];

export type GetConfigsectionsCountResponses = {
  /**
   * successful operation
   */
  200: ConfigSectionCountResponse;
};

export type GetConfigsectionsCountResponse = GetConfigsectionsCountResponses[keyof GetConfigsectionsCountResponses];

export type GetConfigsectionsByIdData = {
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
  url: '/api/v2/ui/configsections/{id}';
};

export type GetConfigsectionsByIdErrors = {
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

export type GetConfigsectionsByIdError = GetConfigsectionsByIdErrors[keyof GetConfigsectionsByIdErrors];

export type GetConfigsectionsByIdResponses = {
  /**
   * successful operation
   */
  200: ConfigSectionResponse;
};

export type GetConfigsectionsByIdResponse = GetConfigsectionsByIdResponses[keyof GetConfigsectionsByIdResponses];
