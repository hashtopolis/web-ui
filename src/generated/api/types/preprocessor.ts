import type { ErrorResponse } from './common';

export type PreprocessorCreate = {
  data: {
    type: 'preprocessor';
    attributes: {
      name: string;
      url: string;
      binaryName: string;
      keyspaceCommand: string;
      skipCommand: string;
      limitCommand: string;
    };
  };
};

export type PreprocessorPatch = {
  data: {
    type: 'preprocessor';
    attributes: {
      binaryName?: string;
      keyspaceCommand?: string;
      limitCommand?: string;
      name?: string;
      skipCommand?: string;
      url?: string;
    };
  };
};

export type PreprocessorPatchMultiple = {
  data: Array<{
    id: string;
    type: 'preprocessor';
    attributes: {
      binaryName?: string;
      keyspaceCommand?: string;
      limitCommand?: string;
      name?: string;
      skipCommand?: string;
      url?: string;
    };
  }>;
};

export type PreprocessorDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'preprocessor';
  }>;
};

export type PreprocessorResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'preprocessor';
    attributes: {
      name: string;
      url: string;
      binaryName: string;
      keyspaceCommand: string;
      skipCommand: string;
      limitCommand: string;
    };
    links: {
      self: string;
    };
  };
};

export type PreprocessorPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'preprocessor';
    attributes: {
      name: string;
      url: string;
      binaryName: string;
      keyspaceCommand: string;
      skipCommand: string;
      limitCommand: string;
    };
    links: {
      self: string;
    };
  };
};

export type PreprocessorListResponse = {
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
    type: 'preprocessor';
    attributes: {
      name: string;
      url: string;
      binaryName: string;
      keyspaceCommand: string;
      skipCommand: string;
      limitCommand: string;
    };
    links: {
      self: string;
    };
  }>;
};

export type PreprocessorCountResponse = {
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

export type DeletePreprocessorsData = {
  body: PreprocessorDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/preprocessors';
};

export type DeletePreprocessorsErrors = {
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

export type DeletePreprocessorsError = DeletePreprocessorsErrors[keyof DeletePreprocessorsErrors];

export type DeletePreprocessorsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeletePreprocessorsResponse = DeletePreprocessorsResponses[keyof DeletePreprocessorsResponses];

export type GetPreprocessorsData = {
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
     * Example: `{"primary":{"preprocessorId": 123}}` -> `eyJwcmltYXJ5Ijp7InByZXByb2Nlc3NvcklkIjogMTIzfX0=`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"preprocessorId": 123}}` -> `eyJwcmltYXJ5Ijp7InByZXByb2Nlc3NvcklkIjogMTIzfX0=`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[preprocessorId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options:
     */
    include?: Array<string>;
  };
  url: '/api/v2/ui/preprocessors';
};

export type GetPreprocessorsErrors = {
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

export type GetPreprocessorsError = GetPreprocessorsErrors[keyof GetPreprocessorsErrors];

export type GetPreprocessorsResponses = {
  /**
   * successful operation
   */
  200: PreprocessorListResponse;
};

export type GetPreprocessorsResponse = GetPreprocessorsResponses[keyof GetPreprocessorsResponses];

export type PatchPreprocessorsData = {
  body: PreprocessorPatchMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/preprocessors';
};

export type PatchPreprocessorsErrors = {
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

export type PatchPreprocessorsError = PatchPreprocessorsErrors[keyof PatchPreprocessorsErrors];

export type PatchPreprocessorsResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchPreprocessorsResponse = PatchPreprocessorsResponses[keyof PatchPreprocessorsResponses];

export type PostPreprocessorsData = {
  body: PreprocessorCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/preprocessors';
};

export type PostPreprocessorsErrors = {
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

export type PostPreprocessorsError = PostPreprocessorsErrors[keyof PostPreprocessorsErrors];

export type PostPreprocessorsResponses = {
  /**
   * successful operation
   */
  201: PreprocessorPostPatchResponse;
};

export type PostPreprocessorsResponse = PostPreprocessorsResponses[keyof PostPreprocessorsResponses];

export type GetPreprocessorsCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[preprocessorId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/preprocessors/count';
};

export type GetPreprocessorsCountErrors = {
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

export type GetPreprocessorsCountError = GetPreprocessorsCountErrors[keyof GetPreprocessorsCountErrors];

export type GetPreprocessorsCountResponses = {
  /**
   * successful operation
   */
  200: PreprocessorCountResponse;
};

export type GetPreprocessorsCountResponse = GetPreprocessorsCountResponses[keyof GetPreprocessorsCountResponses];

export type DeletePreprocessorsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/preprocessors/{id}';
};

export type DeletePreprocessorsByIdErrors = {
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

export type DeletePreprocessorsByIdError = DeletePreprocessorsByIdErrors[keyof DeletePreprocessorsByIdErrors];

export type DeletePreprocessorsByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeletePreprocessorsByIdResponse = DeletePreprocessorsByIdResponses[keyof DeletePreprocessorsByIdResponses];

export type GetPreprocessorsByIdData = {
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
  url: '/api/v2/ui/preprocessors/{id}';
};

export type GetPreprocessorsByIdErrors = {
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

export type GetPreprocessorsByIdError = GetPreprocessorsByIdErrors[keyof GetPreprocessorsByIdErrors];

export type GetPreprocessorsByIdResponses = {
  /**
   * successful operation
   */
  200: PreprocessorResponse;
};

export type GetPreprocessorsByIdResponse = GetPreprocessorsByIdResponses[keyof GetPreprocessorsByIdResponses];

export type PatchPreprocessorsByIdData = {
  body: PreprocessorPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/preprocessors/{id}';
};

export type PatchPreprocessorsByIdErrors = {
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

export type PatchPreprocessorsByIdError = PatchPreprocessorsByIdErrors[keyof PatchPreprocessorsByIdErrors];

export type PatchPreprocessorsByIdResponses = {
  /**
   * successful operation
   */
  200: PreprocessorPostPatchResponse;
};

export type PatchPreprocessorsByIdResponse = PatchPreprocessorsByIdResponses[keyof PatchPreprocessorsByIdResponses];
