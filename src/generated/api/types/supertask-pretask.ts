import type { ErrorResponse } from './common';

export type SupertaskPretaskPatch = {
  data: {
    type: 'supertaskPretask';
    attributes: {
      priority?: number;
    };
  };
};

export type SupertaskPretaskPatchMultiple = {
  data: Array<{
    id: number;
    type: 'supertaskPretask';
    attributes: {
      priority?: number;
    };
  }>;
};

export type SupertaskPretaskResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: number;
    type: 'supertaskPretask';
    attributes: {
      supertaskId: number;
      pretaskId: number;
      priority: number;
    };
    links: {
      self: string;
    };
  };
};

export type SupertaskPretaskPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: number;
    type: 'supertaskPretask';
    attributes: {
      supertaskId: number;
      pretaskId: number;
      priority: number;
    };
    links: {
      self: string;
    };
  };
};

export type SupertaskPretaskListResponse = {
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
    id: number;
    type: 'supertaskPretask';
    attributes: {
      supertaskId: number;
      pretaskId: number;
      priority: number;
    };
    links: {
      self: string;
    };
  }>;
};

export type SupertaskPretaskCountResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    /**
     * Number of objects accessible to the current user matching the given filters
     */
    count: number;
    /**
     * Number of objects accessible to the current user without any filter applied, only present when `include_total=true` was requested
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

export type GetSupertaskpretasksData = {
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
     * Example: `{"primary":{"supertaskPretaskId": 123}}` -> `eyJwcmltYXJ5Ijp7InN1cGVydGFza1ByZXRhc2tJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"supertaskPretaskId": 123}}` -> `eyJwcmltYXJ5Ijp7InN1cGVydGFza1ByZXRhc2tJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amount of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[supertaskPretaskId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options:
     */
    include?: Array<string>;
  };
  url: '/api/v2/ui/supertaskpretasks';
};

export type GetSupertaskpretasksErrors = {
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

export type GetSupertaskpretasksError = GetSupertaskpretasksErrors[keyof GetSupertaskpretasksErrors];

export type GetSupertaskpretasksResponses = {
  /**
   * successful operation
   */
  200: SupertaskPretaskListResponse;
};

export type GetSupertaskpretasksResponse = GetSupertaskpretasksResponses[keyof GetSupertaskpretasksResponses];

export type PatchSupertaskpretasksData = {
  body: SupertaskPretaskPatchMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/supertaskpretasks';
};

export type PatchSupertaskpretasksErrors = {
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

export type PatchSupertaskpretasksError = PatchSupertaskpretasksErrors[keyof PatchSupertaskpretasksErrors];

export type PatchSupertaskpretasksResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchSupertaskpretasksResponse = PatchSupertaskpretasksResponses[keyof PatchSupertaskpretasksResponses];

export type GetSupertaskpretasksCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[supertaskPretaskId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of accessible objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/supertaskpretasks/count';
};

export type GetSupertaskpretasksCountErrors = {
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

export type GetSupertaskpretasksCountError = GetSupertaskpretasksCountErrors[keyof GetSupertaskpretasksCountErrors];

export type GetSupertaskpretasksCountResponses = {
  /**
   * successful operation
   */
  200: SupertaskPretaskCountResponse;
};

export type GetSupertaskpretasksCountResponse =
  GetSupertaskpretasksCountResponses[keyof GetSupertaskpretasksCountResponses];

export type GetSupertaskpretasksByIdData = {
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
  url: '/api/v2/ui/supertaskpretasks/{id}';
};

export type GetSupertaskpretasksByIdErrors = {
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

export type GetSupertaskpretasksByIdError = GetSupertaskpretasksByIdErrors[keyof GetSupertaskpretasksByIdErrors];

export type GetSupertaskpretasksByIdResponses = {
  /**
   * successful operation
   */
  200: SupertaskPretaskResponse;
};

export type GetSupertaskpretasksByIdResponse =
  GetSupertaskpretasksByIdResponses[keyof GetSupertaskpretasksByIdResponses];

export type PatchSupertaskpretasksByIdData = {
  body: SupertaskPretaskPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/supertaskpretasks/{id}';
};

export type PatchSupertaskpretasksByIdErrors = {
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

export type PatchSupertaskpretasksByIdError = PatchSupertaskpretasksByIdErrors[keyof PatchSupertaskpretasksByIdErrors];

export type PatchSupertaskpretasksByIdResponses = {
  /**
   * successful operation
   */
  200: SupertaskPretaskPostPatchResponse;
};

export type PatchSupertaskpretasksByIdResponse =
  PatchSupertaskpretasksByIdResponses[keyof PatchSupertaskpretasksByIdResponses];
