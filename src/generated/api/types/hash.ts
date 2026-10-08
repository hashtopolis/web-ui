import type { ErrorResponse } from './common';

export type HashResourceObject = {
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
  links: {
    self: string;
  };
  relationships: {
    chunk: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'chunk';
        id: number;
      } | null;
    };
    hashlist: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'hashlist';
        id: number;
      } | null;
    };
  };
};

export type HashResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
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
    links: {
      self: string;
    };
    relationships: {
      chunk: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'chunk';
          id: number;
        } | null;
      };
      hashlist: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'hashlist';
          id: number;
        } | null;
      };
    };
  };
  included?: Array<
    | {
        id: number;
        type: 'chunk';
        attributes: {
          taskId: number;
          skip: number;
          length: number;
          agentId: number | null;
          dispatchTime: number;
          solveTime: number;
          checkpoint: number;
          progress: number;
          state: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
          cracked: number;
          speed: number;
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
  >;
};

export type HashListResponse = {
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
    links: {
      self: string;
    };
    relationships: {
      chunk: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'chunk';
          id: number;
        } | null;
      };
      hashlist: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'hashlist';
          id: number;
        } | null;
      };
    };
  }>;
  included?: Array<
    | {
        id: number;
        type: 'chunk';
        attributes: {
          taskId: number;
          skip: number;
          length: number;
          agentId: number | null;
          dispatchTime: number;
          solveTime: number;
          checkpoint: number;
          progress: number;
          state: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
          cracked: number;
          speed: number;
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
  >;
};

export type HashCountResponse = {
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

export type HashRelationChunk = {
  data: {
    type: 'chunk';
    id: number;
  };
};

export type HashRelationChunkGetResponse = {
  data: {
    type: 'chunk';
    id: number;
  };
};

export type HashRelationHashlist = {
  data: {
    type: 'hashlist';
    id: number;
  };
};

export type HashRelationHashlistGetResponse = {
  data: {
    type: 'hashlist';
    id: number;
  };
};

export type GetHashesData = {
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
     * Example: `{"primary":{"hashId": 123}}` -> `eyJwcmltYXJ5Ijp7Imhhc2hJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"hashId": 123}}` -> `eyJwcmltYXJ5Ijp7Imhhc2hJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[hashId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: chunk, hashlist
     */
    include?: Array<'chunk' | 'hashlist'>;
  };
  url: '/api/v2/ui/hashes';
};

export type GetHashesErrors = {
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

export type GetHashesError = GetHashesErrors[keyof GetHashesErrors];

export type GetHashesResponses = {
  /**
   * successful operation
   */
  200: HashListResponse;
};

export type GetHashesResponse = GetHashesResponses[keyof GetHashesResponses];

export type GetHashesCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[hashId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of accessible objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/hashes/count';
};

export type GetHashesCountErrors = {
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

export type GetHashesCountError = GetHashesCountErrors[keyof GetHashesCountErrors];

export type GetHashesCountResponses = {
  /**
   * successful operation
   */
  200: HashCountResponse;
};

export type GetHashesCountResponse = GetHashesCountResponses[keyof GetHashesCountResponses];

export type GetHashesByIdChunkData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashes/{id}/chunk';
};

export type GetHashesByIdChunkErrors = {
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

export type GetHashesByIdChunkError = GetHashesByIdChunkErrors[keyof GetHashesByIdChunkErrors];

export type GetHashesByIdChunkResponses = {
  /**
   * successful operation
   */
  200: HashRelationChunkGetResponse;
};

export type GetHashesByIdChunkResponse = GetHashesByIdChunkResponses[keyof GetHashesByIdChunkResponses];

export type GetHashesByIdRelationshipsChunkData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashes/{id}/relationships/chunk';
};

export type GetHashesByIdRelationshipsChunkErrors = {
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

export type GetHashesByIdRelationshipsChunkError =
  GetHashesByIdRelationshipsChunkErrors[keyof GetHashesByIdRelationshipsChunkErrors];

export type GetHashesByIdRelationshipsChunkResponses = {
  /**
   * successful operation
   */
  200: HashResponse;
};

export type GetHashesByIdRelationshipsChunkResponse =
  GetHashesByIdRelationshipsChunkResponses[keyof GetHashesByIdRelationshipsChunkResponses];

export type PatchHashesByIdRelationshipsChunkData = {
  body: HashRelationChunk;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashes/{id}/relationships/chunk';
};

export type PatchHashesByIdRelationshipsChunkErrors = {
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

export type PatchHashesByIdRelationshipsChunkError =
  PatchHashesByIdRelationshipsChunkErrors[keyof PatchHashesByIdRelationshipsChunkErrors];

export type PatchHashesByIdRelationshipsChunkResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchHashesByIdRelationshipsChunkResponse =
  PatchHashesByIdRelationshipsChunkResponses[keyof PatchHashesByIdRelationshipsChunkResponses];

export type GetHashesByIdHashlistData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashes/{id}/hashlist';
};

export type GetHashesByIdHashlistErrors = {
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

export type GetHashesByIdHashlistError = GetHashesByIdHashlistErrors[keyof GetHashesByIdHashlistErrors];

export type GetHashesByIdHashlistResponses = {
  /**
   * successful operation
   */
  200: HashRelationHashlistGetResponse;
};

export type GetHashesByIdHashlistResponse = GetHashesByIdHashlistResponses[keyof GetHashesByIdHashlistResponses];

export type GetHashesByIdRelationshipsHashlistData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashes/{id}/relationships/hashlist';
};

export type GetHashesByIdRelationshipsHashlistErrors = {
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

export type GetHashesByIdRelationshipsHashlistError =
  GetHashesByIdRelationshipsHashlistErrors[keyof GetHashesByIdRelationshipsHashlistErrors];

export type GetHashesByIdRelationshipsHashlistResponses = {
  /**
   * successful operation
   */
  200: HashResponse;
};

export type GetHashesByIdRelationshipsHashlistResponse =
  GetHashesByIdRelationshipsHashlistResponses[keyof GetHashesByIdRelationshipsHashlistResponses];

export type PatchHashesByIdRelationshipsHashlistData = {
  body: HashRelationHashlist;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/hashes/{id}/relationships/hashlist';
};

export type PatchHashesByIdRelationshipsHashlistErrors = {
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

export type PatchHashesByIdRelationshipsHashlistError =
  PatchHashesByIdRelationshipsHashlistErrors[keyof PatchHashesByIdRelationshipsHashlistErrors];

export type PatchHashesByIdRelationshipsHashlistResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchHashesByIdRelationshipsHashlistResponse =
  PatchHashesByIdRelationshipsHashlistResponses[keyof PatchHashesByIdRelationshipsHashlistResponses];

export type GetHashesByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options: chunk, hashlist
     */
    include?: Array<'chunk' | 'hashlist'>;
  };
  url: '/api/v2/ui/hashes/{id}';
};

export type GetHashesByIdErrors = {
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

export type GetHashesByIdError = GetHashesByIdErrors[keyof GetHashesByIdErrors];

export type GetHashesByIdResponses = {
  /**
   * successful operation
   */
  200: HashResponse;
};

export type GetHashesByIdResponse = GetHashesByIdResponses[keyof GetHashesByIdResponses];
