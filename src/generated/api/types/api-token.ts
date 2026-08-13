import type { ErrorResponse } from './common';

export type ApiTokenCreate = {
  data: {
    type: 'apiToken';
    attributes: {
      scopes: Array<number>;
      startValid: number;
      endValid: number;
      userId?: string | null;
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

export type ApiTokenPatchMultiple = {
  data: Array<{
    id: string;
    type: 'apiToken';
    attributes: {
      isRevoked?: boolean;
    };
  }>;
};

export type ApiTokenDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'apiToken';
  }>;
};

export type ApiTokenResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'apiToken';
    attributes: {
      startValid: number;
      endValid: number;
      userId: string | null;
      isRevoked: boolean;
      token?: string;
    };
    links: {
      self: string;
    };
    relationships: {
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: string;
        } | null;
      };
    };
  };
  included?: Array<{
    id: string;
    type: 'user';
    attributes: {
      name: string;
      email: string;
      isValid: boolean;
      isComputedPassword: boolean;
      lastLoginDate: number;
      registeredSince: number;
      sessionLifetime: number;
      globalPermissionGroupId: string;
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
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'apiToken';
    attributes: {
      startValid: number;
      endValid: number;
      userId: string | null;
      isRevoked: boolean;
      token?: string;
    };
    links: {
      self: string;
    };
    relationships: {
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: string;
        } | null;
      };
    };
  };
  included?: Array<{
    id: string;
    type: 'user';
    attributes: {
      name: string;
      email: string;
      isValid: boolean;
      isComputedPassword: boolean;
      lastLoginDate: number;
      registeredSince: number;
      sessionLifetime: number;
      globalPermissionGroupId: string;
      yubikey: string;
      otp1: string;
      otp2: string;
      otp3: string;
      otp4: string;
    };
  }>;
};

export type ApiTokenListResponse = {
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
    type: 'apiToken';
    attributes: {
      startValid: number;
      endValid: number;
      userId: string | null;
      isRevoked: boolean;
      token?: string;
    };
    links: {
      self: string;
    };
    relationships: {
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: string;
        } | null;
      };
    };
  }>;
  included?: Array<{
    id: string;
    type: 'user';
    attributes: {
      name: string;
      email: string;
      isValid: boolean;
      isComputedPassword: boolean;
      lastLoginDate: number;
      registeredSince: number;
      sessionLifetime: number;
      globalPermissionGroupId: string;
      yubikey: string;
      otp1: string;
      otp2: string;
      otp3: string;
      otp4: string;
    };
  }>;
};

export type ApiTokenCountResponse = {
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

export type ApiTokenRelationUser = {
  data: {
    type: 'user';
    id: string;
  };
};

export type ApiTokenRelationUserGetResponse = {
  data: {
    type: 'user';
    id: string;
  };
};

export type DeleteApiTokensData = {
  body: ApiTokenDeleteMultiple;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type DeleteApiTokensError = DeleteApiTokensErrors[keyof DeleteApiTokensErrors];

export type DeleteApiTokensResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteApiTokensResponse = DeleteApiTokensResponses[keyof DeleteApiTokensResponses];

export type GetApiTokensData = {
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
     * Example: `{"primary":{"jwtApiKeyId": 123}}` -> `eyJwcmltYXJ5Ijp7Imp3dEFwaUtleUlkIjogMTIzfX0=`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"jwtApiKeyId": 123}}` -> `eyJwcmltYXJ5Ijp7Imp3dEFwaUtleUlkIjogMTIzfX0=`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[jwtApiKeyId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: user
     */
    include?: Array<'user'>;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
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
  body: ApiTokenPatchMultiple;
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

export type PatchApiTokensError = PatchApiTokensErrors[keyof PatchApiTokensErrors];

export type PatchApiTokensResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchApiTokensResponse = PatchApiTokensResponses[keyof PatchApiTokensResponses];

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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
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
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[jwtApiKeyId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetApiTokensCountError = GetApiTokensCountErrors[keyof GetApiTokensCountErrors];

export type GetApiTokensCountResponses = {
  /**
   * successful operation
   */
  200: ApiTokenCountResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
  body?: never;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
     * Relationships to include in the response, comma seperated. Possible options: user
     */
    include?: Array<'user'>;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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

export type PatchApiTokensByIdError = PatchApiTokensByIdErrors[keyof PatchApiTokensByIdErrors];

export type PatchApiTokensByIdResponses = {
  /**
   * successful operation
   */
  200: ApiTokenPostPatchResponse;
};

export type PatchApiTokensByIdResponse = PatchApiTokensByIdResponses[keyof PatchApiTokensByIdResponses];
