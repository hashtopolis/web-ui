import type { ErrorResponse, NotFoundResponse } from './common';

export type SupertaskCreate = {
    data: {
        type: 'supertask';
        attributes: {
            pretasks: Array<number>;
            supertaskName: string;
        };
    };
};

export type SupertaskPatch = {
    data: {
        type: 'supertask';
        attributes: {
            supertaskName?: string;
        };
    };
};

export type SupertaskResponse = {
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
        type: 'supertask';
        attributes: {
            supertaskName: string;
        };
    };
    relationships?: {
        pretasks: {
            links: {
                self: string;
                related: string;
            };
            data?: Array<{
                type: 'preTask';
                id: number;
            }>;
        };
    };
    included?: Array<{
        id: number;
        type: 'preTask';
        attributes: {
            taskName: string;
            attackCmd: string;
            chunkTime: number;
            statusTimer: number;
            color: string;
            isSmall: boolean;
            isCpuTask: boolean;
            useNewBench: boolean;
            priority: number;
            maxAgents: number;
            isMaskImport: boolean;
            crackerBinaryTypeId: number;
        };
    }>;
};

export type SupertaskSingleResponse = {
    data: {
        id: number;
        type: 'supertask';
        attributes: {
            supertaskName: string;
        };
    };
    relationships?: {
        pretasks: {
            links: {
                self: string;
                related: string;
            };
            data?: Array<{
                type: 'preTask';
                id: number;
            }>;
        };
    };
    included?: Array<{
        id: number;
        type: 'preTask';
        attributes: {
            taskName: string;
            attackCmd: string;
            chunkTime: number;
            statusTimer: number;
            color: string;
            isSmall: boolean;
            isCpuTask: boolean;
            useNewBench: boolean;
            priority: number;
            maxAgents: number;
            isMaskImport: boolean;
            crackerBinaryTypeId: number;
        };
    }>;
};

export type SupertaskPostPatchResponse = {
    jsonapi: {
        version: string;
        ext?: Array<string>;
    };
    data: {
        id: number;
        type: 'supertask';
        attributes: {
            supertaskName: string;
        };
    };
};

export type SupertaskListResponse = {
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
        type: 'supertask';
        attributes: {
            supertaskName: string;
        };
    }>;
    relationships?: {
        pretasks: {
            links: {
                self: string;
                related: string;
            };
            data?: Array<{
                type: 'preTask';
                id: number;
            }>;
        };
    };
    included?: Array<{
        id: number;
        type: 'preTask';
        attributes: {
            taskName: string;
            attackCmd: string;
            chunkTime: number;
            statusTimer: number;
            color: string;
            isSmall: boolean;
            isCpuTask: boolean;
            useNewBench: boolean;
            priority: number;
            maxAgents: number;
            isMaskImport: boolean;
            crackerBinaryTypeId: number;
        };
    }>;
};

export type SupertaskRelationPretasks = {
    data: Array<{
        type: 'pretasks';
        id: number;
    }>;
};

export type SupertaskRelationPretasksGetResponse = {
    data: Array<{
        type: 'pretasks';
        id: number;
    }>;
};

export type DeleteSupertasksData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/ui/supertasks';
};

export type DeleteSupertasksErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type DeleteSupertasksError = DeleteSupertasksErrors[keyof DeleteSupertasksErrors];

export type DeleteSupertasksResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type GetSupertasksData = {
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
    url: '/api/v2/ui/supertasks';
};

export type GetSupertasksErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetSupertasksError = GetSupertasksErrors[keyof GetSupertasksErrors];

export type GetSupertasksResponses = {
    /**
     * successful operation
     */
    200: SupertaskListResponse;
};

export type GetSupertasksResponse = GetSupertasksResponses[keyof GetSupertasksResponses];

export type PatchSupertasksData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/ui/supertasks';
};

export type PatchSupertasksErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type PatchSupertasksError = PatchSupertasksErrors[keyof PatchSupertasksErrors];

export type PatchSupertasksResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type PostSupertasksData = {
    body: SupertaskCreate;
    path?: never;
    query?: never;
    url: '/api/v2/ui/supertasks';
};

export type PostSupertasksErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type PostSupertasksError = PostSupertasksErrors[keyof PostSupertasksErrors];

export type PostSupertasksResponses = {
    /**
     * successful operation
     */
    201: SupertaskPostPatchResponse;
};

export type PostSupertasksResponse = PostSupertasksResponses[keyof PostSupertasksResponses];

export type GetSupertasksCountData = {
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
    url: '/api/v2/ui/supertasks/count';
};

export type GetSupertasksCountErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetSupertasksCountError = GetSupertasksCountErrors[keyof GetSupertasksCountErrors];

export type GetSupertasksCountResponses = {
    /**
     * successful operation
     */
    200: SupertaskListResponse;
};

export type GetSupertasksCountResponse = GetSupertasksCountResponses[keyof GetSupertasksCountResponses];

export type GetSupertasksByIdByRelationData = {
    body?: never;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/supertasks/{id}/{relation}';
};

