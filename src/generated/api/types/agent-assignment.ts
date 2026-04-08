import type { ErrorResponse, NotFoundResponse } from './common';

export type AgentAssignmentCreate = {
  data: {
    type: 'agentAssignment';
    attributes: {
      taskId: number;
      agentId: number;
      benchmark: string;
    };
  };
};

export type AgentAssignmentPatch = {
  data: {
    type: 'agentAssignment';
    attributes: {
      benchmark?: string;
    };
  };
};

export type AgentAssignmentResponse = {
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
    type: 'agentAssignment';
    attributes: {
      taskId: number;
      agentId: number;
      benchmark: string;
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

export type AgentAssignmentPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  data: {
    id: number;
    type: 'agentAssignment';
    attributes: {
      taskId: number;
      agentId: number;
      benchmark: string;
    };
  };
};

export type AgentAssignmentListResponse = {
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
    type: 'agentAssignment';
    attributes: {
      taskId: number;
      agentId: number;
      benchmark: string;
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

export type AgentAssignmentRelationTask = {
  data: {
    type: 'task';
    id: number;
  };
};

export type AgentAssignmentRelationTaskGetResponse = {
  data: {
    type: 'task';
    id: number;
  };
};

export type DeleteAgentassignmentsData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/agentassignments';
};

export type DeleteAgentassignmentsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type DeleteAgentassignmentsError = DeleteAgentassignmentsErrors[keyof DeleteAgentassignmentsErrors];

export type DeleteAgentassignmentsResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetAgentassignmentsData = {
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
  url: '/api/v2/ui/agentassignments';
};

export type GetAgentassignmentsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetAgentassignmentsError = GetAgentassignmentsErrors[keyof GetAgentassignmentsErrors];

export type GetAgentassignmentsResponses = {
  /**
   * successful operation
   */
  200: AgentAssignmentListResponse;
};

export type GetAgentassignmentsResponse = GetAgentassignmentsResponses[keyof GetAgentassignmentsResponses];

export type PatchAgentassignmentsData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/agentassignments';
};

export type PatchAgentassignmentsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PatchAgentassignmentsError = PatchAgentassignmentsErrors[keyof PatchAgentassignmentsErrors];

export type PatchAgentassignmentsResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type PostAgentassignmentsData = {
  body: AgentAssignmentCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/agentassignments';
};

export type PostAgentassignmentsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PostAgentassignmentsError = PostAgentassignmentsErrors[keyof PostAgentassignmentsErrors];

export type PostAgentassignmentsResponses = {
  /**
   * successful operation
   */
  201: AgentAssignmentPostPatchResponse;
};

export type PostAgentassignmentsResponse = PostAgentassignmentsResponses[keyof PostAgentassignmentsResponses];

export type GetAgentassignmentsCountData = {
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
  url: '/api/v2/ui/agentassignments/count';
};

export type GetAgentassignmentsCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetAgentassignmentsCountError = GetAgentassignmentsCountErrors[keyof GetAgentassignmentsCountErrors];

export type GetAgentassignmentsCountResponses = {
  /**
   * successful operation
   */
  200: AgentAssignmentListResponse;
};

export type GetAgentassignmentsCountResponse =
  GetAgentassignmentsCountResponses[keyof GetAgentassignmentsCountResponses];

export type GetAgentassignmentsByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/agentassignments/{id}/{relation}';
};

export type GetAgentassignmentsByIdByRelationErrors = {
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

export type GetAgentassignmentsByIdByRelationError =
  GetAgentassignmentsByIdByRelationErrors[keyof GetAgentassignmentsByIdByRelationErrors];

export type GetAgentassignmentsByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: AgentAssignmentRelationTaskGetResponse;
};

export type GetAgentassignmentsByIdByRelationResponse =
  GetAgentassignmentsByIdByRelationResponses[keyof GetAgentassignmentsByIdByRelationResponses];

export type GetAgentassignmentsByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/agentassignments/{id}/relationships/{relation}';
};

export type GetAgentassignmentsByIdRelationshipsByRelationErrors = {
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

export type GetAgentassignmentsByIdRelationshipsByRelationError =
  GetAgentassignmentsByIdRelationshipsByRelationErrors[keyof GetAgentassignmentsByIdRelationshipsByRelationErrors];

export type GetAgentassignmentsByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: AgentAssignmentResponse;
};

export type GetAgentassignmentsByIdRelationshipsByRelationResponse =
  GetAgentassignmentsByIdRelationshipsByRelationResponses[keyof GetAgentassignmentsByIdRelationshipsByRelationResponses];

export type PatchAgentassignmentsByIdRelationshipsByRelationData = {
  body: AgentAssignmentRelationTask;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/agentassignments/{id}/relationships/{relation}';
};

export type PatchAgentassignmentsByIdRelationshipsByRelationErrors = {
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

export type PatchAgentassignmentsByIdRelationshipsByRelationError =
  PatchAgentassignmentsByIdRelationshipsByRelationErrors[keyof PatchAgentassignmentsByIdRelationshipsByRelationErrors];

export type PatchAgentassignmentsByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchAgentassignmentsByIdRelationshipsByRelationResponse =
  PatchAgentassignmentsByIdRelationshipsByRelationResponses[keyof PatchAgentassignmentsByIdRelationshipsByRelationResponses];

export type DeleteAgentassignmentsByIdData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agentassignments/{id}';
};

export type DeleteAgentassignmentsByIdErrors = {
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

export type DeleteAgentassignmentsByIdError = DeleteAgentassignmentsByIdErrors[keyof DeleteAgentassignmentsByIdErrors];

export type DeleteAgentassignmentsByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentassignmentsByIdResponse =
  DeleteAgentassignmentsByIdResponses[keyof DeleteAgentassignmentsByIdResponses];

export type GetAgentassignmentsByIdData = {
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
  url: '/api/v2/ui/agentassignments/{id}';
};

export type GetAgentassignmentsByIdErrors = {
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

export type GetAgentassignmentsByIdError = GetAgentassignmentsByIdErrors[keyof GetAgentassignmentsByIdErrors];

export type GetAgentassignmentsByIdResponses = {
  /**
   * successful operation
   */
  200: AgentAssignmentResponse;
};

export type GetAgentassignmentsByIdResponse = GetAgentassignmentsByIdResponses[keyof GetAgentassignmentsByIdResponses];

export type PatchAgentassignmentsByIdData = {
  body: AgentAssignmentPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agentassignments/{id}';
};

export type PatchAgentassignmentsByIdErrors = {
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

export type PatchAgentassignmentsByIdError = PatchAgentassignmentsByIdErrors[keyof PatchAgentassignmentsByIdErrors];

export type PatchAgentassignmentsByIdResponses = {
  /**
   * successful operation
   */
  200: AgentAssignmentPostPatchResponse;
};

export type PatchAgentassignmentsByIdResponse =
  PatchAgentassignmentsByIdResponses[keyof PatchAgentassignmentsByIdResponses];
