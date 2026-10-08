import type { ErrorResponse } from './common';

export type TaskResourceObject = {
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
    totalAssignedAgents?: number;
    dispatched?: string;
    searched?: string;
    status?: 0 | 1 | 2 | 3 | 4;
    totalNumberOfChunks?: number;
    currentSpeed?: number;
    estimatedTime?: number;
    cprogress?: number;
    timeSpent?: number;
    cracked?: number;
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
};

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
      preprocessorCommand?: string;
      priority?: number;
      statusTimer?: number;
      taskName?: string;
    };
  };
};

export type TaskPatchMultiple = {
  data: Array<{
    id: number;
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
      preprocessorCommand?: string;
      priority?: number;
      statusTimer?: number;
      taskName?: string;
    };
  }>;
};

export type TaskDeleteMultiple = {
  data: Array<{
    id: number;
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
      totalAssignedAgents?: number;
      dispatched?: string;
      searched?: string;
      status?: 0 | 1 | 2 | 3 | 4;
      totalNumberOfChunks?: number;
      currentSpeed?: number;
      estimatedTime?: number;
      cprogress?: number;
      timeSpent?: number;
      cracked?: number;
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
  };
  included?: Array<
    | {
        id: number;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: number;
          version: string;
          /**
           * External http/https url where the agent downloads the binary archive from. The server keeps a local copy of the archive for later analysis: on creation it is downloaded from this url, and changing the url re-downloads it from the new url. The creation or change is rejected if that download fails or the archive is not a valid 7z file. Mutually exclusive with sourceType: when the archive is uploaded with sourceType, this url is set automatically to the download endpoint of this server and cannot be changed afterwards.
           */
          downloadUrl: string | null;
          binaryName: string;
          /**
           * Filename of the locally stored 7z archive, null when the binary is downloaded from the downloadUrl. Cannot be provided.
           */
          filename: string | null;
          /**
           * Access group containing this cracker binary. Required on creation; the requesting user must belong to the group. It can be changed only when the user belongs to both the current and new groups.
           */
          accessGroupId: number;
        };
      }
    | {
        id: number;
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean | null;
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
  links: {
    self: string;
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
      totalAssignedAgents?: number;
      dispatched?: string;
      searched?: string;
      status?: 0 | 1 | 2 | 3 | 4;
      totalNumberOfChunks?: number;
      currentSpeed?: number;
      estimatedTime?: number;
      cprogress?: number;
      timeSpent?: number;
      cracked?: number;
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
  };
  included?: Array<
    | {
        id: number;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: number;
          version: string;
          /**
           * External http/https url where the agent downloads the binary archive from. The server keeps a local copy of the archive for later analysis: on creation it is downloaded from this url, and changing the url re-downloads it from the new url. The creation or change is rejected if that download fails or the archive is not a valid 7z file. Mutually exclusive with sourceType: when the archive is uploaded with sourceType, this url is set automatically to the download endpoint of this server and cannot be changed afterwards.
           */
          downloadUrl: string | null;
          binaryName: string;
          /**
           * Filename of the locally stored 7z archive, null when the binary is downloaded from the downloadUrl. Cannot be provided.
           */
          filename: string | null;
          /**
           * Access group containing this cracker binary. Required on creation; the requesting user must belong to the group. It can be changed only when the user belongs to both the current and new groups.
           */
          accessGroupId: number;
        };
      }
    | {
        id: number;
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean | null;
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
      totalAssignedAgents?: number;
      dispatched?: string;
      searched?: string;
      status?: 0 | 1 | 2 | 3 | 4;
      totalNumberOfChunks?: number;
      currentSpeed?: number;
      estimatedTime?: number;
      cprogress?: number;
      timeSpent?: number;
      cracked?: number;
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
  }>;
  included?: Array<
    | {
        id: number;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: number;
          version: string;
          /**
           * External http/https url where the agent downloads the binary archive from. The server keeps a local copy of the archive for later analysis: on creation it is downloaded from this url, and changing the url re-downloads it from the new url. The creation or change is rejected if that download fails or the archive is not a valid 7z file. Mutually exclusive with sourceType: when the archive is uploaded with sourceType, this url is set automatically to the download endpoint of this server and cannot be changed afterwards.
           */
          downloadUrl: string | null;
          binaryName: string;
          /**
           * Filename of the locally stored 7z archive, null when the binary is downloaded from the downloadUrl. Cannot be provided.
           */
          filename: string | null;
          /**
           * Access group containing this cracker binary. Required on creation; the requesting user must belong to the group. It can be changed only when the user belongs to both the current and new groups.
           */
          accessGroupId: number;
        };
      }
    | {
        id: number;
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean | null;
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

export type TaskCountResponse = {
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

export type TaskRelationCrackerBinary = {
  data: {
    type: 'crackerBinary';
    id: number;
  };
};

export type TaskRelationCrackerBinaryGetResponse = {
  data: {
    type: 'crackerBinary';
    id: number;
  };
};

export type TaskRelationCrackerBinaryType = {
  data: {
    type: 'crackerBinaryType';
    id: number;
  };
};

export type TaskRelationCrackerBinaryTypeGetResponse = {
  data: {
    type: 'crackerBinaryType';
    id: number;
  };
};

export type TaskRelationHashlist = {
  data: {
    type: 'hashlist';
    id: number;
  };
};

export type TaskRelationHashlistGetResponse = {
  data: {
    type: 'hashlist';
    id: number;
  };
};

export type TaskRelationAssignedAgents = {
  data: Array<{
    type: 'agent';
    id: number;
  }>;
};

export type TaskRelationAssignedAgentsGetResponse = {
  data: Array<{
    type: 'agent';
    id: number;
  }>;
};

export type TaskRelationFiles = {
  data: Array<{
    type: 'file';
    id: number;
  }>;
};

export type TaskRelationFilesGetResponse = {
  data: Array<{
    type: 'file';
    id: number;
  }>;
};

export type TaskRelationSpeeds = {
  data: Array<{
    type: 'speed';
    id: number;
  }>;
};

export type TaskRelationSpeedsGetResponse = {
  data: Array<{
    type: 'speed';
    id: number;
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
     * Also report the number of accessible objects without any filter applied, as `meta.total_count`
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

export type GetTasksByIdCrackerBinaryData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/crackerBinary';
};

export type GetTasksByIdCrackerBinaryErrors = {
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

export type GetTasksByIdCrackerBinaryError = GetTasksByIdCrackerBinaryErrors[keyof GetTasksByIdCrackerBinaryErrors];

export type GetTasksByIdCrackerBinaryResponses = {
  /**
   * successful operation
   */
  200: TaskRelationCrackerBinaryGetResponse;
};

export type GetTasksByIdCrackerBinaryResponse =
  GetTasksByIdCrackerBinaryResponses[keyof GetTasksByIdCrackerBinaryResponses];

export type GetTasksByIdRelationshipsCrackerBinaryData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/crackerBinary';
};

export type GetTasksByIdRelationshipsCrackerBinaryErrors = {
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

export type GetTasksByIdRelationshipsCrackerBinaryError =
  GetTasksByIdRelationshipsCrackerBinaryErrors[keyof GetTasksByIdRelationshipsCrackerBinaryErrors];

export type GetTasksByIdRelationshipsCrackerBinaryResponses = {
  /**
   * successful operation
   */
  200: TaskResponse;
};

export type GetTasksByIdRelationshipsCrackerBinaryResponse =
  GetTasksByIdRelationshipsCrackerBinaryResponses[keyof GetTasksByIdRelationshipsCrackerBinaryResponses];

export type PatchTasksByIdRelationshipsCrackerBinaryData = {
  body: TaskRelationCrackerBinary;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/crackerBinary';
};

export type PatchTasksByIdRelationshipsCrackerBinaryErrors = {
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

export type PatchTasksByIdRelationshipsCrackerBinaryError =
  PatchTasksByIdRelationshipsCrackerBinaryErrors[keyof PatchTasksByIdRelationshipsCrackerBinaryErrors];

export type PatchTasksByIdRelationshipsCrackerBinaryResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchTasksByIdRelationshipsCrackerBinaryResponse =
  PatchTasksByIdRelationshipsCrackerBinaryResponses[keyof PatchTasksByIdRelationshipsCrackerBinaryResponses];

export type GetTasksByIdCrackerBinaryTypeData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/crackerBinaryType';
};

export type GetTasksByIdCrackerBinaryTypeErrors = {
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

export type GetTasksByIdCrackerBinaryTypeError =
  GetTasksByIdCrackerBinaryTypeErrors[keyof GetTasksByIdCrackerBinaryTypeErrors];

export type GetTasksByIdCrackerBinaryTypeResponses = {
  /**
   * successful operation
   */
  200: TaskRelationCrackerBinaryTypeGetResponse;
};

export type GetTasksByIdCrackerBinaryTypeResponse =
  GetTasksByIdCrackerBinaryTypeResponses[keyof GetTasksByIdCrackerBinaryTypeResponses];

export type GetTasksByIdRelationshipsCrackerBinaryTypeData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/crackerBinaryType';
};

export type GetTasksByIdRelationshipsCrackerBinaryTypeErrors = {
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

export type GetTasksByIdRelationshipsCrackerBinaryTypeError =
  GetTasksByIdRelationshipsCrackerBinaryTypeErrors[keyof GetTasksByIdRelationshipsCrackerBinaryTypeErrors];

export type GetTasksByIdRelationshipsCrackerBinaryTypeResponses = {
  /**
   * successful operation
   */
  200: TaskResponse;
};

export type GetTasksByIdRelationshipsCrackerBinaryTypeResponse =
  GetTasksByIdRelationshipsCrackerBinaryTypeResponses[keyof GetTasksByIdRelationshipsCrackerBinaryTypeResponses];

export type PatchTasksByIdRelationshipsCrackerBinaryTypeData = {
  body: TaskRelationCrackerBinaryType;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/crackerBinaryType';
};

export type PatchTasksByIdRelationshipsCrackerBinaryTypeErrors = {
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

export type PatchTasksByIdRelationshipsCrackerBinaryTypeError =
  PatchTasksByIdRelationshipsCrackerBinaryTypeErrors[keyof PatchTasksByIdRelationshipsCrackerBinaryTypeErrors];

export type PatchTasksByIdRelationshipsCrackerBinaryTypeResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchTasksByIdRelationshipsCrackerBinaryTypeResponse =
  PatchTasksByIdRelationshipsCrackerBinaryTypeResponses[keyof PatchTasksByIdRelationshipsCrackerBinaryTypeResponses];

export type GetTasksByIdHashlistData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/hashlist';
};

export type GetTasksByIdHashlistErrors = {
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

export type GetTasksByIdHashlistError = GetTasksByIdHashlistErrors[keyof GetTasksByIdHashlistErrors];

export type GetTasksByIdHashlistResponses = {
  /**
   * successful operation
   */
  200: TaskRelationHashlistGetResponse;
};

export type GetTasksByIdHashlistResponse = GetTasksByIdHashlistResponses[keyof GetTasksByIdHashlistResponses];

export type GetTasksByIdRelationshipsHashlistData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/hashlist';
};

export type GetTasksByIdRelationshipsHashlistErrors = {
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

export type GetTasksByIdRelationshipsHashlistError =
  GetTasksByIdRelationshipsHashlistErrors[keyof GetTasksByIdRelationshipsHashlistErrors];

export type GetTasksByIdRelationshipsHashlistResponses = {
  /**
   * successful operation
   */
  200: TaskResponse;
};

export type GetTasksByIdRelationshipsHashlistResponse =
  GetTasksByIdRelationshipsHashlistResponses[keyof GetTasksByIdRelationshipsHashlistResponses];

export type PatchTasksByIdRelationshipsHashlistData = {
  body: TaskRelationHashlist;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/hashlist';
};

export type PatchTasksByIdRelationshipsHashlistErrors = {
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

export type PatchTasksByIdRelationshipsHashlistError =
  PatchTasksByIdRelationshipsHashlistErrors[keyof PatchTasksByIdRelationshipsHashlistErrors];

export type PatchTasksByIdRelationshipsHashlistResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchTasksByIdRelationshipsHashlistResponse =
  PatchTasksByIdRelationshipsHashlistResponses[keyof PatchTasksByIdRelationshipsHashlistResponses];

export type GetTasksByIdAssignedAgentsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/assignedAgents';
};

export type GetTasksByIdAssignedAgentsErrors = {
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

export type GetTasksByIdAssignedAgentsError = GetTasksByIdAssignedAgentsErrors[keyof GetTasksByIdAssignedAgentsErrors];

export type GetTasksByIdAssignedAgentsResponses = {
  /**
   * successful operation
   */
  200: TaskRelationAssignedAgentsGetResponse;
};

export type GetTasksByIdAssignedAgentsResponse =
  GetTasksByIdAssignedAgentsResponses[keyof GetTasksByIdAssignedAgentsResponses];

export type DeleteTasksByIdRelationshipsAssignedAgentsData = {
  body: TaskRelationAssignedAgents;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/assignedAgents';
};

export type DeleteTasksByIdRelationshipsAssignedAgentsErrors = {
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

export type DeleteTasksByIdRelationshipsAssignedAgentsError =
  DeleteTasksByIdRelationshipsAssignedAgentsErrors[keyof DeleteTasksByIdRelationshipsAssignedAgentsErrors];

export type DeleteTasksByIdRelationshipsAssignedAgentsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteTasksByIdRelationshipsAssignedAgentsResponse =
  DeleteTasksByIdRelationshipsAssignedAgentsResponses[keyof DeleteTasksByIdRelationshipsAssignedAgentsResponses];

export type GetTasksByIdRelationshipsAssignedAgentsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/assignedAgents';
};

export type GetTasksByIdRelationshipsAssignedAgentsErrors = {
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

export type GetTasksByIdRelationshipsAssignedAgentsError =
  GetTasksByIdRelationshipsAssignedAgentsErrors[keyof GetTasksByIdRelationshipsAssignedAgentsErrors];

export type GetTasksByIdRelationshipsAssignedAgentsResponses = {
  /**
   * successful operation
   */
  200: TaskResponse;
};

export type GetTasksByIdRelationshipsAssignedAgentsResponse =
  GetTasksByIdRelationshipsAssignedAgentsResponses[keyof GetTasksByIdRelationshipsAssignedAgentsResponses];

export type PatchTasksByIdRelationshipsAssignedAgentsData = {
  body: TaskRelationAssignedAgents;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/assignedAgents';
};

export type PatchTasksByIdRelationshipsAssignedAgentsErrors = {
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

export type PatchTasksByIdRelationshipsAssignedAgentsError =
  PatchTasksByIdRelationshipsAssignedAgentsErrors[keyof PatchTasksByIdRelationshipsAssignedAgentsErrors];

export type PatchTasksByIdRelationshipsAssignedAgentsResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchTasksByIdRelationshipsAssignedAgentsResponse =
  PatchTasksByIdRelationshipsAssignedAgentsResponses[keyof PatchTasksByIdRelationshipsAssignedAgentsResponses];

export type PostTasksByIdRelationshipsAssignedAgentsData = {
  body: TaskRelationAssignedAgents;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/assignedAgents';
};

export type PostTasksByIdRelationshipsAssignedAgentsErrors = {
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

export type PostTasksByIdRelationshipsAssignedAgentsError =
  PostTasksByIdRelationshipsAssignedAgentsErrors[keyof PostTasksByIdRelationshipsAssignedAgentsErrors];

export type PostTasksByIdRelationshipsAssignedAgentsResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostTasksByIdRelationshipsAssignedAgentsResponse =
  PostTasksByIdRelationshipsAssignedAgentsResponses[keyof PostTasksByIdRelationshipsAssignedAgentsResponses];

export type GetTasksByIdFilesData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/files';
};

export type GetTasksByIdFilesErrors = {
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

export type GetTasksByIdFilesError = GetTasksByIdFilesErrors[keyof GetTasksByIdFilesErrors];

export type GetTasksByIdFilesResponses = {
  /**
   * successful operation
   */
  200: TaskRelationFilesGetResponse;
};

export type GetTasksByIdFilesResponse = GetTasksByIdFilesResponses[keyof GetTasksByIdFilesResponses];

export type DeleteTasksByIdRelationshipsFilesData = {
  body: TaskRelationFiles;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/files';
};

export type DeleteTasksByIdRelationshipsFilesErrors = {
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

export type DeleteTasksByIdRelationshipsFilesError =
  DeleteTasksByIdRelationshipsFilesErrors[keyof DeleteTasksByIdRelationshipsFilesErrors];

export type DeleteTasksByIdRelationshipsFilesResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteTasksByIdRelationshipsFilesResponse =
  DeleteTasksByIdRelationshipsFilesResponses[keyof DeleteTasksByIdRelationshipsFilesResponses];

export type GetTasksByIdRelationshipsFilesData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/files';
};

export type GetTasksByIdRelationshipsFilesErrors = {
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

export type GetTasksByIdRelationshipsFilesError =
  GetTasksByIdRelationshipsFilesErrors[keyof GetTasksByIdRelationshipsFilesErrors];

export type GetTasksByIdRelationshipsFilesResponses = {
  /**
   * successful operation
   */
  200: TaskResponse;
};

export type GetTasksByIdRelationshipsFilesResponse =
  GetTasksByIdRelationshipsFilesResponses[keyof GetTasksByIdRelationshipsFilesResponses];

export type PatchTasksByIdRelationshipsFilesData = {
  body: TaskRelationFiles;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/files';
};

export type PatchTasksByIdRelationshipsFilesErrors = {
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

export type PatchTasksByIdRelationshipsFilesError =
  PatchTasksByIdRelationshipsFilesErrors[keyof PatchTasksByIdRelationshipsFilesErrors];

export type PatchTasksByIdRelationshipsFilesResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchTasksByIdRelationshipsFilesResponse =
  PatchTasksByIdRelationshipsFilesResponses[keyof PatchTasksByIdRelationshipsFilesResponses];

export type PostTasksByIdRelationshipsFilesData = {
  body: TaskRelationFiles;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/files';
};

export type PostTasksByIdRelationshipsFilesErrors = {
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

export type PostTasksByIdRelationshipsFilesError =
  PostTasksByIdRelationshipsFilesErrors[keyof PostTasksByIdRelationshipsFilesErrors];

export type PostTasksByIdRelationshipsFilesResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostTasksByIdRelationshipsFilesResponse =
  PostTasksByIdRelationshipsFilesResponses[keyof PostTasksByIdRelationshipsFilesResponses];

export type GetTasksByIdSpeedsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/speeds';
};

export type GetTasksByIdSpeedsErrors = {
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

export type GetTasksByIdSpeedsError = GetTasksByIdSpeedsErrors[keyof GetTasksByIdSpeedsErrors];

export type GetTasksByIdSpeedsResponses = {
  /**
   * successful operation
   */
  200: TaskRelationSpeedsGetResponse;
};

export type GetTasksByIdSpeedsResponse = GetTasksByIdSpeedsResponses[keyof GetTasksByIdSpeedsResponses];

export type DeleteTasksByIdRelationshipsSpeedsData = {
  body: TaskRelationSpeeds;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/speeds';
};

export type DeleteTasksByIdRelationshipsSpeedsErrors = {
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

export type DeleteTasksByIdRelationshipsSpeedsError =
  DeleteTasksByIdRelationshipsSpeedsErrors[keyof DeleteTasksByIdRelationshipsSpeedsErrors];

export type DeleteTasksByIdRelationshipsSpeedsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteTasksByIdRelationshipsSpeedsResponse =
  DeleteTasksByIdRelationshipsSpeedsResponses[keyof DeleteTasksByIdRelationshipsSpeedsResponses];

export type GetTasksByIdRelationshipsSpeedsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/speeds';
};

export type GetTasksByIdRelationshipsSpeedsErrors = {
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

export type GetTasksByIdRelationshipsSpeedsError =
  GetTasksByIdRelationshipsSpeedsErrors[keyof GetTasksByIdRelationshipsSpeedsErrors];

export type GetTasksByIdRelationshipsSpeedsResponses = {
  /**
   * successful operation
   */
  200: TaskResponse;
};

export type GetTasksByIdRelationshipsSpeedsResponse =
  GetTasksByIdRelationshipsSpeedsResponses[keyof GetTasksByIdRelationshipsSpeedsResponses];

export type PatchTasksByIdRelationshipsSpeedsData = {
  body: TaskRelationSpeeds;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/speeds';
};

export type PatchTasksByIdRelationshipsSpeedsErrors = {
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

export type PatchTasksByIdRelationshipsSpeedsError =
  PatchTasksByIdRelationshipsSpeedsErrors[keyof PatchTasksByIdRelationshipsSpeedsErrors];

export type PatchTasksByIdRelationshipsSpeedsResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchTasksByIdRelationshipsSpeedsResponse =
  PatchTasksByIdRelationshipsSpeedsResponses[keyof PatchTasksByIdRelationshipsSpeedsResponses];

export type PostTasksByIdRelationshipsSpeedsData = {
  body: TaskRelationSpeeds;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/tasks/{id}/relationships/speeds';
};

export type PostTasksByIdRelationshipsSpeedsErrors = {
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

export type PostTasksByIdRelationshipsSpeedsError =
  PostTasksByIdRelationshipsSpeedsErrors[keyof PostTasksByIdRelationshipsSpeedsErrors];

export type PostTasksByIdRelationshipsSpeedsResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostTasksByIdRelationshipsSpeedsResponse =
  PostTasksByIdRelationshipsSpeedsResponses[keyof PostTasksByIdRelationshipsSpeedsResponses];

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
