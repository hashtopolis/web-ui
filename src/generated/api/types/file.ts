import type { ErrorResponse } from './common';

export type FileCreate = {
  data: {
    type: 'file';
    attributes: {
      sourceType: string;
      sourceData: string;
      filename: string;
      isSecret: boolean;
      fileType: 0 | 1 | 2 | 100;
      accessGroupId: string;
    };
  };
};

export type FilePatch = {
  data: {
    type: 'file';
    attributes: {
      accessGroupId?: string;
      fileType?: 0 | 1 | 2 | 100;
      filename?: string;
      isSecret?: boolean;
    };
  };
};

export type FilePatchMultiple = {
  data: Array<{
    id: string;
    type: 'file';
    attributes: {
      accessGroupId?: string;
      fileType?: 0 | 1 | 2 | 100;
      filename?: string;
      isSecret?: boolean;
    };
  }>;
};

export type FileDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'file';
  }>;
};

export type FileResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
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
    };
  };
  included?: Array<{
    id: string;
    type: 'accessGroup';
    attributes: {
      groupName: string;
    };
  }>;
};

export type FileSingleResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
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
    };
  };
  included?: Array<{
    id: string;
    type: 'accessGroup';
    attributes: {
      groupName: string;
    };
  }>;
};

export type FilePostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
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
    };
  };
  included?: Array<{
    id: string;
    type: 'accessGroup';
    attributes: {
      groupName: string;
    };
  }>;
};

export type FileListResponse = {
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
    type: 'file';
    attributes: {
      filename: string;
      size: number;
      isSecret: boolean;
      fileType: 0 | 1 | 2 | 100;
      accessGroupId: string;
      lineCount: number;
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
    };
  }>;
  included?: Array<{
    id: string;
    type: 'accessGroup';
    attributes: {
      groupName: string;
    };
  }>;
};

export type FileCountResponse = {
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

export type FileRelationAccessGroup = {
  data: {
    type: 'accessGroup';
    id: string;
  };
};

export type FileRelationAccessGroupGetResponse = {
  data: {
    type: 'accessGroup';
    id: string;
  };
};

export type DeleteFilesData = {
  body: FileDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/files';
};

export type DeleteFilesErrors = {
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

export type DeleteFilesError = DeleteFilesErrors[keyof DeleteFilesErrors];

export type DeleteFilesResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteFilesResponse = DeleteFilesResponses[keyof DeleteFilesResponses];

export type GetFilesData = {
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
     * Example: `{"primary":{"fileId": 123}}` -> `eyJwcmltYXJ5Ijp7ImZpbGVJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"fileId": 123}}` -> `eyJwcmltYXJ5Ijp7ImZpbGVJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[fileId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: accessGroup
     */
    include?: Array<'accessGroup'>;
  };
  url: '/api/v2/ui/files';
};

export type GetFilesErrors = {
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

export type GetFilesError = GetFilesErrors[keyof GetFilesErrors];

export type GetFilesResponses = {
  /**
   * successful operation
   */
  200: FileListResponse;
};

export type GetFilesResponse = GetFilesResponses[keyof GetFilesResponses];

export type PatchFilesData = {
  body: FilePatchMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/files';
};

export type PatchFilesErrors = {
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

export type PatchFilesError = PatchFilesErrors[keyof PatchFilesErrors];

export type PatchFilesResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchFilesResponse = PatchFilesResponses[keyof PatchFilesResponses];

export type PostFilesData = {
  body: FileCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/files';
};

export type PostFilesErrors = {
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

export type PostFilesError = PostFilesErrors[keyof PostFilesErrors];

export type PostFilesResponses = {
  /**
   * successful operation
   */
  201: FilePostPatchResponse;
};

export type PostFilesResponse = PostFilesResponses[keyof PostFilesResponses];

export type GetFilesCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[fileId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/files/count';
};

export type GetFilesCountErrors = {
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

export type GetFilesCountError = GetFilesCountErrors[keyof GetFilesCountErrors];

export type GetFilesCountResponses = {
  /**
   * successful operation
   */
  200: FileCountResponse;
};

export type GetFilesCountResponse = GetFilesCountResponses[keyof GetFilesCountResponses];

export type GetFilesByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/files/{id}/{relation}';
};

export type GetFilesByIdByRelationErrors = {
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

export type GetFilesByIdByRelationError = GetFilesByIdByRelationErrors[keyof GetFilesByIdByRelationErrors];

export type GetFilesByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: FileRelationAccessGroupGetResponse;
};

export type GetFilesByIdByRelationResponse = GetFilesByIdByRelationResponses[keyof GetFilesByIdByRelationResponses];

export type GetFilesByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/files/{id}/relationships/{relation}';
};

export type GetFilesByIdRelationshipsByRelationErrors = {
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

export type GetFilesByIdRelationshipsByRelationError =
  GetFilesByIdRelationshipsByRelationErrors[keyof GetFilesByIdRelationshipsByRelationErrors];

export type GetFilesByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: FileResponse;
};

export type GetFilesByIdRelationshipsByRelationResponse =
  GetFilesByIdRelationshipsByRelationResponses[keyof GetFilesByIdRelationshipsByRelationResponses];

export type PatchFilesByIdRelationshipsByRelationData = {
  body: FileRelationAccessGroup;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/files/{id}/relationships/{relation}';
};

export type PatchFilesByIdRelationshipsByRelationErrors = {
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

export type PatchFilesByIdRelationshipsByRelationError =
  PatchFilesByIdRelationshipsByRelationErrors[keyof PatchFilesByIdRelationshipsByRelationErrors];

export type PatchFilesByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchFilesByIdRelationshipsByRelationResponse =
  PatchFilesByIdRelationshipsByRelationResponses[keyof PatchFilesByIdRelationshipsByRelationResponses];

export type DeleteFilesByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/files/{id}';
};

export type DeleteFilesByIdErrors = {
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

export type DeleteFilesByIdError = DeleteFilesByIdErrors[keyof DeleteFilesByIdErrors];

export type DeleteFilesByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteFilesByIdResponse = DeleteFilesByIdResponses[keyof DeleteFilesByIdResponses];

export type GetFilesByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options: accessGroup
     */
    include?: Array<'accessGroup'>;
  };
  url: '/api/v2/ui/files/{id}';
};

export type GetFilesByIdErrors = {
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

export type GetFilesByIdError = GetFilesByIdErrors[keyof GetFilesByIdErrors];

export type GetFilesByIdResponses = {
  /**
   * successful operation
   */
  200: FileResponse;
};

export type GetFilesByIdResponse = GetFilesByIdResponses[keyof GetFilesByIdResponses];

export type PatchFilesByIdData = {
  body: FilePatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/files/{id}';
};

export type PatchFilesByIdErrors = {
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

export type PatchFilesByIdError = PatchFilesByIdErrors[keyof PatchFilesByIdErrors];

export type PatchFilesByIdResponses = {
  /**
   * successful operation
   */
  200: FilePostPatchResponse;
};

export type PatchFilesByIdResponse = PatchFilesByIdResponses[keyof PatchFilesByIdResponses];
