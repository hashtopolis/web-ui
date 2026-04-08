import type { ErrorResponse, NotFoundResponse } from './common';

export type ApiTokenCreate = {
  data: {
    type: 'apiToken';
    attributes: {
      scopes: Array<number>;
      startValid: number;
      endValid: number;
      userId: number;
      isRevoked: boolean;
    };
  };
};

export type ApiTokenPatch = {
  data: {
    type: 'apiToken';
    attributes: {
      isRevoked?: boolean;
    };
  };
};

export type ApiTokenResponse = {
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
    type: 'apiToken';
    attributes: {
      startValid: number;
      endValid: number;
      userId: number;
      isRevoked: boolean;
      token?: string;
    };
  };
  relationships?: {
    user: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'user';
        id: number;
      } | null;
    };
  };
  included?: Array<{
    id: number;
    type: 'user';
    attributes: {
      name: string;
      email: string;
      isValid: boolean;
      isComputedPassword: boolean;
      lastLoginDate: number;
      registeredSince: number;
      sessionLifetime: number;
      globalPermissionGroupId: number;
      yubikey: string;
      otp1: string;
      otp2: string;
      otp3: string;
      otp4: string;
    };
  }>;
};

export type ApiTokenPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  data: {
    id: number;
    type: 'apiToken';
    attributes: {
      startValid: number;
      endValid: number;
      userId: number;
      isRevoked: boolean;
      token?: string;
    };
  };
};

export type ApiTokenListResponse = {
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
    type: 'apiToken';
    attributes: {
      startValid: number;
      endValid: number;
      userId: number;
      isRevoked: boolean;
      token?: string;
    };
  }>;
  relationships?: {
    user: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'user';
        id: number;
      } | null;
    };
  };
  included?: Array<{
    id: number;
    type: 'user';
    attributes: {
      name: string;
      email: string;
      isValid: boolean;
      isComputedPassword: boolean;
      lastLoginDate: number;
      registeredSince: number;
      sessionLifetime: number;
      globalPermissionGroupId: number;
      yubikey: string;
      otp1: string;
      otp2: string;
      otp3: string;
      otp4: string;
    };
  }>;
};

export type ApiTokenRelationUser = {
  data: {
    type: 'user';
    id: number;
  };
};

export type ApiTokenRelationUserGetResponse = {
  data: {
    type: 'user';
    id: number;
  };
};

export type DeleteApiTokensData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/apiTokens';
};

export type DeleteApiTokensErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type DeleteApiTokensError = DeleteApiTokensErrors[keyof DeleteApiTokensErrors];

export type DeleteApiTokensResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetApiTokensData = {
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
  url: '/api/v2/ui/apiTokens';
};

export type GetApiTokensErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetApiTokensError = GetApiTokensErrors[keyof GetApiTokensErrors];

export type GetApiTokensResponses = {
  /**
   * successful operation
   */
  200: ApiTokenListResponse;
};

export type GetApiTokensResponse = GetApiTokensResponses[keyof GetApiTokensResponses];

export type PatchApiTokensData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/apiTokens';
};

export type PatchApiTokensErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PatchApiTokensError = PatchApiTokensErrors[keyof PatchApiTokensErrors];

export type PatchApiTokensResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type PostApiTokensData = {
  body: ApiTokenCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/apiTokens';
};

export type PostApiTokensErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PostApiTokensError = PostApiTokensErrors[keyof PostApiTokensErrors];

export type PostApiTokensResponses = {
  /**
   * successful operation
   */
  201: ApiTokenPostPatchResponse;
};

export type PostApiTokensResponse = PostApiTokensResponses[keyof PostApiTokensResponses];

export type GetApiTokensCountData = {
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
  url: '/api/v2/ui/apiTokens/count';
};

export type GetApiTokensCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetApiTokensCountError = GetApiTokensCountErrors[keyof GetApiTokensCountErrors];

export type GetApiTokensCountResponses = {
  /**
   * successful operation
   */
  200: ApiTokenListResponse;
};

export type GetApiTokensCountResponse = GetApiTokensCountResponses[keyof GetApiTokensCountResponses];

export type GetApiTokensByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/apiTokens/{id}/{relation}';
};

export type GetApiTokensByIdByRelationErrors = {
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

export type GetApiTokensByIdByRelationError = GetApiTokensByIdByRelationErrors[keyof GetApiTokensByIdByRelationErrors];

export type GetApiTokensByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: ApiTokenRelationUserGetResponse;
};

export type GetApiTokensByIdByRelationResponse =
  GetApiTokensByIdByRelationResponses[keyof GetApiTokensByIdByRelationResponses];

export type GetApiTokensByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/apiTokens/{id}/relationships/{relation}';
};

export type GetApiTokensByIdRelationshipsByRelationErrors = {
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

export type GetApiTokensByIdRelationshipsByRelationError =
  GetApiTokensByIdRelationshipsByRelationErrors[keyof GetApiTokensByIdRelationshipsByRelationErrors];

export type GetApiTokensByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: ApiTokenResponse;
};

export type GetApiTokensByIdRelationshipsByRelationResponse =
  GetApiTokensByIdRelationshipsByRelationResponses[keyof GetApiTokensByIdRelationshipsByRelationResponses];

export type PatchApiTokensByIdRelationshipsByRelationData = {
  body: ApiTokenRelationUser;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/apiTokens/{id}/relationships/{relation}';
};

export type PatchApiTokensByIdRelationshipsByRelationErrors = {
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

export type PatchApiTokensByIdRelationshipsByRelationError =
  PatchApiTokensByIdRelationshipsByRelationErrors[keyof PatchApiTokensByIdRelationshipsByRelationErrors];

export type PatchApiTokensByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchApiTokensByIdRelationshipsByRelationResponse =
  PatchApiTokensByIdRelationshipsByRelationResponses[keyof PatchApiTokensByIdRelationshipsByRelationResponses];

export type DeleteApiTokensByIdData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/apiTokens/{id}';
};

export type DeleteApiTokensByIdErrors = {
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

export type DeleteApiTokensByIdError = DeleteApiTokensByIdErrors[keyof DeleteApiTokensByIdErrors];

export type DeleteApiTokensByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteApiTokensByIdResponse = DeleteApiTokensByIdResponses[keyof DeleteApiTokensByIdResponses];

export type GetApiTokensByIdData = {
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
  url: '/api/v2/ui/apiTokens/{id}';
};

export type GetApiTokensByIdErrors = {
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

export type GetApiTokensByIdError = GetApiTokensByIdErrors[keyof GetApiTokensByIdErrors];

export type GetApiTokensByIdResponses = {
  /**
   * successful operation
   */
  200: ApiTokenResponse;
};

export type GetApiTokensByIdResponse = GetApiTokensByIdResponses[keyof GetApiTokensByIdResponses];

export type PatchApiTokensByIdData = {
  body: ApiTokenPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/apiTokens/{id}';
};

export type PatchApiTokensByIdErrors = {
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

export type PatchApiTokensByIdError = PatchApiTokensByIdErrors[keyof PatchApiTokensByIdErrors];

export type PatchApiTokensByIdResponses = {
  /**
   * successful operation
   */
  200: ApiTokenPostPatchResponse;
};

export type PatchApiTokensByIdResponse = PatchApiTokensByIdResponses[keyof PatchApiTokensByIdResponses];
