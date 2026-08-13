import type { ErrorResponse } from './common';

export type AccessGroupCreate = {
  data: {
    type: 'accessGroup';
    attributes: {
      groupName: string;
    };
  };
};

export type AccessGroupPatch = {
  data: {
    type: 'accessGroup';
    attributes: {
      groupName?: string;
    };
  };
};

export type AccessGroupPatchMultiple = {
  data: Array<{
    id: string;
    type: 'accessGroup';
    attributes: {
      groupName?: string;
    };
  }>;
};

export type AccessGroupDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'accessGroup';
  }>;
};

export type AccessGroupResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'accessGroup';
    attributes: {
      groupName: string;
    };
    links: {
      self: string;
    };
    relationships: {
      agentMembers: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agent';
          id: string;
        }>;
      };
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
  included?: Array<
    | {
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
      }
    | {
        id: string;
        type: 'agent';
        attributes: {
          agentName: string;
          uid: string;
          os: 0 | 1 | 2;
          devices: string;
          cmdPars: string;
          ignoreErrors: 0 | 1 | 2;
          isActive: boolean;
          isTrusted: boolean;
          token: string;
          lastAct: string;
          lastTime: number;
          lastIp: string;
          userId: string | null;
          cpuOnly: boolean;
          clientSignature: string;
        };
      }
  >;
};

export type AccessGroupSingleResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'accessGroup';
    attributes: {
      groupName: string;
    };
    links: {
      self: string;
    };
    relationships: {
      agentMembers: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agent';
          id: string;
        }>;
      };
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
  included?: Array<
    | {
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
      }
    | {
        id: string;
        type: 'agent';
        attributes: {
          agentName: string;
          uid: string;
          os: 0 | 1 | 2;
          devices: string;
          cmdPars: string;
          ignoreErrors: 0 | 1 | 2;
          isActive: boolean;
          isTrusted: boolean;
          token: string;
          lastAct: string;
          lastTime: number;
          lastIp: string;
          userId: string | null;
          cpuOnly: boolean;
          clientSignature: string;
        };
      }
  >;
};

export type AccessGroupPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'accessGroup';
    attributes: {
      groupName: string;
    };
    links: {
      self: string;
    };
    relationships: {
      agentMembers: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agent';
          id: string;
        }>;
      };
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
  included?: Array<
    | {
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
      }
    | {
        id: string;
        type: 'agent';
        attributes: {
          agentName: string;
          uid: string;
          os: 0 | 1 | 2;
          devices: string;
          cmdPars: string;
          ignoreErrors: 0 | 1 | 2;
          isActive: boolean;
          isTrusted: boolean;
          token: string;
          lastAct: string;
          lastTime: number;
          lastIp: string;
          userId: string | null;
          cpuOnly: boolean;
          clientSignature: string;
        };
      }
  >;
};

export type AccessGroupListResponse = {
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
    type: 'accessGroup';
    attributes: {
      groupName: string;
    };
    links: {
      self: string;
    };
    relationships: {
      agentMembers: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'agent';
          id: string;
        }>;
      };
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
  included?: Array<
    | {
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
      }
    | {
        id: string;
        type: 'agent';
        attributes: {
          agentName: string;
          uid: string;
          os: 0 | 1 | 2;
          devices: string;
          cmdPars: string;
          ignoreErrors: 0 | 1 | 2;
          isActive: boolean;
          isTrusted: boolean;
          token: string;
          lastAct: string;
          lastTime: number;
          lastIp: string;
          userId: string | null;
          cpuOnly: boolean;
          clientSignature: string;
        };
      }
  >;
};

