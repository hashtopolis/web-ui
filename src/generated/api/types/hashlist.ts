import type { ErrorResponse, NotFoundResponse } from './common';

export type HashlistCreate = {
  data: {
    type: 'hashlist';
    attributes: {
      hashlistSeperator?: string | null;
      sourceType: string;
      sourceData: string;
      name: string;
      format: 0 | 1 | 2 | 3;
      hashTypeId: number;
      hashCount: number;
      separator?: string | null;
      isSecret: boolean;
      isHexSalt: boolean;
      isSalted: boolean;
      accessGroupId: number;
      notes: string;
      useBrain: boolean;
      brainFeatures: number;
      isArchived: boolean;
    };
  };
};

export type HashlistPatch = {
  data: {
    type: 'hashlist';
    attributes: {
      accessGroupId?: number;
      isArchived?: boolean;
      isSecret?: boolean;
      name?: string;
      notes?: string;
    };
  };
};

export type HashlistResponse = {
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
    type: 'hashlist';
    attributes: {
      name: string;
      format: 0 | 1 | 2 | 3;
      hashTypeId: number;
      hashCount: number;
      separator: string | null;
      cracked: number;
      isSecret: boolean;
      isHexSalt: boolean;
      isSalted: boolean;
      accessGroupId: number;
      notes: string;
      useBrain: boolean;
      brainFeatures: number;
      isArchived: boolean;
    };
  };
  relationships?: {
    accessGroup: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'accessGroup';
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
    hashes: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'hash';
        id: number;
      }>;
    };
    hashlists: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'hashlist';
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
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hash';
        attributes: {
          hashlistId: number;
          hash: string;
          salt: string;
          plaintext: string;
          timeCracked: number;
          chunkId: number;
          isCracked: boolean;
          crackPos: number;
        };
      }
    | {
        id: number;
        type: 'hashlist';
        attributes: {
          name: string;
          format: 0 | 1 | 2 | 3;
          hashTypeId: number;
          hashCount: number;
          separator: string | null;
          cracked: number;
          isSecret: boolean;
          isHexSalt: boolean;
          isSalted: boolean;
          accessGroupId: number;
          notes: string;
          useBrain: boolean;
          brainFeatures: number;
          isArchived: boolean;
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

export type HashlistSingleResponse = {
  data: {
    id: number;
    type: 'hashlist';
    attributes: {
      name: string;
      format: 0 | 1 | 2 | 3;
      hashTypeId: number;
      hashCount: number;
      separator: string | null;
      cracked: number;
      isSecret: boolean;
      isHexSalt: boolean;
      isSalted: boolean;
      accessGroupId: number;
      notes: string;
      useBrain: boolean;
      brainFeatures: number;
      isArchived: boolean;
    };
  };
  relationships?: {
    accessGroup: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'accessGroup';
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
    hashes: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'hash';
        id: number;
      }>;
    };
    hashlists: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'hashlist';
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
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hash';
        attributes: {
          hashlistId: number;
          hash: string;
          salt: string;
          plaintext: string;
          timeCracked: number;
          chunkId: number;
          isCracked: boolean;
          crackPos: number;
        };
      }
    | {
        id: number;
        type: 'hashlist';
        attributes: {
          name: string;
          format: 0 | 1 | 2 | 3;
          hashTypeId: number;
          hashCount: number;
          separator: string | null;
          cracked: number;
          isSecret: boolean;
          isHexSalt: boolean;
          isSalted: boolean;
          accessGroupId: number;
          notes: string;
          useBrain: boolean;
          brainFeatures: number;
          isArchived: boolean;
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

export type HashlistPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  data: {
    id: number;
    type: 'hashlist';
    attributes: {
      name: string;
      format: 0 | 1 | 2 | 3;
      hashTypeId: number;
      hashCount: number;
      separator: string | null;
      cracked: number;
      isSecret: boolean;
      isHexSalt: boolean;
      isSalted: boolean;
      accessGroupId: number;
      notes: string;
      useBrain: boolean;
      brainFeatures: number;
      isArchived: boolean;
    };
  };
};

export type HashlistListResponse = {
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
    type: 'hashlist';
    attributes: {
      name: string;
      format: 0 | 1 | 2 | 3;
      hashTypeId: number;
      hashCount: number;
      separator: string | null;
      cracked: number;
      isSecret: boolean;
      isHexSalt: boolean;
      isSalted: boolean;
      accessGroupId: number;
      notes: string;
      useBrain: boolean;
      brainFeatures: number;
      isArchived: boolean;
    };
  }>;
  relationships?: {
    accessGroup: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'accessGroup';
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
    hashes: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'hash';
        id: number;
      }>;
    };
    hashlists: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'hashlist';
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
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hash';
        attributes: {
          hashlistId: number;
          hash: string;
          salt: string;
          plaintext: string;
          timeCracked: number;
          chunkId: number;
          isCracked: boolean;
          crackPos: number;
        };
      }
    | {
        id: number;
        type: 'hashlist';
        attributes: {
          name: string;
          format: 0 | 1 | 2 | 3;
          hashTypeId: number;
          hashCount: number;
          separator: string | null;
          cracked: number;
          isSecret: boolean;
          isHexSalt: boolean;
          isSalted: boolean;
          accessGroupId: number;
          notes: string;
          useBrain: boolean;
          brainFeatures: number;
          isArchived: boolean;
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

export type HashlistRelationTasks = {
  data: Array<{
    type: 'tasks';
    id: number;
  }>;
};

export type HashlistRelationTasksGetResponse = {
  data: Array<{
    type: 'tasks';
    id: number;
  }>;
};

export type DeleteHashlistsData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/hashlists';
};

export type DeleteHashlistsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type DeleteHashlistsError = DeleteHashlistsErrors[keyof DeleteHashlistsErrors];

export type DeleteHashlistsResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetHashlistsData = {
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
  url: '/api/v2/ui/hashlists';
};

export type GetHashlistsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetHashlistsError = GetHashlistsErrors[keyof GetHashlistsErrors];

export type GetHashlistsResponses = {
  /**
   * successful operation
   */
  200: HashlistListResponse;
};

export type GetHashlistsResponse = GetHashlistsResponses[keyof GetHashlistsResponses];

export type PatchHashlistsData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/hashlists';
};

