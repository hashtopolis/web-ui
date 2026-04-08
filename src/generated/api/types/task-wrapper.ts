import type { ErrorResponse, NotFoundResponse } from './common';

export type TaskWrapperPatch = {
  data: {
    type: 'taskWrapper';
    attributes: {
      accessGroupId?: number;
      isArchived?: boolean;
      maxAgents?: number;
      priority?: number;
      taskWrapperName?: string;
    };
  };
};

export type TaskWrapperResponse = {
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
    type: 'taskWrapper';
    attributes: {
      priority: number;
      maxAgents: number;
      taskType: 0 | 1;
      hashlistId: number;
      accessGroupId: number;
      taskWrapperName: string;
      isArchived: boolean;
      cracked: number;
    };
  };
  relationships?: {
    accessGroup: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'accessGroup';
        id: number;
      } | null;
    };
    hashType: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'hashType';
        id: number;
      } | null;
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
    tasks: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'task';
        id: number;
      }>;
    };
  };
  included?: Array<
    | {
        id: number;
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hashType';
        attributes: {
          description: string;
          isSalted: boolean;
          isSlowHash: boolean;
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

export type TaskWrapperSingleResponse = {
  data: {
    id: number;
    type: 'taskWrapper';
    attributes: {
      priority: number;
      maxAgents: number;
      taskType: 0 | 1;
      hashlistId: number;
      accessGroupId: number;
      taskWrapperName: string;
      isArchived: boolean;
      cracked: number;
    };
  };
  relationships?: {
    accessGroup: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'accessGroup';
        id: number;
      } | null;
    };
    hashType: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'hashType';
        id: number;
      } | null;
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
    tasks: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'task';
        id: number;
      }>;
    };
  };
  included?: Array<
    | {
        id: number;
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hashType';
        attributes: {
          description: string;
          isSalted: boolean;
          isSlowHash: boolean;
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

export type TaskWrapperPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  data: {
    id: number;
    type: 'taskWrapper';
    attributes: {
      priority: number;
      maxAgents: number;
      taskType: 0 | 1;
      hashlistId: number;
      accessGroupId: number;
      taskWrapperName: string;
      isArchived: boolean;
      cracked: number;
    };
  };
};

export type TaskWrapperListResponse = {
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
    type: 'taskWrapper';
    attributes: {
      priority: number;
      maxAgents: number;
      taskType: 0 | 1;
      hashlistId: number;
      accessGroupId: number;
      taskWrapperName: string;
      isArchived: boolean;
      cracked: number;
    };
  }>;
  relationships?: {
    accessGroup: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'accessGroup';
        id: number;
      } | null;
    };
    hashType: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'hashType';
        id: number;
      } | null;
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
    tasks: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'task';
        id: number;
      }>;
    };
  };
  included?: Array<
    | {
        id: number;
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hashType';
        attributes: {
          description: string;
          isSalted: boolean;
          isSlowHash: boolean;
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

export type TaskWrapperRelationTasks = {
  data: Array<{
    type: 'tasks';
    id: number;
  }>;
};

export type TaskWrapperRelationTasksGetResponse = {
  data: Array<{
    type: 'tasks';
    id: number;
  }>;
};

export type DeleteTaskwrappersData = {
  body?: never;
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
};

export type DeleteTaskwrappersError = DeleteTaskwrappersErrors[keyof DeleteTaskwrappersErrors];

export type DeleteTaskwrappersResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetTaskwrappersData = {
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
  body?: never;
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
};

export type PatchTaskwrappersError = PatchTaskwrappersErrors[keyof PatchTaskwrappersErrors];

export type PatchTaskwrappersResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetTaskwrappersCountData = {
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
};

export type GetTaskwrappersCountError = GetTaskwrappersCountErrors[keyof GetTaskwrappersCountErrors];

export type GetTaskwrappersCountResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperListResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
  body: {
    [key: string]: unknown;
  };
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
   * Not Found
   */
  404: NotFoundResponse;
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
  body: {
    [key: string]: unknown;
  };
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
   * Not Found
   */
  404: NotFoundResponse;
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
     * Items to include. Comma seperated
     */
    include?: string;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
};

export type PatchTaskwrappersByIdError = PatchTaskwrappersByIdErrors[keyof PatchTaskwrappersByIdErrors];

export type PatchTaskwrappersByIdResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperPostPatchResponse;
};

export type PatchTaskwrappersByIdResponse = PatchTaskwrappersByIdResponses[keyof PatchTaskwrappersByIdResponses];
