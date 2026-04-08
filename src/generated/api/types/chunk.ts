import type { ErrorResponse, NotFoundResponse } from './common';

export type ChunkResponse = {
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
        type: 'chunk';
        attributes: {
            taskId: number;
            skip: number;
            length: number;
            agentId: number;
            dispatchTime: number;
            solveTime: number;
            checkpoint: number;
            progress: number;
            state: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
            cracked: number;
            speed: number;
        };
    };
    relationships?: {
        agent: {
            links: {
                self: string;
                related: string;
            };
            data?: {
                type: 'agent';
                id: number;
            } | null;
        };
        task: {
            links: {
                self: string;
                related: string;
            };
            data?: {
                type: 'task';
                id: number;
            } | null;
        };
    };
    included?: Array<{
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
    } | {
        id: number;
        type: 'task';
        attributes: {
            taskName: string;
            attackCmd: string;
            chunkTime: number;
            statusTimer: number;
            keyspace: number;
            keyspaceProgress: number;
            priority: number;
            maxAgents: number;
            color: string | null;
            isSmall: boolean;
            isCpuTask: boolean;
            useNewBench: boolean;
            skipKeyspace: number;
            crackerBinaryId: number;
            crackerBinaryTypeId: number | null;
            taskWrapperId: number;
            isArchived: boolean;
            notes: string;
            staticChunks: number;
            chunkSize: number;
            forcePipe: boolean;
            preprocessorId: number;
            preprocessorCommand: string;
        };
    }>;
};

export type ChunkListResponse = {
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
        type: 'chunk';
        attributes: {
            taskId: number;
            skip: number;
            length: number;
            agentId: number;
            dispatchTime: number;
            solveTime: number;
            checkpoint: number;
            progress: number;
            state: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
            cracked: number;
            speed: number;
        };
    }>;
    relationships?: {
        agent: {
            links: {
                self: string;
                related: string;
            };
            data?: {
                type: 'agent';
                id: number;
            } | null;
        };
        task: {
            links: {
                self: string;
                related: string;
            };
            data?: {
                type: 'task';
                id: number;
            } | null;
        };
    };
    included?: Array<{
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
    } | {
        id: number;
        type: 'task';
        attributes: {
            taskName: string;
            attackCmd: string;
            chunkTime: number;
            statusTimer: number;
            keyspace: number;
            keyspaceProgress: number;
            priority: number;
            maxAgents: number;
            color: string | null;
            isSmall: boolean;
            isCpuTask: boolean;
            useNewBench: boolean;
            skipKeyspace: number;
            crackerBinaryId: number;
            crackerBinaryTypeId: number | null;
            taskWrapperId: number;
            isArchived: boolean;
            notes: string;
            staticChunks: number;
            chunkSize: number;
            forcePipe: boolean;
            preprocessorId: number;
            preprocessorCommand: string;
        };
    }>;
};

export type ChunkRelationTask = {
    data: {
        type: 'task';
        id: number;
    };
};

export type ChunkRelationTaskGetResponse = {
    data: {
        type: 'task';
        id: number;
    };
};

export type GetChunksData = {
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
    url: '/api/v2/ui/chunks';
};

export type GetChunksErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetChunksError = GetChunksErrors[keyof GetChunksErrors];

export type GetChunksResponses = {
    /**
     * successful operation
     */
    200: ChunkListResponse;
};

export type GetChunksResponse = GetChunksResponses[keyof GetChunksResponses];

export type GetChunksCountData = {
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
    url: '/api/v2/ui/chunks/count';
};

export type GetChunksCountErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetChunksCountError = GetChunksCountErrors[keyof GetChunksCountErrors];

export type GetChunksCountResponses = {
    /**
     * successful operation
     */
    200: ChunkListResponse;
};

export type GetChunksCountResponse = GetChunksCountResponses[keyof GetChunksCountResponses];

export type GetChunksByIdByRelationData = {
    body?: never;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/chunks/{id}/{relation}';
};

export type GetChunksByIdByRelationErrors = {
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

export type GetChunksByIdByRelationError = GetChunksByIdByRelationErrors[keyof GetChunksByIdByRelationErrors];

export type GetChunksByIdByRelationResponses = {
    /**
     * successful operation
     */
    200: ChunkRelationTaskGetResponse;
};

export type GetChunksByIdByRelationResponse = GetChunksByIdByRelationResponses[keyof GetChunksByIdByRelationResponses];

export type GetChunksByIdRelationshipsByRelationData = {
    body?: never;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/chunks/{id}/relationships/{relation}';
};

export type GetChunksByIdRelationshipsByRelationErrors = {
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

export type GetChunksByIdRelationshipsByRelationError = GetChunksByIdRelationshipsByRelationErrors[keyof GetChunksByIdRelationshipsByRelationErrors];

export type GetChunksByIdRelationshipsByRelationResponses = {
    /**
     * successful operation
     */
    200: ChunkResponse;
};

export type GetChunksByIdRelationshipsByRelationResponse = GetChunksByIdRelationshipsByRelationResponses[keyof GetChunksByIdRelationshipsByRelationResponses];

export type PatchChunksByIdRelationshipsByRelationData = {
    body: ChunkRelationTask;
    path: {
        id: number;
        relation: string;
    };
    query?: never;
    url: '/api/v2/ui/chunks/{id}/relationships/{relation}';
};

export type PatchChunksByIdRelationshipsByRelationErrors = {
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

export type PatchChunksByIdRelationshipsByRelationError = PatchChunksByIdRelationshipsByRelationErrors[keyof PatchChunksByIdRelationshipsByRelationErrors];

export type PatchChunksByIdRelationshipsByRelationResponses = {
    /**
     * Successfull operation
     */
    204: void;
};

export type PatchChunksByIdRelationshipsByRelationResponse = PatchChunksByIdRelationshipsByRelationResponses[keyof PatchChunksByIdRelationshipsByRelationResponses];

export type GetChunksByIdData = {
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
    url: '/api/v2/ui/chunks/{id}';
};

export type GetChunksByIdErrors = {
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

export type GetChunksByIdError = GetChunksByIdErrors[keyof GetChunksByIdErrors];

export type GetChunksByIdResponses = {
    /**
     * successful operation
     */
    200: ChunkResponse;
};

export type GetChunksByIdResponse = GetChunksByIdResponses[keyof GetChunksByIdResponses];
