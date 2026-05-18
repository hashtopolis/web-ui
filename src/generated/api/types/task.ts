import type { ErrorResponse, NotFoundResponse } from './common';

export type TaskCreate = {
  data: {
    type: 'task';
    attributes: {
      hashlistId: number;
      files: Array<number>;
      taskName: string;
      attackCmd: string;
      chunkTime: number;
      statusTimer: number;
      priority: number;
      maxAgents: number;
      color?: string | null;
      isSmall: boolean;
      isCpuTask: boolean;
      useNewBench: boolean;
      skipKeyspace: number;
      crackerBinaryId: number;
      crackerBinaryTypeId?: number | null;
      isArchived: boolean;
      notes: string;
      staticChunks: number;
      chunkSize: number;
      forcePipe: boolean;
      preprocessorId: number;
      preprocessorCommand: string;
    };
  };
};

export type TaskPatch = {
  data: {
    type: 'task';
    attributes: {
      attackCmd?: string;
      chunkTime?: number;
      color?: string | null;
      isArchived?: boolean;
      isCpuTask?: boolean;
      isSmall?: boolean;
      maxAgents?: number;
      notes?: string;
      priority?: number;
      statusTimer?: number;
      taskName?: string;
    };
  };
};

export type TaskResponse = {
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
      activeAgents?: number;
      dispatched?: string;
      searched?: string;
      status?: 0 | 1 | 2 | 3;
      estimatedTime?: number;
      timeSpent?: number;
      currentSpeed?: number;
      cprogress?: number;
    };
  };
  relationships?: {
    assignedAgents: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'agent';
        id: number;
      }>;
    };
    crackerBinary: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'crackerBinary';
        id: number;
      } | null;
    };
    crackerBinaryType: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'crackerBinaryType';
        id: number;
      } | null;
    };
    files: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'file';
        id: number;
      }>;
    };
    hashlist: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'hashlist';
        id: number;
      } | null;
    };
    speeds: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'speed';
        id: number;
      }>;
    };
  };
  included?: Array<
    | {
        id: number;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: number;
          version: string;
          downloadUrl: string;
          binaryName: string;
        };
      }
    | {
        id: number;
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean;
        };
      }
    | {
        id: number;
        type: 'hashlist';
        attributes: {
          name: string;
          format: 0 | 1 | 2 | 3;
          hashTypeId: number;
          hashCount: number;
          separator: string | null;
          cracked: number;
          isSecret: boolean;
          isHexSalt: boolean;
          isSalted: boolean;
          accessGroupId: number;
          notes: string;
          useBrain: boolean;
          brainFeatures: number;
          isArchived: boolean;
        };
      }
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
        type: 'file';
        attributes: {
          filename: string;
          size: number;
          isSecret: boolean;
          fileType: 0 | 1 | 2 | 100;
          accessGroupId: number;
          lineCount: number;
        };
      }
    | {
        id: number;
        type: 'speed';
        attributes: {
          agentId: number;
          taskId: number;
          speed: number;
          time: number;
        };
      }
  >;
};

export type TaskPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  data: {
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
      activeAgents?: number;
      dispatched?: string;
      searched?: string;
      status?: 0 | 1 | 2 | 3;
      estimatedTime?: number;
      timeSpent?: number;
      currentSpeed?: number;
      cprogress?: number;
    };
  };
};

export type TaskListResponse = {
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
      activeAgents?: number;
      dispatched?: string;
      searched?: string;
      status?: 0 | 1 | 2 | 3;
      estimatedTime?: number;
      timeSpent?: number;
      currentSpeed?: number;
      cprogress?: number;
    };
  }>;
  relationships?: {
    assignedAgents: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'agent';
        id: number;
      }>;
    };
    crackerBinary: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'crackerBinary';
        id: number;
      } | null;
    };
    crackerBinaryType: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'crackerBinaryType';
        id: number;
      } | null;
    };
    files: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'file';
        id: number;
      }>;
    };
    hashlist: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'hashlist';
        id: number;
      } | null;
    };
    speeds: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'speed';
        id: number;
      }>;
    };
  };
  included?: Array<
    | {
        id: number;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: number;
          version: string;
          downloadUrl: string;
          binaryName: string;
        };
      }
    | {
        id: number;
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean;
        };
      }
    | {
        id: number;
        type: 'hashlist';
        attributes: {
          name: string;
          format: 0 | 1 | 2 | 3;
          hashTypeId: number;
          hashCount: number;
          separator: string | null;
          cracked: number;
          isSecret: boolean;
          isHexSalt: boolean;
          isSalted: boolean;
          accessGroupId: number;
          notes: string;
          useBrain: boolean;
          brainFeatures: number;
          isArchived: boolean;
        };
      }
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
        type: 'file';
        attributes: {
          filename: string;
          size: number;
          isSecret: boolean;
          fileType: 0 | 1 | 2 | 100;
          accessGroupId: number;
          lineCount: number;
        };
      }
    | {
        id: number;
        type: 'speed';
        attributes: {
          agentId: number;
          taskId: number;
          speed: number;
          time: number;
        };
      }
  >;
};

export type TaskRelationSpeeds = {
  data: Array<{
    type: 'speeds';
    id: number;
  }>;
};

export type TaskRelationSpeedsGetResponse = {
  data: Array<{
    type: 'speeds';
    id: number;
  }>;
};

export type DeleteTasksData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/tasks';
};

