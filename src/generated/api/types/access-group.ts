import type { ErrorResponse, NotFoundResponse } from './common';

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

export type AccessGroupResponse = {
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
    type: 'accessGroup';
    attributes: {
      groupName: string;
    };
  };
  relationships?: {
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
  included?: Array<
    | {
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
  data: {
    id: number;
    type: 'accessGroup';
    attributes: {
      groupName: string;
    };
  };
};

export type AccessGroupListResponse = {
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
    type: 'accessGroup';
    attributes: {
      groupName: string;
    };
  }>;
  relationships?: {
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
  included?: Array<
    | {
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

export type AccessGroupRelationAgentMembers = {
  data: Array<{
    type: 'agentMembers';
    id: number;
  }>;
};

export type AccessGroupRelationAgentMembersGetResponse = {
  data: Array<{
    type: 'agentMembers';
    id: number;
  }>;
};

export type DeleteAccessgroupsData = {
  body?: never;
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
};

export type DeleteAccessgroupsError = DeleteAccessgroupsErrors[keyof DeleteAccessgroupsErrors];

export type DeleteAccessgroupsResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetAccessgroupsData = {
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
  body?: never;
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
};

export type PatchAccessgroupsError = PatchAccessgroupsErrors[keyof PatchAccessgroupsErrors];

export type PatchAccessgroupsResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

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
};

export type GetAccessgroupsCountError = GetAccessgroupsCountErrors[keyof GetAccessgroupsCountErrors];

export type GetAccessgroupsCountResponses = {
  /**
   * successful operation
   */
  200: AccessGroupListResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
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
  body: {
    [key: string]: unknown;
  };
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
   * Not Found
   */
  404: NotFoundResponse;
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
  body: {
    [key: string]: unknown;
  };
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
   * Not Found
   */
  404: NotFoundResponse;
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
     * Items to include. Comma seperated
     */
    include?: string;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
};

export type PatchAccessgroupsByIdError = PatchAccessgroupsByIdErrors[keyof PatchAccessgroupsByIdErrors];

export type PatchAccessgroupsByIdResponses = {
  /**
   * successful operation
   */
  200: AccessGroupPostPatchResponse;
};

export type PatchAccessgroupsByIdResponse = PatchAccessgroupsByIdResponses[keyof PatchAccessgroupsByIdResponses];
