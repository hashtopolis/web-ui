import type { ErrorResponse } from './common';

export type GlobalPermissionGroupResourceObject = {
  id: number;
  type: 'globalPermissionGroup';
  attributes: {
    name: string;
    permissions: {
      [key: string]: boolean;
    };
  };
  links: {
    self: string;
  };
  relationships: {
    userMembers: {
      links: {
        self: string;
        related: string;
      };
      data?: Array<{
        type: 'user';
        id: number;
      }>;
    };
  };
};

export type GlobalPermissionGroupCreate = {
  data: {
    type: 'globalPermissionGroup';
    attributes: {
      name: string;
      permissions: {
        [key: string]: boolean;
      };
    };
  };
};

export type GlobalPermissionGroupPatch = {
  data: {
    type: 'globalPermissionGroup';
    attributes: {
      name?: string;
      permissions?: {
        [key: string]: boolean;
      };
    };
  };
};

export type GlobalPermissionGroupPatchMultiple = {
  data: Array<{
    id: number;
    type: 'globalPermissionGroup';
    attributes: {
      name?: string;
      permissions?: {
        [key: string]: boolean;
      };
    };
  }>;
};

export type GlobalPermissionGroupDeleteMultiple = {
  data: Array<{
    id: number;
    type: 'globalPermissionGroup';
  }>;
};

export type GlobalPermissionGroupResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: number;
    type: 'globalPermissionGroup';
    attributes: {
      name: string;
      permissions: {
        [key: string]: boolean;
      };
    };
    links: {
      self: string;
    };
    relationships: {
      userMembers: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'user';
          id: number;
        }>;
      };
    };
  };
  included?: Array<{
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
  }>;
};

export type GlobalPermissionGroupPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: number;
    type: 'globalPermissionGroup';
    attributes: {
      name: string;
      permissions: {
        [key: string]: boolean;
      };
    };
    links: {
      self: string;
    };
    relationships: {
      userMembers: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'user';
          id: number;
        }>;
      };
    };
  };
  included?: Array<{
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
  }>;
};

export type GlobalPermissionGroupListResponse = {
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
    type: 'globalPermissionGroup';
    attributes: {
      name: string;
      permissions: {
        [key: string]: boolean;
      };
    };
    links: {
      self: string;
    };
    relationships: {
      userMembers: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'user';
          id: number;
        }>;
      };
    };
  }>;
  included?: Array<{
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
  }>;
};

