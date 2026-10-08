import type { ErrorResponse } from './common';

export type AccessGroupResourceObject = {
  id: number;
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
        id: number;
      }>;
    };
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
    id: number;
    type: 'accessGroup';
    attributes: {
      groupName?: string;
    };
  }>;
};

export type AccessGroupDeleteMultiple = {
  data: Array<{
    id: number;
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
    id: number;
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
          id: number;
        }>;
      };
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
  included?: Array<
    | {
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
      }
    | {
        id: number;
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
          userId: number | null;
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
    id: number;
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
          id: number;
        }>;
      };
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
  included?: Array<
    | {
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
      }
    | {
        id: number;
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
          userId: number | null;
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
    id: number;
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
          id: number;
        }>;
      };
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
  included?: Array<
    | {
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
      }
    | {
        id: number;
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
          userId: number | null;
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

export type AccessGroupRelationUserMembers = {
  data: Array<{
    type: 'user';
    id: number;
  }>;
};

export type AccessGroupRelationUserMembersGetResponse = {
  data: Array<{
    type: 'user';
    id: number;
  }>;
};

export type AccessGroupRelationAgentMembers = {
  data: Array<{
    type: 'agent';
    id: number;
  }>;
};

export type AccessGroupRelationAgentMembersGetResponse = {
  data: Array<{
    type: 'agent';
    id: number;
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
     * Also report the number of accessible objects without any filter applied, as `meta.total_count`
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

export type GetAccessgroupsByIdUserMembersData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/userMembers';
};

export type GetAccessgroupsByIdUserMembersErrors = {
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

export type GetAccessgroupsByIdUserMembersError =
  GetAccessgroupsByIdUserMembersErrors[keyof GetAccessgroupsByIdUserMembersErrors];

export type GetAccessgroupsByIdUserMembersResponses = {
  /**
   * successful operation
   */
  200: AccessGroupRelationUserMembersGetResponse;
};

export type GetAccessgroupsByIdUserMembersResponse =
  GetAccessgroupsByIdUserMembersResponses[keyof GetAccessgroupsByIdUserMembersResponses];

export type DeleteAccessgroupsByIdRelationshipsUserMembersData = {
  body: AccessGroupRelationUserMembers;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/relationships/userMembers';
};

export type DeleteAccessgroupsByIdRelationshipsUserMembersErrors = {
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

export type DeleteAccessgroupsByIdRelationshipsUserMembersError =
  DeleteAccessgroupsByIdRelationshipsUserMembersErrors[keyof DeleteAccessgroupsByIdRelationshipsUserMembersErrors];

export type DeleteAccessgroupsByIdRelationshipsUserMembersResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAccessgroupsByIdRelationshipsUserMembersResponse =
  DeleteAccessgroupsByIdRelationshipsUserMembersResponses[keyof DeleteAccessgroupsByIdRelationshipsUserMembersResponses];

export type GetAccessgroupsByIdRelationshipsUserMembersData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/relationships/userMembers';
};

export type GetAccessgroupsByIdRelationshipsUserMembersErrors = {
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

export type GetAccessgroupsByIdRelationshipsUserMembersError =
  GetAccessgroupsByIdRelationshipsUserMembersErrors[keyof GetAccessgroupsByIdRelationshipsUserMembersErrors];

export type GetAccessgroupsByIdRelationshipsUserMembersResponses = {
  /**
   * successful operation
   */
  200: AccessGroupResponse;
};

export type GetAccessgroupsByIdRelationshipsUserMembersResponse =
  GetAccessgroupsByIdRelationshipsUserMembersResponses[keyof GetAccessgroupsByIdRelationshipsUserMembersResponses];

export type PatchAccessgroupsByIdRelationshipsUserMembersData = {
  body: AccessGroupRelationUserMembers;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/relationships/userMembers';
};

export type PatchAccessgroupsByIdRelationshipsUserMembersErrors = {
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

export type PatchAccessgroupsByIdRelationshipsUserMembersError =
  PatchAccessgroupsByIdRelationshipsUserMembersErrors[keyof PatchAccessgroupsByIdRelationshipsUserMembersErrors];

export type PatchAccessgroupsByIdRelationshipsUserMembersResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchAccessgroupsByIdRelationshipsUserMembersResponse =
  PatchAccessgroupsByIdRelationshipsUserMembersResponses[keyof PatchAccessgroupsByIdRelationshipsUserMembersResponses];

export type PostAccessgroupsByIdRelationshipsUserMembersData = {
  body: AccessGroupRelationUserMembers;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/relationships/userMembers';
};

export type PostAccessgroupsByIdRelationshipsUserMembersErrors = {
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

export type PostAccessgroupsByIdRelationshipsUserMembersError =
  PostAccessgroupsByIdRelationshipsUserMembersErrors[keyof PostAccessgroupsByIdRelationshipsUserMembersErrors];

export type PostAccessgroupsByIdRelationshipsUserMembersResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostAccessgroupsByIdRelationshipsUserMembersResponse =
  PostAccessgroupsByIdRelationshipsUserMembersResponses[keyof PostAccessgroupsByIdRelationshipsUserMembersResponses];

export type GetAccessgroupsByIdAgentMembersData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/agentMembers';
};

export type GetAccessgroupsByIdAgentMembersErrors = {
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

export type GetAccessgroupsByIdAgentMembersError =
  GetAccessgroupsByIdAgentMembersErrors[keyof GetAccessgroupsByIdAgentMembersErrors];

export type GetAccessgroupsByIdAgentMembersResponses = {
  /**
   * successful operation
   */
  200: AccessGroupRelationAgentMembersGetResponse;
};

export type GetAccessgroupsByIdAgentMembersResponse =
  GetAccessgroupsByIdAgentMembersResponses[keyof GetAccessgroupsByIdAgentMembersResponses];

export type DeleteAccessgroupsByIdRelationshipsAgentMembersData = {
  body: AccessGroupRelationAgentMembers;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/relationships/agentMembers';
};

export type DeleteAccessgroupsByIdRelationshipsAgentMembersErrors = {
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

export type DeleteAccessgroupsByIdRelationshipsAgentMembersError =
  DeleteAccessgroupsByIdRelationshipsAgentMembersErrors[keyof DeleteAccessgroupsByIdRelationshipsAgentMembersErrors];

export type DeleteAccessgroupsByIdRelationshipsAgentMembersResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAccessgroupsByIdRelationshipsAgentMembersResponse =
  DeleteAccessgroupsByIdRelationshipsAgentMembersResponses[keyof DeleteAccessgroupsByIdRelationshipsAgentMembersResponses];

export type GetAccessgroupsByIdRelationshipsAgentMembersData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/relationships/agentMembers';
};

export type GetAccessgroupsByIdRelationshipsAgentMembersErrors = {
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

export type GetAccessgroupsByIdRelationshipsAgentMembersError =
  GetAccessgroupsByIdRelationshipsAgentMembersErrors[keyof GetAccessgroupsByIdRelationshipsAgentMembersErrors];

export type GetAccessgroupsByIdRelationshipsAgentMembersResponses = {
  /**
   * successful operation
   */
  200: AccessGroupResponse;
};

export type GetAccessgroupsByIdRelationshipsAgentMembersResponse =
  GetAccessgroupsByIdRelationshipsAgentMembersResponses[keyof GetAccessgroupsByIdRelationshipsAgentMembersResponses];

export type PatchAccessgroupsByIdRelationshipsAgentMembersData = {
  body: AccessGroupRelationAgentMembers;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/relationships/agentMembers';
};

export type PatchAccessgroupsByIdRelationshipsAgentMembersErrors = {
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

export type PatchAccessgroupsByIdRelationshipsAgentMembersError =
  PatchAccessgroupsByIdRelationshipsAgentMembersErrors[keyof PatchAccessgroupsByIdRelationshipsAgentMembersErrors];

export type PatchAccessgroupsByIdRelationshipsAgentMembersResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchAccessgroupsByIdRelationshipsAgentMembersResponse =
  PatchAccessgroupsByIdRelationshipsAgentMembersResponses[keyof PatchAccessgroupsByIdRelationshipsAgentMembersResponses];

export type PostAccessgroupsByIdRelationshipsAgentMembersData = {
  body: AccessGroupRelationAgentMembers;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/accessgroups/{id}/relationships/agentMembers';
};

export type PostAccessgroupsByIdRelationshipsAgentMembersErrors = {
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

export type PostAccessgroupsByIdRelationshipsAgentMembersError =
  PostAccessgroupsByIdRelationshipsAgentMembersErrors[keyof PostAccessgroupsByIdRelationshipsAgentMembersErrors];

export type PostAccessgroupsByIdRelationshipsAgentMembersResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostAccessgroupsByIdRelationshipsAgentMembersResponse =
  PostAccessgroupsByIdRelationshipsAgentMembersResponses[keyof PostAccessgroupsByIdRelationshipsAgentMembersResponses];

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
