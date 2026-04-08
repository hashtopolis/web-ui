import type { ErrorResponse, NotFoundResponse } from './common';

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

export type AgentResponse = {
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
  };
  relationships?: {
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
  included?: Array<
    | {
        id: number;
        type: 'user';
        attributes: {
          name: string;
          email: string;
          isValid: boolean;
          isComputedPassword: boolean;
          lastLoginDate: number;
          registeredSince: number;
          sessionLifetime: number;
          globalPermissionGroupId: number;
          yubikey: string;
          otp1: string;
          otp2: string;
          otp3: string;
          otp4: string;
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
          chunkId: number;
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
          agentId: number;
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
    };
  };
};

export type AgentListResponse = {
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
  }>;
  relationships?: {
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
  included?: Array<
    | {
        id: number;
        type: 'user';
        attributes: {
          name: string;
          email: string;
          isValid: boolean;
          isComputedPassword: boolean;
          lastLoginDate: number;
          registeredSince: number;
          sessionLifetime: number;
          globalPermissionGroupId: number;
          yubikey: string;
          otp1: string;
          otp2: string;
          otp3: string;
          otp4: string;
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
          chunkId: number;
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
          agentId: number;
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

export type AgentRelationAssignments = {
  data: Array<{
    type: 'assignments';
    id: number;
  }>;
};

export type AgentRelationAssignmentsGetResponse = {
  data: Array<{
    type: 'assignments';
    id: number;
  }>;
};

export type DeleteAgentsData = {
  body?: never;
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
};

export type DeleteAgentsError = DeleteAgentsErrors[keyof DeleteAgentsErrors];

export type DeleteAgentsResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetAgentsData = {
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
  body?: never;
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
};

export type PatchAgentsError = PatchAgentsErrors[keyof PatchAgentsErrors];

export type PatchAgentsResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetAgentsCountData = {
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
};

export type GetAgentsCountError = GetAgentsCountErrors[keyof GetAgentsCountErrors];

export type GetAgentsCountResponses = {
  /**
   * successful operation
   */
  200: AgentListResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
  body: {
    [key: string]: unknown;
  };
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
   * Not Found
   */
  404: NotFoundResponse;
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
  body: {
    [key: string]: unknown;
  };
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
   * Not Found
   */
  404: NotFoundResponse;
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
     * Items to include. Comma seperated
     */
    include?: string;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
};

export type PatchAgentsByIdError = PatchAgentsByIdErrors[keyof PatchAgentsByIdErrors];

export type PatchAgentsByIdResponses = {
  /**
   * successful operation
   */
  200: AgentPostPatchResponse;
};

export type PatchAgentsByIdResponse = PatchAgentsByIdResponses[keyof PatchAgentsByIdResponses];
