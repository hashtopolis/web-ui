import type { ErrorResponse } from './common';

export type TaskWrapperPatch = {
  data: {
    type: 'taskWrapper';
    attributes: {
      accessGroupId?: string;
      isArchived?: boolean;
      maxAgents?: number;
      priority?: number;
      taskWrapperName?: string;
    };
  };
};

export type TaskWrapperPatchMultiple = {
  data: Array<{
    id: string;
    type: 'taskWrapper';
    attributes: {
      accessGroupId?: string;
      isArchived?: boolean;
      maxAgents?: number;
      priority?: number;
      taskWrapperName?: string;
    };
  }>;
};

export type TaskWrapperDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'taskWrapper';
  }>;
};

export type TaskWrapperResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'taskWrapper';
    attributes: {
      priority: number;
      maxAgents: number;
      taskType: 0 | 1;
      hashlistId: string;
      accessGroupId: string;
      taskWrapperName: string;
      isArchived: boolean;
      cracked: number;
    };
    links: {
      self: string;
    };
    relationships: {
      accessGroup: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'accessGroup';
          id: string;
        } | null;
      };
      hashType: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'hashType';
          id: string;
        } | null;
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
      tasks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'task';
          id: string;
        }>;
      };
    };
  };
  included?: Array<
    | {
        id: string;
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hashType';
        attributes: {
          description: string;
          isSalted: boolean;
          isSlowHash: boolean;
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

export type TaskWrapperSingleResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'taskWrapper';
    attributes: {
      priority: number;
      maxAgents: number;
      taskType: 0 | 1;
      hashlistId: string;
      accessGroupId: string;
      taskWrapperName: string;
      isArchived: boolean;
      cracked: number;
    };
    links: {
      self: string;
    };
    relationships: {
      accessGroup: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'accessGroup';
          id: string;
        } | null;
      };
      hashType: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'hashType';
          id: string;
        } | null;
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
      tasks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'task';
          id: string;
        }>;
      };
    };
  };
  included?: Array<
    | {
        id: string;
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hashType';
        attributes: {
          description: string;
          isSalted: boolean;
          isSlowHash: boolean;
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

export type TaskWrapperPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'taskWrapper';
    attributes: {
      priority: number;
      maxAgents: number;
      taskType: 0 | 1;
      hashlistId: string;
      accessGroupId: string;
      taskWrapperName: string;
      isArchived: boolean;
      cracked: number;
    };
    links: {
      self: string;
    };
    relationships: {
      accessGroup: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'accessGroup';
          id: string;
        } | null;
      };
      hashType: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'hashType';
          id: string;
        } | null;
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
      tasks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'task';
          id: string;
        }>;
      };
    };
  };
  included?: Array<
    | {
        id: string;
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hashType';
        attributes: {
          description: string;
          isSalted: boolean;
          isSlowHash: boolean;
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

export type TaskWrapperListResponse = {
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
    type: 'taskWrapper';
    attributes: {
      priority: number;
      maxAgents: number;
      taskType: 0 | 1;
      hashlistId: string;
      accessGroupId: string;
      taskWrapperName: string;
      isArchived: boolean;
      cracked: number;
    };
    links: {
      self: string;
    };
    relationships: {
      accessGroup: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'accessGroup';
          id: string;
        } | null;
      };
      hashType: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'hashType';
          id: string;
        } | null;
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
      tasks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'task';
          id: string;
        }>;
      };
    };
  }>;
  included?: Array<
    | {
        id: string;
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hashType';
        attributes: {
          description: string;
          isSalted: boolean;
          isSlowHash: boolean;
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

export type TaskWrapperCountResponse = {
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

export type TaskWrapperRelationTasks = {
  data: Array<{
    type: 'tasks';
    id: string;
  }>;
};

export type TaskWrapperRelationTasksGetResponse = {
  data: Array<{
    type: 'tasks';
    id: string;
  }>;
};

export type TaskWrapperDisplayResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'taskWrapperDisplay';
    attributes: {
      taskWrapperPriority: number;
      taskWrapperMaxAgents: number;
      taskType: 0 | 1;
      hashlistId: string;
      accessGroupId: string;
      taskWrapperName: string;
      displayName: string;
      taskWrapperIsArchived: boolean;
      cracked: number;
      taskId: string;
      taskName: string;
      color: string | null;
      attackCmd: string;
      chunkTime: number;
      statusTimer: number;
      keyspace: number;
      keyspaceProgress: number;
      taskPriority: number;
      taskMaxAgents: number;
      isSmall: boolean;
      isCpuTask: boolean;
      taskIsArchived: boolean;
      preprocessorId: number;
      hashlistName: string;
      hashCount: number;
      hashlistCracked: number;
      hashTypeId: string;
      hashTypeDescription: string;
      groupName: string;
    };
    links: {
      self: string;
    };
    relationships: {
      tasks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'task';
          id: string;
        }>;
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

export type TaskWrapperDisplayListResponse = {
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
    type: 'taskWrapperDisplay';
    attributes: {
      taskWrapperPriority: number;
      taskWrapperMaxAgents: number;
      taskType: 0 | 1;
      hashlistId: string;
      accessGroupId: string;
      taskWrapperName: string;
      displayName: string;
      taskWrapperIsArchived: boolean;
      cracked: number;
      taskId: string;
      taskName: string;
      color: string | null;
      attackCmd: string;
      chunkTime: number;
      statusTimer: number;
      keyspace: number;
      keyspaceProgress: number;
      taskPriority: number;
      taskMaxAgents: number;
      isSmall: boolean;
      isCpuTask: boolean;
      taskIsArchived: boolean;
      preprocessorId: number;
      hashlistName: string;
      hashCount: number;
      hashlistCracked: number;
      hashTypeId: string;
      hashTypeDescription: string;
      groupName: string;
    };
    links: {
      self: string;
    };
    relationships: {
      tasks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'task';
          id: string;
        }>;
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

export type TaskWrapperDisplayCountResponse = {
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

export type TaskWrapperDisplayRelationTasks = {
  data: Array<{
    type: 'tasks';
    id: string;
  }>;
};

export type TaskWrapperDisplayRelationTasksGetResponse = {
  data: Array<{
    type: 'tasks';
    id: string;
  }>;
};

export type DeleteTaskwrappersData = {
  body: TaskWrapperDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/taskwrappers';
};

export type DeleteTaskwrappersErrors = {
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

export type DeleteTaskwrappersError = DeleteTaskwrappersErrors[keyof DeleteTaskwrappersErrors];

export type DeleteTaskwrappersResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteTaskwrappersResponse = DeleteTaskwrappersResponses[keyof DeleteTaskwrappersResponses];

export type GetTaskwrappersData = {
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
     * Example: `{"primary":{"taskWrapperId": 123}}` -> `eyJwcmltYXJ5Ijp7InRhc2tXcmFwcGVySWQiOiAxMjN9fQ==`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"taskWrapperId": 123}}` -> `eyJwcmltYXJ5Ijp7InRhc2tXcmFwcGVySWQiOiAxMjN9fQ==`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[taskWrapperId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: accessGroup, hashlist, hashType, task, tasks
     */
    include?: Array<'accessGroup' | 'hashlist' | 'hashType' | 'task' | 'tasks'>;
  };
  url: '/api/v2/ui/taskwrappers';
};

export type GetTaskwrappersErrors = {
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

export type GetTaskwrappersError = GetTaskwrappersErrors[keyof GetTaskwrappersErrors];

export type GetTaskwrappersResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperListResponse;
};

export type GetTaskwrappersResponse = GetTaskwrappersResponses[keyof GetTaskwrappersResponses];

export type PatchTaskwrappersData = {
  body: TaskWrapperPatchMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/taskwrappers';
};

export type PatchTaskwrappersErrors = {
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

export type PatchTaskwrappersError = PatchTaskwrappersErrors[keyof PatchTaskwrappersErrors];

export type PatchTaskwrappersResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchTaskwrappersResponse = PatchTaskwrappersResponses[keyof PatchTaskwrappersResponses];

export type GetTaskwrappersCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[taskWrapperId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/taskwrappers/count';
};

export type GetTaskwrappersCountErrors = {
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

export type GetTaskwrappersCountError = GetTaskwrappersCountErrors[keyof GetTaskwrappersCountErrors];

export type GetTaskwrappersCountResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperCountResponse;
};

export type GetTaskwrappersCountResponse = GetTaskwrappersCountResponses[keyof GetTaskwrappersCountResponses];

export type GetTaskwrappersByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/taskwrappers/{id}/{relation}';
};

export type GetTaskwrappersByIdByRelationErrors = {
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

export type GetTaskwrappersByIdByRelationError =
  GetTaskwrappersByIdByRelationErrors[keyof GetTaskwrappersByIdByRelationErrors];

export type GetTaskwrappersByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperRelationTasksGetResponse;
};

export type GetTaskwrappersByIdByRelationResponse =
  GetTaskwrappersByIdByRelationResponses[keyof GetTaskwrappersByIdByRelationResponses];

export type DeleteTaskwrappersByIdRelationshipsByRelationData = {
  body: TaskWrapperRelationTasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/taskwrappers/{id}/relationships/{relation}';
};

export type DeleteTaskwrappersByIdRelationshipsByRelationErrors = {
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

export type DeleteTaskwrappersByIdRelationshipsByRelationError =
  DeleteTaskwrappersByIdRelationshipsByRelationErrors[keyof DeleteTaskwrappersByIdRelationshipsByRelationErrors];

export type DeleteTaskwrappersByIdRelationshipsByRelationResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteTaskwrappersByIdRelationshipsByRelationResponse =
  DeleteTaskwrappersByIdRelationshipsByRelationResponses[keyof DeleteTaskwrappersByIdRelationshipsByRelationResponses];

export type GetTaskwrappersByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/taskwrappers/{id}/relationships/{relation}';
};

export type GetTaskwrappersByIdRelationshipsByRelationErrors = {
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

export type GetTaskwrappersByIdRelationshipsByRelationError =
  GetTaskwrappersByIdRelationshipsByRelationErrors[keyof GetTaskwrappersByIdRelationshipsByRelationErrors];

export type GetTaskwrappersByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperResponse;
};

export type GetTaskwrappersByIdRelationshipsByRelationResponse =
  GetTaskwrappersByIdRelationshipsByRelationResponses[keyof GetTaskwrappersByIdRelationshipsByRelationResponses];

export type PatchTaskwrappersByIdRelationshipsByRelationData = {
  body: TaskWrapperRelationTasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/taskwrappers/{id}/relationships/{relation}';
};

export type PatchTaskwrappersByIdRelationshipsByRelationErrors = {
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

export type PatchTaskwrappersByIdRelationshipsByRelationError =
  PatchTaskwrappersByIdRelationshipsByRelationErrors[keyof PatchTaskwrappersByIdRelationshipsByRelationErrors];

export type PatchTaskwrappersByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchTaskwrappersByIdRelationshipsByRelationResponse =
  PatchTaskwrappersByIdRelationshipsByRelationResponses[keyof PatchTaskwrappersByIdRelationshipsByRelationResponses];

export type PostTaskwrappersByIdRelationshipsByRelationData = {
  body: TaskWrapperRelationTasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/taskwrappers/{id}/relationships/{relation}';
};

export type PostTaskwrappersByIdRelationshipsByRelationErrors = {
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

export type PostTaskwrappersByIdRelationshipsByRelationError =
  PostTaskwrappersByIdRelationshipsByRelationErrors[keyof PostTaskwrappersByIdRelationshipsByRelationErrors];

export type PostTaskwrappersByIdRelationshipsByRelationResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostTaskwrappersByIdRelationshipsByRelationResponse =
  PostTaskwrappersByIdRelationshipsByRelationResponses[keyof PostTaskwrappersByIdRelationshipsByRelationResponses];

export type DeleteTaskwrappersByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/taskwrappers/{id}';
};

export type DeleteTaskwrappersByIdErrors = {
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

export type DeleteTaskwrappersByIdError = DeleteTaskwrappersByIdErrors[keyof DeleteTaskwrappersByIdErrors];

export type DeleteTaskwrappersByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteTaskwrappersByIdResponse = DeleteTaskwrappersByIdResponses[keyof DeleteTaskwrappersByIdResponses];

export type GetTaskwrappersByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options: accessGroup, hashlist, hashType, task, tasks
     */
    include?: Array<'accessGroup' | 'hashlist' | 'hashType' | 'task' | 'tasks'>;
  };
  url: '/api/v2/ui/taskwrappers/{id}';
};

export type GetTaskwrappersByIdErrors = {
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

export type GetTaskwrappersByIdError = GetTaskwrappersByIdErrors[keyof GetTaskwrappersByIdErrors];

export type GetTaskwrappersByIdResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperResponse;
};

export type GetTaskwrappersByIdResponse = GetTaskwrappersByIdResponses[keyof GetTaskwrappersByIdResponses];

export type PatchTaskwrappersByIdData = {
  body: TaskWrapperPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/taskwrappers/{id}';
};

export type PatchTaskwrappersByIdErrors = {
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

export type PatchTaskwrappersByIdError = PatchTaskwrappersByIdErrors[keyof PatchTaskwrappersByIdErrors];

export type PatchTaskwrappersByIdResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperPostPatchResponse;
};

export type PatchTaskwrappersByIdResponse = PatchTaskwrappersByIdResponses[keyof PatchTaskwrappersByIdResponses];
