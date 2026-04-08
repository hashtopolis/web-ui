import type { ErrorResponse, NotFoundResponse } from './common';

export type PreTaskCreate = {
    data: {
        type: 'preTask';
        attributes: {
            files: Array<number>;
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
    };
};

export type PreTaskPatch = {
    data: {
        type: 'preTask';
        attributes: {
            attackCmd?: string;
            chunkTime?: number;
            color?: string;
            crackerBinaryTypeId?: number;
            isCpuTask?: boolean;
            isMaskImport?: boolean;
            isSmall?: boolean;
            maxAgents?: number;
            priority?: number;
            statusTimer?: number;
            taskName?: string;
        };
    };
};

export type PreTaskResponse = {
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
            auxiliaryKeyspace?: number;
        };
    };
    relationships?: {
        pretaskFiles: {
            links: {
                self: string;
                related: string;
            };
            data?: Array<{
                type: 'file';
                id: number;
            }>;
        };
    };
    included?: Array<{
        id: number;
        type: 'file';
        attributes: {
            filename: string;
            size: number;
            isSecret: boolean;
            fileType: 0 | 1 | 2 | 100;
            accessGroupId: number;
            lineCount: number;
        };
    }>;
};

export type PreTaskPostPatchResponse = {
    jsonapi: {
        version: string;
        ext?: Array<string>;
    };
    data: {
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
            auxiliaryKeyspace?: number;
        };
    };
};

export type PreTaskListResponse = {
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
            auxiliaryKeyspace?: number;
        };
    }>;
    relationships?: {
        pretaskFiles: {
            links: {
                self: string;
                related: string;
            };
            data?: Array<{
                type: 'file';
                id: number;
            }>;
        };
    };
    included?: Array<{
        id: number;
        type: 'file';
        attributes: {
            filename: string;
            size: number;
            isSecret: boolean;
            fileType: 0 | 1 | 2 | 100;
            accessGroupId: number;
            lineCount: number;
        };
    }>;
};

export type PreTaskRelationPretaskFiles = {
    data: Array<{
        type: 'pretaskFiles';
        id: number;
    }>;
};

export type PreTaskRelationPretaskFilesGetResponse = {
    data: Array<{
        type: 'pretaskFiles';
        id: number;
    }>;
};

export type DeletePretasksData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/ui/pretasks';
};

export type DeletePretasksErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type DeletePretasksError = DeletePretasksErrors[keyof DeletePretasksErrors];

export type DeletePretasksResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type GetPretasksData = {
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
    url: '/api/v2/ui/pretasks';
};

export type GetPretasksErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetPretasksError = GetPretasksErrors[keyof GetPretasksErrors];

export type GetPretasksResponses = {
    /**
     * successful operation
     */
    200: PreTaskListResponse;
};

export type GetPretasksResponse = GetPretasksResponses[keyof GetPretasksResponses];

export type PatchPretasksData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/ui/pretasks';
};

export type PatchPretasksErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type PatchPretasksError = PatchPretasksErrors[keyof PatchPretasksErrors];

export type PatchPretasksResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type PostPretasksData = {
    body: PreTaskCreate;
    path?: never;
    query?: never;
    url: '/api/v2/ui/pretasks';
};

export type PostPretasksErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type PostPretasksError = PostPretasksErrors[keyof PostPretasksErrors];

export type PostPretasksResponses = {
    /**
     * successful operation
     */
    201: PreTaskPostPatchResponse;
};

export type PostPretasksResponse = PostPretasksResponses[keyof PostPretasksResponses];

export type GetPretasksCountData = {
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
    url: '/api/v2/ui/pretasks/count';
};

export type GetPretasksCountErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetPretasksCountError = GetPretasksCountErrors[keyof GetPretasksCountErrors];

export type GetPretasksCountResponses = {
    /**
     * successful operation
     */
    200: PreTaskListResponse;
};

export type GetPretasksCountResponse = GetPretasksCountResponses[keyof GetPretasksCountResponses];

export type GetPretasksByIdByRelationData = {
    body?: never;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/pretasks/{id}/{relation}';
};

