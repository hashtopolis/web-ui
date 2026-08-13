import type { ErrorResponse } from './common';

export type HashlistCreate = {
  data: {
    type: 'hashlist';
    attributes: {
      hashlistSeperator?: string | null;
      sourceType: string;
      sourceData: string;
      name: string;
      format: 0 | 1 | 2 | 3;
      hashTypeId: string;
      hashCount: number;
      separator?: string | null;
      isSecret: boolean;
      isHexSalt: boolean;
      isSalted: boolean;
      accessGroupId: string;
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
      accessGroupId?: string;
      isArchived?: boolean;
      isSecret?: boolean;
      name?: string;
      notes?: string;
    };
  };
};

export type HashlistPatchMultiple = {
  data: Array<{
    id: string;
    type: 'hashlist';
    attributes: {
      accessGroupId?: string;
      isArchived?: boolean;
      isSecret?: boolean;
      name?: string;
      notes?: string;
    };
  }>;
};

export type HashlistDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'hashlist';
  }>;
};

export type HashlistResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'hashlist';
    attributes: {
      name: string;
      format: 0 | 1 | 2 | 3;
      hashTypeId: string;
      hashCount: number;
      separator: string | null;
      cracked: number;
      isSecret: boolean;
      isHexSalt: boolean;
      isSalted: boolean;
      accessGroupId: string;
      notes: string;
      useBrain: boolean;
      brainFeatures: number;
      isArchived: boolean;
    };
    links: {
      self: string;
    };
    relationships: {
      accessGroup: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'accessGroup';
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
      hashes: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'hash';
          id: string;
        }>;
      };
      hashlists: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'hashlist';
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
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hash';
        attributes: {
          hashlistId: string;
          hash: string;
          salt: string;
          plaintext: string;
          timeCracked: number;
          chunkId: string | null;
          isCracked: boolean;
          crackPos: number;
        };
      }
    | {
        id: string;
        type: 'hashlist';
        attributes: {
          name: string;
          format: 0 | 1 | 2 | 3;
          hashTypeId: string;
          hashCount: number;
          separator: string | null;
          cracked: number;
          isSecret: boolean;
          isHexSalt: boolean;
          isSalted: boolean;
          accessGroupId: string;
          notes: string;
          useBrain: boolean;
          brainFeatures: number;
          isArchived: boolean;
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

export type HashlistSingleResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'hashlist';
    attributes: {
      name: string;
      format: 0 | 1 | 2 | 3;
      hashTypeId: string;
      hashCount: number;
      separator: string | null;
      cracked: number;
      isSecret: boolean;
      isHexSalt: boolean;
      isSalted: boolean;
      accessGroupId: string;
      notes: string;
      useBrain: boolean;
      brainFeatures: number;
      isArchived: boolean;
    };
    links: {
      self: string;
    };
    relationships: {
      accessGroup: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'accessGroup';
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
      hashes: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'hash';
          id: string;
        }>;
      };
      hashlists: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'hashlist';
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
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hash';
        attributes: {
          hashlistId: string;
          hash: string;
          salt: string;
          plaintext: string;
          timeCracked: number;
          chunkId: string | null;
          isCracked: boolean;
          crackPos: number;
        };
      }
    | {
        id: string;
        type: 'hashlist';
        attributes: {
          name: string;
          format: 0 | 1 | 2 | 3;
          hashTypeId: string;
          hashCount: number;
          separator: string | null;
          cracked: number;
          isSecret: boolean;
          isHexSalt: boolean;
          isSalted: boolean;
          accessGroupId: string;
          notes: string;
          useBrain: boolean;
          brainFeatures: number;
          isArchived: boolean;
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

export type HashlistPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'hashlist';
    attributes: {
      name: string;
      format: 0 | 1 | 2 | 3;
      hashTypeId: string;
      hashCount: number;
      separator: string | null;
      cracked: number;
      isSecret: boolean;
      isHexSalt: boolean;
      isSalted: boolean;
      accessGroupId: string;
      notes: string;
      useBrain: boolean;
      brainFeatures: number;
      isArchived: boolean;
    };
    links: {
      self: string;
    };
    relationships: {
      accessGroup: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'accessGroup';
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
      hashes: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'hash';
          id: string;
        }>;
      };
      hashlists: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'hashlist';
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
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hash';
        attributes: {
          hashlistId: string;
          hash: string;
          salt: string;
          plaintext: string;
          timeCracked: number;
          chunkId: string | null;
          isCracked: boolean;
          crackPos: number;
        };
      }
    | {
        id: string;
        type: 'hashlist';
        attributes: {
          name: string;
          format: 0 | 1 | 2 | 3;
          hashTypeId: string;
          hashCount: number;
          separator: string | null;
          cracked: number;
          isSecret: boolean;
          isHexSalt: boolean;
          isSalted: boolean;
          accessGroupId: string;
          notes: string;
          useBrain: boolean;
          brainFeatures: number;
          isArchived: boolean;
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

export type HashlistListResponse = {
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
    type: 'hashlist';
    attributes: {
      name: string;
      format: 0 | 1 | 2 | 3;
      hashTypeId: string;
      hashCount: number;
      separator: string | null;
      cracked: number;
      isSecret: boolean;
      isHexSalt: boolean;
      isSalted: boolean;
      accessGroupId: string;
      notes: string;
      useBrain: boolean;
      brainFeatures: number;
      isArchived: boolean;
    };
    links: {
      self: string;
    };
    relationships: {
      accessGroup: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'accessGroup';
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
      hashes: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'hash';
          id: string;
        }>;
      };
      hashlists: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'hashlist';
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
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
        type: 'hash';
        attributes: {
          hashlistId: string;
          hash: string;
          salt: string;
          plaintext: string;
          timeCracked: number;
          chunkId: string | null;
          isCracked: boolean;
          crackPos: number;
        };
      }
    | {
        id: string;
        type: 'hashlist';
        attributes: {
          name: string;
          format: 0 | 1 | 2 | 3;
          hashTypeId: string;
          hashCount: number;
          separator: string | null;
          cracked: number;
          isSecret: boolean;
          isHexSalt: boolean;
          isSalted: boolean;
          accessGroupId: string;
          notes: string;
          useBrain: boolean;
          brainFeatures: number;
          isArchived: boolean;
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

export type HashlistCountResponse = {
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

export type HashlistRelationTasks = {
  data: Array<{
    type: 'tasks';
    id: string;
  }>;
};

export type HashlistRelationTasksGetResponse = {
  data: Array<{
    type: 'tasks';
    id: string;
  }>;
};

export type DeleteHashlistsData = {
  body: HashlistDeleteMultiple;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type DeleteHashlistsError = DeleteHashlistsErrors[keyof DeleteHashlistsErrors];

export type DeleteHashlistsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteHashlistsResponse = DeleteHashlistsResponses[keyof DeleteHashlistsResponses];

export type GetHashlistsData = {
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
     * Example: `{"primary":{"hashlistId": 123}}` -> `eyJwcmltYXJ5Ijp7Imhhc2hsaXN0SWQiOiAxMjN9fQ==`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"hashlistId": 123}}` -> `eyJwcmltYXJ5Ijp7Imhhc2hsaXN0SWQiOiAxMjN9fQ==`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[hashlistId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: accessGroup, hashType, hashes, hashlists, tasks
     */
    include?: Array<'accessGroup' | 'hashType' | 'hashes' | 'hashlists' | 'tasks'>;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
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
  body: HashlistPatchMultiple;
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

export type PatchHashlistsError = PatchHashlistsErrors[keyof PatchHashlistsErrors];

export type PatchHashlistsResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchHashlistsResponse = PatchHashlistsResponses[keyof PatchHashlistsResponses];

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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
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
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[hashlistId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetHashlistsCountError = GetHashlistsCountErrors[keyof GetHashlistsCountErrors];

export type GetHashlistsCountResponses = {
  /**
   * successful operation
   */
  200: HashlistCountResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
  body: HashlistRelationTasks;
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
  body?: never;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
     * Relationships to include in the response, comma seperated. Possible options: accessGroup, hashType, hashes, hashlists, tasks
     */
    include?: Array<'accessGroup' | 'hashType' | 'hashes' | 'hashlists' | 'tasks'>;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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

export type PatchHashlistsByIdError = PatchHashlistsByIdErrors[keyof PatchHashlistsByIdErrors];

export type PatchHashlistsByIdResponses = {
  /**
   * successful operation
   */
  200: HashlistPostPatchResponse;
};

export type PatchHashlistsByIdResponse = PatchHashlistsByIdResponses[keyof PatchHashlistsByIdResponses];
