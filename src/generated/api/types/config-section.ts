import type { ErrorResponse, NotFoundResponse } from './common';

export type ConfigSectionResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links?: {
    self: string;
    first?: string;
    last?: string;
    next?: string | null;
    previous?: string | null;
  };
  data: {
    id: number;
    type: 'configSection';
    attributes: {
      sectionName: string;
    };
  };
  relationships?: {
    [key: string]: unknown;
  };
  included?: Array<unknown>;
};

export type ConfigSectionListResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links?: {
    self: string;
    first?: string;
    last?: string;
    next?: string | null;
    previous?: string | null;
  };
  data: Array<{
    id: number;
    type: 'configSection';
    attributes: {
      sectionName: string;
    };
  }>;
  relationships?: {
    [key: string]: unknown;
  };
  included?: Array<unknown>;
};

export type GetConfigsectionsData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Pointer to paginate to retrieve the data after the value provided
     */
    'page[after]'?: number;
    /**
     * Pointer to paginate to retrieve the data before the value provided
     */
    'page[before]'?: number;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query
     */
    filter?: {
      [key: string]: unknown;
    };
    /**
     * Items to include, comma seperated. Possible options: Array
     */
    include?: string;
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
     * Pointer to paginate to retrieve the data after the value provided
     */
    'page[after]'?: number;
    /**
     * Pointer to paginate to retrieve the data before the value provided
     */
    'page[before]'?: number;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query
     */
    filter?: {
      [key: string]: unknown;
    };
    /**
     * Items to include, comma seperated. Possible options: Array
     */
    include?: string;
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
};

export type GetConfigsectionsCountError = GetConfigsectionsCountErrors[keyof GetConfigsectionsCountErrors];

export type GetConfigsectionsCountResponses = {
  /**
   * successful operation
   */
  200: ConfigSectionListResponse;
};

export type GetConfigsectionsCountResponse = GetConfigsectionsCountResponses[keyof GetConfigsectionsCountResponses];

export type GetConfigsectionsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Items to include. Comma seperated
     */
    include?: string;
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
   * Not Found
   */
  404: NotFoundResponse;
};

export type GetConfigsectionsByIdError = GetConfigsectionsByIdErrors[keyof GetConfigsectionsByIdErrors];

export type GetConfigsectionsByIdResponses = {
  /**
   * successful operation
   */
  200: ConfigSectionResponse;
};

export type GetConfigsectionsByIdResponse = GetConfigsectionsByIdResponses[keyof GetConfigsectionsByIdResponses];
