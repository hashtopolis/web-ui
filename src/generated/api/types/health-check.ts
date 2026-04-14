import type { ErrorResponse, NotFoundResponse } from './common';

export type HealthCheckCreate = {
  data: {
    type: 'healthCheck';
    attributes: {
      checkType: 0 | 3200;
      hashtypeId: number;
      crackerBinaryId: number;
    };
  };
};

export type HealthCheckPatch = {
  data: {
    type: 'healthCheck';
    attributes: {
      checkType?: 0 | 3200;
    };
  };
};

export type HealthCheckResponse = {
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
  };
  relationships?: {
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
    healthCheckAgents: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'healthCheckAgent';
        id: number;
      }>;
    };
  };
  included?: Array<
    | {
        id: number;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: number;
          version: string;
          downloadUrl: string;
          binaryName: string;
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
      }
  >;
};

export type HealthCheckPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  data: {
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
  };
};

export type HealthCheckListResponse = {
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
  }>;
  relationships?: {
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
    healthCheckAgents: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'healthCheckAgent';
        id: number;
      }>;
    };
  };
  included?: Array<
    | {
        id: number;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: number;
          version: string;
          downloadUrl: string;
          binaryName: string;
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
      }
  >;
};

export type HealthCheckRelationHealthCheckAgents = {
  data: Array<{
    type: 'healthCheckAgents';
    id: number;
  }>;
};

export type HealthCheckRelationHealthCheckAgentsGetResponse = {
  data: Array<{
    type: 'healthCheckAgents';
    id: number;
  }>;
};

export type DeleteHealthchecksData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/healthchecks';
};

export type DeleteHealthchecksErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type DeleteHealthchecksError = DeleteHealthchecksErrors[keyof DeleteHealthchecksErrors];

export type DeleteHealthchecksResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetHealthchecksData = {
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
  url: '/api/v2/ui/healthchecks';
};

export type GetHealthchecksErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetHealthchecksError = GetHealthchecksErrors[keyof GetHealthchecksErrors];

export type GetHealthchecksResponses = {
  /**
   * successful operation
   */
  200: HealthCheckListResponse;
};

export type GetHealthchecksResponse = GetHealthchecksResponses[keyof GetHealthchecksResponses];

export type PatchHealthchecksData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/healthchecks';
};

export type PatchHealthchecksErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PatchHealthchecksError = PatchHealthchecksErrors[keyof PatchHealthchecksErrors];

export type PatchHealthchecksResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type PostHealthchecksData = {
  body: HealthCheckCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/healthchecks';
};

export type PostHealthchecksErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PostHealthchecksError = PostHealthchecksErrors[keyof PostHealthchecksErrors];

export type PostHealthchecksResponses = {
  /**
   * successful operation
   */
  201: HealthCheckPostPatchResponse;
};

export type PostHealthchecksResponse = PostHealthchecksResponses[keyof PostHealthchecksResponses];

export type GetHealthchecksCountData = {
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
  url: '/api/v2/ui/healthchecks/count';
};

export type GetHealthchecksCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetHealthchecksCountError = GetHealthchecksCountErrors[keyof GetHealthchecksCountErrors];

export type GetHealthchecksCountResponses = {
  /**
   * successful operation
   */
  200: HealthCheckListResponse;
};

export type GetHealthchecksCountResponse = GetHealthchecksCountResponses[keyof GetHealthchecksCountResponses];

export type GetHealthchecksByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/healthchecks/{id}/{relation}';
};

export type GetHealthchecksByIdByRelationErrors = {
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

export type GetHealthchecksByIdByRelationError =
  GetHealthchecksByIdByRelationErrors[keyof GetHealthchecksByIdByRelationErrors];

export type GetHealthchecksByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: HealthCheckRelationHealthCheckAgentsGetResponse;
};

export type GetHealthchecksByIdByRelationResponse =
  GetHealthchecksByIdByRelationResponses[keyof GetHealthchecksByIdByRelationResponses];

export type DeleteHealthchecksByIdRelationshipsByRelationData = {
  body: HealthCheckRelationHealthCheckAgents;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/healthchecks/{id}/relationships/{relation}';
};