export type DeleteTasksErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type DeleteTasksError = DeleteTasksErrors[keyof DeleteTasksErrors];

export type DeleteTasksResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetTasksData = {
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
  url: '/api/v2/ui/tasks';
};

export type GetTasksErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetTasksError = GetTasksErrors[keyof GetTasksErrors];

export type GetTasksResponses = {
  /**
   * successful operation
   */
  200: TaskListResponse;
};

export type GetTasksResponse = GetTasksResponses[keyof GetTasksResponses];

export type PatchTasksData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/tasks';
};

export type PatchTasksErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PatchTasksError = PatchTasksErrors[keyof PatchTasksErrors];

export type PatchTasksResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type PostTasksData = {
  body: TaskCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/tasks';
};

export type PostTasksErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PostTasksError = PostTasksErrors[keyof PostTasksErrors];

export type PostTasksResponses = {
  /**
   * successful operation
   */
  201: TaskPostPatchResponse;
};

export type PostTasksResponse = PostTasksResponses[keyof PostTasksResponses];

export type GetTasksCountData = {
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
  url: '/api/v2/ui/tasks/count';
};

export type GetTasksCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetTasksCountError = GetTasksCountErrors[keyof GetTasksCountErrors];

export type GetTasksCountResponses = {
  /**
   * successful operation
   */
  200: TaskListResponse;
};

export type GetTasksCountResponse = GetTasksCountResponses[keyof GetTasksCountResponses];

export type GetTasksByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/{relation}';
};

export type GetTasksByIdByRelationErrors = {
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

export type GetTasksByIdByRelationError = GetTasksByIdByRelationErrors[keyof GetTasksByIdByRelationErrors];

export type GetTasksByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: TaskRelationSpeedsGetResponse;
};

export type GetTasksByIdByRelationResponse = GetTasksByIdByRelationResponses[keyof GetTasksByIdByRelationResponses];

export type DeleteTasksByIdRelationshipsByRelationData = {
  body: TaskRelationSpeeds;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/{relation}';
};

export type DeleteTasksByIdRelationshipsByRelationErrors = {
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

export type DeleteTasksByIdRelationshipsByRelationError =
  DeleteTasksByIdRelationshipsByRelationErrors[keyof DeleteTasksByIdRelationshipsByRelationErrors];

export type DeleteTasksByIdRelationshipsByRelationResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteTasksByIdRelationshipsByRelationResponse =
  DeleteTasksByIdRelationshipsByRelationResponses[keyof DeleteTasksByIdRelationshipsByRelationResponses];

export type GetTasksByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/{relation}';
};

export type GetTasksByIdRelationshipsByRelationErrors = {
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

export type GetTasksByIdRelationshipsByRelationError =
  GetTasksByIdRelationshipsByRelationErrors[keyof GetTasksByIdRelationshipsByRelationErrors];

export type GetTasksByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: TaskResponse;
};

export type GetTasksByIdRelationshipsByRelationResponse =
  GetTasksByIdRelationshipsByRelationResponses[keyof GetTasksByIdRelationshipsByRelationResponses];

export type PatchTasksByIdRelationshipsByRelationData = {
  body: TaskRelationSpeeds;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/{relation}';
};

export type PatchTasksByIdRelationshipsByRelationErrors = {
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

export type PatchTasksByIdRelationshipsByRelationError =
  PatchTasksByIdRelationshipsByRelationErrors[keyof PatchTasksByIdRelationshipsByRelationErrors];

export type PatchTasksByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchTasksByIdRelationshipsByRelationResponse =
  PatchTasksByIdRelationshipsByRelationResponses[keyof PatchTasksByIdRelationshipsByRelationResponses];

export type PostTasksByIdRelationshipsByRelationData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/{relation}';
};

export type PostTasksByIdRelationshipsByRelationErrors = {
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

export type PostTasksByIdRelationshipsByRelationError =
  PostTasksByIdRelationshipsByRelationErrors[keyof PostTasksByIdRelationshipsByRelationErrors];

export type PostTasksByIdRelationshipsByRelationResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostTasksByIdRelationshipsByRelationResponse =
  PostTasksByIdRelationshipsByRelationResponses[keyof PostTasksByIdRelationshipsByRelationResponses];

export type DeleteTasksByIdData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}';
};

export type DeleteTasksByIdErrors = {
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

export type DeleteTasksByIdError = DeleteTasksByIdErrors[keyof DeleteTasksByIdErrors];

export type DeleteTasksByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteTasksByIdResponse = DeleteTasksByIdResponses[keyof DeleteTasksByIdResponses];

export type GetTasksByIdData = {
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
  url: '/api/v2/ui/tasks/{id}';
};

export type GetTasksByIdErrors = {
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

export type GetTasksByIdError = GetTasksByIdErrors[keyof GetTasksByIdErrors];

export type GetTasksByIdResponses = {
  /**
   * successful operation
   */
  200: TaskResponse;
};

export type GetTasksByIdResponse = GetTasksByIdResponses[keyof GetTasksByIdResponses];

export type PatchTasksByIdData = {
  body: TaskPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}';
};

export type PatchTasksByIdErrors = {
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

export type PatchTasksByIdError = PatchTasksByIdErrors[keyof PatchTasksByIdErrors];

export type PatchTasksByIdResponses = {
  /**
   * successful operation
   */
  200: TaskPostPatchResponse;
};

export type PatchTasksByIdResponse = PatchTasksByIdResponses[keyof PatchTasksByIdResponses];
