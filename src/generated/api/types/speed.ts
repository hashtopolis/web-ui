import type { ErrorResponse, NotFoundResponse } from './common';

export type SpeedResponse = {
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
    type: 'speed';
    attributes: {
      agentId: number;
      taskId: number;
      speed: number;
      time: number;
    };
  };
  relationships?: {
    agent: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'agent';
        id: number;
      } | null;
    };
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
  included?: Array<
    | {
        id: number;
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
          userId: number | null;
          cpuOnly: boolean;
          clientSignature: string;
        };
      }
    | {
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
      }
  >;
};

export type SpeedListResponse = {
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
    type: 'speed';
    attributes: {
      agentId: number;
      taskId: number;
      speed: number;
      time: number;
    };
  }>;
  relationships?: {
    agent: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'agent';
        id: number;
      } | null;
    };
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
  included?: Array<
    | {
        id: number;
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
          userId: number | null;
          cpuOnly: boolean;
          clientSignature: string;
        };
      }
    | {
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
      }
  >;
};

export type SpeedRelationTask = {
  data: {
    type: 'task';
    id: number;
  };
};

export type SpeedRelationTaskGetResponse = {
  data: {
    type: 'task';
    id: number;
  };
};

export type GetSpeedsData = {
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
};

export type GetSpeedsCountError = GetSpeedsCountErrors[keyof GetSpeedsCountErrors];

export type GetSpeedsCountResponses = {
  /**
   * successful operation
   */
  200: SpeedListResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
     * Items to include. Comma seperated
     */
    include?: string;
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
   * Not Found
   */
  404: NotFoundResponse;
};

export type GetSpeedsByIdError = GetSpeedsByIdErrors[keyof GetSpeedsByIdErrors];

export type GetSpeedsByIdResponses = {
  /**
   * successful operation
   */
  200: SpeedResponse;
};

export type GetSpeedsByIdResponse = GetSpeedsByIdResponses[keyof GetSpeedsByIdResponses];
