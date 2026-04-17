import type { ErrorResponse, NotFoundResponse } from './common';

export type CrackerBinaryCreate = {
  data: {
    type: 'crackerBinary';
    attributes: {
      crackerBinaryTypeId: number;
      version: string;
      downloadUrl: string;
      binaryName: string;
    };
  };
};

export type CrackerBinaryPatch = {
  data: {
    type: 'crackerBinary';
    attributes: {
      binaryName?: string;
      downloadUrl?: string;
      version?: string;
    };
  };
};

export type CrackerBinaryResponse = {
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
    type: 'crackerBinary';
    attributes: {
      crackerBinaryTypeId: number;
      version: string;
      downloadUrl: string;
      binaryName: string;
    };
  };
  relationships?: {
    crackerBinaryType: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'crackerBinaryType';
        id: number;
      } | null;
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
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean;
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

export type CrackerBinaryPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  data: {
    id: number;
    type: 'crackerBinary';
    attributes: {
      crackerBinaryTypeId: number;
      version: string;
      downloadUrl: string;
      binaryName: string;
    };
  };
};

export type CrackerBinaryListResponse = {
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
    type: 'crackerBinary';
    attributes: {
      crackerBinaryTypeId: number;
      version: string;
      downloadUrl: string;
      binaryName: string;
    };
  }>;
  relationships?: {
    crackerBinaryType: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'crackerBinaryType';
        id: number;
      } | null;
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
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean;
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

export type CrackerBinaryRelationTasks = {
  data: Array<{
    type: 'tasks';
    id: number;
  }>;
};

export type CrackerBinaryRelationTasksGetResponse = {
  data: Array<{
    type: 'tasks';
    id: number;
  }>;
};

export type DeleteCrackersData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/crackers';
};

export type DeleteCrackersErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type DeleteCrackersError = DeleteCrackersErrors[keyof DeleteCrackersErrors];

export type DeleteCrackersResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetCrackersData = {
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
  url: '/api/v2/ui/crackers';
};

export type GetCrackersErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetCrackersError = GetCrackersErrors[keyof GetCrackersErrors];

export type GetCrackersResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryListResponse;
};

export type GetCrackersResponse = GetCrackersResponses[keyof GetCrackersResponses];

export type PatchCrackersData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/crackers';
};

export type PatchCrackersErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PatchCrackersError = PatchCrackersErrors[keyof PatchCrackersErrors];

export type PatchCrackersResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type PostCrackersData = {
  body: CrackerBinaryCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/crackers';
};

export type PostCrackersErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PostCrackersError = PostCrackersErrors[keyof PostCrackersErrors];

export type PostCrackersResponses = {
  /**
   * successful operation
   */
  201: CrackerBinaryPostPatchResponse;
};

export type PostCrackersResponse = PostCrackersResponses[keyof PostCrackersResponses];

export type GetCrackersCountData = {
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
  url: '/api/v2/ui/crackers/count';
};

export type GetCrackersCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetCrackersCountError = GetCrackersCountErrors[keyof GetCrackersCountErrors];

export type GetCrackersCountResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryListResponse;
};

export type GetCrackersCountResponse = GetCrackersCountResponses[keyof GetCrackersCountResponses];

export type GetCrackersByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/{relation}';
};

export type GetCrackersByIdByRelationErrors = {
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

export type GetCrackersByIdByRelationError = GetCrackersByIdByRelationErrors[keyof GetCrackersByIdByRelationErrors];

export type GetCrackersByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryRelationTasksGetResponse;
};

export type GetCrackersByIdByRelationResponse =
  GetCrackersByIdByRelationResponses[keyof GetCrackersByIdByRelationResponses];

export type DeleteCrackersByIdRelationshipsByRelationData = {
  body: CrackerBinaryRelationTasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/{relation}';
};

export type DeleteCrackersByIdRelationshipsByRelationErrors = {
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

export type DeleteCrackersByIdRelationshipsByRelationError =
  DeleteCrackersByIdRelationshipsByRelationErrors[keyof DeleteCrackersByIdRelationshipsByRelationErrors];

export type DeleteCrackersByIdRelationshipsByRelationResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteCrackersByIdRelationshipsByRelationResponse =
  DeleteCrackersByIdRelationshipsByRelationResponses[keyof DeleteCrackersByIdRelationshipsByRelationResponses];

export type GetCrackersByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/{relation}';
};

export type GetCrackersByIdRelationshipsByRelationErrors = {
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

export type GetCrackersByIdRelationshipsByRelationError =
  GetCrackersByIdRelationshipsByRelationErrors[keyof GetCrackersByIdRelationshipsByRelationErrors];

export type GetCrackersByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryResponse;
};

export type GetCrackersByIdRelationshipsByRelationResponse =
  GetCrackersByIdRelationshipsByRelationResponses[keyof GetCrackersByIdRelationshipsByRelationResponses];

export type PatchCrackersByIdRelationshipsByRelationData = {
  body: CrackerBinaryRelationTasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/{relation}';
};

export type PatchCrackersByIdRelationshipsByRelationErrors = {
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

export type PatchCrackersByIdRelationshipsByRelationError =
  PatchCrackersByIdRelationshipsByRelationErrors[keyof PatchCrackersByIdRelationshipsByRelationErrors];

export type PatchCrackersByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchCrackersByIdRelationshipsByRelationResponse =
  PatchCrackersByIdRelationshipsByRelationResponses[keyof PatchCrackersByIdRelationshipsByRelationResponses];

export type PostCrackersByIdRelationshipsByRelationData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/{relation}';
};

export type PostCrackersByIdRelationshipsByRelationErrors = {
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

export type PostCrackersByIdRelationshipsByRelationError =
  PostCrackersByIdRelationshipsByRelationErrors[keyof PostCrackersByIdRelationshipsByRelationErrors];

export type PostCrackersByIdRelationshipsByRelationResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostCrackersByIdRelationshipsByRelationResponse =
  PostCrackersByIdRelationshipsByRelationResponses[keyof PostCrackersByIdRelationshipsByRelationResponses];

export type DeleteCrackersByIdData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}';
};

export type DeleteCrackersByIdErrors = {
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

export type DeleteCrackersByIdError = DeleteCrackersByIdErrors[keyof DeleteCrackersByIdErrors];

export type DeleteCrackersByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteCrackersByIdResponse = DeleteCrackersByIdResponses[keyof DeleteCrackersByIdResponses];

export type GetCrackersByIdData = {
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
  url: '/api/v2/ui/crackers/{id}';
};

export type GetCrackersByIdErrors = {
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

export type GetCrackersByIdError = GetCrackersByIdErrors[keyof GetCrackersByIdErrors];

export type GetCrackersByIdResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryResponse;
};

export type GetCrackersByIdResponse = GetCrackersByIdResponses[keyof GetCrackersByIdResponses];

export type PatchCrackersByIdData = {
  body: CrackerBinaryPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}';
};

export type PatchCrackersByIdErrors = {
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

export type PatchCrackersByIdError = PatchCrackersByIdErrors[keyof PatchCrackersByIdErrors];

export type PatchCrackersByIdResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryPostPatchResponse;
};

export type PatchCrackersByIdResponse = PatchCrackersByIdResponses[keyof PatchCrackersByIdResponses];
