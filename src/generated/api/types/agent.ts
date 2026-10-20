import type { ErrorResponse } from './common';

export type AgentPatch = {
  data: {
    type: 'agent';
    attributes: {
      agentName?: string;
      cmdPars?: string;
      cpuOnly?: boolean;
      ignoreErrors?: 0 | 1 | 2;
      isActive?: boolean;
      isTrusted?: boolean;
      os?: 0 | 1 | 2;
      uid?: string;
      userId?: number | null;
    };
  };
};

export type AgentPatchMultiple = {
  data: Array<{
    id: number;
    type: 'agent';
    attributes: {
      agentName?: string;
      cmdPars?: string;
      cpuOnly?: boolean;
      ignoreErrors?: 0 | 1 | 2;
      isActive?: boolean;
      isTrusted?: boolean;
      os?: 0 | 1 | 2;
      uid?: string;
      userId?: number | null;
    };
  }>;
};

export type AgentDeleteMultiple = {
  data: Array<{
    id: number;
    type: 'agent';
  }>;
};

export type AgentResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
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
      crackingTime?: number;
    };
    links: {
      self: string;
    };
    relationships: {
      accessGroups: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'accessGroup';
          id: number;
        }>;
      };
      agentErrors: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentError';
          id: number;
        }>;
      };
      agentStats: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentStat';
          id: number;
        }>;
      };
      assignments: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentAssignment';
          id: number;
        }>;
      };
      chunks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'chunk';
          id: number;
        }>;
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
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: number;
        } | null;
      };
    };
  };
  included?: Array<
    | {
        id: number;
        type: 'user';
        attributes: {
          name: string;
          email?: string;
          isValid?: boolean;
          isComputedPassword?: boolean;
          lastLoginDate?: number;
          registeredSince?: number;
          sessionLifetime?: number;
          globalPermissionGroupId?: number;
        };
      }
    | {
        id: number;
        type: 'accessGroup';
        attributes: {
          groupName: string;
        };
      }
    | {
        id: number;
        type: 'agentStat';
        attributes: {
          agentId: number;
          statType: 1 | 2 | 3;
          time: number;
          value: Array<number>;
        };
      }
    | {
        id: number;
        type: 'agentError';
        attributes: {
          agentId: number;
          taskId: number;
          chunkId: number | null;
          time: number;
          error: string;
        };
      }
    | {
        id: number;
        type: 'chunk';
        attributes: {
          taskId: number;
          skip: number;
          length: number;
          agentId: number | null;
          dispatchTime: number;
          solveTime: number;
          checkpoint: number;
          progress: number;
          state: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
          cracked: number;
          speed: number;
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
    | {
        id: number;
        type: 'agentAssignment';
        attributes: {
          taskId: number;
          agentId: number;
          benchmark: string;
        };
      }
  >;
};

export type AgentPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
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
      crackingTime?: number;
    };
    links: {
      self: string;
    };
    relationships: {
      accessGroups: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'accessGroup';
          id: number;
        }>;
      };
      agentErrors: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentError';
          id: number;
        }>;
      };
      agentStats: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentStat';
          id: number;
        }>;
      };
      assignments: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentAssignment';
          id: number;
        }>;
      };
      chunks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'chunk';
          id: number;
        }>;
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
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: number;
        } | null;
      };
    };
  };
  included?: Array<
    | {
        id: number;
        type: 'user';
        attributes: {
          name: string;
          email?: string;
          isValid?: boolean;
          isComputedPassword?: boolean;
          lastLoginDate?: number;
          registeredSince?: number;
          sessionLifetime?: number;
          globalPermissionGroupId?: number;
        };
      }
    | {
        id: number;
        type: 'accessGroup';
        attributes: {
          groupName: string;
        };
      }
    | {
        id: number;
        type: 'agentStat';
        attributes: {
          agentId: number;
          statType: 1 | 2 | 3;
          time: number;
          value: Array<number>;
        };
      }
    | {
        id: number;
        type: 'agentError';
        attributes: {
          agentId: number;
          taskId: number;
          chunkId: number | null;
          time: number;
          error: string;
        };
      }
    | {
        id: number;
        type: 'chunk';
        attributes: {
          taskId: number;
          skip: number;
          length: number;
          agentId: number | null;
          dispatchTime: number;
          solveTime: number;
          checkpoint: number;
          progress: number;
          state: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
          cracked: number;
          speed: number;
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
    | {
        id: number;
        type: 'agentAssignment';
        attributes: {
          taskId: number;
          agentId: number;
          benchmark: string;
        };
      }
  >;
};

export type AgentListResponse = {
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
      crackingTime?: number;
    };
    links: {
      self: string;
    };
    relationships: {
      accessGroups: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'accessGroup';
          id: number;
        }>;
      };
      agentErrors: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentError';
          id: number;
        }>;
      };
      agentStats: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentStat';
          id: number;
        }>;
      };
      assignments: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentAssignment';
          id: number;
        }>;
      };
      chunks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'chunk';
          id: number;
        }>;
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
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: number;
        } | null;
      };
    };
  }>;
  included?: Array<
    | {
        id: number;
        type: 'user';
        attributes: {
          name: string;
          email?: string;
          isValid?: boolean;
          isComputedPassword?: boolean;
          lastLoginDate?: number;
          registeredSince?: number;
          sessionLifetime?: number;
          globalPermissionGroupId?: number;
        };
      }
    | {
        id: number;
        type: 'accessGroup';
        attributes: {
          groupName: string;
        };
      }
    | {
        id: number;
        type: 'agentStat';
        attributes: {
          agentId: number;
          statType: 1 | 2 | 3;
          time: number;
          value: Array<number>;
        };
      }
    | {
        id: number;
        type: 'agentError';
        attributes: {
          agentId: number;
          taskId: number;
          chunkId: number | null;
          time: number;
          error: string;
        };
      }
    | {
        id: number;
        type: 'chunk';
        attributes: {
          taskId: number;
          skip: number;
          length: number;
          agentId: number | null;
          dispatchTime: number;
          solveTime: number;
          checkpoint: number;
          progress: number;
          state: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
          cracked: number;
          speed: number;
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
    | {
        id: number;
        type: 'agentAssignment';
        attributes: {
          taskId: number;
          agentId: number;
          benchmark: string;
        };
      }
  >;
};

export type AgentCountResponse = {
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

export type AgentRelationUser = {
  data: {
    type: 'user';
    id: number;
  };
};

export type AgentRelationUserGetResponse = {
  data: {
    type: 'user';
    id: number;
  };
};

export type AgentRelationAccessGroups = {
  data: Array<{
    type: 'accessGroup';
    id: number;
  }>;
};

export type AgentRelationAccessGroupsGetResponse = {
  data: Array<{
    type: 'accessGroup';
    id: number;
  }>;
};

export type AgentRelationAgentStats = {
  data: Array<{
    type: 'agentStat';
    id: number;
  }>;
};

export type AgentRelationAgentStatsGetResponse = {
  data: Array<{
    type: 'agentStat';
    id: number;
  }>;
};

export type AgentRelationAgentErrors = {
  data: Array<{
    type: 'agentError';
    id: number;
  }>;
};

export type AgentRelationAgentErrorsGetResponse = {
  data: Array<{
    type: 'agentError';
    id: number;
  }>;
};

export type AgentRelationChunks = {
  data: Array<{
    type: 'chunk';
    id: number;
  }>;
};

export type AgentRelationChunksGetResponse = {
  data: Array<{
    type: 'chunk';
    id: number;
  }>;
};

export type AgentRelationTasks = {
  data: Array<{
    type: 'task';
    id: number;
  }>;
};

export type AgentRelationTasksGetResponse = {
  data: Array<{
    type: 'task';
    id: number;
  }>;
};

export type AgentRelationAssignments = {
  data: Array<{
    type: 'agentAssignment';
    id: number;
  }>;
};

export type AgentRelationAssignmentsGetResponse = {
  data: Array<{
    type: 'agentAssignment';
    id: number;
  }>;
};

export type DeleteAgentsData = {
  body: AgentDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/agents';
};

export type DeleteAgentsErrors = {
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

export type DeleteAgentsError = DeleteAgentsErrors[keyof DeleteAgentsErrors];

export type DeleteAgentsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentsResponse = DeleteAgentsResponses[keyof DeleteAgentsResponses];

export type GetAgentsData = {
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
     * Example: `{"primary":{"agentId": 123}}` -> `eyJwcmltYXJ5Ijp7ImFnZW50SWQiOiAxMjN9fQ==`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"agentId": 123}}` -> `eyJwcmltYXJ5Ijp7ImFnZW50SWQiOiAxMjN9fQ==`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[agentId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: user, accessGroups, agentStats, agentErrors, chunks, tasks, assignments
     */
    include?: Array<'user' | 'accessGroups' | 'agentStats' | 'agentErrors' | 'chunks' | 'tasks' | 'assignments'>;
    /**
     * Aggregated fields to include by type (comma separated values). Possible options: agent: crackingTime
     */
    aggregate?: {
      [key: string]: string;
    };
  };
  url: '/api/v2/ui/agents';
};

export type GetAgentsErrors = {
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

export type GetAgentsError = GetAgentsErrors[keyof GetAgentsErrors];

export type GetAgentsResponses = {
  /**
   * successful operation
   */
  200: AgentListResponse;
};

export type GetAgentsResponse = GetAgentsResponses[keyof GetAgentsResponses];

export type PatchAgentsData = {
  body: AgentPatchMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/agents';
};

export type PatchAgentsErrors = {
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

export type PatchAgentsError = PatchAgentsErrors[keyof PatchAgentsErrors];

export type PatchAgentsResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchAgentsResponse = PatchAgentsResponses[keyof PatchAgentsResponses];

export type GetAgentsCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[agentId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of accessible objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/agents/count';
};

export type GetAgentsCountErrors = {
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

export type GetAgentsCountError = GetAgentsCountErrors[keyof GetAgentsCountErrors];

export type GetAgentsCountResponses = {
  /**
   * successful operation
   */
  200: AgentCountResponse;
};

export type GetAgentsCountResponse = GetAgentsCountResponses[keyof GetAgentsCountResponses];

export type GetAgentsByIdUserData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/user';
};

export type GetAgentsByIdUserErrors = {
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

export type GetAgentsByIdUserError = GetAgentsByIdUserErrors[keyof GetAgentsByIdUserErrors];

export type GetAgentsByIdUserResponses = {
  /**
   * successful operation
   */
  200: AgentRelationUserGetResponse;
};

export type GetAgentsByIdUserResponse = GetAgentsByIdUserResponses[keyof GetAgentsByIdUserResponses];

export type GetAgentsByIdRelationshipsUserData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/user';
};

export type GetAgentsByIdRelationshipsUserErrors = {
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

export type GetAgentsByIdRelationshipsUserError =
  GetAgentsByIdRelationshipsUserErrors[keyof GetAgentsByIdRelationshipsUserErrors];

export type GetAgentsByIdRelationshipsUserResponses = {
  /**
   * successful operation
   */
  200: AgentResponse;
};

export type GetAgentsByIdRelationshipsUserResponse =
  GetAgentsByIdRelationshipsUserResponses[keyof GetAgentsByIdRelationshipsUserResponses];

export type PatchAgentsByIdRelationshipsUserData = {
  body: AgentRelationUser;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/user';
};

export type PatchAgentsByIdRelationshipsUserErrors = {
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

export type PatchAgentsByIdRelationshipsUserError =
  PatchAgentsByIdRelationshipsUserErrors[keyof PatchAgentsByIdRelationshipsUserErrors];

export type PatchAgentsByIdRelationshipsUserResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchAgentsByIdRelationshipsUserResponse =
  PatchAgentsByIdRelationshipsUserResponses[keyof PatchAgentsByIdRelationshipsUserResponses];

export type GetAgentsByIdAccessGroupsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/accessGroups';
};

export type GetAgentsByIdAccessGroupsErrors = {
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

export type GetAgentsByIdAccessGroupsError = GetAgentsByIdAccessGroupsErrors[keyof GetAgentsByIdAccessGroupsErrors];

export type GetAgentsByIdAccessGroupsResponses = {
  /**
   * successful operation
   */
  200: AgentRelationAccessGroupsGetResponse;
};

export type GetAgentsByIdAccessGroupsResponse =
  GetAgentsByIdAccessGroupsResponses[keyof GetAgentsByIdAccessGroupsResponses];

export type DeleteAgentsByIdRelationshipsAccessGroupsData = {
  body: AgentRelationAccessGroups;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/accessGroups';
};

export type DeleteAgentsByIdRelationshipsAccessGroupsErrors = {
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

export type DeleteAgentsByIdRelationshipsAccessGroupsError =
  DeleteAgentsByIdRelationshipsAccessGroupsErrors[keyof DeleteAgentsByIdRelationshipsAccessGroupsErrors];

export type DeleteAgentsByIdRelationshipsAccessGroupsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentsByIdRelationshipsAccessGroupsResponse =
  DeleteAgentsByIdRelationshipsAccessGroupsResponses[keyof DeleteAgentsByIdRelationshipsAccessGroupsResponses];

export type GetAgentsByIdRelationshipsAccessGroupsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/accessGroups';
};

export type GetAgentsByIdRelationshipsAccessGroupsErrors = {
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

export type GetAgentsByIdRelationshipsAccessGroupsError =
  GetAgentsByIdRelationshipsAccessGroupsErrors[keyof GetAgentsByIdRelationshipsAccessGroupsErrors];

export type GetAgentsByIdRelationshipsAccessGroupsResponses = {
  /**
   * successful operation
   */
  200: AgentResponse;
};

export type GetAgentsByIdRelationshipsAccessGroupsResponse =
  GetAgentsByIdRelationshipsAccessGroupsResponses[keyof GetAgentsByIdRelationshipsAccessGroupsResponses];

export type PatchAgentsByIdRelationshipsAccessGroupsData = {
  body: AgentRelationAccessGroups;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/accessGroups';
};

export type PatchAgentsByIdRelationshipsAccessGroupsErrors = {
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

export type PatchAgentsByIdRelationshipsAccessGroupsError =
  PatchAgentsByIdRelationshipsAccessGroupsErrors[keyof PatchAgentsByIdRelationshipsAccessGroupsErrors];

export type PatchAgentsByIdRelationshipsAccessGroupsResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchAgentsByIdRelationshipsAccessGroupsResponse =
  PatchAgentsByIdRelationshipsAccessGroupsResponses[keyof PatchAgentsByIdRelationshipsAccessGroupsResponses];

export type PostAgentsByIdRelationshipsAccessGroupsData = {
  body: AgentRelationAccessGroups;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/accessGroups';
};

export type PostAgentsByIdRelationshipsAccessGroupsErrors = {
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

export type PostAgentsByIdRelationshipsAccessGroupsError =
  PostAgentsByIdRelationshipsAccessGroupsErrors[keyof PostAgentsByIdRelationshipsAccessGroupsErrors];

export type PostAgentsByIdRelationshipsAccessGroupsResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostAgentsByIdRelationshipsAccessGroupsResponse =
  PostAgentsByIdRelationshipsAccessGroupsResponses[keyof PostAgentsByIdRelationshipsAccessGroupsResponses];

export type GetAgentsByIdAgentStatsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/agentStats';
};

export type GetAgentsByIdAgentStatsErrors = {
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

export type GetAgentsByIdAgentStatsError = GetAgentsByIdAgentStatsErrors[keyof GetAgentsByIdAgentStatsErrors];

export type GetAgentsByIdAgentStatsResponses = {
  /**
   * successful operation
   */
  200: AgentRelationAgentStatsGetResponse;
};

export type GetAgentsByIdAgentStatsResponse = GetAgentsByIdAgentStatsResponses[keyof GetAgentsByIdAgentStatsResponses];

export type DeleteAgentsByIdRelationshipsAgentStatsData = {
  body: AgentRelationAgentStats;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/agentStats';
};

export type DeleteAgentsByIdRelationshipsAgentStatsErrors = {
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

export type DeleteAgentsByIdRelationshipsAgentStatsError =
  DeleteAgentsByIdRelationshipsAgentStatsErrors[keyof DeleteAgentsByIdRelationshipsAgentStatsErrors];

export type DeleteAgentsByIdRelationshipsAgentStatsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentsByIdRelationshipsAgentStatsResponse =
  DeleteAgentsByIdRelationshipsAgentStatsResponses[keyof DeleteAgentsByIdRelationshipsAgentStatsResponses];

export type GetAgentsByIdRelationshipsAgentStatsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/agentStats';
};

export type GetAgentsByIdRelationshipsAgentStatsErrors = {
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

export type GetAgentsByIdRelationshipsAgentStatsError =
  GetAgentsByIdRelationshipsAgentStatsErrors[keyof GetAgentsByIdRelationshipsAgentStatsErrors];

export type GetAgentsByIdRelationshipsAgentStatsResponses = {
  /**
   * successful operation
   */
  200: AgentResponse;
};

export type GetAgentsByIdRelationshipsAgentStatsResponse =
  GetAgentsByIdRelationshipsAgentStatsResponses[keyof GetAgentsByIdRelationshipsAgentStatsResponses];

export type PatchAgentsByIdRelationshipsAgentStatsData = {
  body: AgentRelationAgentStats;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/agentStats';
};

export type PatchAgentsByIdRelationshipsAgentStatsErrors = {
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

export type PatchAgentsByIdRelationshipsAgentStatsError =
  PatchAgentsByIdRelationshipsAgentStatsErrors[keyof PatchAgentsByIdRelationshipsAgentStatsErrors];

export type PatchAgentsByIdRelationshipsAgentStatsResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchAgentsByIdRelationshipsAgentStatsResponse =
  PatchAgentsByIdRelationshipsAgentStatsResponses[keyof PatchAgentsByIdRelationshipsAgentStatsResponses];

export type PostAgentsByIdRelationshipsAgentStatsData = {
  body: AgentRelationAgentStats;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/agentStats';
};

export type PostAgentsByIdRelationshipsAgentStatsErrors = {
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

export type PostAgentsByIdRelationshipsAgentStatsError =
  PostAgentsByIdRelationshipsAgentStatsErrors[keyof PostAgentsByIdRelationshipsAgentStatsErrors];

export type PostAgentsByIdRelationshipsAgentStatsResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostAgentsByIdRelationshipsAgentStatsResponse =
  PostAgentsByIdRelationshipsAgentStatsResponses[keyof PostAgentsByIdRelationshipsAgentStatsResponses];

export type GetAgentsByIdAgentErrorsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/agentErrors';
};

export type GetAgentsByIdAgentErrorsErrors = {
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

export type GetAgentsByIdAgentErrorsError = GetAgentsByIdAgentErrorsErrors[keyof GetAgentsByIdAgentErrorsErrors];

export type GetAgentsByIdAgentErrorsResponses = {
  /**
   * successful operation
   */
  200: AgentRelationAgentErrorsGetResponse;
};

export type GetAgentsByIdAgentErrorsResponse =
  GetAgentsByIdAgentErrorsResponses[keyof GetAgentsByIdAgentErrorsResponses];

export type DeleteAgentsByIdRelationshipsAgentErrorsData = {
  body: AgentRelationAgentErrors;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/agentErrors';
};

export type DeleteAgentsByIdRelationshipsAgentErrorsErrors = {
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

export type DeleteAgentsByIdRelationshipsAgentErrorsError =
  DeleteAgentsByIdRelationshipsAgentErrorsErrors[keyof DeleteAgentsByIdRelationshipsAgentErrorsErrors];

export type DeleteAgentsByIdRelationshipsAgentErrorsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentsByIdRelationshipsAgentErrorsResponse =
  DeleteAgentsByIdRelationshipsAgentErrorsResponses[keyof DeleteAgentsByIdRelationshipsAgentErrorsResponses];

export type GetAgentsByIdRelationshipsAgentErrorsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/agentErrors';
};

export type GetAgentsByIdRelationshipsAgentErrorsErrors = {
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

export type GetAgentsByIdRelationshipsAgentErrorsError =
  GetAgentsByIdRelationshipsAgentErrorsErrors[keyof GetAgentsByIdRelationshipsAgentErrorsErrors];

export type GetAgentsByIdRelationshipsAgentErrorsResponses = {
  /**
   * successful operation
   */
  200: AgentResponse;
};

export type GetAgentsByIdRelationshipsAgentErrorsResponse =
  GetAgentsByIdRelationshipsAgentErrorsResponses[keyof GetAgentsByIdRelationshipsAgentErrorsResponses];

export type PatchAgentsByIdRelationshipsAgentErrorsData = {
  body: AgentRelationAgentErrors;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/agentErrors';
};

export type PatchAgentsByIdRelationshipsAgentErrorsErrors = {
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

export type PatchAgentsByIdRelationshipsAgentErrorsError =
  PatchAgentsByIdRelationshipsAgentErrorsErrors[keyof PatchAgentsByIdRelationshipsAgentErrorsErrors];

export type PatchAgentsByIdRelationshipsAgentErrorsResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchAgentsByIdRelationshipsAgentErrorsResponse =
  PatchAgentsByIdRelationshipsAgentErrorsResponses[keyof PatchAgentsByIdRelationshipsAgentErrorsResponses];

export type PostAgentsByIdRelationshipsAgentErrorsData = {
  body: AgentRelationAgentErrors;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/agentErrors';
};

export type PostAgentsByIdRelationshipsAgentErrorsErrors = {
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

export type PostAgentsByIdRelationshipsAgentErrorsError =
  PostAgentsByIdRelationshipsAgentErrorsErrors[keyof PostAgentsByIdRelationshipsAgentErrorsErrors];

export type PostAgentsByIdRelationshipsAgentErrorsResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostAgentsByIdRelationshipsAgentErrorsResponse =
  PostAgentsByIdRelationshipsAgentErrorsResponses[keyof PostAgentsByIdRelationshipsAgentErrorsResponses];

export type GetAgentsByIdChunksData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/chunks';
};

export type GetAgentsByIdChunksErrors = {
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

export type GetAgentsByIdChunksError = GetAgentsByIdChunksErrors[keyof GetAgentsByIdChunksErrors];

export type GetAgentsByIdChunksResponses = {
  /**
   * successful operation
   */
  200: AgentRelationChunksGetResponse;
};

export type GetAgentsByIdChunksResponse = GetAgentsByIdChunksResponses[keyof GetAgentsByIdChunksResponses];

export type DeleteAgentsByIdRelationshipsChunksData = {
  body: AgentRelationChunks;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/chunks';
};

export type DeleteAgentsByIdRelationshipsChunksErrors = {
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

export type DeleteAgentsByIdRelationshipsChunksError =
  DeleteAgentsByIdRelationshipsChunksErrors[keyof DeleteAgentsByIdRelationshipsChunksErrors];

export type DeleteAgentsByIdRelationshipsChunksResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentsByIdRelationshipsChunksResponse =
  DeleteAgentsByIdRelationshipsChunksResponses[keyof DeleteAgentsByIdRelationshipsChunksResponses];

export type GetAgentsByIdRelationshipsChunksData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/chunks';
};

export type GetAgentsByIdRelationshipsChunksErrors = {
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

export type GetAgentsByIdRelationshipsChunksError =
  GetAgentsByIdRelationshipsChunksErrors[keyof GetAgentsByIdRelationshipsChunksErrors];

export type GetAgentsByIdRelationshipsChunksResponses = {
  /**
   * successful operation
   */
  200: AgentResponse;
};

export type GetAgentsByIdRelationshipsChunksResponse =
  GetAgentsByIdRelationshipsChunksResponses[keyof GetAgentsByIdRelationshipsChunksResponses];

export type PatchAgentsByIdRelationshipsChunksData = {
  body: AgentRelationChunks;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/chunks';
};

export type PatchAgentsByIdRelationshipsChunksErrors = {
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

export type PatchAgentsByIdRelationshipsChunksError =
  PatchAgentsByIdRelationshipsChunksErrors[keyof PatchAgentsByIdRelationshipsChunksErrors];

export type PatchAgentsByIdRelationshipsChunksResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchAgentsByIdRelationshipsChunksResponse =
  PatchAgentsByIdRelationshipsChunksResponses[keyof PatchAgentsByIdRelationshipsChunksResponses];

export type PostAgentsByIdRelationshipsChunksData = {
  body: AgentRelationChunks;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/chunks';
};

export type PostAgentsByIdRelationshipsChunksErrors = {
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

export type PostAgentsByIdRelationshipsChunksError =
  PostAgentsByIdRelationshipsChunksErrors[keyof PostAgentsByIdRelationshipsChunksErrors];

export type PostAgentsByIdRelationshipsChunksResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostAgentsByIdRelationshipsChunksResponse =
  PostAgentsByIdRelationshipsChunksResponses[keyof PostAgentsByIdRelationshipsChunksResponses];

export type GetAgentsByIdTasksData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/tasks';
};

export type GetAgentsByIdTasksErrors = {
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

export type GetAgentsByIdTasksError = GetAgentsByIdTasksErrors[keyof GetAgentsByIdTasksErrors];

export type GetAgentsByIdTasksResponses = {
  /**
   * successful operation
   */
  200: AgentRelationTasksGetResponse;
};

export type GetAgentsByIdTasksResponse = GetAgentsByIdTasksResponses[keyof GetAgentsByIdTasksResponses];

export type DeleteAgentsByIdRelationshipsTasksData = {
  body: AgentRelationTasks;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/tasks';
};

export type DeleteAgentsByIdRelationshipsTasksErrors = {
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

export type DeleteAgentsByIdRelationshipsTasksError =
  DeleteAgentsByIdRelationshipsTasksErrors[keyof DeleteAgentsByIdRelationshipsTasksErrors];

export type DeleteAgentsByIdRelationshipsTasksResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentsByIdRelationshipsTasksResponse =
  DeleteAgentsByIdRelationshipsTasksResponses[keyof DeleteAgentsByIdRelationshipsTasksResponses];

export type GetAgentsByIdRelationshipsTasksData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/tasks';
};

export type GetAgentsByIdRelationshipsTasksErrors = {
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

export type GetAgentsByIdRelationshipsTasksError =
  GetAgentsByIdRelationshipsTasksErrors[keyof GetAgentsByIdRelationshipsTasksErrors];

export type GetAgentsByIdRelationshipsTasksResponses = {
  /**
   * successful operation
   */
  200: AgentResponse;
};

export type GetAgentsByIdRelationshipsTasksResponse =
  GetAgentsByIdRelationshipsTasksResponses[keyof GetAgentsByIdRelationshipsTasksResponses];

export type PatchAgentsByIdRelationshipsTasksData = {
  body: AgentRelationTasks;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/tasks';
};

export type PatchAgentsByIdRelationshipsTasksErrors = {
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

export type PatchAgentsByIdRelationshipsTasksError =
  PatchAgentsByIdRelationshipsTasksErrors[keyof PatchAgentsByIdRelationshipsTasksErrors];

export type PatchAgentsByIdRelationshipsTasksResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchAgentsByIdRelationshipsTasksResponse =
  PatchAgentsByIdRelationshipsTasksResponses[keyof PatchAgentsByIdRelationshipsTasksResponses];

export type PostAgentsByIdRelationshipsTasksData = {
  body: AgentRelationTasks;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/tasks';
};

export type PostAgentsByIdRelationshipsTasksErrors = {
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

export type PostAgentsByIdRelationshipsTasksError =
  PostAgentsByIdRelationshipsTasksErrors[keyof PostAgentsByIdRelationshipsTasksErrors];

export type PostAgentsByIdRelationshipsTasksResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostAgentsByIdRelationshipsTasksResponse =
  PostAgentsByIdRelationshipsTasksResponses[keyof PostAgentsByIdRelationshipsTasksResponses];

export type GetAgentsByIdAssignmentsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/assignments';
};

export type GetAgentsByIdAssignmentsErrors = {
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

export type GetAgentsByIdAssignmentsError = GetAgentsByIdAssignmentsErrors[keyof GetAgentsByIdAssignmentsErrors];

export type GetAgentsByIdAssignmentsResponses = {
  /**
   * successful operation
   */
  200: AgentRelationAssignmentsGetResponse;
};

export type GetAgentsByIdAssignmentsResponse =
  GetAgentsByIdAssignmentsResponses[keyof GetAgentsByIdAssignmentsResponses];

export type DeleteAgentsByIdRelationshipsAssignmentsData = {
  body: AgentRelationAssignments;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/assignments';
};

export type DeleteAgentsByIdRelationshipsAssignmentsErrors = {
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

export type DeleteAgentsByIdRelationshipsAssignmentsError =
  DeleteAgentsByIdRelationshipsAssignmentsErrors[keyof DeleteAgentsByIdRelationshipsAssignmentsErrors];

export type DeleteAgentsByIdRelationshipsAssignmentsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentsByIdRelationshipsAssignmentsResponse =
  DeleteAgentsByIdRelationshipsAssignmentsResponses[keyof DeleteAgentsByIdRelationshipsAssignmentsResponses];

export type GetAgentsByIdRelationshipsAssignmentsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/assignments';
};

export type GetAgentsByIdRelationshipsAssignmentsErrors = {
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

export type GetAgentsByIdRelationshipsAssignmentsError =
  GetAgentsByIdRelationshipsAssignmentsErrors[keyof GetAgentsByIdRelationshipsAssignmentsErrors];

export type GetAgentsByIdRelationshipsAssignmentsResponses = {
  /**
   * successful operation
   */
  200: AgentResponse;
};

export type GetAgentsByIdRelationshipsAssignmentsResponse =
  GetAgentsByIdRelationshipsAssignmentsResponses[keyof GetAgentsByIdRelationshipsAssignmentsResponses];

export type PatchAgentsByIdRelationshipsAssignmentsData = {
  body: AgentRelationAssignments;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/assignments';
};

export type PatchAgentsByIdRelationshipsAssignmentsErrors = {
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

export type PatchAgentsByIdRelationshipsAssignmentsError =
  PatchAgentsByIdRelationshipsAssignmentsErrors[keyof PatchAgentsByIdRelationshipsAssignmentsErrors];

export type PatchAgentsByIdRelationshipsAssignmentsResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchAgentsByIdRelationshipsAssignmentsResponse =
  PatchAgentsByIdRelationshipsAssignmentsResponses[keyof PatchAgentsByIdRelationshipsAssignmentsResponses];

export type PostAgentsByIdRelationshipsAssignmentsData = {
  body: AgentRelationAssignments;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/assignments';
};

export type PostAgentsByIdRelationshipsAssignmentsErrors = {
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

export type PostAgentsByIdRelationshipsAssignmentsError =
  PostAgentsByIdRelationshipsAssignmentsErrors[keyof PostAgentsByIdRelationshipsAssignmentsErrors];

export type PostAgentsByIdRelationshipsAssignmentsResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostAgentsByIdRelationshipsAssignmentsResponse =
  PostAgentsByIdRelationshipsAssignmentsResponses[keyof PostAgentsByIdRelationshipsAssignmentsResponses];

export type DeleteAgentsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}';
};

export type DeleteAgentsByIdErrors = {
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

export type DeleteAgentsByIdError = DeleteAgentsByIdErrors[keyof DeleteAgentsByIdErrors];

export type DeleteAgentsByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentsByIdResponse = DeleteAgentsByIdResponses[keyof DeleteAgentsByIdResponses];

export type GetAgentsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options: user, accessGroups, agentStats, agentErrors, chunks, tasks, assignments
     */
    include?: Array<'user' | 'accessGroups' | 'agentStats' | 'agentErrors' | 'chunks' | 'tasks' | 'assignments'>;
  };
  url: '/api/v2/ui/agents/{id}';
};

export type GetAgentsByIdErrors = {
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

export type GetAgentsByIdError = GetAgentsByIdErrors[keyof GetAgentsByIdErrors];

export type GetAgentsByIdResponses = {
  /**
   * successful operation
   */
  200: AgentResponse;
};

export type GetAgentsByIdResponse = GetAgentsByIdResponses[keyof GetAgentsByIdResponses];

export type PatchAgentsByIdData = {
  body: AgentPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}';
};

export type PatchAgentsByIdErrors = {
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

export type PatchAgentsByIdError = PatchAgentsByIdErrors[keyof PatchAgentsByIdErrors];

export type PatchAgentsByIdResponses = {
  /**
   * successful operation
   */
  200: AgentPostPatchResponse;
};

export type PatchAgentsByIdResponse = PatchAgentsByIdResponses[keyof PatchAgentsByIdResponses];
