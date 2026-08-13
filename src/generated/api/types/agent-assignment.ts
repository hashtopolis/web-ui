import type { ErrorResponse } from './common';

export type AgentAssignmentCreate = {
  data: {
    type: 'agentAssignment';
    attributes: {
      taskId: string;
      agentId: string;
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

export type AgentAssignmentPatchMultiple = {
  data: Array<{
    id: string;
    type: 'agentAssignment';
    attributes: {
      benchmark?: string;
    };
  }>;
};

export type AgentAssignmentDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'agentAssignment';
  }>;
};

export type AgentAssignmentResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'agentAssignment';
    attributes: {
      taskId: string;
      agentId: string;
      benchmark: string;
    };
    links: {
      self: string;
    };
    relationships: {
      agent: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'agent';
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
    };
  };
  included?: Array<
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

export type AgentAssignmentPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'agentAssignment';
    attributes: {
      taskId: string;
      agentId: string;
      benchmark: string;
    };
    links: {
      self: string;
    };
    relationships: {
      agent: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'agent';
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
    };
  };
  included?: Array<
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

export type AgentAssignmentListResponse = {
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
    type: 'agentAssignment';
    attributes: {
      taskId: string;
      agentId: string;
      benchmark: string;
    };
    links: {
      self: string;
    };
    relationships: {
      agent: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'agent';
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
    };
  }>;
  included?: Array<
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

export type AgentAssignmentCountResponse = {
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

export type AgentAssignmentRelationTask = {
  data: {
    type: 'task';
    id: string;
  };
};

export type AgentAssignmentRelationTaskGetResponse = {
  data: {
    type: 'task';
    id: string;
  };
};

export type DeleteAgentassignmentsData = {
  body: AgentAssignmentDeleteMultiple;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type DeleteAgentassignmentsError = DeleteAgentassignmentsErrors[keyof DeleteAgentassignmentsErrors];

export type DeleteAgentassignmentsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentassignmentsResponse = DeleteAgentassignmentsResponses[keyof DeleteAgentassignmentsResponses];

export type GetAgentassignmentsData = {
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
     * Example: `{"primary":{"assignmentId": 123}}` -> `eyJwcmltYXJ5Ijp7ImFzc2lnbm1lbnRJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"assignmentId": 123}}` -> `eyJwcmltYXJ5Ijp7ImFzc2lnbm1lbnRJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[assignmentId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: agent, task
     */
    include?: Array<'agent' | 'task'>;
    /**
     * Aggregated fields to include by type (comma separated values). Possible options: assignment: crackingTime, cracked, currentSpeed, currentChunkId, searched
     */
    aggregate?: {
      [key: string]: string;
    };
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
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
  body: AgentAssignmentPatchMultiple;
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

export type PatchAgentassignmentsError = PatchAgentassignmentsErrors[keyof PatchAgentassignmentsErrors];

export type PatchAgentassignmentsResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchAgentassignmentsResponse = PatchAgentassignmentsResponses[keyof PatchAgentassignmentsResponses];

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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
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
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[assignmentId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetAgentassignmentsCountError = GetAgentassignmentsCountErrors[keyof GetAgentassignmentsCountErrors];

export type GetAgentassignmentsCountResponses = {
  /**
   * successful operation
   */
  200: AgentAssignmentCountResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
  body?: never;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
     * Relationships to include in the response, comma seperated. Possible options: agent, task
     */
    include?: Array<'agent' | 'task'>;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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

export type PatchAgentassignmentsByIdError = PatchAgentassignmentsByIdErrors[keyof PatchAgentassignmentsByIdErrors];

export type PatchAgentassignmentsByIdResponses = {
  /**
   * successful operation
   */
  200: AgentAssignmentPostPatchResponse;
};

export type PatchAgentassignmentsByIdResponse =
  PatchAgentassignmentsByIdResponses[keyof PatchAgentassignmentsByIdResponses];
