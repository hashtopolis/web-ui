import type { ErrorResponse, NotFoundResponse } from './common';

export type HashResponse = {
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
  };
  relationships?: {
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
  included?: Array<
    | {
        id: number;
        type: 'chunk';
        attributes: {
          taskId: number;
          skip: number;
          length: number;
          agentId: number;
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
  links?: {
    self: string;
    first?: string;
    last?: string;
    next?: string | null;
    previous?: string | null;
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
      chunkId: number;
      isCracked: boolean;
      crackPos: number;
    };
  }>;
  relationships?: {
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
  included?: Array<
    | {
        id: number;
        type: 'chunk';
        attributes: {
          taskId: number;
          skip: number;
          length: number;
          agentId: number;
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
};

export type GetHashesCountError = GetHashesCountErrors[keyof GetHashesCountErrors];

export type GetHashesCountResponses = {
  /**
   * successful operation
   */
  200: HashListResponse;
};

export type GetHashesCountResponse = GetHashesCountResponses[keyof GetHashesCountResponses];

export type GetHashesByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/hashes/{id}/{relation}';
};

export type GetHashesByIdByRelationErrors = {
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

export type GetHashesByIdByRelationError = GetHashesByIdByRelationErrors[keyof GetHashesByIdByRelationErrors];

export type GetHashesByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: HashRelationHashlistGetResponse;
};

export type GetHashesByIdByRelationResponse = GetHashesByIdByRelationResponses[keyof GetHashesByIdByRelationResponses];

export type GetHashesByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/hashes/{id}/relationships/{relation}';
};

export type GetHashesByIdRelationshipsByRelationErrors = {
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

export type GetHashesByIdRelationshipsByRelationError =
  GetHashesByIdRelationshipsByRelationErrors[keyof GetHashesByIdRelationshipsByRelationErrors];

export type GetHashesByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: HashResponse;
};

export type GetHashesByIdRelationshipsByRelationResponse =
  GetHashesByIdRelationshipsByRelationResponses[keyof GetHashesByIdRelationshipsByRelationResponses];

export type PatchHashesByIdRelationshipsByRelationData = {
  body: HashRelationHashlist;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/hashes/{id}/relationships/{relation}';
};

export type PatchHashesByIdRelationshipsByRelationErrors = {
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

export type PatchHashesByIdRelationshipsByRelationError =
  PatchHashesByIdRelationshipsByRelationErrors[keyof PatchHashesByIdRelationshipsByRelationErrors];

export type PatchHashesByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchHashesByIdRelationshipsByRelationResponse =
  PatchHashesByIdRelationshipsByRelationResponses[keyof PatchHashesByIdRelationshipsByRelationResponses];

export type GetHashesByIdData = {
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
   * Not Found
   */
  404: NotFoundResponse;
};

export type GetHashesByIdError = GetHashesByIdErrors[keyof GetHashesByIdErrors];

export type GetHashesByIdResponses = {
  /**
   * successful operation
   */
  200: HashResponse;
};

export type GetHashesByIdResponse = GetHashesByIdResponses[keyof GetHashesByIdResponses];
