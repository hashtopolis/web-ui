import type { ErrorResponse, NotFoundResponse } from './common';

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

export type GlobalPermissionGroupResponse = {
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
        type: 'globalPermissionGroup';
        attributes: {
            name: string;
            permissions: {
                [key: string]: boolean;
            };
        };
    };
    relationships?: {
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

export type GlobalPermissionGroupPostPatchResponse = {
    jsonapi: {
        version: string;
        ext?: Array<string>;
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
    };
};

export type GlobalPermissionGroupListResponse = {
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
        type: 'globalPermissionGroup';
        attributes: {
            name: string;
            permissions: {
                [key: string]: boolean;
            };
        };
    }>;
    relationships?: {
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

export type GlobalPermissionGroupRelationUserMembers = {
    data: Array<{
        type: 'userMembers';
        id: number;
    }>;
};

export type GlobalPermissionGroupRelationUserMembersGetResponse = {
    data: Array<{
        type: 'userMembers';
        id: number;
    }>;
};

export type DeleteGlobalpermissiongroupsData = {
    body?: never;
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
};

export type DeleteGlobalpermissiongroupsError = DeleteGlobalpermissiongroupsErrors[keyof DeleteGlobalpermissiongroupsErrors];

export type DeleteGlobalpermissiongroupsResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type GetGlobalpermissiongroupsData = {
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
};

export type GetGlobalpermissiongroupsError = GetGlobalpermissiongroupsErrors[keyof GetGlobalpermissiongroupsErrors];

export type GetGlobalpermissiongroupsResponses = {
    /**
     * successful operation
     */
    200: GlobalPermissionGroupListResponse;
};

export type GetGlobalpermissiongroupsResponse = GetGlobalpermissiongroupsResponses[keyof GetGlobalpermissiongroupsResponses];

export type PatchGlobalpermissiongroupsData = {
    body?: never;
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
};

export type PatchGlobalpermissiongroupsError = PatchGlobalpermissiongroupsErrors[keyof PatchGlobalpermissiongroupsErrors];

export type PatchGlobalpermissiongroupsResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

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
};

export type PostGlobalpermissiongroupsError = PostGlobalpermissiongroupsErrors[keyof PostGlobalpermissiongroupsErrors];

export type PostGlobalpermissiongroupsResponses = {
    /**
     * successful operation
     */
    201: GlobalPermissionGroupPostPatchResponse;
};

export type PostGlobalpermissiongroupsResponse = PostGlobalpermissiongroupsResponses[keyof PostGlobalpermissiongroupsResponses];

export type GetGlobalpermissiongroupsCountData = {
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
};

export type GetGlobalpermissiongroupsCountError = GetGlobalpermissiongroupsCountErrors[keyof GetGlobalpermissiongroupsCountErrors];

export type GetGlobalpermissiongroupsCountResponses = {
    /**
     * successful operation
     */
    200: GlobalPermissionGroupListResponse;
};

export type GetGlobalpermissiongroupsCountResponse = GetGlobalpermissiongroupsCountResponses[keyof GetGlobalpermissiongroupsCountResponses];

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
     * Not Found
     */
    404: NotFoundResponse;
};

export type GetGlobalpermissiongroupsByIdByRelationError = GetGlobalpermissiongroupsByIdByRelationErrors[keyof GetGlobalpermissiongroupsByIdByRelationErrors];

export type GetGlobalpermissiongroupsByIdByRelationResponses = {
    /**
     * successful operation
     */
    200: GlobalPermissionGroupRelationUserMembersGetResponse;
};

export type GetGlobalpermissiongroupsByIdByRelationResponse = GetGlobalpermissiongroupsByIdByRelationResponses[keyof GetGlobalpermissiongroupsByIdByRelationResponses];

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
     * Not Found
     */
    404: NotFoundResponse;
};

export type DeleteGlobalpermissiongroupsByIdRelationshipsByRelationError = DeleteGlobalpermissiongroupsByIdRelationshipsByRelationErrors[keyof DeleteGlobalpermissiongroupsByIdRelationshipsByRelationErrors];

export type DeleteGlobalpermissiongroupsByIdRelationshipsByRelationResponses = {
    /**
     * successfully deleted
     */
    204: void;
};

