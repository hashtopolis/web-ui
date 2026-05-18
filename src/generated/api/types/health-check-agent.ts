import type { ErrorResponse, NotFoundResponse } from './common';

export type HealthCheckAgentResponse = {
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
    type: 'healthCheckAgent';
    attributes: {
      healthCheckId: number;
      agentId: number;
      status: -1 | 0 | 1;
      cracked: number;
      numGpus: number;
      start: number;
      end: number;
      errors: string;
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
    healthCheck: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'healthCheck';
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
        type: 'healthCheck';
        attributes: {
          time: number;
          status: -1 | 0 | 1;
          checkType: 0 | 3200;
          hashtypeId: number;
          crackerBinaryId: number;
          expectedCracks: number;
          attackCmd: string;
        };
      }
  >;
};

export type HealthCheckAgentListResponse = {
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
    type: 'healthCheckAgent';
    attributes: {
      healthCheckId: number;
      agentId: number;
      status: -1 | 0 | 1;
      cracked: number;
      numGpus: number;
      start: number;
      end: number;
      errors: string;
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
    healthCheck: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'healthCheck';
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
        type: 'healthCheck';
        attributes: {
          time: number;
          status: -1 | 0 | 1;
          checkType: 0 | 3200;
          hashtypeId: number;
          crackerBinaryId: number;
          expectedCracks: number;
          attackCmd: string;
        };
      }
  >;
};

export type HealthCheckAgentRelationHealthCheck = {
  data: {
    type: 'healthCheck';
    id: number;
  };
};

export type HealthCheckAgentRelationHealthCheckGetResponse = {
  data: {
    type: 'healthCheck';
    id: number;
  };
};

export type GetHealthcheckagentsData = {
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
  url: '/api/v2/ui/healthcheckagents';
};

export type GetHealthcheckagentsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetHealthcheckagentsError = GetHealthcheckagentsErrors[keyof GetHealthcheckagentsErrors];

export type GetHealthcheckagentsResponses = {
  /**
   * successful operation
   */
  200: HealthCheckAgentListResponse;
};

export type GetHealthcheckagentsResponse = GetHealthcheckagentsResponses[keyof GetHealthcheckagentsResponses];

export type GetHealthcheckagentsCountData = {
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
  url: '/api/v2/ui/healthcheckagents/count';
};

export type GetHealthcheckagentsCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetHealthcheckagentsCountError = GetHealthcheckagentsCountErrors[keyof GetHealthcheckagentsCountErrors];

export type GetHealthcheckagentsCountResponses = {
  /**
   * successful operation
   */
  200: HealthCheckAgentListResponse;
};

export type GetHealthcheckagentsCountResponse =
  GetHealthcheckagentsCountResponses[keyof GetHealthcheckagentsCountResponses];

export type GetHealthcheckagentsByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/healthcheckagents/{id}/{relation}';
};

export type GetHealthcheckagentsByIdByRelationErrors = {
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

export type GetHealthcheckagentsByIdByRelationError =
  GetHealthcheckagentsByIdByRelationErrors[keyof GetHealthcheckagentsByIdByRelationErrors];

export type GetHealthcheckagentsByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: HealthCheckAgentRelationHealthCheckGetResponse;
};

export type GetHealthcheckagentsByIdByRelationResponse =
  GetHealthcheckagentsByIdByRelationResponses[keyof GetHealthcheckagentsByIdByRelationResponses];

export type GetHealthcheckagentsByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/healthcheckagents/{id}/relationships/{relation}';
};

export type GetHealthcheckagentsByIdRelationshipsByRelationErrors = {
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

export type GetHealthcheckagentsByIdRelationshipsByRelationError =
  GetHealthcheckagentsByIdRelationshipsByRelationErrors[keyof GetHealthcheckagentsByIdRelationshipsByRelationErrors];

export type GetHealthcheckagentsByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: HealthCheckAgentResponse;
};

export type GetHealthcheckagentsByIdRelationshipsByRelationResponse =
  GetHealthcheckagentsByIdRelationshipsByRelationResponses[keyof GetHealthcheckagentsByIdRelationshipsByRelationResponses];

export type PatchHealthcheckagentsByIdRelationshipsByRelationData = {
  body: HealthCheckAgentRelationHealthCheck;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/healthcheckagents/{id}/relationships/{relation}';
};

export type PatchHealthcheckagentsByIdRelationshipsByRelationErrors = {
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

export type PatchHealthcheckagentsByIdRelationshipsByRelationError =
  PatchHealthcheckagentsByIdRelationshipsByRelationErrors[keyof PatchHealthcheckagentsByIdRelationshipsByRelationErrors];

export type PatchHealthcheckagentsByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchHealthcheckagentsByIdRelationshipsByRelationResponse =
  PatchHealthcheckagentsByIdRelationshipsByRelationResponses[keyof PatchHealthcheckagentsByIdRelationshipsByRelationResponses];

export type GetHealthcheckagentsByIdData = {
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
  url: '/api/v2/ui/healthcheckagents/{id}';
};

export type GetHealthcheckagentsByIdErrors = {
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

export type GetHealthcheckagentsByIdError = GetHealthcheckagentsByIdErrors[keyof GetHealthcheckagentsByIdErrors];

export type GetHealthcheckagentsByIdResponses = {
  /**
   * successful operation
   */
  200: HealthCheckAgentResponse;
};

export type GetHealthcheckagentsByIdResponse =
  GetHealthcheckagentsByIdResponses[keyof GetHealthcheckagentsByIdResponses];
