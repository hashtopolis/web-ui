import type { ErrorResponse } from './common';

export type AgentErrorDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'agentError';
  }>;
};

export type AgentErrorResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'agentError';
    attributes: {
      agentId: string;
      taskId: string;
      chunkId: string | null;
      time: number;
      error: string;
    };
    links: {
      self: string;
    };
    relationships: {
      task: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'task';
          id: string;
        } | null;
      };
    };
  };
  included?: Array<{
    id: string;
    type: 'task';
    attributes: {
      taskName: string;
      attackCmd: string;
      chunkTime: number;
      statusTimer: number;
      keyspace: number;
      keyspaceProgress: number;
      priority: number;
      maxAgents: number;
      color: string | null;
      isSmall: boolean;
      isCpuTask: boolean;
      useNewBench: boolean;
      skipKeyspace: number;
      crackerBinaryId: string;
      crackerBinaryTypeId: string | null;
      taskWrapperId: string;
      isArchived: boolean;
      notes: string;
      staticChunks: number;
      chunkSize: number;
      forcePipe: boolean;
      preprocessorId: number;
      preprocessorCommand: string;
    };
  }>;
};

export type AgentErrorListResponse = {
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
    type: 'agentError';
    attributes: {
      agentId: string;
      taskId: string;
      chunkId: string | null;
      time: number;
      error: string;
    };
    links: {
      self: string;
    };
    relationships: {
      task: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'task';
          id: string;
        } | null;
      };
    };
  }>;
  included?: Array<{
    id: string;
    type: 'task';
    attributes: {
      taskName: string;
      attackCmd: string;
      chunkTime: number;
      statusTimer: number;
      keyspace: number;
      keyspaceProgress: number;
      priority: number;
      maxAgents: number;
      color: string | null;
      isSmall: boolean;
      isCpuTask: boolean;
      useNewBench: boolean;
      skipKeyspace: number;
      crackerBinaryId: string;
      crackerBinaryTypeId: string | null;
      taskWrapperId: string;
      isArchived: boolean;
      notes: string;
      staticChunks: number;
      chunkSize: number;
      forcePipe: boolean;
      preprocessorId: number;
      preprocessorCommand: string;
    };
  }>;
};

export type AgentErrorCountResponse = {
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

export type AgentErrorRelationTask = {
  data: {
    type: 'task';
    id: string;
  };
};

export type AgentErrorRelationTaskGetResponse = {
  data: {
    type: 'task';
    id: string;
  };
};

export type DeleteAgenterrorsData = {
  body: AgentErrorDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/agenterrors';
};

export type DeleteAgenterrorsErrors = {
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

export type DeleteAgenterrorsError = DeleteAgenterrorsErrors[keyof DeleteAgenterrorsErrors];

export type DeleteAgenterrorsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgenterrorsResponse = DeleteAgenterrorsResponses[keyof DeleteAgenterrorsResponses];

export type GetAgenterrorsData = {
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
     * Example: `{"primary":{"agentErrorId": 123}}` -> `eyJwcmltYXJ5Ijp7ImFnZW50RXJyb3JJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"agentErrorId": 123}}` -> `eyJwcmltYXJ5Ijp7ImFnZW50RXJyb3JJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[agentErrorId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: task
     */
    include?: Array<'task'>;
  };
  url: '/api/v2/ui/agenterrors';
};

export type GetAgenterrorsErrors = {
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

export type GetAgenterrorsError = GetAgenterrorsErrors[keyof GetAgenterrorsErrors];

export type GetAgenterrorsResponses = {
  /**
   * successful operation
   */
  200: AgentErrorListResponse;
};

export type GetAgenterrorsResponse = GetAgenterrorsResponses[keyof GetAgenterrorsResponses];

export type GetAgenterrorsCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[agentErrorId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/agenterrors/count';
};

export type GetAgenterrorsCountErrors = {
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

export type GetAgenterrorsCountError = GetAgenterrorsCountErrors[keyof GetAgenterrorsCountErrors];

export type GetAgenterrorsCountResponses = {
  /**
   * successful operation
   */
  200: AgentErrorCountResponse;
};

export type GetAgenterrorsCountResponse = GetAgenterrorsCountResponses[keyof GetAgenterrorsCountResponses];

export type GetAgenterrorsByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/agenterrors/{id}/{relation}';
};

export type GetAgenterrorsByIdByRelationErrors = {
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

export type GetAgenterrorsByIdByRelationError =
  GetAgenterrorsByIdByRelationErrors[keyof GetAgenterrorsByIdByRelationErrors];

export type GetAgenterrorsByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: AgentErrorRelationTaskGetResponse;
};

export type GetAgenterrorsByIdByRelationResponse =
  GetAgenterrorsByIdByRelationResponses[keyof GetAgenterrorsByIdByRelationResponses];

export type GetAgenterrorsByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/agenterrors/{id}/relationships/{relation}';
};

export type GetAgenterrorsByIdRelationshipsByRelationErrors = {
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

export type GetAgenterrorsByIdRelationshipsByRelationError =
  GetAgenterrorsByIdRelationshipsByRelationErrors[keyof GetAgenterrorsByIdRelationshipsByRelationErrors];

export type GetAgenterrorsByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: AgentErrorResponse;
};

export type GetAgenterrorsByIdRelationshipsByRelationResponse =
  GetAgenterrorsByIdRelationshipsByRelationResponses[keyof GetAgenterrorsByIdRelationshipsByRelationResponses];

export type PatchAgenterrorsByIdRelationshipsByRelationData = {
  body: AgentErrorRelationTask;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/agenterrors/{id}/relationships/{relation}';
};

export type PatchAgenterrorsByIdRelationshipsByRelationErrors = {
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

export type PatchAgenterrorsByIdRelationshipsByRelationError =
  PatchAgenterrorsByIdRelationshipsByRelationErrors[keyof PatchAgenterrorsByIdRelationshipsByRelationErrors];

export type PatchAgenterrorsByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchAgenterrorsByIdRelationshipsByRelationResponse =
  PatchAgenterrorsByIdRelationshipsByRelationResponses[keyof PatchAgenterrorsByIdRelationshipsByRelationResponses];

export type DeleteAgenterrorsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agenterrors/{id}';
};

export type DeleteAgenterrorsByIdErrors = {
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

export type DeleteAgenterrorsByIdError = DeleteAgenterrorsByIdErrors[keyof DeleteAgenterrorsByIdErrors];

export type DeleteAgenterrorsByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgenterrorsByIdResponse = DeleteAgenterrorsByIdResponses[keyof DeleteAgenterrorsByIdResponses];

export type GetAgenterrorsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options: task
     */
    include?: Array<'task'>;
  };
  url: '/api/v2/ui/agenterrors/{id}';
};

export type GetAgenterrorsByIdErrors = {
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

export type GetAgenterrorsByIdError = GetAgenterrorsByIdErrors[keyof GetAgenterrorsByIdErrors];

export type GetAgenterrorsByIdResponses = {
  /**
   * successful operation
   */
  200: AgentErrorResponse;
};

export type GetAgenterrorsByIdResponse = GetAgenterrorsByIdResponses[keyof GetAgenterrorsByIdResponses];