export type AccessGroupCountResponse = {
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

export type AccessGroupRelationAgentMembers = {
  data: Array<{
    type: 'agentMembers';
    id: string;
  }>;
};

export type AccessGroupRelationAgentMembersGetResponse = {
  data: Array<{
    type: 'agentMembers';
    id: string;
  }>;
};

export type DeleteAccessgroupsData = {
  body: AccessGroupDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/accessgroups';
};

export type DeleteAccessgroupsErrors = {
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

export type DeleteAccessgroupsError = DeleteAccessgroupsErrors[keyof DeleteAccessgroupsErrors];

export type DeleteAccessgroupsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAccessgroupsResponse = DeleteAccessgroupsResponses[keyof DeleteAccessgroupsResponses];

export type GetAccessgroupsData = {
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
     * Example: `{"primary":{"accessGroupId": 123}}` -> `eyJwcmltYXJ5Ijp7ImFjY2Vzc0dyb3VwSWQiOiAxMjN9fQ==`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"accessGroupId": 123}}` -> `eyJwcmltYXJ5Ijp7ImFjY2Vzc0dyb3VwSWQiOiAxMjN9fQ==`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[accessGroupId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: userMembers, agentMembers
     */
    include?: Array<'userMembers' | 'agentMembers'>;
  };
  url: '/api/v2/ui/accessgroups';
};

export type GetAccessgroupsErrors = {
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

export type GetAccessgroupsError = GetAccessgroupsErrors[keyof GetAccessgroupsErrors];

export type GetAccessgroupsResponses = {
  /**
   * successful operation
   */
  200: AccessGroupListResponse;
};

export type GetAccessgroupsResponse = GetAccessgroupsResponses[keyof GetAccessgroupsResponses];

export type PatchAccessgroupsData = {
  body: AccessGroupPatchMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/accessgroups';
};

export type PatchAccessgroupsErrors = {
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

export type PatchAccessgroupsError = PatchAccessgroupsErrors[keyof PatchAccessgroupsErrors];

export type PatchAccessgroupsResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchAccessgroupsResponse = PatchAccessgroupsResponses[keyof PatchAccessgroupsResponses];

export type PostAccessgroupsData = {
  body: AccessGroupCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/accessgroups';
};

export type PostAccessgroupsErrors = {
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

export type PostAccessgroupsError = PostAccessgroupsErrors[keyof PostAccessgroupsErrors];

export type PostAccessgroupsResponses = {
  /**
   * successful operation
   */
  201: AccessGroupPostPatchResponse;
};

export type PostAccessgroupsResponse = PostAccessgroupsResponses[keyof PostAccessgroupsResponses];

export type GetAccessgroupsCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[accessGroupId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/accessgroups/count';
};

export type GetAccessgroupsCountErrors = {
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

export type GetAccessgroupsCountError = GetAccessgroupsCountErrors[keyof GetAccessgroupsCountErrors];

export type GetAccessgroupsCountResponses = {
  /**
   * successful operation
   */
  200: AccessGroupCountResponse;
};

export type GetAccessgroupsCountResponse = GetAccessgroupsCountResponses[keyof GetAccessgroupsCountResponses];

export type GetAccessgroupsByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/{relation}';
};

export type GetAccessgroupsByIdByRelationErrors = {
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

export type GetAccessgroupsByIdByRelationError =
  GetAccessgroupsByIdByRelationErrors[keyof GetAccessgroupsByIdByRelationErrors];

export type GetAccessgroupsByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: AccessGroupRelationAgentMembersGetResponse;
};

export type GetAccessgroupsByIdByRelationResponse =
  GetAccessgroupsByIdByRelationResponses[keyof GetAccessgroupsByIdByRelationResponses];

export type DeleteAccessgroupsByIdRelationshipsByRelationData = {
  body: AccessGroupRelationAgentMembers;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/relationships/{relation}';
};

export type DeleteAccessgroupsByIdRelationshipsByRelationErrors = {
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

export type DeleteAccessgroupsByIdRelationshipsByRelationError =
  DeleteAccessgroupsByIdRelationshipsByRelationErrors[keyof DeleteAccessgroupsByIdRelationshipsByRelationErrors];

export type DeleteAccessgroupsByIdRelationshipsByRelationResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAccessgroupsByIdRelationshipsByRelationResponse =
  DeleteAccessgroupsByIdRelationshipsByRelationResponses[keyof DeleteAccessgroupsByIdRelationshipsByRelationResponses];

export type GetAccessgroupsByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/relationships/{relation}';
};

export type GetAccessgroupsByIdRelationshipsByRelationErrors = {
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

export type GetAccessgroupsByIdRelationshipsByRelationError =
  GetAccessgroupsByIdRelationshipsByRelationErrors[keyof GetAccessgroupsByIdRelationshipsByRelationErrors];

export type GetAccessgroupsByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: AccessGroupResponse;
};

export type GetAccessgroupsByIdRelationshipsByRelationResponse =
  GetAccessgroupsByIdRelationshipsByRelationResponses[keyof GetAccessgroupsByIdRelationshipsByRelationResponses];

export type PatchAccessgroupsByIdRelationshipsByRelationData = {
  body: AccessGroupRelationAgentMembers;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/relationships/{relation}';
};

export type PatchAccessgroupsByIdRelationshipsByRelationErrors = {
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

export type PatchAccessgroupsByIdRelationshipsByRelationError =
  PatchAccessgroupsByIdRelationshipsByRelationErrors[keyof PatchAccessgroupsByIdRelationshipsByRelationErrors];

export type PatchAccessgroupsByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchAccessgroupsByIdRelationshipsByRelationResponse =
  PatchAccessgroupsByIdRelationshipsByRelationResponses[keyof PatchAccessgroupsByIdRelationshipsByRelationResponses];

export type PostAccessgroupsByIdRelationshipsByRelationData = {
  body: AccessGroupRelationAgentMembers;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/relationships/{relation}';
};

export type PostAccessgroupsByIdRelationshipsByRelationErrors = {
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

export type PostAccessgroupsByIdRelationshipsByRelationError =
  PostAccessgroupsByIdRelationshipsByRelationErrors[keyof PostAccessgroupsByIdRelationshipsByRelationErrors];

export type PostAccessgroupsByIdRelationshipsByRelationResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostAccessgroupsByIdRelationshipsByRelationResponse =
  PostAccessgroupsByIdRelationshipsByRelationResponses[keyof PostAccessgroupsByIdRelationshipsByRelationResponses];

export type DeleteAccessgroupsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}';
};

export type DeleteAccessgroupsByIdErrors = {
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

export type DeleteAccessgroupsByIdError = DeleteAccessgroupsByIdErrors[keyof DeleteAccessgroupsByIdErrors];

export type DeleteAccessgroupsByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAccessgroupsByIdResponse = DeleteAccessgroupsByIdResponses[keyof DeleteAccessgroupsByIdResponses];

export type GetAccessgroupsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options: userMembers, agentMembers
     */
    include?: Array<'userMembers' | 'agentMembers'>;
  };
  url: '/api/v2/ui/accessgroups/{id}';
};

export type GetAccessgroupsByIdErrors = {
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

export type GetAccessgroupsByIdError = GetAccessgroupsByIdErrors[keyof GetAccessgroupsByIdErrors];

export type GetAccessgroupsByIdResponses = {
  /**
   * successful operation
   */
  200: AccessGroupResponse;
};

export type GetAccessgroupsByIdResponse = GetAccessgroupsByIdResponses[keyof GetAccessgroupsByIdResponses];

export type PatchAccessgroupsByIdData = {
  body: AccessGroupPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}';
};

export type PatchAccessgroupsByIdErrors = {
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

export type PatchAccessgroupsByIdError = PatchAccessgroupsByIdErrors[keyof PatchAccessgroupsByIdErrors];

export type PatchAccessgroupsByIdResponses = {
  /**
   * successful operation
   */
  200: AccessGroupPostPatchResponse;
};

export type PatchAccessgroupsByIdResponse = PatchAccessgroupsByIdResponses[keyof PatchAccessgroupsByIdResponses];
