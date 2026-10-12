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

export type HashlistPatchMultiple = {
  data: Array<{
    id: number;
    type: 'hashlist';
    attributes: {
      accessGroupId?: number;
      isArchived?: boolean;
      isSecret?: boolean;
      name?: string;
      notes?: string;
    };
  }>;
};

export type HashlistDeleteMultiple = {
  data: Array<{
    id: number;
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
          chunkId: number | null;
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
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
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
          chunkId: number | null;
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
  links: {
    self: string;
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
          chunkId: number | null;
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
  }>;
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
          chunkId: number | null;
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

export type HashlistCountResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    /**
     * Number of objects accessible to the current user matching the given filters
     */
    count: number;
    /**
     * Number of objects accessible to the current user without any filter applied, only present when `include_total=true` was requested
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

export type HashlistRelationAccessGroup = {
  data: {
    type: 'accessGroup';
    id: number;
  };
};

export type HashlistRelationAccessGroupGetResponse = {
  data: {
    type: 'accessGroup';
    id: number;
  };
};

export type HashlistRelationHashType = {
  data: {
    type: 'hashType';
    id: number;
  };
};

export type HashlistRelationHashTypeGetResponse = {
  data: {
    type: 'hashType';
    id: number;
  };
};

export type HashlistRelationHashes = {
  data: Array<{
    type: 'hash';
    id: number;
  }>;
};

export type HashlistRelationHashesGetResponse = {
  data: Array<{
    type: 'hash';
    id: number;
  }>;
};

export type HashlistRelationHashlists = {
  data: Array<{
    type: 'hashlist';
    id: number;
  }>;
};

export type HashlistRelationHashlistsGetResponse = {
  data: Array<{
    type: 'hashlist';
    id: number;
  }>;
};

export type HashlistRelationTasks = {
  data: Array<{
    type: 'task';
    id: number;
  }>;
};

export type HashlistRelationTasksGetResponse = {
  data: Array<{
    type: 'task';
    id: number;
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
     * Also report the number of accessible objects without any filter applied, as `meta.total_count`
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

export type GetHashlistsByIdAccessGroupData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/accessGroup';
};

export type GetHashlistsByIdAccessGroupErrors = {
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

export type GetHashlistsByIdAccessGroupError =
  GetHashlistsByIdAccessGroupErrors[keyof GetHashlistsByIdAccessGroupErrors];

export type GetHashlistsByIdAccessGroupResponses = {
  /**
   * successful operation
   */
  200: HashlistRelationAccessGroupGetResponse;
};

export type GetHashlistsByIdAccessGroupResponse =
  GetHashlistsByIdAccessGroupResponses[keyof GetHashlistsByIdAccessGroupResponses];

export type GetHashlistsByIdRelationshipsAccessGroupData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/accessGroup';
};

