import type { ErrorResponse } from './common';

export type SpeedResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'speed';
    attributes: {
      agentId: string;
      taskId: string;
      speed: number;
      time: number;
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

export type SpeedListResponse = {
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
    type: 'speed';
    attributes: {
      agentId: string;
      taskId: string;
      speed: number;
      time: number;
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

export type SpeedCountResponse = {
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

export type SpeedRelationTask = {
  data: {
    type: 'task';
    id: string;
  };
};

export type SpeedRelationTaskGetResponse = {
  data: {
    type: 'task';
    id: string;
  };
};

export type GetSpeedsData = {
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
     * Example: `{"primary":{"speedId": 123}}` -> `eyJwcmltYXJ5Ijp7InNwZWVkSWQiOiAxMjN9fQ==`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"speedId": 123}}` -> `eyJwcmltYXJ5Ijp7InNwZWVkSWQiOiAxMjN9fQ==`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[speedId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: agent, task
     */
    include?: Array<'agent' | 'task'>;
  };
  url: '/api/v2/ui/speeds';
};

export type GetSpeedsErrors = {
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

export type GetSpeedsError = GetSpeedsErrors[keyof GetSpeedsErrors];

export type GetSpeedsResponses = {
  /**
   * successful operation
   */
  200: SpeedListResponse;
};

export type GetSpeedsResponse = GetSpeedsResponses[keyof GetSpeedsResponses];

export type GetSpeedsCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[speedId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/speeds/count';
};

export type GetSpeedsCountErrors = {
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

export type GetSpeedsCountError = GetSpeedsCountErrors[keyof GetSpeedsCountErrors];

export type GetSpeedsCountResponses = {
  /**
   * successful operation
   */
  200: SpeedCountResponse;
};

export type GetSpeedsCountResponse = GetSpeedsCountResponses[keyof GetSpeedsCountResponses];

export type GetSpeedsByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/speeds/{id}/{relation}';
};

export type GetSpeedsByIdByRelationErrors = {
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

export type GetSpeedsByIdByRelationError = GetSpeedsByIdByRelationErrors[keyof GetSpeedsByIdByRelationErrors];

export type GetSpeedsByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: SpeedRelationTaskGetResponse;
};

export type GetSpeedsByIdByRelationResponse = GetSpeedsByIdByRelationResponses[keyof GetSpeedsByIdByRelationResponses];

export type GetSpeedsByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/speeds/{id}/relationships/{relation}';
};

export type GetSpeedsByIdRelationshipsByRelationErrors = {
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

export type GetSpeedsByIdRelationshipsByRelationError =
  GetSpeedsByIdRelationshipsByRelationErrors[keyof GetSpeedsByIdRelationshipsByRelationErrors];

export type GetSpeedsByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: SpeedResponse;
};

export type GetSpeedsByIdRelationshipsByRelationResponse =
  GetSpeedsByIdRelationshipsByRelationResponses[keyof GetSpeedsByIdRelationshipsByRelationResponses];

export type PatchSpeedsByIdRelationshipsByRelationData = {
  body: SpeedRelationTask;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/speeds/{id}/relationships/{relation}';
};

export type PatchSpeedsByIdRelationshipsByRelationErrors = {
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

export type PatchSpeedsByIdRelationshipsByRelationError =
  PatchSpeedsByIdRelationshipsByRelationErrors[keyof PatchSpeedsByIdRelationshipsByRelationErrors];

export type PatchSpeedsByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchSpeedsByIdRelationshipsByRelationResponse =
  PatchSpeedsByIdRelationshipsByRelationResponses[keyof PatchSpeedsByIdRelationshipsByRelationResponses];

export type GetSpeedsByIdData = {
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
  url: '/api/v2/ui/speeds/{id}';
};

export type GetSpeedsByIdErrors = {
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

export type GetSpeedsByIdError = GetSpeedsByIdErrors[keyof GetSpeedsByIdErrors];

export type GetSpeedsByIdResponses = {
  /**
   * successful operation
   */
  200: SpeedResponse;
};

export type GetSpeedsByIdResponse = GetSpeedsByIdResponses[keyof GetSpeedsByIdResponses];
