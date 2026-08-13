import type { ErrorResponse } from './common';

export type HealthCheckAgentResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'healthCheckAgent';
    attributes: {
      healthCheckId: string;
      agentId: string;
      status: -1 | 0 | 1;
      cracked: number;
      numGpus: number;
      start: number;
      end: number;
      errors: string;
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
      healthCheck: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'healthCheck';
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
        type: 'healthCheck';
        attributes: {
          time: number;
          status: -1 | 0 | 1;
          checkType: 0 | 3200;
          hashtypeId: string;
          crackerBinaryId: string;
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
    type: 'healthCheckAgent';
    attributes: {
      healthCheckId: string;
      agentId: string;
      status: -1 | 0 | 1;
      cracked: number;
      numGpus: number;
      start: number;
      end: number;
      errors: string;
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
      healthCheck: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'healthCheck';
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
        type: 'healthCheck';
        attributes: {
          time: number;
          status: -1 | 0 | 1;
          checkType: 0 | 3200;
          hashtypeId: string;
          crackerBinaryId: string;
          expectedCracks: number;
          attackCmd: string;
        };
      }
  >;
};

export type HealthCheckAgentCountResponse = {
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

export type HealthCheckAgentRelationHealthCheck = {
  data: {
    type: 'healthCheck';
    id: string;
  };
};

export type HealthCheckAgentRelationHealthCheckGetResponse = {
  data: {
    type: 'healthCheck';
    id: string;
  };
};

export type GetHealthcheckagentsData = {
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
     * Example: `{"primary":{"healthCheckAgentId": 123}}` -> `eyJwcmltYXJ5Ijp7ImhlYWx0aENoZWNrQWdlbnRJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"healthCheckAgentId": 123}}` -> `eyJwcmltYXJ5Ijp7ImhlYWx0aENoZWNrQWdlbnRJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[healthCheckAgentId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: agent, healthCheck
     */
    include?: Array<'agent' | 'healthCheck'>;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
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
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[healthCheckAgentId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetHealthcheckagentsCountError = GetHealthcheckagentsCountErrors[keyof GetHealthcheckagentsCountErrors];

export type GetHealthcheckagentsCountResponses = {
  /**
   * successful operation
   */
  200: HealthCheckAgentCountResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
     * Relationships to include in the response, comma seperated. Possible options: agent, healthCheck
     */
    include?: Array<'agent' | 'healthCheck'>;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