export type DeleteGlobalpermissiongroupsByIdRelationshipsByRelationResponse = DeleteGlobalpermissiongroupsByIdRelationshipsByRelationResponses[keyof DeleteGlobalpermissiongroupsByIdRelationshipsByRelationResponses];

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
     * Not Found
     */
    404: NotFoundResponse;
};

export type GetGlobalpermissiongroupsByIdRelationshipsByRelationError = GetGlobalpermissiongroupsByIdRelationshipsByRelationErrors[keyof GetGlobalpermissiongroupsByIdRelationshipsByRelationErrors];

export type GetGlobalpermissiongroupsByIdRelationshipsByRelationResponses = {
    /**
     * successful operation
     */
    200: GlobalPermissionGroupResponse;
};

export type GetGlobalpermissiongroupsByIdRelationshipsByRelationResponse = GetGlobalpermissiongroupsByIdRelationshipsByRelationResponses[keyof GetGlobalpermissiongroupsByIdRelationshipsByRelationResponses];

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
     * Not Found
     */
    404: NotFoundResponse;
};

export type PatchGlobalpermissiongroupsByIdRelationshipsByRelationError = PatchGlobalpermissiongroupsByIdRelationshipsByRelationErrors[keyof PatchGlobalpermissiongroupsByIdRelationshipsByRelationErrors];

export type PatchGlobalpermissiongroupsByIdRelationshipsByRelationResponses = {
    /**
     * Successfull operation
     */
    204: void;
};

export type PatchGlobalpermissiongroupsByIdRelationshipsByRelationResponse = PatchGlobalpermissiongroupsByIdRelationshipsByRelationResponses[keyof PatchGlobalpermissiongroupsByIdRelationshipsByRelationResponses];

export type PostGlobalpermissiongroupsByIdRelationshipsByRelationData = {
    body: {
        [key: string]: unknown;
    };
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
     * Not Found
     */
    404: NotFoundResponse;
};

export type PostGlobalpermissiongroupsByIdRelationshipsByRelationError = PostGlobalpermissiongroupsByIdRelationshipsByRelationErrors[keyof PostGlobalpermissiongroupsByIdRelationshipsByRelationErrors];

export type PostGlobalpermissiongroupsByIdRelationshipsByRelationResponses = {
    /**
     * successfully created
     */
    204: void;
};

export type PostGlobalpermissiongroupsByIdRelationshipsByRelationResponse = PostGlobalpermissiongroupsByIdRelationshipsByRelationResponses[keyof PostGlobalpermissiongroupsByIdRelationshipsByRelationResponses];

export type DeleteGlobalpermissiongroupsByIdData = {
    body: {
        [key: string]: unknown;
    };
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
     * Not Found
     */
    404: NotFoundResponse;
};

export type DeleteGlobalpermissiongroupsByIdError = DeleteGlobalpermissiongroupsByIdErrors[keyof DeleteGlobalpermissiongroupsByIdErrors];

export type DeleteGlobalpermissiongroupsByIdResponses = {
    /**
     * successfully deleted
     */
    204: void;
};

export type DeleteGlobalpermissiongroupsByIdResponse = DeleteGlobalpermissiongroupsByIdResponses[keyof DeleteGlobalpermissiongroupsByIdResponses];

export type GetGlobalpermissiongroupsByIdData = {
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
     * Not Found
     */
    404: NotFoundResponse;
};

export type GetGlobalpermissiongroupsByIdError = GetGlobalpermissiongroupsByIdErrors[keyof GetGlobalpermissiongroupsByIdErrors];

export type GetGlobalpermissiongroupsByIdResponses = {
    /**
     * successful operation
     */
    200: GlobalPermissionGroupResponse;
};

export type GetGlobalpermissiongroupsByIdResponse = GetGlobalpermissiongroupsByIdResponses[keyof GetGlobalpermissiongroupsByIdResponses];

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
     * Not Found
     */
    404: NotFoundResponse;
};

export type PatchGlobalpermissiongroupsByIdError = PatchGlobalpermissiongroupsByIdErrors[keyof PatchGlobalpermissiongroupsByIdErrors];

export type PatchGlobalpermissiongroupsByIdResponses = {
    /**
     * successful operation
     */
    200: GlobalPermissionGroupPostPatchResponse;
};

export type PatchGlobalpermissiongroupsByIdResponse = PatchGlobalpermissiongroupsByIdResponses[keyof PatchGlobalpermissiongroupsByIdResponses];
