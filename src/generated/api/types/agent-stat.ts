import type { ErrorResponse, NotFoundResponse } from './common';

export type AgentStatResponse = {
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
        type: 'agentStat';
        attributes: {
            agentId: number;
            statType: 1 | 2 | 3;
            time: number;
            value: Array<number>;
        };
    };
    relationships?: {
        [key: string]: unknown;
    };
    included?: Array<unknown>;
};

export type AgentStatListResponse = {
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
        type: 'agentStat';
        attributes: {
            agentId: number;
            statType: 1 | 2 | 3;
            time: number;
            value: Array<number>;
        };
    }>;
    relationships?: {
        [key: string]: unknown;
    };
    included?: Array<unknown>;
};

export type DeleteAgentstatsData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/ui/agentstats';
};

export type DeleteAgentstatsErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type DeleteAgentstatsError = DeleteAgentstatsErrors[keyof DeleteAgentstatsErrors];

export type DeleteAgentstatsResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type GetAgentstatsData = {
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
    url: '/api/v2/ui/agentstats';
};

export type GetAgentstatsErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetAgentstatsError = GetAgentstatsErrors[keyof GetAgentstatsErrors];

export type GetAgentstatsResponses = {
    /**
     * successful operation
     */
    200: AgentStatListResponse;
};

export type GetAgentstatsResponse = GetAgentstatsResponses[keyof GetAgentstatsResponses];

export type GetAgentstatsCountData = {
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
    url: '/api/v2/ui/agentstats/count';
};

export type GetAgentstatsCountErrors = {
    /**
     * Invalid request
     */
    400: ErrorResponse;
    /**
     * Authentication failed
     */
    401: ErrorResponse;
};

export type GetAgentstatsCountError = GetAgentstatsCountErrors[keyof GetAgentstatsCountErrors];

export type GetAgentstatsCountResponses = {
    /**
     * successful operation
     */
    200: AgentStatListResponse;
};

export type GetAgentstatsCountResponse = GetAgentstatsCountResponses[keyof GetAgentstatsCountResponses];

export type DeleteAgentstatsByIdData = {
    body: {
        [key: string]: unknown;
    };
    path: {
        id: number;
    };
    query?: never;
    url: '/api/v2/ui/agentstats/{id}';
};

export type DeleteAgentstatsByIdErrors = {
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

export type DeleteAgentstatsByIdError = DeleteAgentstatsByIdErrors[keyof DeleteAgentstatsByIdErrors];

export type DeleteAgentstatsByIdResponses = {
    /**
     * successfully deleted
     */
    204: void;
};

export type DeleteAgentstatsByIdResponse = DeleteAgentstatsByIdResponses[keyof DeleteAgentstatsByIdResponses];

export type GetAgentstatsByIdData = {
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
    url: '/api/v2/ui/agentstats/{id}';
};

export type GetAgentstatsByIdErrors = {
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

export type GetAgentstatsByIdError = GetAgentstatsByIdErrors[keyof GetAgentstatsByIdErrors];

export type GetAgentstatsByIdResponses = {
    /**
     * successful operation
     */
    200: AgentStatResponse;
};

export type GetAgentstatsByIdResponse = GetAgentstatsByIdResponses[keyof GetAgentstatsByIdResponses];
