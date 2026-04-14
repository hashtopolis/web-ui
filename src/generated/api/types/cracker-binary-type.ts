import type { ErrorResponse, NotFoundResponse } from './common';

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
      isChunkingAvailable?: boolean;
      typeName?: string;
    };
  };
};

export type CrackerBinaryTypeResponse = {
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
    type: 'crackerBinaryType';
    attributes: {
      typeName: string;
      isChunkingAvailable: boolean;
    };
  };
  relationships?: {
    crackerVersions: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'crackerBinary';
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

export type CrackerBinaryTypePostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  data: {
    id: number;
    type: 'crackerBinaryType';
    attributes: {
      typeName: string;
      isChunkingAvailable: boolean;
    };
  };
};

export type CrackerBinaryTypeListResponse = {
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
    type: 'crackerBinaryType';
    attributes: {
      typeName: string;
      isChunkingAvailable: boolean;
    };
  }>;
  relationships?: {
    crackerVersions: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'crackerBinary';
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

export type CrackerBinaryTypeRelationTasks = {
  data: Array<{
    type: 'tasks';
    id: number;
  }>;
};

export type CrackerBinaryTypeRelationTasksGetResponse = {
  data: Array<{
    type: 'tasks';
    id: number;
  }>;
};

export type DeleteCrackertypesData = {
  body?: never;
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
};

export type DeleteCrackertypesError = DeleteCrackertypesErrors[keyof DeleteCrackertypesErrors];

export type DeleteCrackertypesResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetCrackertypesData = {
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
  body?: never;
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
};

export type PatchCrackertypesError = PatchCrackertypesErrors[keyof PatchCrackertypesErrors];

export type PatchCrackertypesResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

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
};

export type GetCrackertypesCountError = GetCrackertypesCountErrors[keyof GetCrackertypesCountErrors];

export type GetCrackertypesCountResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryTypeListResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
  body: {
    [key: string]: unknown;
  };
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
   * Not Found
   */
  404: NotFoundResponse;
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
  body: {
    [key: string]: unknown;
  };
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
   * Not Found
   */
  404: NotFoundResponse;
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
     * Items to include. Comma seperated
     */
    include?: string;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
};

export type PatchCrackertypesByIdError = PatchCrackertypesByIdErrors[keyof PatchCrackertypesByIdErrors];

export type PatchCrackertypesByIdResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryTypePostPatchResponse;
};

export type PatchCrackertypesByIdResponse = PatchCrackertypesByIdResponses[keyof PatchCrackertypesByIdResponses];