export type GlobalPermissionGroupCountResponse = {
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

export type GlobalPermissionGroupRelationUserMembers = {
  data: Array<{
    type: 'user';
    id: number;
  }>;
};

export type GlobalPermissionGroupRelationUserMembersGetResponse = {
  data: Array<{
    type: 'user';
    id: number;
  }>;
};

export type DeleteGlobalpermissiongroupsData = {
  body: GlobalPermissionGroupDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups';
};

export type DeleteGlobalpermissiongroupsErrors = {
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

export type DeleteGlobalpermissiongroupsError =
  DeleteGlobalpermissiongroupsErrors[keyof DeleteGlobalpermissiongroupsErrors];

export type DeleteGlobalpermissiongroupsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteGlobalpermissiongroupsResponse =
  DeleteGlobalpermissiongroupsResponses[keyof DeleteGlobalpermissiongroupsResponses];

export type GetGlobalpermissiongroupsData = {
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
     * Example: `{"primary":{"rightGroupId": 123}}` -> `eyJwcmltYXJ5Ijp7InJpZ2h0R3JvdXBJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"rightGroupId": 123}}` -> `eyJwcmltYXJ5Ijp7InJpZ2h0R3JvdXBJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[rightGroupId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: userMembers
     */
    include?: Array<'userMembers'>;
  };
  url: '/api/v2/ui/globalpermissiongroups';
};

export type GetGlobalpermissiongroupsErrors = {
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

export type GetGlobalpermissiongroupsError = GetGlobalpermissiongroupsErrors[keyof GetGlobalpermissiongroupsErrors];

export type GetGlobalpermissiongroupsResponses = {
  /**
   * successful operation
   */
  200: GlobalPermissionGroupListResponse;
};

export type GetGlobalpermissiongroupsResponse =
  GetGlobalpermissiongroupsResponses[keyof GetGlobalpermissiongroupsResponses];

export type PatchGlobalpermissiongroupsData = {
  body: GlobalPermissionGroupPatchMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups';
};

export type PatchGlobalpermissiongroupsErrors = {
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

export type PatchGlobalpermissiongroupsError =
  PatchGlobalpermissiongroupsErrors[keyof PatchGlobalpermissiongroupsErrors];

export type PatchGlobalpermissiongroupsResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchGlobalpermissiongroupsResponse =
  PatchGlobalpermissiongroupsResponses[keyof PatchGlobalpermissiongroupsResponses];

export type PostGlobalpermissiongroupsData = {
  body: GlobalPermissionGroupCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups';
};

export type PostGlobalpermissiongroupsErrors = {
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

export type PostGlobalpermissiongroupsError = PostGlobalpermissiongroupsErrors[keyof PostGlobalpermissiongroupsErrors];

export type PostGlobalpermissiongroupsResponses = {
  /**
   * successful operation
   */
  201: GlobalPermissionGroupPostPatchResponse;
};

export type PostGlobalpermissiongroupsResponse =
  PostGlobalpermissiongroupsResponses[keyof PostGlobalpermissiongroupsResponses];

export type GetGlobalpermissiongroupsCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[rightGroupId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of accessible objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/globalpermissiongroups/count';
};

export type GetGlobalpermissiongroupsCountErrors = {
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

export type GetGlobalpermissiongroupsCountError =
  GetGlobalpermissiongroupsCountErrors[keyof GetGlobalpermissiongroupsCountErrors];

export type GetGlobalpermissiongroupsCountResponses = {
  /**
   * successful operation
   */
  200: GlobalPermissionGroupCountResponse;
};

export type GetGlobalpermissiongroupsCountResponse =
  GetGlobalpermissiongroupsCountResponses[keyof GetGlobalpermissiongroupsCountResponses];

export type GetGlobalpermissiongroupsByIdUserMembersData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups/{id}/userMembers';
};

export type GetGlobalpermissiongroupsByIdUserMembersErrors = {
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

export type GetGlobalpermissiongroupsByIdUserMembersError =
  GetGlobalpermissiongroupsByIdUserMembersErrors[keyof GetGlobalpermissiongroupsByIdUserMembersErrors];

export type GetGlobalpermissiongroupsByIdUserMembersResponses = {
  /**
   * successful operation
   */
  200: GlobalPermissionGroupRelationUserMembersGetResponse;
};

export type GetGlobalpermissiongroupsByIdUserMembersResponse =
  GetGlobalpermissiongroupsByIdUserMembersResponses[keyof GetGlobalpermissiongroupsByIdUserMembersResponses];

export type DeleteGlobalpermissiongroupsByIdRelationshipsUserMembersData = {
  body: GlobalPermissionGroupRelationUserMembers;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups/{id}/relationships/userMembers';
};

export type DeleteGlobalpermissiongroupsByIdRelationshipsUserMembersErrors = {
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

export type DeleteGlobalpermissiongroupsByIdRelationshipsUserMembersError =
  DeleteGlobalpermissiongroupsByIdRelationshipsUserMembersErrors[keyof DeleteGlobalpermissiongroupsByIdRelationshipsUserMembersErrors];

export type DeleteGlobalpermissiongroupsByIdRelationshipsUserMembersResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteGlobalpermissiongroupsByIdRelationshipsUserMembersResponse =
  DeleteGlobalpermissiongroupsByIdRelationshipsUserMembersResponses[keyof DeleteGlobalpermissiongroupsByIdRelationshipsUserMembersResponses];

export type GetGlobalpermissiongroupsByIdRelationshipsUserMembersData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups/{id}/relationships/userMembers';
};

export type GetGlobalpermissiongroupsByIdRelationshipsUserMembersErrors = {
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

export type GetGlobalpermissiongroupsByIdRelationshipsUserMembersError =
  GetGlobalpermissiongroupsByIdRelationshipsUserMembersErrors[keyof GetGlobalpermissiongroupsByIdRelationshipsUserMembersErrors];

export type GetGlobalpermissiongroupsByIdRelationshipsUserMembersResponses = {
  /**
   * successful operation
   */
  200: GlobalPermissionGroupResponse;
};

export type GetGlobalpermissiongroupsByIdRelationshipsUserMembersResponse =
  GetGlobalpermissiongroupsByIdRelationshipsUserMembersResponses[keyof GetGlobalpermissiongroupsByIdRelationshipsUserMembersResponses];

export type PatchGlobalpermissiongroupsByIdRelationshipsUserMembersData = {
  body: GlobalPermissionGroupRelationUserMembers;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups/{id}/relationships/userMembers';
};

export type PatchGlobalpermissiongroupsByIdRelationshipsUserMembersErrors = {
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

export type PatchGlobalpermissiongroupsByIdRelationshipsUserMembersError =
  PatchGlobalpermissiongroupsByIdRelationshipsUserMembersErrors[keyof PatchGlobalpermissiongroupsByIdRelationshipsUserMembersErrors];

export type PatchGlobalpermissiongroupsByIdRelationshipsUserMembersResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchGlobalpermissiongroupsByIdRelationshipsUserMembersResponse =
  PatchGlobalpermissiongroupsByIdRelationshipsUserMembersResponses[keyof PatchGlobalpermissiongroupsByIdRelationshipsUserMembersResponses];

export type PostGlobalpermissiongroupsByIdRelationshipsUserMembersData = {
  body: GlobalPermissionGroupRelationUserMembers;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups/{id}/relationships/userMembers';
};

export type PostGlobalpermissiongroupsByIdRelationshipsUserMembersErrors = {
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

export type PostGlobalpermissiongroupsByIdRelationshipsUserMembersError =
  PostGlobalpermissiongroupsByIdRelationshipsUserMembersErrors[keyof PostGlobalpermissiongroupsByIdRelationshipsUserMembersErrors];

export type PostGlobalpermissiongroupsByIdRelationshipsUserMembersResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostGlobalpermissiongroupsByIdRelationshipsUserMembersResponse =
  PostGlobalpermissiongroupsByIdRelationshipsUserMembersResponses[keyof PostGlobalpermissiongroupsByIdRelationshipsUserMembersResponses];

export type DeleteGlobalpermissiongroupsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups/{id}';
};

export type DeleteGlobalpermissiongroupsByIdErrors = {
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

export type DeleteGlobalpermissiongroupsByIdError =
  DeleteGlobalpermissiongroupsByIdErrors[keyof DeleteGlobalpermissiongroupsByIdErrors];

export type DeleteGlobalpermissiongroupsByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteGlobalpermissiongroupsByIdResponse =
  DeleteGlobalpermissiongroupsByIdResponses[keyof DeleteGlobalpermissiongroupsByIdResponses];

export type GetGlobalpermissiongroupsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options: userMembers
     */
    include?: Array<'userMembers'>;
  };
  url: '/api/v2/ui/globalpermissiongroups/{id}';
};

export type GetGlobalpermissiongroupsByIdErrors = {
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

export type GetGlobalpermissiongroupsByIdError =
  GetGlobalpermissiongroupsByIdErrors[keyof GetGlobalpermissiongroupsByIdErrors];

export type GetGlobalpermissiongroupsByIdResponses = {
  /**
   * successful operation
   */
  200: GlobalPermissionGroupResponse;
};

export type GetGlobalpermissiongroupsByIdResponse =
  GetGlobalpermissiongroupsByIdResponses[keyof GetGlobalpermissiongroupsByIdResponses];

export type PatchGlobalpermissiongroupsByIdData = {
  body: GlobalPermissionGroupPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups/{id}';
};

export type PatchGlobalpermissiongroupsByIdErrors = {
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

export type PatchGlobalpermissiongroupsByIdError =
  PatchGlobalpermissiongroupsByIdErrors[keyof PatchGlobalpermissiongroupsByIdErrors];

export type PatchGlobalpermissiongroupsByIdResponses = {
  /**
   * successful operation
   */
  200: GlobalPermissionGroupPostPatchResponse;
};

export type PatchGlobalpermissiongroupsByIdResponse =
  PatchGlobalpermissiongroupsByIdResponses[keyof PatchGlobalpermissiongroupsByIdResponses];
