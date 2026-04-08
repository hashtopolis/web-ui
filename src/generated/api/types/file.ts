import type { ErrorResponse, NotFoundResponse } from './common';

export type FileCreate = {
    data: {
        type: 'file';
        attributes: {
            sourceType: string;
            sourceData: string;
            filename: string;
            isSecret: boolean;
            fileType: 0 | 1 | 2 | 100;
            accessGroupId: number;
        };
    };
};

export type FilePatch = {
    data: {
        type: 'file';
        attributes: {
            accessGroupId?: number;
            fileType?: 0 | 1 | 2 | 100;
            filename?: string;
            isSecret?: boolean;
        };
    };
};

export type FileResponse = {
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
        type: 'file';
        attributes: {
            filename: string;
            size: number;
            isSecret: boolean;
            fileType: 0 | 1 | 2 | 100;
            accessGroupId: number;
            lineCount: number;
        };
    };
    relationships?: {
        accessGroup: {
            links: {
                self: string;
                related: string;
            };
            data?: {
                type: 'accessGroup';
                id: number;
            } | null;
        };
    };
    included?: Array<{
        id: number;
        type: 'accessGroup';
        attributes: {
            groupName: string;
        };
    }>;
};

export type FileSingleResponse = {
    data: {
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
    };
    relationships?: {
        accessGroup: {
            links: {
                self: string;
                related: string;
            };
            data?: {
                type: 'accessGroup';
                id: number;
            } | null;
        };
    };
    included?: Array<{
        id: number;
        type: 'accessGroup';
        attributes: {
            groupName: string;
        };
    }>;
};

export type FilePostPatchResponse = {
    jsonapi: {
        version: string;
        ext?: Array<string>;
    };
    data: {
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
    };
};

export type FileListResponse = {
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
    relationships?: {
        accessGroup: {
            links: {
                self: string;
                related: string;
            };
            data?: {
                type: 'accessGroup';
                id: number;
            } | null;
        };
    };
    included?: Array<{
        id: number;
        type: 'accessGroup';
        attributes: {
            groupName: string;
        };
    }>;
};

export type FileRelationAccessGroup = {
    data: {
        type: 'accessGroup';
        id: number;
    };
};

export type FileRelationAccessGroupGetResponse = {
    data: {
        type: 'accessGroup';
        id: number;
    };
};

export type DeleteFilesData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/ui/files';
};

export type DeleteFilesErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type DeleteFilesError = DeleteFilesErrors[keyof DeleteFilesErrors];

export type DeleteFilesResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type GetFilesData = {
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
    url: '/api/v2/ui/files';
};

export type GetFilesErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetFilesError = GetFilesErrors[keyof GetFilesErrors];

export type GetFilesResponses = {
    /**
     * successful operation
     */
    200: FileListResponse;
};

export type GetFilesResponse = GetFilesResponses[keyof GetFilesResponses];

export type PatchFilesData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/ui/files';
};

export type PatchFilesErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type PatchFilesError = PatchFilesErrors[keyof PatchFilesErrors];

export type PatchFilesResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type PostFilesData = {
    body: FileCreate;
    path?: never;
    query?: never;
    url: '/api/v2/ui/files';
};

export type PostFilesErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type PostFilesError = PostFilesErrors[keyof PostFilesErrors];

export type PostFilesResponses = {
    /**
     * successful operation
     */
    201: FilePostPatchResponse;
};

export type PostFilesResponse = PostFilesResponses[keyof PostFilesResponses];

export type GetFilesCountData = {
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
    url: '/api/v2/ui/files/count';
};

export type GetFilesCountErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetFilesCountError = GetFilesCountErrors[keyof GetFilesCountErrors];

export type GetFilesCountResponses = {
    /**
     * successful operation
     */
    200: FileListResponse;
};

export type GetFilesCountResponse = GetFilesCountResponses[keyof GetFilesCountResponses];

export type GetFilesByIdByRelationData = {
    body?: never;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/files/{id}/{relation}';
};

export type GetFilesByIdByRelationErrors = {
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

export type GetFilesByIdByRelationError = GetFilesByIdByRelationErrors[keyof GetFilesByIdByRelationErrors];

export type GetFilesByIdByRelationResponses = {
    /**
     * successful operation
     */
    200: FileRelationAccessGroupGetResponse;
};

export type GetFilesByIdByRelationResponse = GetFilesByIdByRelationResponses[keyof GetFilesByIdByRelationResponses];

export type GetFilesByIdRelationshipsByRelationData = {
    body?: never;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/files/{id}/relationships/{relation}';
};

export type GetFilesByIdRelationshipsByRelationErrors = {
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

export type GetFilesByIdRelationshipsByRelationError = GetFilesByIdRelationshipsByRelationErrors[keyof GetFilesByIdRelationshipsByRelationErrors];

export type GetFilesByIdRelationshipsByRelationResponses = {
    /**
     * successful operation
     */
    200: FileResponse;
};

export type GetFilesByIdRelationshipsByRelationResponse = GetFilesByIdRelationshipsByRelationResponses[keyof GetFilesByIdRelationshipsByRelationResponses];

export type PatchFilesByIdRelationshipsByRelationData = {
    body: FileRelationAccessGroup;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/files/{id}/relationships/{relation}';
};

export type PatchFilesByIdRelationshipsByRelationErrors = {
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

export type PatchFilesByIdRelationshipsByRelationError = PatchFilesByIdRelationshipsByRelationErrors[keyof PatchFilesByIdRelationshipsByRelationErrors];

export type PatchFilesByIdRelationshipsByRelationResponses = {
    /**
     * Successfull operation
     */
    204: void;
};

export type PatchFilesByIdRelationshipsByRelationResponse = PatchFilesByIdRelationshipsByRelationResponses[keyof PatchFilesByIdRelationshipsByRelationResponses];

export type DeleteFilesByIdData = {
    body: {
        [key: string]: unknown;
    };
    path: {
        id: number;
    };
    query?: never;
    url: '/api/v2/ui/files/{id}';
};

export type DeleteFilesByIdErrors = {
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

export type DeleteFilesByIdError = DeleteFilesByIdErrors[keyof DeleteFilesByIdErrors];

export type DeleteFilesByIdResponses = {
    /**
     * successfully deleted
     */
    204: void;
};

export type DeleteFilesByIdResponse = DeleteFilesByIdResponses[keyof DeleteFilesByIdResponses];

export type GetFilesByIdData = {
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
    url: '/api/v2/ui/files/{id}';
};

export type GetFilesByIdErrors = {
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

export type GetFilesByIdError = GetFilesByIdErrors[keyof GetFilesByIdErrors];

export type GetFilesByIdResponses = {
    /**
     * successful operation
     */
    200: FileResponse;
};

export type GetFilesByIdResponse = GetFilesByIdResponses[keyof GetFilesByIdResponses];

export type PatchFilesByIdData = {
    body: FilePatch;
    path: {
        id: number;
    };
    query?: never;
    url: '/api/v2/ui/files/{id}';
};

export type PatchFilesByIdErrors = {
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

export type PatchFilesByIdError = PatchFilesByIdErrors[keyof PatchFilesByIdErrors];

export type PatchFilesByIdResponses = {
    /**
     * successful operation
     */
    200: FilePostPatchResponse;
};

export type PatchFilesByIdResponse = PatchFilesByIdResponses[keyof PatchFilesByIdResponses];
