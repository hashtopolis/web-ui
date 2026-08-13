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
      userId?: string | null;
    };
  };
};

export type AgentPatchMultiple = {
  data: Array<{
    id: string;
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
      userId?: string | null;
    };
  }>;
};

export type AgentDeleteMultiple = {
  data: Array<{
    id: string;
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
          id: string;
        }>;
      };
      agentErrors: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentError';
          id: string;
        }>;
      };
      agentStats: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentStat';
          id: string;
        }>;
      };
      assignments: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentAssignment';
          id: string;
        }>;
      };
      chunks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'chunk';
          id: string;
        }>;
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
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: string;
        } | null;
      };
    };
  };
  included?: Array<
    | {
        id: string;
        type: 'user';
        attributes: {
          name: string;
          email: string;
          isValid: boolean;
          isComputedPassword: boolean;
          lastLoginDate: number;
          registeredSince: number;
          sessionLifetime: number;
          globalPermissionGroupId: string;
          yubikey: string;
          otp1: string;
          otp2: string;
          otp3: string;
          otp4: string;
        };
      }
    | {
        id: string;
        type: 'accessGroup';
        attributes: {
          groupName: string;
        };
      }
    | {
        id: string;
        type: 'agentStat';
        attributes: {
          agentId: string;
          statType: 1 | 2 | 3;
          time: number;
          value: Array<number>;
        };
      }
    | {
        id: string;
        type: 'agentError';
        attributes: {
          agentId: string;
          taskId: string;
          chunkId: string | null;
          time: number;
          error: string;
        };
      }
    | {
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
    | {
        id: string;
        type: 'agentAssignment';
        attributes: {
          taskId: string;
          agentId: string;
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
          id: string;
        }>;
      };
      agentErrors: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentError';
          id: string;
        }>;
      };
      agentStats: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentStat';
          id: string;
        }>;
      };
      assignments: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentAssignment';
          id: string;
        }>;
      };
      chunks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'chunk';
          id: string;
        }>;
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
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: string;
        } | null;
      };
    };
  };
  included?: Array<
    | {
        id: string;
        type: 'user';
        attributes: {
          name: string;
          email: string;
          isValid: boolean;
          isComputedPassword: boolean;
          lastLoginDate: number;
          registeredSince: number;
          sessionLifetime: number;
          globalPermissionGroupId: string;
          yubikey: string;
          otp1: string;
          otp2: string;
          otp3: string;
          otp4: string;
        };
      }
    | {
        id: string;
        type: 'accessGroup';
        attributes: {
          groupName: string;
        };
      }
    | {
        id: string;
        type: 'agentStat';
        attributes: {
          agentId: string;
          statType: 1 | 2 | 3;
          time: number;
          value: Array<number>;
        };
      }
    | {
        id: string;
        type: 'agentError';
        attributes: {
          agentId: string;
          taskId: string;
          chunkId: string | null;
          time: number;
          error: string;
        };
      }
    | {
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
    | {
        id: string;
        type: 'agentAssignment';
        attributes: {
          taskId: string;
          agentId: string;
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
          id: string;
        }>;
      };
      agentErrors: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentError';
          id: string;
        }>;
      };
      agentStats: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentStat';
          id: string;
        }>;
      };
      assignments: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agentAssignment';
          id: string;
        }>;
      };
      chunks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'chunk';
          id: string;
        }>;
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
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: string;
        } | null;
      };
    };
  }>;
  included?: Array<
    | {
        id: string;
        type: 'user';
        attributes: {
          name: string;
          email: string;
          isValid: boolean;
          isComputedPassword: boolean;
          lastLoginDate: number;
          registeredSince: number;
          sessionLifetime: number;
          globalPermissionGroupId: string;
          yubikey: string;
          otp1: string;
          otp2: string;
          otp3: string;
          otp4: string;
        };
      }
    | {
        id: string;
        type: 'accessGroup';
        attributes: {
          groupName: string;
        };
      }
    | {
        id: string;
        type: 'agentStat';
        attributes: {
          agentId: string;
          statType: 1 | 2 | 3;
          time: number;
          value: Array<number>;
        };
      }
    | {
        id: string;
        type: 'agentError';
        attributes: {
          agentId: string;
          taskId: string;
          chunkId: string | null;
          time: number;
          error: string;
        };
      }
    | {
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
    | {
        id: string;
        type: 'agentAssignment';
        attributes: {
          taskId: string;
          agentId: string;
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

export type AgentRelationAssignments = {
  data: Array<{
    type: 'assignments';
    id: string;
  }>;
};

export type AgentRelationAssignmentsGetResponse = {
  data: Array<{
    type: 'assignments';
    id: string;
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
     * Also report the number of objects without any filter applied, as `meta.total_count`
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

export type GetAgentsByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/{relation}';
};

export type GetAgentsByIdByRelationErrors = {
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

export type GetAgentsByIdByRelationError = GetAgentsByIdByRelationErrors[keyof GetAgentsByIdByRelationErrors];

export type GetAgentsByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: AgentRelationAssignmentsGetResponse;
};

export type GetAgentsByIdByRelationResponse = GetAgentsByIdByRelationResponses[keyof GetAgentsByIdByRelationResponses];

export type DeleteAgentsByIdRelationshipsByRelationData = {
  body: AgentRelationAssignments;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/{relation}';
};

export type DeleteAgentsByIdRelationshipsByRelationErrors = {
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

export type DeleteAgentsByIdRelationshipsByRelationError =
  DeleteAgentsByIdRelationshipsByRelationErrors[keyof DeleteAgentsByIdRelationshipsByRelationErrors];

export type DeleteAgentsByIdRelationshipsByRelationResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentsByIdRelationshipsByRelationResponse =
  DeleteAgentsByIdRelationshipsByRelationResponses[keyof DeleteAgentsByIdRelationshipsByRelationResponses];

export type GetAgentsByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/{relation}';
};

export type GetAgentsByIdRelationshipsByRelationErrors = {
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

export type GetAgentsByIdRelationshipsByRelationError =
  GetAgentsByIdRelationshipsByRelationErrors[keyof GetAgentsByIdRelationshipsByRelationErrors];

export type GetAgentsByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: AgentResponse;
};

export type GetAgentsByIdRelationshipsByRelationResponse =
  GetAgentsByIdRelationshipsByRelationResponses[keyof GetAgentsByIdRelationshipsByRelationResponses];

export type PatchAgentsByIdRelationshipsByRelationData = {
  body: AgentRelationAssignments;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/{relation}';
};

export type PatchAgentsByIdRelationshipsByRelationErrors = {
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

export type PatchAgentsByIdRelationshipsByRelationError =
  PatchAgentsByIdRelationshipsByRelationErrors[keyof PatchAgentsByIdRelationshipsByRelationErrors];

export type PatchAgentsByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchAgentsByIdRelationshipsByRelationResponse =
  PatchAgentsByIdRelationshipsByRelationResponses[keyof PatchAgentsByIdRelationshipsByRelationResponses];

export type PostAgentsByIdRelationshipsByRelationData = {
  body: AgentRelationAssignments;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/agents/{id}/relationships/{relation}';
};

export type PostAgentsByIdRelationshipsByRelationErrors = {
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

export type PostAgentsByIdRelationshipsByRelationError =
  PostAgentsByIdRelationshipsByRelationErrors[keyof PostAgentsByIdRelationshipsByRelationErrors];

export type PostAgentsByIdRelationshipsByRelationResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostAgentsByIdRelationshipsByRelationResponse =
  PostAgentsByIdRelationshipsByRelationResponses[keyof PostAgentsByIdRelationshipsByRelationResponses];

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