export type PatchHashlistsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PatchHashlistsError = PatchHashlistsErrors[keyof PatchHashlistsErrors];

export type PatchHashlistsResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type PostHashlistsData = {
  body: HashlistCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/hashlists';
};

export type PostHashlistsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PostHashlistsError = PostHashlistsErrors[keyof PostHashlistsErrors];

export type PostHashlistsResponses = {
  /**
   * successful operation
   */
  201: HashlistPostPatchResponse;
};

export type PostHashlistsResponse = PostHashlistsResponses[keyof PostHashlistsResponses];

export type GetHashlistsCountData = {
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
  url: '/api/v2/ui/hashlists/count';
};

export type GetHashlistsCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetHashlistsCountError = GetHashlistsCountErrors[keyof GetHashlistsCountErrors];

export type GetHashlistsCountResponses = {
  /**
   * successful operation
   */
  200: HashlistListResponse;
};

export type GetHashlistsCountResponse = GetHashlistsCountResponses[keyof GetHashlistsCountResponses];

export type GetHashlistsByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/{relation}';
};

export type GetHashlistsByIdByRelationErrors = {
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

export type GetHashlistsByIdByRelationError = GetHashlistsByIdByRelationErrors[keyof GetHashlistsByIdByRelationErrors];

export type GetHashlistsByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: HashlistRelationTasksGetResponse;
};

export type GetHashlistsByIdByRelationResponse =
  GetHashlistsByIdByRelationResponses[keyof GetHashlistsByIdByRelationResponses];

