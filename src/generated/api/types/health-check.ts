import type { ErrorResponse } from './common';

export type HealthCheckCreate = {
  data: {
    type: 'healthCheck';
    attributes: {
      checkType: 0 | 3200;
      hashtypeId: string;
      crackerBinaryId: string;
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

export type HealthCheckPatchMultiple = {
  data: Array<{
    id: string;
    type: 'healthCheck';
    attributes: {
      checkType?: 0 | 3200;
    };
  }>;
};

export type HealthCheckDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'healthCheck';
  }>;
};

export type HealthCheckResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
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
    links: {
      self: string;
    };
    relationships: {
      crackerBinary: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'crackerBinary';
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
      healthCheckAgents: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'healthCheckAgent';
          id: string;
        }>;
      };
    };
  };
  included?: Array<
    | {
        id: string;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: string;
          version: string;
          downloadUrl: string;
          binaryName: string;
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
      }
  >;
};

export type HealthCheckPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
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
    links: {
      self: string;
    };
    relationships: {
      crackerBinary: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'crackerBinary';
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
      healthCheckAgents: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'healthCheckAgent';
          id: string;
        }>;
      };
    };
  };
  included?: Array<
    | {
        id: string;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: string;
          version: string;
          downloadUrl: string;
          binaryName: string;
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
      }
  >;
};

export type HealthCheckListResponse = {
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
    links: {
      self: string;
    };
    relationships: {
      crackerBinary: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'crackerBinary';
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
      healthCheckAgents: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'healthCheckAgent';
          id: string;
        }>;
      };
    };
  }>;
  included?: Array<
    | {
        id: string;
        type: 'crackerBinary';
        attributes: {
          crackerBinaryTypeId: string;
          version: string;
          downloadUrl: string;
          binaryName: string;
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
      }
  >;
};

export type HealthCheckCountResponse = {
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

export type HealthCheckRelationHealthCheckAgents = {
  data: Array<{
    type: 'healthCheckAgents';
    id: string;
  }>;
};

export type HealthCheckRelationHealthCheckAgentsGetResponse = {
  data: Array<{
    type: 'healthCheckAgents';
    id: string;
  }>;
};

export type DeleteHealthchecksData = {
  body: HealthCheckDeleteMultiple;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type DeleteHealthchecksError = DeleteHealthchecksErrors[keyof DeleteHealthchecksErrors];

export type DeleteHealthchecksResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteHealthchecksResponse = DeleteHealthchecksResponses[keyof DeleteHealthchecksResponses];

export type GetHealthchecksData = {
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
     * Example: `{"primary":{"healthCheckId": 123}}` -> `eyJwcmltYXJ5Ijp7ImhlYWx0aENoZWNrSWQiOiAxMjN9fQ==`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"healthCheckId": 123}}` -> `eyJwcmltYXJ5Ijp7ImhlYWx0aENoZWNrSWQiOiAxMjN9fQ==`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[healthCheckId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: crackerBinary, hashType, healthCheckAgents
     */
    include?: Array<'crackerBinary' | 'hashType' | 'healthCheckAgents'>;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
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
  body: HealthCheckPatchMultiple;
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

export type PatchHealthchecksError = PatchHealthchecksErrors[keyof PatchHealthchecksErrors];

export type PatchHealthchecksResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchHealthchecksResponse = PatchHealthchecksResponses[keyof PatchHealthchecksResponses];

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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
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
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[healthCheckId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetHealthchecksCountError = GetHealthchecksCountErrors[keyof GetHealthchecksCountErrors];

export type GetHealthchecksCountResponses = {
  /**
   * successful operation
   */
  200: HealthCheckCountResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
  body: HealthCheckRelationHealthCheckAgents;
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
  body?: never;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
     * Relationships to include in the response, comma seperated. Possible options: crackerBinary, hashType, healthCheckAgents
     */
    include?: Array<'crackerBinary' | 'hashType' | 'healthCheckAgents'>;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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

export type PatchHealthchecksByIdError = PatchHealthchecksByIdErrors[keyof PatchHealthchecksByIdErrors];

export type PatchHealthchecksByIdResponses = {
  /**
   * successful operation
   */
  200: HealthCheckPostPatchResponse;
};

export type PatchHealthchecksByIdResponse = PatchHealthchecksByIdResponses[keyof PatchHealthchecksByIdResponses];