export type DeleteHealthchecksByIdRelationshipsByRelationErrors = {
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

export type DeleteHealthchecksByIdRelationshipsByRelationError =
  DeleteHealthchecksByIdRelationshipsByRelationErrors[keyof DeleteHealthchecksByIdRelationshipsByRelationErrors];

export type DeleteHealthchecksByIdRelationshipsByRelationResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteHealthchecksByIdRelationshipsByRelationResponse =
  DeleteHealthchecksByIdRelationshipsByRelationResponses[keyof DeleteHealthchecksByIdRelationshipsByRelationResponses];

export type GetHealthchecksByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/healthchecks/{id}/relationships/{relation}';
};

export type GetHealthchecksByIdRelationshipsByRelationErrors = {
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

export type GetHealthchecksByIdRelationshipsByRelationError =
  GetHealthchecksByIdRelationshipsByRelationErrors[keyof GetHealthchecksByIdRelationshipsByRelationErrors];

export type GetHealthchecksByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: HealthCheckResponse;
};

export type GetHealthchecksByIdRelationshipsByRelationResponse =
  GetHealthchecksByIdRelationshipsByRelationResponses[keyof GetHealthchecksByIdRelationshipsByRelationResponses];

export type PatchHealthchecksByIdRelationshipsByRelationData = {
  body: HealthCheckRelationHealthCheckAgents;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/healthchecks/{id}/relationships/{relation}';
};

export type PatchHealthchecksByIdRelationshipsByRelationErrors = {
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

export type PatchHealthchecksByIdRelationshipsByRelationError =
  PatchHealthchecksByIdRelationshipsByRelationErrors[keyof PatchHealthchecksByIdRelationshipsByRelationErrors];

export type PatchHealthchecksByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchHealthchecksByIdRelationshipsByRelationResponse =
  PatchHealthchecksByIdRelationshipsByRelationResponses[keyof PatchHealthchecksByIdRelationshipsByRelationResponses];

export type PostHealthchecksByIdRelationshipsByRelationData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/healthchecks/{id}/relationships/{relation}';
};

export type PostHealthchecksByIdRelationshipsByRelationErrors = {
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

export type PostHealthchecksByIdRelationshipsByRelationError =
  PostHealthchecksByIdRelationshipsByRelationErrors[keyof PostHealthchecksByIdRelationshipsByRelationErrors];

export type PostHealthchecksByIdRelationshipsByRelationResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostHealthchecksByIdRelationshipsByRelationResponse =
  PostHealthchecksByIdRelationshipsByRelationResponses[keyof PostHealthchecksByIdRelationshipsByRelationResponses];

export type DeleteHealthchecksByIdData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/healthchecks/{id}';
};

export type DeleteHealthchecksByIdErrors = {
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

export type DeleteHealthchecksByIdError = DeleteHealthchecksByIdErrors[keyof DeleteHealthchecksByIdErrors];

export type DeleteHealthchecksByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteHealthchecksByIdResponse = DeleteHealthchecksByIdResponses[keyof DeleteHealthchecksByIdResponses];

export type GetHealthchecksByIdData = {
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
  url: '/api/v2/ui/healthchecks/{id}';
};

export type GetHealthchecksByIdErrors = {
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

export type GetHealthchecksByIdError = GetHealthchecksByIdErrors[keyof GetHealthchecksByIdErrors];

export type GetHealthchecksByIdResponses = {
  /**
   * successful operation
   */
  200: HealthCheckResponse;
};

export type GetHealthchecksByIdResponse = GetHealthchecksByIdResponses[keyof GetHealthchecksByIdResponses];

export type PatchHealthchecksByIdData = {
  body: HealthCheckPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/healthchecks/{id}';
};

export type PatchHealthchecksByIdErrors = {
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

export type PatchHealthchecksByIdError = PatchHealthchecksByIdErrors[keyof PatchHealthchecksByIdErrors];

export type PatchHealthchecksByIdResponses = {
  /**
   * successful operation
   */
  200: HealthCheckPostPatchResponse;
};

export type PatchHealthchecksByIdResponse = PatchHealthchecksByIdResponses[keyof PatchHealthchecksByIdResponses];
