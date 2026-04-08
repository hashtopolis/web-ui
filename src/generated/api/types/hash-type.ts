import type { ErrorResponse, NotFoundResponse } from './common';

export type HashTypeCreate = {
    data: {
        type: 'hashType';
        attributes: {
            hashTypeId: number;
            description: string;
            isSalted: boolean;
            isSlowHash: boolean;
        };
    };
};

export type HashTypePatch = {
    data: {
        type: 'hashType';
        attributes: {
            description?: string;
            isSalted?: boolean;
            isSlowHash?: boolean;
        };
    };
};

export type HashTypeResponse = {
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
        type: 'hashType';
        attributes: {
            description: string;
            isSalted: boolean;
            isSlowHash: boolean;
        };
    };
    relationships?: {
        [key: string]: unknown;
    };
    included?: Array<unknown>;
};

export type HashTypePostPatchResponse = {
    jsonapi: {
        version: string;
        ext?: Array<string>;
    };
    data: {
        id: number;
        type: 'hashType';
        attributes: {
            description: string;
            isSalted: boolean;
            isSlowHash: boolean;
        };
    };
};

export type HashTypeListResponse = {
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
        type: 'hashType';
        attributes: {
            description: string;
            isSalted: boolean;
            isSlowHash: boolean;
        };
    }>;
    relationships?: {
        [key: string]: unknown;
    };
    included?: Array<unknown>;
};

export type DeleteHashtypesData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/ui/hashtypes';
};

export type DeleteHashtypesErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type DeleteHashtypesError = DeleteHashtypesErrors[keyof DeleteHashtypesErrors];

export type DeleteHashtypesResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type GetHashtypesData = {
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
    url: '/api/v2/ui/hashtypes';
};

export type GetHashtypesErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetHashtypesError = GetHashtypesErrors[keyof GetHashtypesErrors];

export type GetHashtypesResponses = {
    /**
     * successful operation
     */
    200: HashTypeListResponse;
};

export type GetHashtypesResponse = GetHashtypesResponses[keyof GetHashtypesResponses];

export type PatchHashtypesData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/ui/hashtypes';
};

export type PatchHashtypesErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type PatchHashtypesError = PatchHashtypesErrors[keyof PatchHashtypesErrors];

export type PatchHashtypesResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type PostHashtypesData = {
    body: HashTypeCreate;
    path?: never;
    query?: never;
    url: '/api/v2/ui/hashtypes';
};

export type PostHashtypesErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type PostHashtypesError = PostHashtypesErrors[keyof PostHashtypesErrors];

export type PostHashtypesResponses = {
    /**
     * successful operation
     */
    201: HashTypePostPatchResponse;
};

export type PostHashtypesResponse = PostHashtypesResponses[keyof PostHashtypesResponses];

export type GetHashtypesCountData = {
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
    url: '/api/v2/ui/hashtypes/count';
};

export type GetHashtypesCountErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetHashtypesCountError = GetHashtypesCountErrors[keyof GetHashtypesCountErrors];

export type GetHashtypesCountResponses = {
    /**
     * successful operation
     */
    200: HashTypeListResponse;
};

export type GetHashtypesCountResponse = GetHashtypesCountResponses[keyof GetHashtypesCountResponses];

export type DeleteHashtypesByIdData = {
    body: {
        [key: string]: unknown;
    };
    path: {
        id: number;
    };
    query?: never;
    url: '/api/v2/ui/hashtypes/{id}';
};

export type DeleteHashtypesByIdErrors = {
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

export type DeleteHashtypesByIdError = DeleteHashtypesByIdErrors[keyof DeleteHashtypesByIdErrors];

export type DeleteHashtypesByIdResponses = {
    /**
     * successfully deleted
     */
    204: void;
};

export type DeleteHashtypesByIdResponse = DeleteHashtypesByIdResponses[keyof DeleteHashtypesByIdResponses];

export type GetHashtypesByIdData = {
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
    url: '/api/v2/ui/hashtypes/{id}';
};

export type GetHashtypesByIdErrors = {
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

export type GetHashtypesByIdError = GetHashtypesByIdErrors[keyof GetHashtypesByIdErrors];

export type GetHashtypesByIdResponses = {
    /**
     * successful operation
     */
    200: HashTypeResponse;
};

export type GetHashtypesByIdResponse = GetHashtypesByIdResponses[keyof GetHashtypesByIdResponses];

export type PatchHashtypesByIdData = {
    body: HashTypePatch;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/v2/ui/hashtypes/{id}';
};

export type PatchHashtypesByIdErrors = {
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

export type PatchHashtypesByIdError = PatchHashtypesByIdErrors[keyof PatchHashtypesByIdErrors];

export type PatchHashtypesByIdResponses = {
    /**
     * successful operation
     */
    200: HashTypePostPatchResponse;
};

export type PatchHashtypesByIdResponse = PatchHashtypesByIdResponses[keyof PatchHashtypesByIdResponses];
