import type { ErrorResponse } from './common';

export type CrackerBinaryCreate = {
  data: {
    type: 'crackerBinary';
    attributes: {
      /**
       * Source the 7z archive is uploaded from: inline (base64 archive data in sourceData), import (filename of a file in the import directory as sourceData) or url (http/https url in sourceData, fetched by the server). Mutually exclusive with downloadUrl.
       */
      sourceType?: 'inline' | 'import' | 'url' | null;
      /**
       * Source of the archive upload, depending on sourceType: base64 encoded archive data, filename of a file in the import directory or a http/https url to fetch the archive from.
       */
      sourceData?: string | null;
      crackerBinaryTypeId: number;
      version: string;
      /**
       * External http/https url where the agent downloads the binary archive from. The server keeps a local copy of the archive for later analysis: on creation it is downloaded from this url, and changing the url re-downloads it from the new url. The creation or change is rejected if that download fails or the archive is not a valid 7z file. Mutually exclusive with sourceType: when the archive is uploaded with sourceType, this url is set automatically to the download endpoint of this server and cannot be changed afterwards.
       */
      downloadUrl?: string | null;
      binaryName: string;
      /**
       * Access group containing this cracker binary. Required on creation; the requesting user must belong to the group. It can be changed only when the user belongs to both the current and new groups.
       */
      accessGroupId: number;
    };
  };
};

export type CrackerBinaryPatch = {
  data: {
    type: 'crackerBinary';
    attributes: {
      accessGroupId?: number;
      binaryName?: string;
      downloadUrl?: string | null;
      version?: string;
    };
  };
};

export type CrackerBinaryPatchMultiple = {
  data: Array<{
    id: number;
    type: 'crackerBinary';
    attributes: {
      accessGroupId?: number;
      binaryName?: string;
      downloadUrl?: string | null;
      version?: string;
    };
  }>;
};

export type CrackerBinaryDeleteMultiple = {
  data: Array<{
    id: number;
    type: 'crackerBinary';
  }>;
};

export type CrackerBinaryResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: number;
    type: 'crackerBinary';
    attributes: {
      crackerBinaryTypeId: number;
      version: string;
      /**
       * External http/https url where the agent downloads the binary archive from. The server keeps a local copy of the archive for later analysis: on creation it is downloaded from this url, and changing the url re-downloads it from the new url. The creation or change is rejected if that download fails or the archive is not a valid 7z file. Mutually exclusive with sourceType: when the archive is uploaded with sourceType, this url is set automatically to the download endpoint of this server and cannot be changed afterwards.
       */
      downloadUrl: string | null;
      binaryName: string;
      /**
       * Filename of the locally stored 7z archive, null when the binary is downloaded from the downloadUrl. Cannot be provided.
       */
      filename: string | null;
      /**
       * Access group containing this cracker binary. Required on creation; the requesting user must belong to the group. It can be changed only when the user belongs to both the current and new groups.
       */
      accessGroupId: number;
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
      hashtypes: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'hashType';
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
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean | null;
        };
      }
    | {
        id: number;
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
    | {
        id: number;
        type: 'hashType';
        attributes: {
          description: string;
          isSalted: boolean;
          isSlowHash: boolean;
        };
      }
  >;
};

export type CrackerBinaryPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: number;
    type: 'crackerBinary';
    attributes: {
      crackerBinaryTypeId: number;
      version: string;
      /**
       * External http/https url where the agent downloads the binary archive from. The server keeps a local copy of the archive for later analysis: on creation it is downloaded from this url, and changing the url re-downloads it from the new url. The creation or change is rejected if that download fails or the archive is not a valid 7z file. Mutually exclusive with sourceType: when the archive is uploaded with sourceType, this url is set automatically to the download endpoint of this server and cannot be changed afterwards.
       */
      downloadUrl: string | null;
      binaryName: string;
      /**
       * Filename of the locally stored 7z archive, null when the binary is downloaded from the downloadUrl. Cannot be provided.
       */
      filename: string | null;
      /**
       * Access group containing this cracker binary. Required on creation; the requesting user must belong to the group. It can be changed only when the user belongs to both the current and new groups.
       */
      accessGroupId: number;
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
      hashtypes: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'hashType';
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
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean | null;
        };
      }
    | {
        id: number;
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
    | {
        id: number;
        type: 'hashType';
        attributes: {
          description: string;
          isSalted: boolean;
          isSlowHash: boolean;
        };
      }
  >;
};

