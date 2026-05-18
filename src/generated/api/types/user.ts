import type { ErrorResponse, NotFoundResponse } from './common';

export type UserCreate = {
  data: {
    type: 'user';
    attributes: {
      name: string;
      email: string;
      globalPermissionGroupId: number;
    };
  };
};

export type UserPatch = {
  data: {
    type: 'user';
    attributes: {
      email?: string;
      globalPermissionGroupId?: number;
      isValid?: boolean;
      sessionLifetime?: number;
    };
  };
};

export type UserResponse = {
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
  };
  relationships?: {
    accessGroups: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'accessGroup';
        id: number;
      }>;
    };
    globalPermissionGroup: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'globalPermissionGroup';
        id: number;
      } | null;
    };
  };
  included?: Array<
    | {
        id: number;
        type: 'globalPermissionGroup';
        attributes: {
          name: string;
          permissions: {
            [key: string]: boolean;
          };
        };
      }
    | {
        id: number;
        type: 'accessGroup';
        attributes: {
          groupName: string;
        };
      }
  >;
};

export type UserPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  data: {
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
  };
};

export type UserListResponse = {
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
  relationships?: {
    accessGroups: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'accessGroup';
        id: number;
      }>;
    };
    globalPermissionGroup: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'globalPermissionGroup';
        id: number;
      } | null;
    };
  };
  included?: Array<
    | {
        id: number;
        type: 'globalPermissionGroup';
        attributes: {
          name: string;
          permissions: {
            [key: string]: boolean;
          };
        };
      }
    | {
        id: number;
        type: 'accessGroup';
        attributes: {
          groupName: string;
        };
      }
  >;
};

export type UserRelationAccessGroups = {
  data: Array<{
    type: 'accessGroups';
    id: number;
  }>;
};

export type UserRelationAccessGroupsGetResponse = {
  data: Array<{
    type: 'accessGroups';
    id: number;
  }>;
};

export type DeleteUsersData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/users';
};

export type DeleteUsersErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type DeleteUsersError = DeleteUsersErrors[keyof DeleteUsersErrors];

export type DeleteUsersResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetUsersData = {
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
  url: '/api/v2/ui/users';
};

export type GetUsersErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetUsersError = GetUsersErrors[keyof GetUsersErrors];

export type GetUsersResponses = {
  /**
   * successful operation
   */
  200: UserListResponse;
};

export type GetUsersResponse = GetUsersResponses[keyof GetUsersResponses];

export type PatchUsersData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/users';
};

export type PatchUsersErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PatchUsersError = PatchUsersErrors[keyof PatchUsersErrors];

export type PatchUsersResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type PostUsersData = {
  body: UserCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/users';
};

export type PostUsersErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PostUsersError = PostUsersErrors[keyof PostUsersErrors];

export type PostUsersResponses = {
  /**
   * successful operation
   */
  201: UserPostPatchResponse;
};

export type PostUsersResponse = PostUsersResponses[keyof PostUsersResponses];

export type GetUsersCountData = {
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
  url: '/api/v2/ui/users/count';
};

export type GetUsersCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetUsersCountError = GetUsersCountErrors[keyof GetUsersCountErrors];

export type GetUsersCountResponses = {
  /**
   * successful operation
   */
  200: UserListResponse;
};

export type GetUsersCountResponse = GetUsersCountResponses[keyof GetUsersCountResponses];

export type GetUsersByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}/{relation}';
};

export type GetUsersByIdByRelationErrors = {
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

export type GetUsersByIdByRelationError = GetUsersByIdByRelationErrors[keyof GetUsersByIdByRelationErrors];

export type GetUsersByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: UserRelationAccessGroupsGetResponse;
};

export type GetUsersByIdByRelationResponse = GetUsersByIdByRelationResponses[keyof GetUsersByIdByRelationResponses];

export type DeleteUsersByIdRelationshipsByRelationData = {
  body: UserRelationAccessGroups;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}/relationships/{relation}';
};

export type DeleteUsersByIdRelationshipsByRelationErrors = {
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

export type DeleteUsersByIdRelationshipsByRelationError =
  DeleteUsersByIdRelationshipsByRelationErrors[keyof DeleteUsersByIdRelationshipsByRelationErrors];

export type DeleteUsersByIdRelationshipsByRelationResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteUsersByIdRelationshipsByRelationResponse =
  DeleteUsersByIdRelationshipsByRelationResponses[keyof DeleteUsersByIdRelationshipsByRelationResponses];

export type GetUsersByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}/relationships/{relation}';
};

export type GetUsersByIdRelationshipsByRelationErrors = {
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

export type GetUsersByIdRelationshipsByRelationError =
  GetUsersByIdRelationshipsByRelationErrors[keyof GetUsersByIdRelationshipsByRelationErrors];

export type GetUsersByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: UserResponse;
};

export type GetUsersByIdRelationshipsByRelationResponse =
  GetUsersByIdRelationshipsByRelationResponses[keyof GetUsersByIdRelationshipsByRelationResponses];

export type PatchUsersByIdRelationshipsByRelationData = {
  body: UserRelationAccessGroups;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}/relationships/{relation}';
};

export type PatchUsersByIdRelationshipsByRelationErrors = {
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

export type PatchUsersByIdRelationshipsByRelationError =
  PatchUsersByIdRelationshipsByRelationErrors[keyof PatchUsersByIdRelationshipsByRelationErrors];

export type PatchUsersByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchUsersByIdRelationshipsByRelationResponse =
  PatchUsersByIdRelationshipsByRelationResponses[keyof PatchUsersByIdRelationshipsByRelationResponses];

export type PostUsersByIdRelationshipsByRelationData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}/relationships/{relation}';
};

export type PostUsersByIdRelationshipsByRelationErrors = {
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

export type PostUsersByIdRelationshipsByRelationError =
  PostUsersByIdRelationshipsByRelationErrors[keyof PostUsersByIdRelationshipsByRelationErrors];

export type PostUsersByIdRelationshipsByRelationResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostUsersByIdRelationshipsByRelationResponse =
  PostUsersByIdRelationshipsByRelationResponses[keyof PostUsersByIdRelationshipsByRelationResponses];

export type DeleteUsersByIdData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}';
};

export type DeleteUsersByIdErrors = {
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

export type DeleteUsersByIdError = DeleteUsersByIdErrors[keyof DeleteUsersByIdErrors];

export type DeleteUsersByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteUsersByIdResponse = DeleteUsersByIdResponses[keyof DeleteUsersByIdResponses];

export type GetUsersByIdData = {
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
  url: '/api/v2/ui/users/{id}';
};

export type GetUsersByIdErrors = {
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

export type GetUsersByIdError = GetUsersByIdErrors[keyof GetUsersByIdErrors];

export type GetUsersByIdResponses = {
  /**
   * successful operation
   */
  200: UserResponse;
};

export type GetUsersByIdResponse = GetUsersByIdResponses[keyof GetUsersByIdResponses];

export type PatchUsersByIdData = {
  body: UserPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}';
};

export type PatchUsersByIdErrors = {
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

export type PatchUsersByIdError = PatchUsersByIdErrors[keyof PatchUsersByIdErrors];

export type PatchUsersByIdResponses = {
  /**
   * successful operation
   */
  200: UserPostPatchResponse;
};

export type PatchUsersByIdResponse = PatchUsersByIdResponses[keyof PatchUsersByIdResponses];
