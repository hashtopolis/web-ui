import type { ErrorResponse, NotFoundResponse } from './common';

export type PreprocessorCreate = {
    data: {
        type: 'preprocessor';
        attributes: {
            name: string;
            url: string;
            binaryName: string;
            keyspaceCommand: string;
            skipCommand: string;
            limitCommand: string;
        };
    };
};

export type PreprocessorPatch = {
    data: {
        type: 'preprocessor';
        attributes: {
            binaryName?: string;
            keyspaceCommand?: string;
            limitCommand?: string;
            name?: string;
            skipCommand?: string;
            url?: string;
        };
    };
};

export type PreprocessorResponse = {
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
        type: 'preprocessor';
        attributes: {
            name: string;
            url: string;
            binaryName: string;
            keyspaceCommand: string;
            skipCommand: string;
            limitCommand: string;
        };
    };
    relationships?: {
        [key: string]: unknown;
    };
    included?: Array<unknown>;
};

export type PreprocessorPostPatchResponse = {
    jsonapi: {
        version: string;
        ext?: Array<string>;
    };
    data: {
        id: number;
        type: 'preprocessor';
        attributes: {
            name: string;
            url: string;
            binaryName: string;
            keyspaceCommand: string;
            skipCommand: string;
            limitCommand: string;
        };
    };
};

export type PreprocessorListResponse = {
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
        type: 'preprocessor';
        attributes: {
            name: string;
            url: string;
            binaryName: string;
            keyspaceCommand: string;
            skipCommand: string;
            limitCommand: string;
        };
    }>;
    relationships?: {
        [key: string]: unknown;
    };
    included?: Array<unknown>;
};

export type DeletePreprocessorsData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/ui/preprocessors';
};

export type DeletePreprocessorsErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type DeletePreprocessorsError = DeletePreprocessorsErrors[keyof DeletePreprocessorsErrors];

export type DeletePreprocessorsResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type GetPreprocessorsData = {
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
    url: '/api/v2/ui/preprocessors';
};

export type GetPreprocessorsErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetPreprocessorsError = GetPreprocessorsErrors[keyof GetPreprocessorsErrors];

export type GetPreprocessorsResponses = {
    /**
     * successful operation
     */
    200: PreprocessorListResponse;
};

export type GetPreprocessorsResponse = GetPreprocessorsResponses[keyof GetPreprocessorsResponses];

export type PatchPreprocessorsData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/ui/preprocessors';
};

export type PatchPreprocessorsErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type PatchPreprocessorsError = PatchPreprocessorsErrors[keyof PatchPreprocessorsErrors];

export type PatchPreprocessorsResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type PostPreprocessorsData = {
    body: PreprocessorCreate;
    path?: never;
    query?: never;
    url: '/api/v2/ui/preprocessors';
};

export type PostPreprocessorsErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type PostPreprocessorsError = PostPreprocessorsErrors[keyof PostPreprocessorsErrors];

export type PostPreprocessorsResponses = {
    /**
     * successful operation
     */
    201: PreprocessorPostPatchResponse;
};

export type PostPreprocessorsResponse = PostPreprocessorsResponses[keyof PostPreprocessorsResponses];

export type GetPreprocessorsCountData = {
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
    url: '/api/v2/ui/preprocessors/count';
};

export type GetPreprocessorsCountErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetPreprocessorsCountError = GetPreprocessorsCountErrors[keyof GetPreprocessorsCountErrors];

export type GetPreprocessorsCountResponses = {
    /**
     * successful operation
     */
    200: PreprocessorListResponse;
};

export type GetPreprocessorsCountResponse = GetPreprocessorsCountResponses[keyof GetPreprocessorsCountResponses];

export type DeletePreprocessorsByIdData = {
    body: {
        [key: string]: unknown;
    };
    path: {
        id: number;
    };
    query?: never;
    url: '/api/v2/ui/preprocessors/{id}';
};

export type DeletePreprocessorsByIdErrors = {
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

export type DeletePreprocessorsByIdError = DeletePreprocessorsByIdErrors[keyof DeletePreprocessorsByIdErrors];

export type DeletePreprocessorsByIdResponses = {
    /**
     * successfully deleted
     */
    204: void;
};

export type DeletePreprocessorsByIdResponse = DeletePreprocessorsByIdResponses[keyof DeletePreprocessorsByIdResponses];

export type GetPreprocessorsByIdData = {
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
    url: '/api/v2/ui/preprocessors/{id}';
};

export type GetPreprocessorsByIdErrors = {
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

export type GetPreprocessorsByIdError = GetPreprocessorsByIdErrors[keyof GetPreprocessorsByIdErrors];

export type GetPreprocessorsByIdResponses = {
    /**
     * successful operation
     */
    200: PreprocessorResponse;
};

export type GetPreprocessorsByIdResponse = GetPreprocessorsByIdResponses[keyof GetPreprocessorsByIdResponses];

export type PatchPreprocessorsByIdData = {
    body: PreprocessorPatch;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/v2/ui/preprocessors/{id}';
};

export type PatchPreprocessorsByIdErrors = {
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

export type PatchPreprocessorsByIdError = PatchPreprocessorsByIdErrors[keyof PatchPreprocessorsByIdErrors];

export type PatchPreprocessorsByIdResponses = {
    /**
     * successful operation
     */
    200: PreprocessorPostPatchResponse;
};

export type PatchPreprocessorsByIdResponse = PatchPreprocessorsByIdResponses[keyof PatchPreprocessorsByIdResponses];
