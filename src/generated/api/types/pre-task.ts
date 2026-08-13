import type { ErrorResponse } from './common';

export type PreTaskCreate = {
  data: {
    type: 'preTask';
    attributes: {
      files: Array<number>;
      taskName: string;
      attackCmd: string;
      chunkTime: number;
      statusTimer: number;
      color: string;
      isSmall: boolean;
      isCpuTask: boolean;
      useNewBench: boolean;
      priority: number;
      maxAgents: number;
      isMaskImport: boolean;
      crackerBinaryTypeId: string;
    };
  };
};

export type PreTaskPatch = {
  data: {
    type: 'preTask';
    attributes: {
      attackCmd?: string;
      chunkTime?: number;
      color?: string;
      crackerBinaryTypeId?: string;
      isCpuTask?: boolean;
      isMaskImport?: boolean;
      isSmall?: boolean;
      maxAgents?: number;
      priority?: number;
      statusTimer?: number;
      taskName?: string;
      useNewBench?: boolean;
    };
  };
};

export type PreTaskPatchMultiple = {
  data: Array<{
    id: string;
    type: 'preTask';
    attributes: {
      attackCmd?: string;
      chunkTime?: number;
      color?: string;
      crackerBinaryTypeId?: string;
      isCpuTask?: boolean;
      isMaskImport?: boolean;
      isSmall?: boolean;
      maxAgents?: number;
      priority?: number;
      statusTimer?: number;
      taskName?: string;
      useNewBench?: boolean;
    };
  }>;
};

export type PreTaskDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'preTask';
  }>;
};

export type PreTaskResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'preTask';
    attributes: {
      taskName: string;
      attackCmd: string;
      chunkTime: number;
      statusTimer: number;
      color: string;
      isSmall: boolean;
      isCpuTask: boolean;
      useNewBench: boolean;
      priority: number;
      maxAgents: number;
      isMaskImport: boolean;
      crackerBinaryTypeId: string;
      auxiliaryKeyspace?: number;
    };
    links: {
      self: string;
    };
    relationships: {
      pretaskFiles: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'file';
          id: string;
        }>;
      };
    };
  };
  included?: Array<{
    id: string;
    type: 'file';
    attributes: {
      filename: string;
      size: number;
      isSecret: boolean;
      fileType: 0 | 1 | 2 | 100;
      accessGroupId: string;
      lineCount: number;
    };
  }>;
};

export type PreTaskPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'preTask';
    attributes: {
      taskName: string;
      attackCmd: string;
      chunkTime: number;
      statusTimer: number;
      color: string;
      isSmall: boolean;
      isCpuTask: boolean;
      useNewBench: boolean;
      priority: number;
      maxAgents: number;
      isMaskImport: boolean;
      crackerBinaryTypeId: string;
      auxiliaryKeyspace?: number;
    };
    links: {
      self: string;
    };
    relationships: {
      pretaskFiles: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'file';
          id: string;
        }>;
      };
    };
  };
  included?: Array<{
    id: string;
    type: 'file';
    attributes: {
      filename: string;
      size: number;
      isSecret: boolean;
      fileType: 0 | 1 | 2 | 100;
      accessGroupId: string;
      lineCount: number;
    };
  }>;
};

export type PreTaskListResponse = {
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
    type: 'preTask';
    attributes: {
      taskName: string;
      attackCmd: string;
      chunkTime: number;
      statusTimer: number;
      color: string;
      isSmall: boolean;
      isCpuTask: boolean;
      useNewBench: boolean;
      priority: number;
      maxAgents: number;
      isMaskImport: boolean;
      crackerBinaryTypeId: string;
      auxiliaryKeyspace?: number;
    };
    links: {
      self: string;
    };
    relationships: {
      pretaskFiles: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'file';
          id: string;
        }>;
      };
    };
  }>;
  included?: Array<{
    id: string;
    type: 'file';
    attributes: {
      filename: string;
      size: number;
      isSecret: boolean;
      fileType: 0 | 1 | 2 | 100;
      accessGroupId: string;
      lineCount: number;
    };
  }>;
};

