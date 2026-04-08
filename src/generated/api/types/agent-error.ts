import type { ErrorResponse, NotFoundResponse } from './common';

export type AgentErrorResponse = {
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
    type: 'agentError';
    attributes: {
      agentId: number;
      taskId: number;
      chunkId: number | null;
      time: number;
      error: string;
    };
  };
  relationships?: {
    task: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'task';
        id: number;
      } | null;
    };
  };
  included?: Array<{
    id: number;
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
      crackerBinaryId: number;
      crackerBinaryTypeId: number | null;
      taskWrapperId: number;
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
  links?: {
    self: string;
    first?: string;
    last?: string;
    next?: string | null;
    previous?: string | null;
  };
  data: Array<{
    id: number;
    type: 'agentError';
    attributes: {
      agentId: number;
      taskId: number;
      chunkId: number | null;
      time: number;
      error: string;
    };
  }>;
  relationships?: {
    task: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'task';
        id: number;
      } | null;
    };
  };
  included?: Array<{
    id: number;
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
      crackerBinaryId: number;
      crackerBinaryTypeId: number | null;
      taskWrapperId: number;
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

export type AgentErrorRelationTask = {
  data: {
    type: 'task';
    id: number;
  };
};

export type AgentErrorRelationTaskGetResponse = {
  data: {
    type: 'task';
    id: number;
  };
};

export type DeleteAgenterrorsData = {
  body?: never;
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
};

export type DeleteAgenterrorsError = DeleteAgenterrorsErrors[keyof DeleteAgenterrorsErrors];

export type DeleteAgenterrorsResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetAgenterrorsData = {
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
};

export type GetAgenterrorsCountError = GetAgenterrorsCountErrors[keyof GetAgenterrorsCountErrors];

export type GetAgenterrorsCountResponses = {
  /**
   * successful operation
   */
  200: AgentErrorListResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
  body: {
    [key: string]: unknown;
  };
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
   * Not Found
   */
  404: NotFoundResponse;
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
     * Items to include. Comma seperated
     */
    include?: string;
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
   * Not Found
   */
  404: NotFoundResponse;
};

export type GetAgenterrorsByIdError = GetAgenterrorsByIdErrors[keyof GetAgenterrorsByIdErrors];

export type GetAgenterrorsByIdResponses = {
  /**
   * successful operation
   */
  200: AgentErrorResponse;
};

export type GetAgenterrorsByIdResponse = GetAgenterrorsByIdResponses[keyof GetAgenterrorsByIdResponses];