export type GetSupertasksByIdByRelationErrors = {
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

export type GetSupertasksByIdByRelationError = GetSupertasksByIdByRelationErrors[keyof GetSupertasksByIdByRelationErrors];

export type GetSupertasksByIdByRelationResponses = {
    /**
     * successful operation
     */
    200: SupertaskRelationPretasksGetResponse;
};

export type GetSupertasksByIdByRelationResponse = GetSupertasksByIdByRelationResponses[keyof GetSupertasksByIdByRelationResponses];

export type DeleteSupertasksByIdRelationshipsByRelationData = {
    body: SupertaskRelationPretasks;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/supertasks/{id}/relationships/{relation}';
};

export type DeleteSupertasksByIdRelationshipsByRelationErrors = {
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

export type DeleteSupertasksByIdRelationshipsByRelationError = DeleteSupertasksByIdRelationshipsByRelationErrors[keyof DeleteSupertasksByIdRelationshipsByRelationErrors];

export type DeleteSupertasksByIdRelationshipsByRelationResponses = {
    /**
     * successfully deleted
     */
    204: void;
};

export type DeleteSupertasksByIdRelationshipsByRelationResponse = DeleteSupertasksByIdRelationshipsByRelationResponses[keyof DeleteSupertasksByIdRelationshipsByRelationResponses];

export type GetSupertasksByIdRelationshipsByRelationData = {
    body?: never;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/supertasks/{id}/relationships/{relation}';
};

export type GetSupertasksByIdRelationshipsByRelationErrors = {
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

export type GetSupertasksByIdRelationshipsByRelationError = GetSupertasksByIdRelationshipsByRelationErrors[keyof GetSupertasksByIdRelationshipsByRelationErrors];

export type GetSupertasksByIdRelationshipsByRelationResponses = {
    /**
     * successful operation
     */
    200: SupertaskResponse;
};

export type GetSupertasksByIdRelationshipsByRelationResponse = GetSupertasksByIdRelationshipsByRelationResponses[keyof GetSupertasksByIdRelationshipsByRelationResponses];

export type PatchSupertasksByIdRelationshipsByRelationData = {
    body: SupertaskRelationPretasks;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/supertasks/{id}/relationships/{relation}';
};

export type PatchSupertasksByIdRelationshipsByRelationErrors = {
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

export type PatchSupertasksByIdRelationshipsByRelationError = PatchSupertasksByIdRelationshipsByRelationErrors[keyof PatchSupertasksByIdRelationshipsByRelationErrors];

export type PatchSupertasksByIdRelationshipsByRelationResponses = {
    /**
     * Successfull operation
     */
    204: void;
};

export type PatchSupertasksByIdRelationshipsByRelationResponse = PatchSupertasksByIdRelationshipsByRelationResponses[keyof PatchSupertasksByIdRelationshipsByRelationResponses];

export type PostSupertasksByIdRelationshipsByRelationData = {
    body: {
        [key: string]: unknown;
    };
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/supertasks/{id}/relationships/{relation}';
};

export type PostSupertasksByIdRelationshipsByRelationErrors = {
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

export type PostSupertasksByIdRelationshipsByRelationError = PostSupertasksByIdRelationshipsByRelationErrors[keyof PostSupertasksByIdRelationshipsByRelationErrors];

export type PostSupertasksByIdRelationshipsByRelationResponses = {
    /**
     * successfully created
     */
    204: void;
};

export type PostSupertasksByIdRelationshipsByRelationResponse = PostSupertasksByIdRelationshipsByRelationResponses[keyof PostSupertasksByIdRelationshipsByRelationResponses];

export type DeleteSupertasksByIdData = {
    body: {
        [key: string]: unknown;
    };
    path: {
        id: number;
    };
    query?: never;
    url: '/api/v2/ui/supertasks/{id}';
};

export type DeleteSupertasksByIdErrors = {
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

export type DeleteSupertasksByIdError = DeleteSupertasksByIdErrors[keyof DeleteSupertasksByIdErrors];

export type DeleteSupertasksByIdResponses = {
    /**
     * successfully deleted
     */
    204: void;
};

export type DeleteSupertasksByIdResponse = DeleteSupertasksByIdResponses[keyof DeleteSupertasksByIdResponses];

export type GetSupertasksByIdData = {
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
    url: '/api/v2/ui/supertasks/{id}';
};

export type GetSupertasksByIdErrors = {
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

export type GetSupertasksByIdError = GetSupertasksByIdErrors[keyof GetSupertasksByIdErrors];

export type GetSupertasksByIdResponses = {
    /**
     * successful operation
     */
    200: SupertaskResponse;
};

export type GetSupertasksByIdResponse = GetSupertasksByIdResponses[keyof GetSupertasksByIdResponses];

export type PatchSupertasksByIdData = {
    body: SupertaskPatch;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/v2/ui/supertasks/{id}';
};

export type PatchSupertasksByIdErrors = {
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

export type PatchSupertasksByIdError = PatchSupertasksByIdErrors[keyof PatchSupertasksByIdErrors];

export type PatchSupertasksByIdResponses = {
    /**
     * successful operation
     */
    200: SupertaskPostPatchResponse;
};

export type PatchSupertasksByIdResponse = PatchSupertasksByIdResponses[keyof PatchSupertasksByIdResponses];