export type PreTaskCountResponse = {
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

export type PreTaskRelationPretaskFiles = {
  data: Array<{
    type: 'pretaskFiles';
    id: string;
  }>;
};

export type PreTaskRelationPretaskFilesGetResponse = {
  data: Array<{
    type: 'pretaskFiles';
    id: string;
  }>;
};

export type DeletePretasksData = {
  body: PreTaskDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/pretasks';
};

export type DeletePretasksErrors = {
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

export type DeletePretasksError = DeletePretasksErrors[keyof DeletePretasksErrors];

export type DeletePretasksResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeletePretasksResponse = DeletePretasksResponses[keyof DeletePretasksResponses];

export type GetPretasksData = {
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
     * Example: `{"primary":{"pretaskId": 123}}` -> `eyJwcmltYXJ5Ijp7InByZXRhc2tJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"pretaskId": 123}}` -> `eyJwcmltYXJ5Ijp7InByZXRhc2tJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[pretaskId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: pretaskFiles
     */
    include?: Array<'pretaskFiles'>;
    /**
     * Aggregated fields to include by type (comma separated values). Possible options: pretask: auxiliaryKeyspace
     */
    aggregate?: {
      [key: string]: string;
    };
  };
  url: '/api/v2/ui/pretasks';
};

export type GetPretasksErrors = {
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

export type GetPretasksError = GetPretasksErrors[keyof GetPretasksErrors];

export type GetPretasksResponses = {
  /**
   * successful operation
   */
  200: PreTaskListResponse;
};

export type GetPretasksResponse = GetPretasksResponses[keyof GetPretasksResponses];

export type PatchPretasksData = {
  body: PreTaskPatchMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/pretasks';
};

export type PatchPretasksErrors = {
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

export type PatchPretasksError = PatchPretasksErrors[keyof PatchPretasksErrors];

export type PatchPretasksResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchPretasksResponse = PatchPretasksResponses[keyof PatchPretasksResponses];

export type PostPretasksData = {
  body: PreTaskCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/pretasks';
};

export type PostPretasksErrors = {
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

export type PostPretasksError = PostPretasksErrors[keyof PostPretasksErrors];

export type PostPretasksResponses = {
  /**
   * successful operation
   */
  201: PreTaskPostPatchResponse;
};

export type PostPretasksResponse = PostPretasksResponses[keyof PostPretasksResponses];

export type GetPretasksCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[pretaskId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/pretasks/count';
};

export type GetPretasksCountErrors = {
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

export type GetPretasksCountError = GetPretasksCountErrors[keyof GetPretasksCountErrors];

export type GetPretasksCountResponses = {
  /**
   * successful operation
   */
  200: PreTaskCountResponse;
};

export type GetPretasksCountResponse = GetPretasksCountResponses[keyof GetPretasksCountResponses];

export type GetPretasksByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/pretasks/{id}/{relation}';
};

export type GetPretasksByIdByRelationErrors = {
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

export type GetPretasksByIdByRelationError = GetPretasksByIdByRelationErrors[keyof GetPretasksByIdByRelationErrors];

export type GetPretasksByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: PreTaskRelationPretaskFilesGetResponse;
};

export type GetPretasksByIdByRelationResponse =
  GetPretasksByIdByRelationResponses[keyof GetPretasksByIdByRelationResponses];

export type DeletePretasksByIdRelationshipsByRelationData = {
  body: PreTaskRelationPretaskFiles;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/pretasks/{id}/relationships/{relation}';
};

export type DeletePretasksByIdRelationshipsByRelationErrors = {
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

export type DeletePretasksByIdRelationshipsByRelationError =
  DeletePretasksByIdRelationshipsByRelationErrors[keyof DeletePretasksByIdRelationshipsByRelationErrors];

export type DeletePretasksByIdRelationshipsByRelationResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeletePretasksByIdRelationshipsByRelationResponse =
  DeletePretasksByIdRelationshipsByRelationResponses[keyof DeletePretasksByIdRelationshipsByRelationResponses];

export type GetPretasksByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/pretasks/{id}/relationships/{relation}';
};

export type GetPretasksByIdRelationshipsByRelationErrors = {
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

export type GetPretasksByIdRelationshipsByRelationError =
  GetPretasksByIdRelationshipsByRelationErrors[keyof GetPretasksByIdRelationshipsByRelationErrors];

export type GetPretasksByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: PreTaskResponse;
};

export type GetPretasksByIdRelationshipsByRelationResponse =
  GetPretasksByIdRelationshipsByRelationResponses[keyof GetPretasksByIdRelationshipsByRelationResponses];

export type PatchPretasksByIdRelationshipsByRelationData = {
  body: PreTaskRelationPretaskFiles;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/pretasks/{id}/relationships/{relation}';
};

export type PatchPretasksByIdRelationshipsByRelationErrors = {
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

export type PatchPretasksByIdRelationshipsByRelationError =
  PatchPretasksByIdRelationshipsByRelationErrors[keyof PatchPretasksByIdRelationshipsByRelationErrors];

export type PatchPretasksByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchPretasksByIdRelationshipsByRelationResponse =
  PatchPretasksByIdRelationshipsByRelationResponses[keyof PatchPretasksByIdRelationshipsByRelationResponses];

export type PostPretasksByIdRelationshipsByRelationData = {
  body: PreTaskRelationPretaskFiles;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/pretasks/{id}/relationships/{relation}';
};

export type PostPretasksByIdRelationshipsByRelationErrors = {
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

export type PostPretasksByIdRelationshipsByRelationError =
  PostPretasksByIdRelationshipsByRelationErrors[keyof PostPretasksByIdRelationshipsByRelationErrors];

export type PostPretasksByIdRelationshipsByRelationResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostPretasksByIdRelationshipsByRelationResponse =
  PostPretasksByIdRelationshipsByRelationResponses[keyof PostPretasksByIdRelationshipsByRelationResponses];

export type DeletePretasksByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/pretasks/{id}';
};

export type DeletePretasksByIdErrors = {
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

export type DeletePretasksByIdError = DeletePretasksByIdErrors[keyof DeletePretasksByIdErrors];

export type DeletePretasksByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeletePretasksByIdResponse = DeletePretasksByIdResponses[keyof DeletePretasksByIdResponses];

export type GetPretasksByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options: pretaskFiles
     */
    include?: Array<'pretaskFiles'>;
  };
  url: '/api/v2/ui/pretasks/{id}';
};

export type GetPretasksByIdErrors = {
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

export type GetPretasksByIdError = GetPretasksByIdErrors[keyof GetPretasksByIdErrors];

export type GetPretasksByIdResponses = {
  /**
   * successful operation
   */
  200: PreTaskResponse;
};

export type GetPretasksByIdResponse = GetPretasksByIdResponses[keyof GetPretasksByIdResponses];

export type PatchPretasksByIdData = {
  body: PreTaskPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/pretasks/{id}';
};

export type PatchPretasksByIdErrors = {
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

export type PatchPretasksByIdError = PatchPretasksByIdErrors[keyof PatchPretasksByIdErrors];

export type PatchPretasksByIdResponses = {
  /**
   * successful operation
   */
  200: PreTaskPostPatchResponse;
};

export type PatchPretasksByIdResponse = PatchPretasksByIdResponses[keyof PatchPretasksByIdResponses];
