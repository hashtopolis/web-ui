import type { ErrorResponse } from './common';

export type UserResourceObject = {
  id: number;
  type: 'user';
  attributes: {
    name: string;
    email?: string;
    isValid?: boolean;
    isComputedPassword?: boolean;
    lastLoginDate?: number;
    registeredSince?: number;
    sessionLifetime?: number;
    globalPermissionGroupId?: number;
  };
  links: {
    self: string;
  };
  relationships: {
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
};

export type UserCreate = {
  data: {
    type: 'user';
    attributes: {
      name: string;
      email: string;
      isValid: boolean;
      sessionLifetime: number;
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

export type UserPatchMultiple = {
  data: Array<{
    id: number;
    type: 'user';
    attributes: {
      email?: string;
      globalPermissionGroupId?: number;
      isValid?: boolean;
      sessionLifetime?: number;
    };
  }>;
};

export type UserDeleteMultiple = {
  data: Array<{
    id: number;
    type: 'user';
  }>;
};

export type UserResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: number;
    type: 'user';
    attributes: {
      name: string;
      email?: string;
      isValid?: boolean;
      isComputedPassword?: boolean;
      lastLoginDate?: number;
      registeredSince?: number;
      sessionLifetime?: number;
      globalPermissionGroupId?: number;
    };
    links: {
      self: string;
    };
    relationships: {
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
  links: {
    self: string;
  };
  data: {
    id: number;
    type: 'user';
    attributes: {
      name: string;
      email?: string;
      isValid?: boolean;
      isComputedPassword?: boolean;
      lastLoginDate?: number;
      registeredSince?: number;
      sessionLifetime?: number;
      globalPermissionGroupId?: number;
    };
    links: {
      self: string;
    };
    relationships: {
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

export type UserListResponse = {
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
    type: 'user';
    attributes: {
      name: string;
      email?: string;
      isValid?: boolean;
      isComputedPassword?: boolean;
      lastLoginDate?: number;
      registeredSince?: number;
      sessionLifetime?: number;
      globalPermissionGroupId?: number;
    };
    links: {
      self: string;
    };
    relationships: {
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
  }>;
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

export type UserCountResponse = {
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

export type UserRelationGlobalPermissionGroup = {
  data: {
    type: 'globalPermissionGroup';
    id: number;
  };
};

export type UserRelationGlobalPermissionGroupGetResponse = {
  data: {
    type: 'globalPermissionGroup';
    id: number;
  };
};

export type UserRelationAccessGroups = {
  data: Array<{
    type: 'accessGroup';
    id: number;
  }>;
};

export type UserRelationAccessGroupsGetResponse = {
  data: Array<{
    type: 'accessGroup';
    id: number;
  }>;
};

export type DeleteUsersData = {
  body: UserDeleteMultiple;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type DeleteUsersError = DeleteUsersErrors[keyof DeleteUsersErrors];

export type DeleteUsersResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteUsersResponse = DeleteUsersResponses[keyof DeleteUsersResponses];

export type GetUsersData = {
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
     * Example: `{"primary":{"userId": 123}}` -> `eyJwcmltYXJ5Ijp7InVzZXJJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"userId": 123}}` -> `eyJwcmltYXJ5Ijp7InVzZXJJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[userId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: globalPermissionGroup, accessGroups
     */
    include?: Array<'globalPermissionGroup' | 'accessGroups'>;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
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
  body: UserPatchMultiple;
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

export type PatchUsersError = PatchUsersErrors[keyof PatchUsersErrors];

export type PatchUsersResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchUsersResponse = PatchUsersResponses[keyof PatchUsersResponses];

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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
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
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[userId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of accessible objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetUsersCountError = GetUsersCountErrors[keyof GetUsersCountErrors];

export type GetUsersCountResponses = {
  /**
   * successful operation
   */
  200: UserCountResponse;
};

export type GetUsersCountResponse = GetUsersCountResponses[keyof GetUsersCountResponses];

export type GetUsersByIdGlobalPermissionGroupData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}/globalPermissionGroup';
};

export type GetUsersByIdGlobalPermissionGroupErrors = {
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

export type GetUsersByIdGlobalPermissionGroupError =
  GetUsersByIdGlobalPermissionGroupErrors[keyof GetUsersByIdGlobalPermissionGroupErrors];

export type GetUsersByIdGlobalPermissionGroupResponses = {
  /**
   * successful operation
   */
  200: UserRelationGlobalPermissionGroupGetResponse;
};

export type GetUsersByIdGlobalPermissionGroupResponse =
  GetUsersByIdGlobalPermissionGroupResponses[keyof GetUsersByIdGlobalPermissionGroupResponses];

export type GetUsersByIdRelationshipsGlobalPermissionGroupData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}/relationships/globalPermissionGroup';
};

export type GetUsersByIdRelationshipsGlobalPermissionGroupErrors = {
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

export type GetUsersByIdRelationshipsGlobalPermissionGroupError =
  GetUsersByIdRelationshipsGlobalPermissionGroupErrors[keyof GetUsersByIdRelationshipsGlobalPermissionGroupErrors];

export type GetUsersByIdRelationshipsGlobalPermissionGroupResponses = {
  /**
   * successful operation
   */
  200: UserResponse;
};

export type GetUsersByIdRelationshipsGlobalPermissionGroupResponse =
  GetUsersByIdRelationshipsGlobalPermissionGroupResponses[keyof GetUsersByIdRelationshipsGlobalPermissionGroupResponses];

export type PatchUsersByIdRelationshipsGlobalPermissionGroupData = {
  body: UserRelationGlobalPermissionGroup;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}/relationships/globalPermissionGroup';
};

export type PatchUsersByIdRelationshipsGlobalPermissionGroupErrors = {
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

export type PatchUsersByIdRelationshipsGlobalPermissionGroupError =
  PatchUsersByIdRelationshipsGlobalPermissionGroupErrors[keyof PatchUsersByIdRelationshipsGlobalPermissionGroupErrors];

export type PatchUsersByIdRelationshipsGlobalPermissionGroupResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchUsersByIdRelationshipsGlobalPermissionGroupResponse =
  PatchUsersByIdRelationshipsGlobalPermissionGroupResponses[keyof PatchUsersByIdRelationshipsGlobalPermissionGroupResponses];

export type GetUsersByIdAccessGroupsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}/accessGroups';
};

export type GetUsersByIdAccessGroupsErrors = {
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

export type GetUsersByIdAccessGroupsError = GetUsersByIdAccessGroupsErrors[keyof GetUsersByIdAccessGroupsErrors];

export type GetUsersByIdAccessGroupsResponses = {
  /**
   * successful operation
   */
  200: UserRelationAccessGroupsGetResponse;
};

export type GetUsersByIdAccessGroupsResponse =
  GetUsersByIdAccessGroupsResponses[keyof GetUsersByIdAccessGroupsResponses];

export type DeleteUsersByIdRelationshipsAccessGroupsData = {
  body: UserRelationAccessGroups;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}/relationships/accessGroups';
};

export type DeleteUsersByIdRelationshipsAccessGroupsErrors = {
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

export type DeleteUsersByIdRelationshipsAccessGroupsError =
  DeleteUsersByIdRelationshipsAccessGroupsErrors[keyof DeleteUsersByIdRelationshipsAccessGroupsErrors];

export type DeleteUsersByIdRelationshipsAccessGroupsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteUsersByIdRelationshipsAccessGroupsResponse =
  DeleteUsersByIdRelationshipsAccessGroupsResponses[keyof DeleteUsersByIdRelationshipsAccessGroupsResponses];

export type GetUsersByIdRelationshipsAccessGroupsData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}/relationships/accessGroups';
};

export type GetUsersByIdRelationshipsAccessGroupsErrors = {
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

export type GetUsersByIdRelationshipsAccessGroupsError =
  GetUsersByIdRelationshipsAccessGroupsErrors[keyof GetUsersByIdRelationshipsAccessGroupsErrors];

export type GetUsersByIdRelationshipsAccessGroupsResponses = {
  /**
   * successful operation
   */
  200: UserResponse;
};

export type GetUsersByIdRelationshipsAccessGroupsResponse =
  GetUsersByIdRelationshipsAccessGroupsResponses[keyof GetUsersByIdRelationshipsAccessGroupsResponses];

export type PatchUsersByIdRelationshipsAccessGroupsData = {
  body: UserRelationAccessGroups;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}/relationships/accessGroups';
};

export type PatchUsersByIdRelationshipsAccessGroupsErrors = {
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

export type PatchUsersByIdRelationshipsAccessGroupsError =
  PatchUsersByIdRelationshipsAccessGroupsErrors[keyof PatchUsersByIdRelationshipsAccessGroupsErrors];

export type PatchUsersByIdRelationshipsAccessGroupsResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchUsersByIdRelationshipsAccessGroupsResponse =
  PatchUsersByIdRelationshipsAccessGroupsResponses[keyof PatchUsersByIdRelationshipsAccessGroupsResponses];

export type PostUsersByIdRelationshipsAccessGroupsData = {
  body: UserRelationAccessGroups;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/users/{id}/relationships/accessGroups';
};

export type PostUsersByIdRelationshipsAccessGroupsErrors = {
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

export type PostUsersByIdRelationshipsAccessGroupsError =
  PostUsersByIdRelationshipsAccessGroupsErrors[keyof PostUsersByIdRelationshipsAccessGroupsErrors];

export type PostUsersByIdRelationshipsAccessGroupsResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostUsersByIdRelationshipsAccessGroupsResponse =
  PostUsersByIdRelationshipsAccessGroupsResponses[keyof PostUsersByIdRelationshipsAccessGroupsResponses];

export type DeleteUsersByIdData = {
  body?: never;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
     * Relationships to include in the response, comma seperated. Possible options: globalPermissionGroup, accessGroups
     */
    include?: Array<'globalPermissionGroup' | 'accessGroups'>;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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

export type PatchUsersByIdError = PatchUsersByIdErrors[keyof PatchUsersByIdErrors];

export type PatchUsersByIdResponses = {
  /**
   * successful operation
   */
  200: UserPostPatchResponse;
};

export type PatchUsersByIdResponse = PatchUsersByIdResponses[keyof PatchUsersByIdResponses];
