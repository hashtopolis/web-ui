import type { ErrorResponse } from './common';

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
      crackerBinaryId: string;
      crackerBinaryTypeId?: string | null;
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

export type TaskPatchMultiple = {
  data: Array<{
    id: string;
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
  }>;
};

export type TaskDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'task';
  }>;
};

export type TaskResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
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
      totalAssignedAgents?: number;
      dispatched?: string;
      searched?: string;
      status?: 0 | 1 | 2 | 3 | 4;
      totalNumberOfChunks?: number;
      currentSpeed?: number;
      estimatedTime?: number;
      timeSpent?: number;
      cprogress?: number;
    };
    links: {
      self: string;
    };
    relationships: {
      assignedAgents: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agent';
          id: string;
        }>;
      };
      crackerBinary: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'crackerBinary';
          id: string;
        } | null;
      };
      crackerBinaryType: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'crackerBinaryType';
          id: string;
        } | null;
      };
      files: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'file';
          id: string;
        }>;
      };
      hashlist: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'hashlist';
          id: string;
        } | null;
      };
      speeds: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'speed';
          id: string;
        }>;
      };
    };
  };
  included?: Array<
    | {
        id: string;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: string;
          version: string;
          downloadUrl: string;
          binaryName: string;
        };
      }
    | {
        id: string;
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean | null;
        };
      }
    | {
        id: string;
        type: 'hashlist';
        attributes: {
          name: string;
          format: 0 | 1 | 2 | 3;
          hashTypeId: string;
          hashCount: number;
          separator: string | null;
          cracked: number;
          isSecret: boolean;
          isHexSalt: boolean;
          isSalted: boolean;
          accessGroupId: string;
          notes: string;
          useBrain: boolean;
          brainFeatures: number;
          isArchived: boolean;
        };
      }
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
        type: 'file';
        attributes: {
          filename: string;
          size: number;
          isSecret: boolean;
          fileType: 0 | 1 | 2 | 100;
          accessGroupId: string;
          lineCount: number;
        };
      }
    | {
        id: string;
        type: 'speed';
        attributes: {
          agentId: string;
          taskId: string;
          speed: number;
          time: number;
        };
      }
  >;
};

export type TaskSingleResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
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
      totalAssignedAgents?: number;
      dispatched?: string;
      searched?: string;
      status?: 0 | 1 | 2 | 3 | 4;
      totalNumberOfChunks?: number;
      currentSpeed?: number;
      estimatedTime?: number;
      timeSpent?: number;
      cprogress?: number;
    };
    links: {
      self: string;
    };
    relationships: {
      assignedAgents: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agent';
          id: string;
        }>;
      };
      crackerBinary: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'crackerBinary';
          id: string;
        } | null;
      };
      crackerBinaryType: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'crackerBinaryType';
          id: string;
        } | null;
      };
      files: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'file';
          id: string;
        }>;
      };
      hashlist: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'hashlist';
          id: string;
        } | null;
      };
      speeds: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'speed';
          id: string;
        }>;
      };
    };
  };
  included?: Array<
    | {
        id: string;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: string;
          version: string;
          downloadUrl: string;
          binaryName: string;
        };
      }
    | {
        id: string;
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean | null;
        };
      }
    | {
        id: string;
        type: 'hashlist';
        attributes: {
          name: string;
          format: 0 | 1 | 2 | 3;
          hashTypeId: string;
          hashCount: number;
          separator: string | null;
          cracked: number;
          isSecret: boolean;
          isHexSalt: boolean;
          isSalted: boolean;
          accessGroupId: string;
          notes: string;
          useBrain: boolean;
          brainFeatures: number;
          isArchived: boolean;
        };
      }
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
        type: 'file';
        attributes: {
          filename: string;
          size: number;
          isSecret: boolean;
          fileType: 0 | 1 | 2 | 100;
          accessGroupId: string;
          lineCount: number;
        };
      }
    | {
        id: string;
        type: 'speed';
        attributes: {
          agentId: string;
          taskId: string;
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
  links: {
    self: string;
  };
  data: {
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
      totalAssignedAgents?: number;
      dispatched?: string;
      searched?: string;
      status?: 0 | 1 | 2 | 3 | 4;
      totalNumberOfChunks?: number;
      currentSpeed?: number;
      estimatedTime?: number;
      timeSpent?: number;
      cprogress?: number;
    };
    links: {
      self: string;
    };
    relationships: {
      assignedAgents: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agent';
          id: string;
        }>;
      };
      crackerBinary: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'crackerBinary';
          id: string;
        } | null;
      };
      crackerBinaryType: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'crackerBinaryType';
          id: string;
        } | null;
      };
      files: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'file';
          id: string;
        }>;
      };
      hashlist: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'hashlist';
          id: string;
        } | null;
      };
      speeds: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'speed';
          id: string;
        }>;
      };
    };
  };
  included?: Array<
    | {
        id: string;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: string;
          version: string;
          downloadUrl: string;
          binaryName: string;
        };
      }
    | {
        id: string;
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean | null;
        };
      }
    | {
        id: string;
        type: 'hashlist';
        attributes: {
          name: string;
          format: 0 | 1 | 2 | 3;
          hashTypeId: string;
          hashCount: number;
          separator: string | null;
          cracked: number;
          isSecret: boolean;
          isHexSalt: boolean;
          isSalted: boolean;
          accessGroupId: string;
          notes: string;
          useBrain: boolean;
          brainFeatures: number;
          isArchived: boolean;
        };
      }
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
        type: 'file';
        attributes: {
          filename: string;
          size: number;
          isSecret: boolean;
          fileType: 0 | 1 | 2 | 100;
          accessGroupId: string;
          lineCount: number;
        };
      }
    | {
        id: string;
        type: 'speed';
        attributes: {
          agentId: string;
          taskId: string;
          speed: number;
          time: number;
        };
      }
  >;
};