export type GetPretasksByIdByRelationErrors = {
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

export type GetPretasksByIdByRelationError = GetPretasksByIdByRelationErrors[keyof GetPretasksByIdByRelationErrors];

export type GetPretasksByIdByRelationResponses = {
    /**
     * successful operation
     */
    200: PreTaskRelationPretaskFilesGetResponse;
};

export type GetPretasksByIdByRelationResponse = GetPretasksByIdByRelationResponses[keyof GetPretasksByIdByRelationResponses];

export type DeletePretasksByIdRelationshipsByRelationData = {
    body: PreTaskRelationPretaskFiles;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/pretasks/{id}/relationships/{relation}';
};

export type DeletePretasksByIdRelationshipsByRelationErrors = {
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

export type DeletePretasksByIdRelationshipsByRelationError = DeletePretasksByIdRelationshipsByRelationErrors[keyof DeletePretasksByIdRelationshipsByRelationErrors];

export type DeletePretasksByIdRelationshipsByRelationResponses = {
    /**
     * successfully deleted
     */
    204: void;
};

export type DeletePretasksByIdRelationshipsByRelationResponse = DeletePretasksByIdRelationshipsByRelationResponses[keyof DeletePretasksByIdRelationshipsByRelationResponses];

export type GetPretasksByIdRelationshipsByRelationData = {
    body?: never;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/pretasks/{id}/relationships/{relation}';
};

export type GetPretasksByIdRelationshipsByRelationErrors = {
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

export type GetPretasksByIdRelationshipsByRelationError = GetPretasksByIdRelationshipsByRelationErrors[keyof GetPretasksByIdRelationshipsByRelationErrors];

export type GetPretasksByIdRelationshipsByRelationResponses = {
    /**
     * successful operation
     */
    200: PreTaskResponse;
};

export type GetPretasksByIdRelationshipsByRelationResponse = GetPretasksByIdRelationshipsByRelationResponses[keyof GetPretasksByIdRelationshipsByRelationResponses];

export type PatchPretasksByIdRelationshipsByRelationData = {
    body: PreTaskRelationPretaskFiles;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/pretasks/{id}/relationships/{relation}';
};

export type PatchPretasksByIdRelationshipsByRelationErrors = {
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

export type PatchPretasksByIdRelationshipsByRelationError = PatchPretasksByIdRelationshipsByRelationErrors[keyof PatchPretasksByIdRelationshipsByRelationErrors];

export type PatchPretasksByIdRelationshipsByRelationResponses = {
    /**
     * Successfull operation
     */
    204: void;
};

export type PatchPretasksByIdRelationshipsByRelationResponse = PatchPretasksByIdRelationshipsByRelationResponses[keyof PatchPretasksByIdRelationshipsByRelationResponses];

export type PostPretasksByIdRelationshipsByRelationData = {
    body: {
        [key: string]: unknown;
    };
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/pretasks/{id}/relationships/{relation}';
};

export type PostPretasksByIdRelationshipsByRelationErrors = {
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

export type PostPretasksByIdRelationshipsByRelationError = PostPretasksByIdRelationshipsByRelationErrors[keyof PostPretasksByIdRelationshipsByRelationErrors];

export type PostPretasksByIdRelationshipsByRelationResponses = {
    /**
     * successfully created
     */
    204: void;
};

export type PostPretasksByIdRelationshipsByRelationResponse = PostPretasksByIdRelationshipsByRelationResponses[keyof PostPretasksByIdRelationshipsByRelationResponses];

export type DeletePretasksByIdData = {
    body: {
        [key: string]: unknown;
    };
    path: {
        id: number;
    };
    query?: never;
    url: '/api/v2/ui/pretasks/{id}';
};

export type DeletePretasksByIdErrors = {
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

export type DeletePretasksByIdError = DeletePretasksByIdErrors[keyof DeletePretasksByIdErrors];

export type DeletePretasksByIdResponses = {
    /**
     * successfully deleted
     */
    204: void;
};

export type DeletePretasksByIdResponse = DeletePretasksByIdResponses[keyof DeletePretasksByIdResponses];

export type GetPretasksByIdData = {
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
    url: '/api/v2/ui/pretasks/{id}';
};

export type GetPretasksByIdErrors = {
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

export type GetPretasksByIdError = GetPretasksByIdErrors[keyof GetPretasksByIdErrors];

export type GetPretasksByIdResponses = {
    /**
     * successful operation
     */
    200: PreTaskResponse;
};

export type GetPretasksByIdResponse = GetPretasksByIdResponses[keyof GetPretasksByIdResponses];

export type PatchPretasksByIdData = {
    body: PreTaskPatch;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/v2/ui/pretasks/{id}';
};

export type PatchPretasksByIdErrors = {
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

export type PatchPretasksByIdError = PatchPretasksByIdErrors[keyof PatchPretasksByIdErrors];

export type PatchPretasksByIdResponses = {
    /**
     * successful operation
     */
    200: PreTaskPostPatchResponse;
};

export type PatchPretasksByIdResponse = PatchPretasksByIdResponses[keyof PatchPretasksByIdResponses];
