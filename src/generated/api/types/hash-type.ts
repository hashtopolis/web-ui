import type { ErrorResponse } from './common';

export type HashTypeCreate = {
  data: {
    type: 'hashType';
    attributes: {
      hashTypeId: number;
      description: string;
      isSalted: boolean;
      isSlowHash: boolean;
    };
  };
};

export type HashTypePatch = {
  data: {
    type: 'hashType';
    attributes: {
      description?: string;
      isSalted?: boolean;
      isSlowHash?: boolean;
    };
  };
};

export type HashTypePatchMultiple = {
  data: Array<{
    id: string;
    type: 'hashType';
    attributes: {
      description?: string;
      isSalted?: boolean;
      isSlowHash?: boolean;
    };
  }>;
};

export type HashTypeDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'hashType';
  }>;
};

export type HashTypeResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'hashType';
    attributes: {
      description: string;
      isSalted: boolean;
      isSlowHash: boolean;
    };
    links: {
      self: string;
    };
  };
};

export type HashTypePostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'hashType';
    attributes: {
      description: string;
      isSalted: boolean;
      isSlowHash: boolean;
    };
    links: {
      self: string;
    };
  };
};

export type HashTypeListResponse = {
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
    type: 'hashType';
    attributes: {
      description: string;
      isSalted: boolean;
      isSlowHash: boolean;
    };
    links: {
      self: string;
    };
  }>;
};

export type HashTypeCountResponse = {
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

export type DeleteHashtypesData = {
  body: HashTypeDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/hashtypes';
};

export type DeleteHashtypesErrors = {
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

export type DeleteHashtypesError = DeleteHashtypesErrors[keyof DeleteHashtypesErrors];

export type DeleteHashtypesResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteHashtypesResponse = DeleteHashtypesResponses[keyof DeleteHashtypesResponses];

export type GetHashtypesData = {
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
     * Example: `{"primary":{"hashTypeId": 123}}` -> `eyJwcmltYXJ5Ijp7Imhhc2hUeXBlSWQiOiAxMjN9fQ==`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"hashTypeId": 123}}` -> `eyJwcmltYXJ5Ijp7Imhhc2hUeXBlSWQiOiAxMjN9fQ==`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[hashTypeId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options:
     */
    include?: Array<string>;
  };
  url: '/api/v2/ui/hashtypes';
};

export type GetHashtypesErrors = {
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

export type GetHashtypesError = GetHashtypesErrors[keyof GetHashtypesErrors];

export type GetHashtypesResponses = {
  /**
   * successful operation
   */
  200: HashTypeListResponse;
};

export type GetHashtypesResponse = GetHashtypesResponses[keyof GetHashtypesResponses];

export type PatchHashtypesData = {
  body: HashTypePatchMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/hashtypes';
};

export type PatchHashtypesErrors = {
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
  /**
   * Resource already exists
   */
  409: ErrorResponse;
};

export type PatchHashtypesError = PatchHashtypesErrors[keyof PatchHashtypesErrors];

export type PatchHashtypesResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchHashtypesResponse = PatchHashtypesResponses[keyof PatchHashtypesResponses];

export type PostHashtypesData = {
  body: HashTypeCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/hashtypes';
};

export type PostHashtypesErrors = {
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
   * Resource already exists
   */
  409: ErrorResponse;
};

export type PostHashtypesError = PostHashtypesErrors[keyof PostHashtypesErrors];

export type PostHashtypesResponses = {
  /**
   * successful operation
   */
  201: HashTypePostPatchResponse;
};

export type PostHashtypesResponse = PostHashtypesResponses[keyof PostHashtypesResponses];

export type GetHashtypesCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[hashTypeId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/hashtypes/count';
};

export type GetHashtypesCountErrors = {
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

export type GetHashtypesCountError = GetHashtypesCountErrors[keyof GetHashtypesCountErrors];

export type GetHashtypesCountResponses = {
  /**
   * successful operation
   */
  200: HashTypeCountResponse;
};

export type GetHashtypesCountResponse = GetHashtypesCountResponses[keyof GetHashtypesCountResponses];

export type DeleteHashtypesByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashtypes/{id}';
};

export type DeleteHashtypesByIdErrors = {
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

export type DeleteHashtypesByIdError = DeleteHashtypesByIdErrors[keyof DeleteHashtypesByIdErrors];

export type DeleteHashtypesByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteHashtypesByIdResponse = DeleteHashtypesByIdResponses[keyof DeleteHashtypesByIdResponses];

export type GetHashtypesByIdData = {
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
  url: '/api/v2/ui/hashtypes/{id}';
};

export type GetHashtypesByIdErrors = {
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

export type GetHashtypesByIdError = GetHashtypesByIdErrors[keyof GetHashtypesByIdErrors];

export type GetHashtypesByIdResponses = {
  /**
   * successful operation
   */
  200: HashTypeResponse;
};

export type GetHashtypesByIdResponse = GetHashtypesByIdResponses[keyof GetHashtypesByIdResponses];

export type PatchHashtypesByIdData = {
  body: HashTypePatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashtypes/{id}';
};

export type PatchHashtypesByIdErrors = {
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
  /**
   * Resource already exists
   */
  409: ErrorResponse;
};

export type PatchHashtypesByIdError = PatchHashtypesByIdErrors[keyof PatchHashtypesByIdErrors];

export type PatchHashtypesByIdResponses = {
  /**
   * successful operation
   */
  200: HashTypePostPatchResponse;
};

export type PatchHashtypesByIdResponse = PatchHashtypesByIdResponses[keyof PatchHashtypesByIdResponses];