export type CrackerBinaryListResponse = {
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
    type: 'crackerBinary';
    attributes: {
      crackerBinaryTypeId: number;
      version: string;
      /**
       * External http/https url where the agent downloads the binary archive from. The server keeps a local copy of the archive for later analysis: on creation it is downloaded from this url, and changing the url re-downloads it from the new url. The creation or change is rejected if that download fails or the archive is not a valid 7z file. Mutually exclusive with sourceType: when the archive is uploaded with sourceType, this url is set automatically to the download endpoint of this server and cannot be changed afterwards.
       */
      downloadUrl: string | null;
      binaryName: string;
      /**
       * Filename of the locally stored 7z archive, null when the binary is downloaded from the downloadUrl. Cannot be provided.
       */
      filename: string | null;
      /**
       * Access group containing this cracker binary. Required on creation; the requesting user must belong to the group. It can be changed only when the user belongs to both the current and new groups.
       */
      accessGroupId: number;
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
      hashtypes: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'hashType';
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
        type: 'crackerBinaryType';
        attributes: {
          typeName: string;
          isChunkingAvailable: boolean | null;
        };
      }
    | {
        id: number;
        type: 'accessGroup';
        attributes: {
          groupName: string;
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
    | {
        id: number;
        type: 'hashType';
        attributes: {
          description: string;
          isSalted: boolean;
          isSlowHash: boolean;
        };
      }
  >;
};

export type CrackerBinaryCountResponse = {
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

export type CrackerBinaryRelationCrackerBinaryType = {
  data: {
    type: 'crackerBinaryType';
    id: number;
  };
};

export type CrackerBinaryRelationCrackerBinaryTypeGetResponse = {
  data: {
    type: 'crackerBinaryType';
    id: number;
  };
};

export type CrackerBinaryRelationAccessGroup = {
  data: {
    type: 'accessGroup';
    id: number;
  };
};

export type CrackerBinaryRelationAccessGroupGetResponse = {
  data: {
    type: 'accessGroup';
    id: number;
  };
};

export type CrackerBinaryRelationTasks = {
  data: Array<{
    type: 'task';
    id: number;
  }>;
};

export type CrackerBinaryRelationTasksGetResponse = {
  data: Array<{
    type: 'task';
    id: number;
  }>;
};

export type CrackerBinaryRelationHashtypes = {
  data: Array<{
    type: 'hashType';
    id: number;
  }>;
};

export type CrackerBinaryRelationHashtypesGetResponse = {
  data: Array<{
    type: 'hashType';
    id: number;
  }>;
};

export type DeleteCrackersData = {
  body: CrackerBinaryDeleteMultiple;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type DeleteCrackersError = DeleteCrackersErrors[keyof DeleteCrackersErrors];

export type DeleteCrackersResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteCrackersResponse = DeleteCrackersResponses[keyof DeleteCrackersResponses];

export type GetCrackersData = {
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
     * Example: `{"primary":{"crackerBinaryId": 123}}` -> `eyJwcmltYXJ5Ijp7ImNyYWNrZXJCaW5hcnlJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"crackerBinaryId": 123}}` -> `eyJwcmltYXJ5Ijp7ImNyYWNrZXJCaW5hcnlJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[crackerBinaryId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: crackerBinaryType, accessGroup, tasks, hashtypes
     */
    include?: Array<'crackerBinaryType' | 'accessGroup' | 'tasks' | 'hashtypes'>;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
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
  body: CrackerBinaryPatchMultiple;
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

export type PatchCrackersError = PatchCrackersErrors[keyof PatchCrackersErrors];

export type PatchCrackersResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchCrackersResponse = PatchCrackersResponses[keyof PatchCrackersResponses];

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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
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
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[crackerBinaryId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of accessible objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetCrackersCountError = GetCrackersCountErrors[keyof GetCrackersCountErrors];

export type GetCrackersCountResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryCountResponse;
};

export type GetCrackersCountResponse = GetCrackersCountResponses[keyof GetCrackersCountResponses];

export type GetCrackersByIdCrackerBinaryTypeData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/crackerBinaryType';
};

export type GetCrackersByIdCrackerBinaryTypeErrors = {
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

export type GetCrackersByIdCrackerBinaryTypeError =
  GetCrackersByIdCrackerBinaryTypeErrors[keyof GetCrackersByIdCrackerBinaryTypeErrors];

export type GetCrackersByIdCrackerBinaryTypeResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryRelationCrackerBinaryTypeGetResponse;
};

export type GetCrackersByIdCrackerBinaryTypeResponse =
  GetCrackersByIdCrackerBinaryTypeResponses[keyof GetCrackersByIdCrackerBinaryTypeResponses];

export type GetCrackersByIdRelationshipsCrackerBinaryTypeData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/crackerBinaryType';
};

export type GetCrackersByIdRelationshipsCrackerBinaryTypeErrors = {
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

export type GetCrackersByIdRelationshipsCrackerBinaryTypeError =
  GetCrackersByIdRelationshipsCrackerBinaryTypeErrors[keyof GetCrackersByIdRelationshipsCrackerBinaryTypeErrors];

export type GetCrackersByIdRelationshipsCrackerBinaryTypeResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryResponse;
};

export type GetCrackersByIdRelationshipsCrackerBinaryTypeResponse =
  GetCrackersByIdRelationshipsCrackerBinaryTypeResponses[keyof GetCrackersByIdRelationshipsCrackerBinaryTypeResponses];

export type PatchCrackersByIdRelationshipsCrackerBinaryTypeData = {
  body: CrackerBinaryRelationCrackerBinaryType;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/crackerBinaryType';
};

export type PatchCrackersByIdRelationshipsCrackerBinaryTypeErrors = {
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

export type PatchCrackersByIdRelationshipsCrackerBinaryTypeError =
  PatchCrackersByIdRelationshipsCrackerBinaryTypeErrors[keyof PatchCrackersByIdRelationshipsCrackerBinaryTypeErrors];

export type PatchCrackersByIdRelationshipsCrackerBinaryTypeResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchCrackersByIdRelationshipsCrackerBinaryTypeResponse =
  PatchCrackersByIdRelationshipsCrackerBinaryTypeResponses[keyof PatchCrackersByIdRelationshipsCrackerBinaryTypeResponses];

export type GetCrackersByIdAccessGroupData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/accessGroup';
};

export type GetCrackersByIdAccessGroupErrors = {
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

export type GetCrackersByIdAccessGroupError = GetCrackersByIdAccessGroupErrors[keyof GetCrackersByIdAccessGroupErrors];

export type GetCrackersByIdAccessGroupResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryRelationAccessGroupGetResponse;
};

export type GetCrackersByIdAccessGroupResponse =
  GetCrackersByIdAccessGroupResponses[keyof GetCrackersByIdAccessGroupResponses];

export type GetCrackersByIdRelationshipsAccessGroupData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/accessGroup';
};

export type GetCrackersByIdRelationshipsAccessGroupErrors = {
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

export type GetCrackersByIdRelationshipsAccessGroupError =
  GetCrackersByIdRelationshipsAccessGroupErrors[keyof GetCrackersByIdRelationshipsAccessGroupErrors];

export type GetCrackersByIdRelationshipsAccessGroupResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryResponse;
};

export type GetCrackersByIdRelationshipsAccessGroupResponse =
  GetCrackersByIdRelationshipsAccessGroupResponses[keyof GetCrackersByIdRelationshipsAccessGroupResponses];

export type PatchCrackersByIdRelationshipsAccessGroupData = {
  body: CrackerBinaryRelationAccessGroup;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/accessGroup';
};

export type PatchCrackersByIdRelationshipsAccessGroupErrors = {
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

export type PatchCrackersByIdRelationshipsAccessGroupError =
  PatchCrackersByIdRelationshipsAccessGroupErrors[keyof PatchCrackersByIdRelationshipsAccessGroupErrors];

export type PatchCrackersByIdRelationshipsAccessGroupResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchCrackersByIdRelationshipsAccessGroupResponse =
  PatchCrackersByIdRelationshipsAccessGroupResponses[keyof PatchCrackersByIdRelationshipsAccessGroupResponses];

export type GetCrackersByIdTasksData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/tasks';
};

export type GetCrackersByIdTasksErrors = {
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

export type GetCrackersByIdTasksError = GetCrackersByIdTasksErrors[keyof GetCrackersByIdTasksErrors];

export type GetCrackersByIdTasksResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryRelationTasksGetResponse;
};

export type GetCrackersByIdTasksResponse = GetCrackersByIdTasksResponses[keyof GetCrackersByIdTasksResponses];

export type DeleteCrackersByIdRelationshipsTasksData = {
  body: CrackerBinaryRelationTasks;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/tasks';
};

export type DeleteCrackersByIdRelationshipsTasksErrors = {
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

export type DeleteCrackersByIdRelationshipsTasksError =
  DeleteCrackersByIdRelationshipsTasksErrors[keyof DeleteCrackersByIdRelationshipsTasksErrors];

export type DeleteCrackersByIdRelationshipsTasksResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteCrackersByIdRelationshipsTasksResponse =
  DeleteCrackersByIdRelationshipsTasksResponses[keyof DeleteCrackersByIdRelationshipsTasksResponses];

export type GetCrackersByIdRelationshipsTasksData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/tasks';
};

export type GetCrackersByIdRelationshipsTasksErrors = {
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

export type GetCrackersByIdRelationshipsTasksError =
  GetCrackersByIdRelationshipsTasksErrors[keyof GetCrackersByIdRelationshipsTasksErrors];

export type GetCrackersByIdRelationshipsTasksResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryResponse;
};

export type GetCrackersByIdRelationshipsTasksResponse =
  GetCrackersByIdRelationshipsTasksResponses[keyof GetCrackersByIdRelationshipsTasksResponses];

export type PatchCrackersByIdRelationshipsTasksData = {
  body: CrackerBinaryRelationTasks;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/tasks';
};

export type PatchCrackersByIdRelationshipsTasksErrors = {
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

export type PatchCrackersByIdRelationshipsTasksError =
  PatchCrackersByIdRelationshipsTasksErrors[keyof PatchCrackersByIdRelationshipsTasksErrors];

export type PatchCrackersByIdRelationshipsTasksResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchCrackersByIdRelationshipsTasksResponse =
  PatchCrackersByIdRelationshipsTasksResponses[keyof PatchCrackersByIdRelationshipsTasksResponses];

export type PostCrackersByIdRelationshipsTasksData = {
  body: CrackerBinaryRelationTasks;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/tasks';
};

export type PostCrackersByIdRelationshipsTasksErrors = {
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

export type PostCrackersByIdRelationshipsTasksError =
  PostCrackersByIdRelationshipsTasksErrors[keyof PostCrackersByIdRelationshipsTasksErrors];

export type PostCrackersByIdRelationshipsTasksResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostCrackersByIdRelationshipsTasksResponse =
  PostCrackersByIdRelationshipsTasksResponses[keyof PostCrackersByIdRelationshipsTasksResponses];

export type GetCrackersByIdHashtypesData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/hashtypes';
};

export type GetCrackersByIdHashtypesErrors = {
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

export type GetCrackersByIdHashtypesError = GetCrackersByIdHashtypesErrors[keyof GetCrackersByIdHashtypesErrors];

export type GetCrackersByIdHashtypesResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryRelationHashtypesGetResponse;
};

export type GetCrackersByIdHashtypesResponse =
  GetCrackersByIdHashtypesResponses[keyof GetCrackersByIdHashtypesResponses];

export type DeleteCrackersByIdRelationshipsHashtypesData = {
  body: CrackerBinaryRelationHashtypes;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/hashtypes';
};

export type DeleteCrackersByIdRelationshipsHashtypesErrors = {
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

export type DeleteCrackersByIdRelationshipsHashtypesError =
  DeleteCrackersByIdRelationshipsHashtypesErrors[keyof DeleteCrackersByIdRelationshipsHashtypesErrors];

export type DeleteCrackersByIdRelationshipsHashtypesResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteCrackersByIdRelationshipsHashtypesResponse =
  DeleteCrackersByIdRelationshipsHashtypesResponses[keyof DeleteCrackersByIdRelationshipsHashtypesResponses];

export type GetCrackersByIdRelationshipsHashtypesData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/hashtypes';
};

export type GetCrackersByIdRelationshipsHashtypesErrors = {
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

export type GetCrackersByIdRelationshipsHashtypesError =
  GetCrackersByIdRelationshipsHashtypesErrors[keyof GetCrackersByIdRelationshipsHashtypesErrors];

export type GetCrackersByIdRelationshipsHashtypesResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryResponse;
};

export type GetCrackersByIdRelationshipsHashtypesResponse =
  GetCrackersByIdRelationshipsHashtypesResponses[keyof GetCrackersByIdRelationshipsHashtypesResponses];

export type PatchCrackersByIdRelationshipsHashtypesData = {
  body: CrackerBinaryRelationHashtypes;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/hashtypes';
};

export type PatchCrackersByIdRelationshipsHashtypesErrors = {
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

export type PatchCrackersByIdRelationshipsHashtypesError =
  PatchCrackersByIdRelationshipsHashtypesErrors[keyof PatchCrackersByIdRelationshipsHashtypesErrors];

export type PatchCrackersByIdRelationshipsHashtypesResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchCrackersByIdRelationshipsHashtypesResponse =
  PatchCrackersByIdRelationshipsHashtypesResponses[keyof PatchCrackersByIdRelationshipsHashtypesResponses];

export type PostCrackersByIdRelationshipsHashtypesData = {
  body: CrackerBinaryRelationHashtypes;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/crackers/{id}/relationships/hashtypes';
};

export type PostCrackersByIdRelationshipsHashtypesErrors = {
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

export type PostCrackersByIdRelationshipsHashtypesError =
  PostCrackersByIdRelationshipsHashtypesErrors[keyof PostCrackersByIdRelationshipsHashtypesErrors];

export type PostCrackersByIdRelationshipsHashtypesResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostCrackersByIdRelationshipsHashtypesResponse =
  PostCrackersByIdRelationshipsHashtypesResponses[keyof PostCrackersByIdRelationshipsHashtypesResponses];

export type DeleteCrackersByIdData = {
  body?: never;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
     * Relationships to include in the response, comma seperated. Possible options: crackerBinaryType, accessGroup, tasks, hashtypes
     */
    include?: Array<'crackerBinaryType' | 'accessGroup' | 'tasks' | 'hashtypes'>;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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

export type PatchCrackersByIdError = PatchCrackersByIdErrors[keyof PatchCrackersByIdErrors];

export type PatchCrackersByIdResponses = {
  /**
   * successful operation
   */
  200: CrackerBinaryPostPatchResponse;
};

export type PatchCrackersByIdResponse = PatchCrackersByIdResponses[keyof PatchCrackersByIdResponses];
