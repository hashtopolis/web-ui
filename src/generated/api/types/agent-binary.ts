import type { ErrorResponse } from './common';

export type AgentBinaryCreate = {
  data: {
    type: 'agentBinary';
    attributes: {
      binaryType: string;
      version: string;
      operatingSystems: string;
      filename: string;
      updateTrack: string;
    };
  };
};

export type AgentBinaryPatch = {
  data: {
    type: 'agentBinary';
    attributes: {
      binaryType?: string;
      filename?: string;
      operatingSystems?: string;
      updateTrack?: string;
      version?: string;
    };
  };
};

export type AgentBinaryPatchMultiple = {
  data: Array<{
    id: string;
    type: 'agentBinary';
    attributes: {
      binaryType?: string;
      filename?: string;
      operatingSystems?: string;
      updateTrack?: string;
      version?: string;
    };
  }>;
};

export type AgentBinaryDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'agentBinary';
  }>;
};

export type AgentBinaryResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'agentBinary';
    attributes: {
      binaryType: string;
      version: string;
      operatingSystems: string;
      filename: string;
      updateTrack: string;
      updateAvailable: string;
    };
    links: {
      self: string;
    };
  };
};

export type AgentBinaryPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'agentBinary';
    attributes: {
      binaryType: string;
      version: string;
      operatingSystems: string;
      filename: string;
      updateTrack: string;
      updateAvailable: string;
    };
    links: {
      self: string;
    };
  };
};

export type AgentBinaryListResponse = {
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
    type: 'agentBinary';
    attributes: {
      binaryType: string;
      version: string;
      operatingSystems: string;
      filename: string;
      updateTrack: string;
      updateAvailable: string;
    };
    links: {
      self: string;
    };
  }>;
};

export type AgentBinaryCountResponse = {
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

export type DeleteAgentbinariesData = {
  body: AgentBinaryDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/agentbinaries';
};

export type DeleteAgentbinariesErrors = {
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

export type DeleteAgentbinariesError = DeleteAgentbinariesErrors[keyof DeleteAgentbinariesErrors];

export type DeleteAgentbinariesResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentbinariesResponse = DeleteAgentbinariesResponses[keyof DeleteAgentbinariesResponses];

export type GetAgentbinariesData = {
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
     * Example: `{"primary":{"agentBinaryId": 123}}` -> `eyJwcmltYXJ5Ijp7ImFnZW50QmluYXJ5SWQiOiAxMjN9fQ==`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"agentBinaryId": 123}}` -> `eyJwcmltYXJ5Ijp7ImFnZW50QmluYXJ5SWQiOiAxMjN9fQ==`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[agentBinaryId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options:
     */
    include?: Array<string>;
  };
  url: '/api/v2/ui/agentbinaries';
};

export type GetAgentbinariesErrors = {
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

export type GetAgentbinariesError = GetAgentbinariesErrors[keyof GetAgentbinariesErrors];

export type GetAgentbinariesResponses = {
  /**
   * successful operation
   */
  200: AgentBinaryListResponse;
};

export type GetAgentbinariesResponse = GetAgentbinariesResponses[keyof GetAgentbinariesResponses];

export type PatchAgentbinariesData = {
  body: AgentBinaryPatchMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/agentbinaries';
};

export type PatchAgentbinariesErrors = {
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

export type PatchAgentbinariesError = PatchAgentbinariesErrors[keyof PatchAgentbinariesErrors];

export type PatchAgentbinariesResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchAgentbinariesResponse = PatchAgentbinariesResponses[keyof PatchAgentbinariesResponses];

export type PostAgentbinariesData = {
  body: AgentBinaryCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/agentbinaries';
};

export type PostAgentbinariesErrors = {
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

export type PostAgentbinariesError = PostAgentbinariesErrors[keyof PostAgentbinariesErrors];

export type PostAgentbinariesResponses = {
  /**
   * successful operation
   */
  201: AgentBinaryPostPatchResponse;
};

export type PostAgentbinariesResponse = PostAgentbinariesResponses[keyof PostAgentbinariesResponses];

export type GetAgentbinariesCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[agentBinaryId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/agentbinaries/count';
};

export type GetAgentbinariesCountErrors = {
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

export type GetAgentbinariesCountError = GetAgentbinariesCountErrors[keyof GetAgentbinariesCountErrors];

export type GetAgentbinariesCountResponses = {
  /**
   * successful operation
   */
  200: AgentBinaryCountResponse;
};

export type GetAgentbinariesCountResponse = GetAgentbinariesCountResponses[keyof GetAgentbinariesCountResponses];

export type DeleteAgentbinariesByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agentbinaries/{id}';
};

export type DeleteAgentbinariesByIdErrors = {
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

export type DeleteAgentbinariesByIdError = DeleteAgentbinariesByIdErrors[keyof DeleteAgentbinariesByIdErrors];

export type DeleteAgentbinariesByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentbinariesByIdResponse = DeleteAgentbinariesByIdResponses[keyof DeleteAgentbinariesByIdResponses];

export type GetAgentbinariesByIdData = {
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
  url: '/api/v2/ui/agentbinaries/{id}';
};

export type GetAgentbinariesByIdErrors = {
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

export type GetAgentbinariesByIdError = GetAgentbinariesByIdErrors[keyof GetAgentbinariesByIdErrors];

export type GetAgentbinariesByIdResponses = {
  /**
   * successful operation
   */
  200: AgentBinaryResponse;
};

export type GetAgentbinariesByIdResponse = GetAgentbinariesByIdResponses[keyof GetAgentbinariesByIdResponses];

export type PatchAgentbinariesByIdData = {
  body: AgentBinaryPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agentbinaries/{id}';
};

export type PatchAgentbinariesByIdErrors = {
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

export type PatchAgentbinariesByIdError = PatchAgentbinariesByIdErrors[keyof PatchAgentbinariesByIdErrors];

export type PatchAgentbinariesByIdResponses = {
  /**
   * successful operation
   */
  200: AgentBinaryPostPatchResponse;
};

export type PatchAgentbinariesByIdResponse = PatchAgentbinariesByIdResponses[keyof PatchAgentbinariesByIdResponses];
