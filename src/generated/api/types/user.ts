import type { ErrorResponse } from './common';

export type UserCreate = {
  data: {
    type: 'user';
    attributes: {
      name: string;
      email: string;
      globalPermissionGroupId: string;
    };
  };
};

export type UserPatch = {
  data: {
    type: 'user';
    attributes: {
      email?: string;
      globalPermissionGroupId?: string;
      isValid?: boolean;
      sessionLifetime?: number;
    };
  };
};

export type UserPatchMultiple = {
  data: Array<{
    id: string;
    type: 'user';
    attributes: {
      email?: string;
      globalPermissionGroupId?: string;
      isValid?: boolean;
      sessionLifetime?: number;
    };
  }>;
};

export type UserDeleteMultiple = {
  data: Array<{
    id: string;
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
          id: string;
        }>;
      };
      globalPermissionGroup: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'globalPermissionGroup';
          id: string;
        } | null;
      };
    };
  };
  included?: Array<
    | {
        id: string;
        type: 'globalPermissionGroup';
        attributes: {
          name: string;
          permissions: {
            [key: string]: boolean;
          };
        };
      }
    | {
        id: string;
        type: 'accessGroup';
        attributes: {
          groupName: string;
        };
      }
  >;
};

export type UserSingleResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
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
          id: string;
        }>;
      };
      globalPermissionGroup: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'globalPermissionGroup';
          id: string;
        } | null;
      };
    };
  };
  included?: Array<
    | {
        id: string;
        type: 'globalPermissionGroup';
        attributes: {
          name: string;
          permissions: {
            [key: string]: boolean;
          };
        };
      }
    | {
        id: string;
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
          id: string;
        }>;
      };
      globalPermissionGroup: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'globalPermissionGroup';
          id: string;
        } | null;
      };
    };
  };
  included?: Array<
    | {
        id: string;
        type: 'globalPermissionGroup';
        attributes: {
          name: string;
          permissions: {
            [key: string]: boolean;
          };
        };
      }
    | {
        id: string;
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
          id: string;
        }>;
      };
      globalPermissionGroup: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'globalPermissionGroup';
          id: string;
        } | null;
      };
    };
  }>;
  included?: Array<
    | {
        id: string;
        type: 'globalPermissionGroup';
        attributes: {
          name: string;
          permissions: {
            [key: string]: boolean;
          };
        };
      }
    | {
        id: string;
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

export type UserRelationAccessGroups = {
  data: Array<{
    type: 'accessGroups';
    id: string;
  }>;
};

export type UserRelationAccessGroupsGetResponse = {
  data: Array<{
    type: 'accessGroups';
    id: string;
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
     * Example: `{"primary":{"id": 123}}` -> `eyJwcmltYXJ5Ijp7ImlkIjogMTIzfX0=`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"id": 123}}` -> `eyJwcmltYXJ5Ijp7ImlkIjogMTIzfX0=`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[id__gt]=200`.
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
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[id__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
  body: UserRelationAccessGroups;
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
