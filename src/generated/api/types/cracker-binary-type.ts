import type { ErrorResponse } from './common';

export type CrackerBinaryTypeCreate = {
  data: {
    type: 'crackerBinaryType';
    attributes: {
      typeName: string;
    };
  };
};

export type CrackerBinaryTypePatch = {
  data: {
    type: 'crackerBinaryType';
    attributes: {
      isChunkingAvailable?: boolean | null;
      typeName?: string;
    };
  };
};

export type CrackerBinaryTypePatchMultiple = {
  data: Array<{
    id: string;
    type: 'crackerBinaryType';
    attributes: {
      isChunkingAvailable?: boolean | null;
      typeName?: string;
    };
  }>;
};

export type CrackerBinaryTypeDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'crackerBinaryType';
  }>;
};

export type CrackerBinaryTypeResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'crackerBinaryType';
    attributes: {
      typeName: string;
      isChunkingAvailable: boolean | null;
    };
    links: {
      self: string;
    };
    relationships: {
      crackerVersions: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'crackerBinary';
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

export type CrackerBinaryTypePostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'crackerBinaryType';
    attributes: {
      typeName: string;
      isChunkingAvailable: boolean | null;
    };
    links: {
      self: string;
    };
    relationships: {
      crackerVersions: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'crackerBinary';
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

export type CrackerBinaryTypeListResponse = {
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
    type: 'crackerBinaryType';
    attributes: {
      typeName: string;
      isChunkingAvailable: boolean | null;
    };
    links: {
      self: string;
    };
    relationships: {
      crackerVersions: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'crackerBinary';
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

export type CrackerBinaryTypeCountResponse = {
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

export type CrackerBinaryTypeRelationTasks = {
  data: Array<{
    type: 'tasks';
    id: string;
  }>;
};

export type CrackerBinaryTypeRelationTasksGetResponse = {
  data: Array<{
    type: 'tasks';
    id: string;
  }>;
};

export type DeleteCrackertypesData = {
  body: CrackerBinaryTypeDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/crackertypes';
};

export type DeleteCrackertypesErrors = {
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

export type DeleteCrackertypesError = DeleteCrackertypesErrors[keyof DeleteCrackertypesErrors];

export type DeleteCrackertypesResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteCrackertypesResponse = DeleteCrackertypesResponses[keyof DeleteCrackertypesResponses];

export type GetCrackertypesData = {
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
     * Example: `{"primary":{"crackerBinaryTypeId": 123}}` -> `eyJwcmltYXJ5Ijp7ImNyYWNrZXJCaW5hcnlUeXBlSWQiOiAxMjN9fQ==`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"crackerBinaryTypeId": 123}}` -> `eyJwcmltYXJ5Ijp7ImNyYWNrZXJCaW5hcnlUeXBlSWQiOiAxMjN9fQ==`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[crackerBinaryTypeId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: crackerVersions, tasks
     */
    include?: Array<'crackerVersions' | 'tasks'>;
  };
  url: '/api/v2/ui/crackertypes';
};

export type GetCrackertypesErrors = {
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

export type GetCrackertypesError = GetCrackertypesErrors[keyof GetCrackertypesErrors];

export type GetCrackertypesResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryTypeListResponse;
};

export type GetCrackertypesResponse = GetCrackertypesResponses[keyof GetCrackertypesResponses];

export type PatchCrackertypesData = {
  body: CrackerBinaryTypePatchMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/crackertypes';
};

export type PatchCrackertypesErrors = {
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

export type PatchCrackertypesError = PatchCrackertypesErrors[keyof PatchCrackertypesErrors];

export type PatchCrackertypesResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchCrackertypesResponse = PatchCrackertypesResponses[keyof PatchCrackertypesResponses];

export type PostCrackertypesData = {
  body: CrackerBinaryTypeCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/crackertypes';
};

export type PostCrackertypesErrors = {
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

export type PostCrackertypesError = PostCrackertypesErrors[keyof PostCrackertypesErrors];

export type PostCrackertypesResponses = {
  /**
   * successful operation
   */
  201: CrackerBinaryTypePostPatchResponse;
};

export type PostCrackertypesResponse = PostCrackertypesResponses[keyof PostCrackertypesResponses];

export type GetCrackertypesCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[crackerBinaryTypeId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/crackertypes/count';
};

export type GetCrackertypesCountErrors = {
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

export type GetCrackertypesCountError = GetCrackertypesCountErrors[keyof GetCrackertypesCountErrors];

export type GetCrackertypesCountResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryTypeCountResponse;
};

export type GetCrackertypesCountResponse = GetCrackertypesCountResponses[keyof GetCrackertypesCountResponses];

export type GetCrackertypesByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/crackertypes/{id}/{relation}';
};

export type GetCrackertypesByIdByRelationErrors = {
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

export type GetCrackertypesByIdByRelationError =
  GetCrackertypesByIdByRelationErrors[keyof GetCrackertypesByIdByRelationErrors];

export type GetCrackertypesByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryTypeRelationTasksGetResponse;
};

export type GetCrackertypesByIdByRelationResponse =
  GetCrackertypesByIdByRelationResponses[keyof GetCrackertypesByIdByRelationResponses];

export type DeleteCrackertypesByIdRelationshipsByRelationData = {
  body: CrackerBinaryTypeRelationTasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/crackertypes/{id}/relationships/{relation}';
};

export type DeleteCrackertypesByIdRelationshipsByRelationErrors = {
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

export type DeleteCrackertypesByIdRelationshipsByRelationError =
  DeleteCrackertypesByIdRelationshipsByRelationErrors[keyof DeleteCrackertypesByIdRelationshipsByRelationErrors];

export type DeleteCrackertypesByIdRelationshipsByRelationResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteCrackertypesByIdRelationshipsByRelationResponse =
  DeleteCrackertypesByIdRelationshipsByRelationResponses[keyof DeleteCrackertypesByIdRelationshipsByRelationResponses];

export type GetCrackertypesByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/crackertypes/{id}/relationships/{relation}';
};

export type GetCrackertypesByIdRelationshipsByRelationErrors = {
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

export type GetCrackertypesByIdRelationshipsByRelationError =
  GetCrackertypesByIdRelationshipsByRelationErrors[keyof GetCrackertypesByIdRelationshipsByRelationErrors];

export type GetCrackertypesByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryTypeResponse;
};

export type GetCrackertypesByIdRelationshipsByRelationResponse =
  GetCrackertypesByIdRelationshipsByRelationResponses[keyof GetCrackertypesByIdRelationshipsByRelationResponses];

export type PatchCrackertypesByIdRelationshipsByRelationData = {
  body: CrackerBinaryTypeRelationTasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/crackertypes/{id}/relationships/{relation}';
};

export type PatchCrackertypesByIdRelationshipsByRelationErrors = {
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

export type PatchCrackertypesByIdRelationshipsByRelationError =
  PatchCrackertypesByIdRelationshipsByRelationErrors[keyof PatchCrackertypesByIdRelationshipsByRelationErrors];

export type PatchCrackertypesByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchCrackertypesByIdRelationshipsByRelationResponse =
  PatchCrackertypesByIdRelationshipsByRelationResponses[keyof PatchCrackertypesByIdRelationshipsByRelationResponses];

export type PostCrackertypesByIdRelationshipsByRelationData = {
  body: CrackerBinaryTypeRelationTasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/crackertypes/{id}/relationships/{relation}';
};

export type PostCrackertypesByIdRelationshipsByRelationErrors = {
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

export type PostCrackertypesByIdRelationshipsByRelationError =
  PostCrackertypesByIdRelationshipsByRelationErrors[keyof PostCrackertypesByIdRelationshipsByRelationErrors];

export type PostCrackertypesByIdRelationshipsByRelationResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostCrackertypesByIdRelationshipsByRelationResponse =
  PostCrackertypesByIdRelationshipsByRelationResponses[keyof PostCrackertypesByIdRelationshipsByRelationResponses];

export type DeleteCrackertypesByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackertypes/{id}';
};

export type DeleteCrackertypesByIdErrors = {
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

export type DeleteCrackertypesByIdError = DeleteCrackertypesByIdErrors[keyof DeleteCrackertypesByIdErrors];

export type DeleteCrackertypesByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteCrackertypesByIdResponse = DeleteCrackertypesByIdResponses[keyof DeleteCrackertypesByIdResponses];

export type GetCrackertypesByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options: crackerVersions, tasks
     */
    include?: Array<'crackerVersions' | 'tasks'>;
  };
  url: '/api/v2/ui/crackertypes/{id}';
};

export type GetCrackertypesByIdErrors = {
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

export type GetCrackertypesByIdError = GetCrackertypesByIdErrors[keyof GetCrackertypesByIdErrors];

export type GetCrackertypesByIdResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryTypeResponse;
};

export type GetCrackertypesByIdResponse = GetCrackertypesByIdResponses[keyof GetCrackertypesByIdResponses];

export type PatchCrackertypesByIdData = {
  body: CrackerBinaryTypePatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackertypes/{id}';
};

export type PatchCrackertypesByIdErrors = {
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

export type PatchCrackertypesByIdError = PatchCrackertypesByIdErrors[keyof PatchCrackertypesByIdErrors];

export type PatchCrackertypesByIdResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryTypePostPatchResponse;
};

export type PatchCrackertypesByIdResponse = PatchCrackertypesByIdResponses[keyof PatchCrackertypesByIdResponses];
