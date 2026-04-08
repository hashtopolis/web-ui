import type { ErrorResponse, NotFoundResponse } from './common';

export type LogEntryCreate = {
    data: {
        type: 'logEntry';
        attributes: {
            [key: string]: unknown;
        };
    };
};

export type LogEntryPatch = {
    data: {
        type: 'logEntry';
        attributes: {
            [key: string]: unknown;
        };
    };
};

export type LogEntryResponse = {
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
        type: 'logEntry';
        attributes: {
            issuer: 'API' | 'User';
            issuerId: string;
            level: 'warning' | 'error' | 'fatal error' | 'information';
            message: string;
            time: number;
        };
    };
    relationships?: {
        [key: string]: unknown;
    };
    included?: Array<unknown>;
};

export type LogEntryPostPatchResponse = {
    jsonapi: {
        version: string;
        ext?: Array<string>;
    };
    data: {
        id: number;
        type: 'logEntry';
        attributes: {
            issuer: 'API' | 'User';
            issuerId: string;
            level: 'warning' | 'error' | 'fatal error' | 'information';
            message: string;
            time: number;
        };
    };
};

export type LogEntryListResponse = {
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
        type: 'logEntry';
        attributes: {
            issuer: 'API' | 'User';
            issuerId: string;
            level: 'warning' | 'error' | 'fatal error' | 'information';
            message: string;
            time: number;
        };
    }>;
    relationships?: {
        [key: string]: unknown;
    };
    included?: Array<unknown>;
};

export type DeleteLogentriesData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/ui/logentries';
};

export type DeleteLogentriesErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type DeleteLogentriesError = DeleteLogentriesErrors[keyof DeleteLogentriesErrors];

export type DeleteLogentriesResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type GetLogentriesData = {
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
    url: '/api/v2/ui/logentries';
};

export type GetLogentriesErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetLogentriesError = GetLogentriesErrors[keyof GetLogentriesErrors];

export type GetLogentriesResponses = {
    /**
     * successful operation
     */
    200: LogEntryListResponse;
};

export type GetLogentriesResponse = GetLogentriesResponses[keyof GetLogentriesResponses];

export type PatchLogentriesData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/ui/logentries';
};

export type PatchLogentriesErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type PatchLogentriesError = PatchLogentriesErrors[keyof PatchLogentriesErrors];

export type PatchLogentriesResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type PostLogentriesData = {
    body: LogEntryCreate;
    path?: never;
    query?: never;
    url: '/api/v2/ui/logentries';
};

export type PostLogentriesErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type PostLogentriesError = PostLogentriesErrors[keyof PostLogentriesErrors];

export type PostLogentriesResponses = {
    /**
     * successful operation
     */
    201: LogEntryPostPatchResponse;
};

export type PostLogentriesResponse = PostLogentriesResponses[keyof PostLogentriesResponses];

export type GetLogentriesCountData = {
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
    url: '/api/v2/ui/logentries/count';
};

export type GetLogentriesCountErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetLogentriesCountError = GetLogentriesCountErrors[keyof GetLogentriesCountErrors];

export type GetLogentriesCountResponses = {
    /**
     * successful operation
     */
    200: LogEntryListResponse;
};

export type GetLogentriesCountResponse = GetLogentriesCountResponses[keyof GetLogentriesCountResponses];

export type DeleteLogentriesByIdData = {
    body: {
        [key: string]: unknown;
    };
    path: {
        id: number;
    };
    query?: never;
    url: '/api/v2/ui/logentries/{id}';
};

export type DeleteLogentriesByIdErrors = {
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

export type DeleteLogentriesByIdError = DeleteLogentriesByIdErrors[keyof DeleteLogentriesByIdErrors];

export type DeleteLogentriesByIdResponses = {
    /**
     * successfully deleted
     */
    204: void;
};

export type DeleteLogentriesByIdResponse = DeleteLogentriesByIdResponses[keyof DeleteLogentriesByIdResponses];

export type GetLogentriesByIdData = {
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
    url: '/api/v2/ui/logentries/{id}';
};

export type GetLogentriesByIdErrors = {
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

export type GetLogentriesByIdError = GetLogentriesByIdErrors[keyof GetLogentriesByIdErrors];

export type GetLogentriesByIdResponses = {
    /**
     * successful operation
     */
    200: LogEntryResponse;
};

export type GetLogentriesByIdResponse = GetLogentriesByIdResponses[keyof GetLogentriesByIdResponses];

export type PatchLogentriesByIdData = {
    body: LogEntryPatch;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/v2/ui/logentries/{id}';
};

export type PatchLogentriesByIdErrors = {
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

export type PatchLogentriesByIdError = PatchLogentriesByIdErrors[keyof PatchLogentriesByIdErrors];

export type PatchLogentriesByIdResponses = {
    /**
     * successful operation
     */
    200: LogEntryPostPatchResponse;
};

export type PatchLogentriesByIdResponse = PatchLogentriesByIdResponses[keyof PatchLogentriesByIdResponses];