export type GetHashlistsByIdRelationshipsAccessGroupErrors = {
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

export type GetHashlistsByIdRelationshipsAccessGroupError =
  GetHashlistsByIdRelationshipsAccessGroupErrors[keyof GetHashlistsByIdRelationshipsAccessGroupErrors];

export type GetHashlistsByIdRelationshipsAccessGroupResponses = {
  /**
   * successful operation
   */
  200: HashlistResponse;
};

export type GetHashlistsByIdRelationshipsAccessGroupResponse =
  GetHashlistsByIdRelationshipsAccessGroupResponses[keyof GetHashlistsByIdRelationshipsAccessGroupResponses];

export type PatchHashlistsByIdRelationshipsAccessGroupData = {
  body: HashlistRelationAccessGroup;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/accessGroup';
};

export type PatchHashlistsByIdRelationshipsAccessGroupErrors = {
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

export type PatchHashlistsByIdRelationshipsAccessGroupError =
  PatchHashlistsByIdRelationshipsAccessGroupErrors[keyof PatchHashlistsByIdRelationshipsAccessGroupErrors];

export type PatchHashlistsByIdRelationshipsAccessGroupResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchHashlistsByIdRelationshipsAccessGroupResponse =
  PatchHashlistsByIdRelationshipsAccessGroupResponses[keyof PatchHashlistsByIdRelationshipsAccessGroupResponses];

export type GetHashlistsByIdHashTypeData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/hashType';
};

export type GetHashlistsByIdHashTypeErrors = {
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

export type GetHashlistsByIdHashTypeError = GetHashlistsByIdHashTypeErrors[keyof GetHashlistsByIdHashTypeErrors];

export type GetHashlistsByIdHashTypeResponses = {
  /**
   * successful operation
   */
  200: HashlistRelationHashTypeGetResponse;
};

export type GetHashlistsByIdHashTypeResponse =
  GetHashlistsByIdHashTypeResponses[keyof GetHashlistsByIdHashTypeResponses];

export type GetHashlistsByIdRelationshipsHashTypeData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/hashType';
};

export type GetHashlistsByIdRelationshipsHashTypeErrors = {
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

export type GetHashlistsByIdRelationshipsHashTypeError =
  GetHashlistsByIdRelationshipsHashTypeErrors[keyof GetHashlistsByIdRelationshipsHashTypeErrors];

export type GetHashlistsByIdRelationshipsHashTypeResponses = {
  /**
   * successful operation
   */
  200: HashlistResponse;
};

export type GetHashlistsByIdRelationshipsHashTypeResponse =
  GetHashlistsByIdRelationshipsHashTypeResponses[keyof GetHashlistsByIdRelationshipsHashTypeResponses];

export type PatchHashlistsByIdRelationshipsHashTypeData = {
  body: HashlistRelationHashType;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/hashType';
};

export type PatchHashlistsByIdRelationshipsHashTypeErrors = {
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

export type PatchHashlistsByIdRelationshipsHashTypeError =
  PatchHashlistsByIdRelationshipsHashTypeErrors[keyof PatchHashlistsByIdRelationshipsHashTypeErrors];

export type PatchHashlistsByIdRelationshipsHashTypeResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchHashlistsByIdRelationshipsHashTypeResponse =
  PatchHashlistsByIdRelationshipsHashTypeResponses[keyof PatchHashlistsByIdRelationshipsHashTypeResponses];

export type GetHashlistsByIdHashesData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/hashes';
};

export type GetHashlistsByIdHashesErrors = {
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

export type GetHashlistsByIdHashesError = GetHashlistsByIdHashesErrors[keyof GetHashlistsByIdHashesErrors];

export type GetHashlistsByIdHashesResponses = {
  /**
   * successful operation
   */
  200: HashlistRelationHashesGetResponse;
};

export type GetHashlistsByIdHashesResponse = GetHashlistsByIdHashesResponses[keyof GetHashlistsByIdHashesResponses];

export type DeleteHashlistsByIdRelationshipsHashesData = {
  body: HashlistRelationHashes;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/hashes';
};

export type DeleteHashlistsByIdRelationshipsHashesErrors = {
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

export type DeleteHashlistsByIdRelationshipsHashesError =
  DeleteHashlistsByIdRelationshipsHashesErrors[keyof DeleteHashlistsByIdRelationshipsHashesErrors];

export type DeleteHashlistsByIdRelationshipsHashesResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteHashlistsByIdRelationshipsHashesResponse =
  DeleteHashlistsByIdRelationshipsHashesResponses[keyof DeleteHashlistsByIdRelationshipsHashesResponses];

export type GetHashlistsByIdRelationshipsHashesData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/hashes';
};

export type GetHashlistsByIdRelationshipsHashesErrors = {
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

export type GetHashlistsByIdRelationshipsHashesError =
  GetHashlistsByIdRelationshipsHashesErrors[keyof GetHashlistsByIdRelationshipsHashesErrors];

export type GetHashlistsByIdRelationshipsHashesResponses = {
  /**
   * successful operation
   */
  200: HashlistResponse;
};

export type GetHashlistsByIdRelationshipsHashesResponse =
  GetHashlistsByIdRelationshipsHashesResponses[keyof GetHashlistsByIdRelationshipsHashesResponses];

export type PatchHashlistsByIdRelationshipsHashesData = {
  body: HashlistRelationHashes;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/hashes';
};

export type PatchHashlistsByIdRelationshipsHashesErrors = {
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

export type PatchHashlistsByIdRelationshipsHashesError =
  PatchHashlistsByIdRelationshipsHashesErrors[keyof PatchHashlistsByIdRelationshipsHashesErrors];

export type PatchHashlistsByIdRelationshipsHashesResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchHashlistsByIdRelationshipsHashesResponse =
  PatchHashlistsByIdRelationshipsHashesResponses[keyof PatchHashlistsByIdRelationshipsHashesResponses];

export type PostHashlistsByIdRelationshipsHashesData = {
  body: HashlistRelationHashes;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/hashes';
};

export type PostHashlistsByIdRelationshipsHashesErrors = {
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

export type PostHashlistsByIdRelationshipsHashesError =
  PostHashlistsByIdRelationshipsHashesErrors[keyof PostHashlistsByIdRelationshipsHashesErrors];

export type PostHashlistsByIdRelationshipsHashesResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostHashlistsByIdRelationshipsHashesResponse =
  PostHashlistsByIdRelationshipsHashesResponses[keyof PostHashlistsByIdRelationshipsHashesResponses];

export type GetHashlistsByIdHashlistsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/hashlists';
};

export type GetHashlistsByIdHashlistsErrors = {
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

export type GetHashlistsByIdHashlistsError = GetHashlistsByIdHashlistsErrors[keyof GetHashlistsByIdHashlistsErrors];

export type GetHashlistsByIdHashlistsResponses = {
  /**
   * successful operation
   */
  200: HashlistRelationHashlistsGetResponse;
};

export type GetHashlistsByIdHashlistsResponse =
  GetHashlistsByIdHashlistsResponses[keyof GetHashlistsByIdHashlistsResponses];

export type DeleteHashlistsByIdRelationshipsHashlistsData = {
  body: HashlistRelationHashlists;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/hashlists';
};

export type DeleteHashlistsByIdRelationshipsHashlistsErrors = {
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

export type DeleteHashlistsByIdRelationshipsHashlistsError =
  DeleteHashlistsByIdRelationshipsHashlistsErrors[keyof DeleteHashlistsByIdRelationshipsHashlistsErrors];

export type DeleteHashlistsByIdRelationshipsHashlistsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteHashlistsByIdRelationshipsHashlistsResponse =
  DeleteHashlistsByIdRelationshipsHashlistsResponses[keyof DeleteHashlistsByIdRelationshipsHashlistsResponses];

export type GetHashlistsByIdRelationshipsHashlistsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/hashlists';
};

export type GetHashlistsByIdRelationshipsHashlistsErrors = {
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

export type GetHashlistsByIdRelationshipsHashlistsError =
  GetHashlistsByIdRelationshipsHashlistsErrors[keyof GetHashlistsByIdRelationshipsHashlistsErrors];

export type GetHashlistsByIdRelationshipsHashlistsResponses = {
  /**
   * successful operation
   */
  200: HashlistResponse;
};

export type GetHashlistsByIdRelationshipsHashlistsResponse =
  GetHashlistsByIdRelationshipsHashlistsResponses[keyof GetHashlistsByIdRelationshipsHashlistsResponses];

export type PatchHashlistsByIdRelationshipsHashlistsData = {
  body: HashlistRelationHashlists;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/hashlists';
};

export type PatchHashlistsByIdRelationshipsHashlistsErrors = {
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

export type PatchHashlistsByIdRelationshipsHashlistsError =
  PatchHashlistsByIdRelationshipsHashlistsErrors[keyof PatchHashlistsByIdRelationshipsHashlistsErrors];

export type PatchHashlistsByIdRelationshipsHashlistsResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchHashlistsByIdRelationshipsHashlistsResponse =
  PatchHashlistsByIdRelationshipsHashlistsResponses[keyof PatchHashlistsByIdRelationshipsHashlistsResponses];

export type PostHashlistsByIdRelationshipsHashlistsData = {
  body: HashlistRelationHashlists;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/hashlists';
};

export type PostHashlistsByIdRelationshipsHashlistsErrors = {
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

export type PostHashlistsByIdRelationshipsHashlistsError =
  PostHashlistsByIdRelationshipsHashlistsErrors[keyof PostHashlistsByIdRelationshipsHashlistsErrors];

export type PostHashlistsByIdRelationshipsHashlistsResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostHashlistsByIdRelationshipsHashlistsResponse =
  PostHashlistsByIdRelationshipsHashlistsResponses[keyof PostHashlistsByIdRelationshipsHashlistsResponses];

export type GetHashlistsByIdTasksData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/tasks';
};

export type GetHashlistsByIdTasksErrors = {
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

export type GetHashlistsByIdTasksError = GetHashlistsByIdTasksErrors[keyof GetHashlistsByIdTasksErrors];

export type GetHashlistsByIdTasksResponses = {
  /**
   * successful operation
   */
  200: HashlistRelationTasksGetResponse;
};

export type GetHashlistsByIdTasksResponse = GetHashlistsByIdTasksResponses[keyof GetHashlistsByIdTasksResponses];

export type DeleteHashlistsByIdRelationshipsTasksData = {
  body: HashlistRelationTasks;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/tasks';
};

export type DeleteHashlistsByIdRelationshipsTasksErrors = {
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

export type DeleteHashlistsByIdRelationshipsTasksError =
  DeleteHashlistsByIdRelationshipsTasksErrors[keyof DeleteHashlistsByIdRelationshipsTasksErrors];

export type DeleteHashlistsByIdRelationshipsTasksResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteHashlistsByIdRelationshipsTasksResponse =
  DeleteHashlistsByIdRelationshipsTasksResponses[keyof DeleteHashlistsByIdRelationshipsTasksResponses];

export type GetHashlistsByIdRelationshipsTasksData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/tasks';
};

export type GetHashlistsByIdRelationshipsTasksErrors = {
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

export type GetHashlistsByIdRelationshipsTasksError =
  GetHashlistsByIdRelationshipsTasksErrors[keyof GetHashlistsByIdRelationshipsTasksErrors];

export type GetHashlistsByIdRelationshipsTasksResponses = {
  /**
   * successful operation
   */
  200: HashlistResponse;
};

export type GetHashlistsByIdRelationshipsTasksResponse =
  GetHashlistsByIdRelationshipsTasksResponses[keyof GetHashlistsByIdRelationshipsTasksResponses];

export type PatchHashlistsByIdRelationshipsTasksData = {
  body: HashlistRelationTasks;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/tasks';
};

export type PatchHashlistsByIdRelationshipsTasksErrors = {
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

export type PatchHashlistsByIdRelationshipsTasksError =
  PatchHashlistsByIdRelationshipsTasksErrors[keyof PatchHashlistsByIdRelationshipsTasksErrors];

export type PatchHashlistsByIdRelationshipsTasksResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchHashlistsByIdRelationshipsTasksResponse =
  PatchHashlistsByIdRelationshipsTasksResponses[keyof PatchHashlistsByIdRelationshipsTasksResponses];

export type PostHashlistsByIdRelationshipsTasksData = {
  body: HashlistRelationTasks;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashlists/{id}/relationships/tasks';
};

export type PostHashlistsByIdRelationshipsTasksErrors = {
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

export type PostHashlistsByIdRelationshipsTasksError =
  PostHashlistsByIdRelationshipsTasksErrors[keyof PostHashlistsByIdRelationshipsTasksErrors];

export type PostHashlistsByIdRelationshipsTasksResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostHashlistsByIdRelationshipsTasksResponse =
  PostHashlistsByIdRelationshipsTasksResponses[keyof PostHashlistsByIdRelationshipsTasksResponses];

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