export type TaskListResponse = {
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
      totalAssignedAgents?: number;
      dispatched?: string;
      searched?: string;
      status?: 0 | 1 | 2 | 3 | 4;
      totalNumberOfChunks?: number;
      currentSpeed?: number;
      estimatedTime?: number;
      timeSpent?: number;
      cprogress?: number;
    };
    links: {
      self: string;
    };
    relationships: {
      assignedAgents: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agent';
          id: string;
        }>;
      };
      crackerBinary: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'crackerBinary';
          id: string;
        } | null;
      };
      crackerBinaryType: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'crackerBinaryType';
          id: string;
        } | null;
      };
      files: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'file';
          id: string;
        }>;
      };
      hashlist: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'hashlist';
          id: string;
        } | null;
      };
      speeds: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'speed';
          id: string;
        }>;
      };
    };
  }>;
  included?: Array<
    | {
        id: string;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: string;
          version: string;
          downloadUrl: string;
          binaryName: string;
        };
      }
    | {
        id: string;
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean | null;
        };
      }
    | {
        id: string;
        type: 'hashlist';
        attributes: {
          name: string;
          format: 0 | 1 | 2 | 3;
          hashTypeId: string;
          hashCount: number;
          separator: string | null;
          cracked: number;
          isSecret: boolean;
          isHexSalt: boolean;
          isSalted: boolean;
          accessGroupId: string;
          notes: string;
          useBrain: boolean;
          brainFeatures: number;
          isArchived: boolean;
        };
      }
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
        type: 'file';
        attributes: {
          filename: string;
          size: number;
          isSecret: boolean;
          fileType: 0 | 1 | 2 | 100;
          accessGroupId: string;
          lineCount: number;
        };
      }
    | {
        id: string;
        type: 'speed';
        attributes: {
          agentId: string;
          taskId: string;
          speed: number;
          time: number;
        };
      }
  >;
};

export type TaskCountResponse = {
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

export type TaskRelationSpeeds = {
  data: Array<{
    type: 'speeds';
    id: string;
  }>;
};

export type TaskRelationSpeedsGetResponse = {
  data: Array<{
    type: 'speeds';
    id: string;
  }>;
};

export type DeleteTasksData = {
  body: TaskDeleteMultiple;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type DeleteTasksError = DeleteTasksErrors[keyof DeleteTasksErrors];

export type DeleteTasksResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteTasksResponse = DeleteTasksResponses[keyof DeleteTasksResponses];

export type GetTasksData = {
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
     * Example: `{"primary":{"taskId": 123}}` -> `eyJwcmltYXJ5Ijp7InRhc2tJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"taskId": 123}}` -> `eyJwcmltYXJ5Ijp7InRhc2tJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[taskId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: crackerBinary, crackerBinaryType, hashlist, assignedAgents, files, speeds
     */
    include?: Array<'crackerBinary' | 'crackerBinaryType' | 'hashlist' | 'assignedAgents' | 'files' | 'speeds'>;
    /**
     * Aggregated fields to include by type (comma separated values). Possible options: task: totalAssignedAgents, dispatched, searched, status, totalNumberOfChunks, currentSpeed, estimatedTime, cprogress, timeSpent, cracked
     */
    aggregate?: {
      [key: string]: string;
    };
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
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
  body: TaskPatchMultiple;
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

export type PatchTasksError = PatchTasksErrors[keyof PatchTasksErrors];

export type PatchTasksResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchTasksResponse = PatchTasksResponses[keyof PatchTasksResponses];

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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
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
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[taskId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetTasksCountError = GetTasksCountErrors[keyof GetTasksCountErrors];

export type GetTasksCountResponses = {
  /**
   * successful operation
   */
  200: TaskCountResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
  body: TaskRelationSpeeds;
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
  body?: never;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
     * Relationships to include in the response, comma seperated. Possible options: crackerBinary, crackerBinaryType, hashlist, assignedAgents, files, speeds
     */
    include?: Array<'crackerBinary' | 'crackerBinaryType' | 'hashlist' | 'assignedAgents' | 'files' | 'speeds'>;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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

export type PatchTasksByIdError = PatchTasksByIdErrors[keyof PatchTasksByIdErrors];

export type PatchTasksByIdResponses = {
  /**
   * successful operation
   */
  200: TaskPostPatchResponse;
};

export type PatchTasksByIdResponse = PatchTasksByIdResponses[keyof PatchTasksByIdResponses];
