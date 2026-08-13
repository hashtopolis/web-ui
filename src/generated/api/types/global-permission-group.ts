import type { ErrorResponse } from './common';

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
    id: string;
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
    id: string;
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
    id: string;
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
          id: string;
        }>;
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

export type GlobalPermissionGroupSingleResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
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
          id: string;
        }>;
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

export type GlobalPermissionGroupPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
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
          id: string;
        }>;
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
    id: string;
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
          id: string;
        }>;
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

export type GlobalPermissionGroupCountResponse = {
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

export type GlobalPermissionGroupRelationUserMembers = {
  data: Array<{
    type: 'userMembers';
    id: string;
  }>;
};

export type GlobalPermissionGroupRelationUserMembersGetResponse = {
  data: Array<{
    type: 'userMembers';
    id: string;
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
     * Also report the number of objects without any filter applied, as `meta.total_count`
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

export type GetGlobalpermissiongroupsByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups/{id}/{relation}';
};

export type GetGlobalpermissiongroupsByIdByRelationErrors = {
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

export type GetGlobalpermissiongroupsByIdByRelationError =
  GetGlobalpermissiongroupsByIdByRelationErrors[keyof GetGlobalpermissiongroupsByIdByRelationErrors];

export type GetGlobalpermissiongroupsByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: GlobalPermissionGroupRelationUserMembersGetResponse;
};

export type GetGlobalpermissiongroupsByIdByRelationResponse =
  GetGlobalpermissiongroupsByIdByRelationResponses[keyof GetGlobalpermissiongroupsByIdByRelationResponses];

export type DeleteGlobalpermissiongroupsByIdRelationshipsByRelationData = {
  body: GlobalPermissionGroupRelationUserMembers;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups/{id}/relationships/{relation}';
};

export type DeleteGlobalpermissiongroupsByIdRelationshipsByRelationErrors = {
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

export type DeleteGlobalpermissiongroupsByIdRelationshipsByRelationError =
  DeleteGlobalpermissiongroupsByIdRelationshipsByRelationErrors[keyof DeleteGlobalpermissiongroupsByIdRelationshipsByRelationErrors];

export type DeleteGlobalpermissiongroupsByIdRelationshipsByRelationResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteGlobalpermissiongroupsByIdRelationshipsByRelationResponse =
  DeleteGlobalpermissiongroupsByIdRelationshipsByRelationResponses[keyof DeleteGlobalpermissiongroupsByIdRelationshipsByRelationResponses];

export type GetGlobalpermissiongroupsByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups/{id}/relationships/{relation}';
};

export type GetGlobalpermissiongroupsByIdRelationshipsByRelationErrors = {
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

export type GetGlobalpermissiongroupsByIdRelationshipsByRelationError =
  GetGlobalpermissiongroupsByIdRelationshipsByRelationErrors[keyof GetGlobalpermissiongroupsByIdRelationshipsByRelationErrors];

export type GetGlobalpermissiongroupsByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: GlobalPermissionGroupResponse;
};

export type GetGlobalpermissiongroupsByIdRelationshipsByRelationResponse =
  GetGlobalpermissiongroupsByIdRelationshipsByRelationResponses[keyof GetGlobalpermissiongroupsByIdRelationshipsByRelationResponses];

export type PatchGlobalpermissiongroupsByIdRelationshipsByRelationData = {
  body: GlobalPermissionGroupRelationUserMembers;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups/{id}/relationships/{relation}';
};

export type PatchGlobalpermissiongroupsByIdRelationshipsByRelationErrors = {
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

export type PatchGlobalpermissiongroupsByIdRelationshipsByRelationError =
  PatchGlobalpermissiongroupsByIdRelationshipsByRelationErrors[keyof PatchGlobalpermissiongroupsByIdRelationshipsByRelationErrors];

export type PatchGlobalpermissiongroupsByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchGlobalpermissiongroupsByIdRelationshipsByRelationResponse =
  PatchGlobalpermissiongroupsByIdRelationshipsByRelationResponses[keyof PatchGlobalpermissiongroupsByIdRelationshipsByRelationResponses];

export type PostGlobalpermissiongroupsByIdRelationshipsByRelationData = {
  body: GlobalPermissionGroupRelationUserMembers;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/globalpermissiongroups/{id}/relationships/{relation}';
};

export type PostGlobalpermissiongroupsByIdRelationshipsByRelationErrors = {
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

export type PostGlobalpermissiongroupsByIdRelationshipsByRelationError =
  PostGlobalpermissiongroupsByIdRelationshipsByRelationErrors[keyof PostGlobalpermissiongroupsByIdRelationshipsByRelationErrors];

export type PostGlobalpermissiongroupsByIdRelationshipsByRelationResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostGlobalpermissiongroupsByIdRelationshipsByRelationResponse =
  PostGlobalpermissiongroupsByIdRelationshipsByRelationResponses[keyof PostGlobalpermissiongroupsByIdRelationshipsByRelationResponses];

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
