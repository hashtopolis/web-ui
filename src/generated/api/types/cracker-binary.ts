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
     * Relationships to include in the response, comma seperated. Possible options: crackerBinaryType, accessGroup, tasks
     */
    include?: Array<'crackerBinaryType' | 'accessGroup' | 'tasks'>;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
  body: CrackerBinaryRelationTasks;
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
     * Relationships to include in the response, comma seperated. Possible options: crackerBinaryType, accessGroup, tasks
     */
    include?: Array<'crackerBinaryType' | 'accessGroup' | 'tasks'>;
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
