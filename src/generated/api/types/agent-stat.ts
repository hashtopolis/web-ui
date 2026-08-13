import type { ErrorResponse } from './common';

export type AgentStatDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'agentStat';
  }>;
};

export type AgentStatResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'agentStat';
    attributes: {
      agentId: string;
      statType: 1 | 2 | 3;
      time: number;
      value: Array<number>;
    };
    links: {
      self: string;
    };
  };
};

export type AgentStatListResponse = {
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
    type: 'agentStat';
    attributes: {
      agentId: string;
      statType: 1 | 2 | 3;
      time: number;
      value: Array<number>;
    };
    links: {
      self: string;
    };
  }>;
};

export type AgentStatCountResponse = {
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

export type DeleteAgentstatsData = {
  body: AgentStatDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/agentstats';
};

export type DeleteAgentstatsErrors = {
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

export type DeleteAgentstatsError = DeleteAgentstatsErrors[keyof DeleteAgentstatsErrors];

export type DeleteAgentstatsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentstatsResponse = DeleteAgentstatsResponses[keyof DeleteAgentstatsResponses];

export type GetAgentstatsData = {
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
     * Example: `{"primary":{"agentStatId": 123}}` -> `eyJwcmltYXJ5Ijp7ImFnZW50U3RhdElkIjogMTIzfX0=`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"agentStatId": 123}}` -> `eyJwcmltYXJ5Ijp7ImFnZW50U3RhdElkIjogMTIzfX0=`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[agentStatId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options:
     */
    include?: Array<string>;
  };
  url: '/api/v2/ui/agentstats';
};

export type GetAgentstatsErrors = {
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

export type GetAgentstatsError = GetAgentstatsErrors[keyof GetAgentstatsErrors];

export type GetAgentstatsResponses = {
  /**
   * successful operation
   */
  200: AgentStatListResponse;
};

export type GetAgentstatsResponse = GetAgentstatsResponses[keyof GetAgentstatsResponses];

export type GetAgentstatsCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[agentStatId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/agentstats/count';
};

export type GetAgentstatsCountErrors = {
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

export type GetAgentstatsCountError = GetAgentstatsCountErrors[keyof GetAgentstatsCountErrors];

export type GetAgentstatsCountResponses = {
  /**
   * successful operation
   */
  200: AgentStatCountResponse;
};

export type GetAgentstatsCountResponse = GetAgentstatsCountResponses[keyof GetAgentstatsCountResponses];

export type DeleteAgentstatsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agentstats/{id}';
};

export type DeleteAgentstatsByIdErrors = {
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

export type DeleteAgentstatsByIdError = DeleteAgentstatsByIdErrors[keyof DeleteAgentstatsByIdErrors];

export type DeleteAgentstatsByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentstatsByIdResponse = DeleteAgentstatsByIdResponses[keyof DeleteAgentstatsByIdResponses];

export type GetAgentstatsByIdData = {
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
  url: '/api/v2/ui/agentstats/{id}';
};

export type GetAgentstatsByIdErrors = {
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

export type GetAgentstatsByIdError = GetAgentstatsByIdErrors[keyof GetAgentstatsByIdErrors];

export type GetAgentstatsByIdResponses = {
  /**
   * successful operation
   */
  200: AgentStatResponse;
};

export type GetAgentstatsByIdResponse = GetAgentstatsByIdResponses[keyof GetAgentstatsByIdResponses];
