import type { ErrorResponse } from './common';

export type ChunkResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'chunk';
    attributes: {
      taskId: string;
      skip: number;
      length: number;
      agentId: string;
      dispatchTime: number;
      solveTime: number;
      checkpoint: number;
      progress: number;
      state: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
      cracked: number;
      speed: number;
    };
    links: {
      self: string;
    };
    relationships: {
      agent: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'agent';
          id: string;
        } | null;
      };
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
  included?: Array<
    | {
        id: string;
        type: 'agent';
        attributes: {
          agentName: string;
          uid: string;
          os: 0 | 1 | 2;
          devices: string;
          cmdPars: string;
          ignoreErrors: 0 | 1 | 2;
          isActive: boolean;
          isTrusted: boolean;
          token: string;
          lastAct: string;
          lastTime: number;
          lastIp: string;
          userId: string | null;
          cpuOnly: boolean;
          clientSignature: string;
        };
      }
    | {
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
      }
  >;
};

export type ChunkListResponse = {
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
    type: 'chunk';
    attributes: {
      taskId: string;
      skip: number;
      length: number;
      agentId: string;
      dispatchTime: number;
      solveTime: number;
      checkpoint: number;
      progress: number;
      state: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
      cracked: number;
      speed: number;
    };
    links: {
      self: string;
    };
    relationships: {
      agent: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'agent';
          id: string;
        } | null;
      };
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
  included?: Array<
    | {
        id: string;
        type: 'agent';
        attributes: {
          agentName: string;
          uid: string;
          os: 0 | 1 | 2;
          devices: string;
          cmdPars: string;
          ignoreErrors: 0 | 1 | 2;
          isActive: boolean;
          isTrusted: boolean;
          token: string;
          lastAct: string;
          lastTime: number;
          lastIp: string;
          userId: string | null;
          cpuOnly: boolean;
          clientSignature: string;
        };
      }
    | {
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
      }
  >;
};

export type ChunkCountResponse = {
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

export type ChunkRelationTask = {
  data: {
    type: 'task';
    id: string;
  };
};

export type ChunkRelationTaskGetResponse = {
  data: {
    type: 'task';
    id: string;
  };
};

export type GetChunksData = {
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
     * Example: `{"primary":{"chunkId": 123}}` -> `eyJwcmltYXJ5Ijp7ImNodW5rSWQiOiAxMjN9fQ==`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"chunkId": 123}}` -> `eyJwcmltYXJ5Ijp7ImNodW5rSWQiOiAxMjN9fQ==`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[chunkId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: agent, task
     */
    include?: Array<'agent' | 'task'>;
  };
  url: '/api/v2/ui/chunks';
};

export type GetChunksErrors = {
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

export type GetChunksError = GetChunksErrors[keyof GetChunksErrors];

export type GetChunksResponses = {
  /**
   * successful operation
   */
  200: ChunkListResponse;
};

export type GetChunksResponse = GetChunksResponses[keyof GetChunksResponses];

export type GetChunksCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[chunkId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/chunks/count';
};

export type GetChunksCountErrors = {
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

export type GetChunksCountError = GetChunksCountErrors[keyof GetChunksCountErrors];

export type GetChunksCountResponses = {
  /**
   * successful operation
   */
  200: ChunkCountResponse;
};

export type GetChunksCountResponse = GetChunksCountResponses[keyof GetChunksCountResponses];

export type GetChunksByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/chunks/{id}/{relation}';
};

export type GetChunksByIdByRelationErrors = {
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

export type GetChunksByIdByRelationError = GetChunksByIdByRelationErrors[keyof GetChunksByIdByRelationErrors];

export type GetChunksByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: ChunkRelationTaskGetResponse;
};

export type GetChunksByIdByRelationResponse = GetChunksByIdByRelationResponses[keyof GetChunksByIdByRelationResponses];

export type GetChunksByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/chunks/{id}/relationships/{relation}';
};

export type GetChunksByIdRelationshipsByRelationErrors = {
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

export type GetChunksByIdRelationshipsByRelationError =
  GetChunksByIdRelationshipsByRelationErrors[keyof GetChunksByIdRelationshipsByRelationErrors];

export type GetChunksByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: ChunkResponse;
};

export type GetChunksByIdRelationshipsByRelationResponse =
  GetChunksByIdRelationshipsByRelationResponses[keyof GetChunksByIdRelationshipsByRelationResponses];

export type PatchChunksByIdRelationshipsByRelationData = {
  body: ChunkRelationTask;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/chunks/{id}/relationships/{relation}';
};

export type PatchChunksByIdRelationshipsByRelationErrors = {
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

export type PatchChunksByIdRelationshipsByRelationError =
  PatchChunksByIdRelationshipsByRelationErrors[keyof PatchChunksByIdRelationshipsByRelationErrors];

export type PatchChunksByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchChunksByIdRelationshipsByRelationResponse =
  PatchChunksByIdRelationshipsByRelationResponses[keyof PatchChunksByIdRelationshipsByRelationResponses];

export type GetChunksByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options: agent, task
     */
    include?: Array<'agent' | 'task'>;
  };
  url: '/api/v2/ui/chunks/{id}';
};

export type GetChunksByIdErrors = {
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

export type GetChunksByIdError = GetChunksByIdErrors[keyof GetChunksByIdErrors];

export type GetChunksByIdResponses = {
  /**
   * successful operation
   */
  200: ChunkResponse;
};

export type GetChunksByIdResponse = GetChunksByIdResponses[keyof GetChunksByIdResponses];