export type DeleteHashlistsByIdRelationshipsByRelationData = {
  body: HashlistRelationTasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/{relation}';
};

export type DeleteHashlistsByIdRelationshipsByRelationErrors = {
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

export type DeleteHashlistsByIdRelationshipsByRelationError =
  DeleteHashlistsByIdRelationshipsByRelationErrors[keyof DeleteHashlistsByIdRelationshipsByRelationErrors];

export type DeleteHashlistsByIdRelationshipsByRelationResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteHashlistsByIdRelationshipsByRelationResponse =
  DeleteHashlistsByIdRelationshipsByRelationResponses[keyof DeleteHashlistsByIdRelationshipsByRelationResponses];

export type GetHashlistsByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/{relation}';
};

export type GetHashlistsByIdRelationshipsByRelationErrors = {
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

export type GetHashlistsByIdRelationshipsByRelationError =
  GetHashlistsByIdRelationshipsByRelationErrors[keyof GetHashlistsByIdRelationshipsByRelationErrors];

export type GetHashlistsByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: HashlistResponse;
};

export type GetHashlistsByIdRelationshipsByRelationResponse =
  GetHashlistsByIdRelationshipsByRelationResponses[keyof GetHashlistsByIdRelationshipsByRelationResponses];

export type PatchHashlistsByIdRelationshipsByRelationData = {
  body: HashlistRelationTasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/{relation}';
};

export type PatchHashlistsByIdRelationshipsByRelationErrors = {
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

export type PatchHashlistsByIdRelationshipsByRelationError =
  PatchHashlistsByIdRelationshipsByRelationErrors[keyof PatchHashlistsByIdRelationshipsByRelationErrors];

export type PatchHashlistsByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchHashlistsByIdRelationshipsByRelationResponse =
  PatchHashlistsByIdRelationshipsByRelationResponses[keyof PatchHashlistsByIdRelationshipsByRelationResponses];

export type PostHashlistsByIdRelationshipsByRelationData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/{relation}';
};

export type PostHashlistsByIdRelationshipsByRelationErrors = {
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

export type PostHashlistsByIdRelationshipsByRelationError =
  PostHashlistsByIdRelationshipsByRelationErrors[keyof PostHashlistsByIdRelationshipsByRelationErrors];

export type PostHashlistsByIdRelationshipsByRelationResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostHashlistsByIdRelationshipsByRelationResponse =
  PostHashlistsByIdRelationshipsByRelationResponses[keyof PostHashlistsByIdRelationshipsByRelationResponses];

export type DeleteHashlistsByIdData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}';
};

export type DeleteHashlistsByIdErrors = {
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

export type DeleteHashlistsByIdError = DeleteHashlistsByIdErrors[keyof DeleteHashlistsByIdErrors];

export type DeleteHashlistsByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteHashlistsByIdResponse = DeleteHashlistsByIdResponses[keyof DeleteHashlistsByIdResponses];

export type GetHashlistsByIdData = {
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
  url: '/api/v2/ui/hashlists/{id}';
};

export type GetHashlistsByIdErrors = {
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

export type GetHashlistsByIdError = GetHashlistsByIdErrors[keyof GetHashlistsByIdErrors];

export type GetHashlistsByIdResponses = {
  /**
   * successful operation
   */
  200: HashlistResponse;
};

export type GetHashlistsByIdResponse = GetHashlistsByIdResponses[keyof GetHashlistsByIdResponses];

export type PatchHashlistsByIdData = {
  body: HashlistPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}';
};

export type PatchHashlistsByIdErrors = {
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

export type PatchHashlistsByIdError = PatchHashlistsByIdErrors[keyof PatchHashlistsByIdErrors];

export type PatchHashlistsByIdResponses = {
  /**
   * successful operation
   */
  200: HashlistPostPatchResponse;
};

export type PatchHashlistsByIdResponse = PatchHashlistsByIdResponses[keyof PatchHashlistsByIdResponses];
