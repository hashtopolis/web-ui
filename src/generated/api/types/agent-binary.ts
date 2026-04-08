import type { ErrorResponse, NotFoundResponse } from './common';

export type AgentBinaryCreate = {
  data: {
    type: 'agentBinary';
    attributes: {
      binaryType: string;
      version: string;
      operatingSystems: string;
      filename: string;
      updateTrack: string;
    };
  };
};

export type AgentBinaryPatch = {
  data: {
    type: 'agentBinary';
    attributes: {
      binaryType?: string;
      filename?: string;
      operatingSystems?: string;
      updateTrack?: string;
      version?: string;
    };
  };
};

export type AgentBinaryResponse = {
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
    type: 'agentBinary';
    attributes: {
      binaryType: string;
      version: string;
      operatingSystems: string;
      filename: string;
      updateTrack: string;
      updateAvailable: string;
    };
  };
  relationships?: {
    [key: string]: unknown;
  };
  included?: Array<unknown>;
};

export type AgentBinaryPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  data: {
    id: number;
    type: 'agentBinary';
    attributes: {
      binaryType: string;
      version: string;
      operatingSystems: string;
      filename: string;
      updateTrack: string;
      updateAvailable: string;
    };
  };
};

export type AgentBinaryListResponse = {
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
    type: 'agentBinary';
    attributes: {
      binaryType: string;
      version: string;
      operatingSystems: string;
      filename: string;
      updateTrack: string;
      updateAvailable: string;
    };
  }>;
  relationships?: {
    [key: string]: unknown;
  };
  included?: Array<unknown>;
};

export type DeleteAgentbinariesData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/agentbinaries';
};

export type DeleteAgentbinariesErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type DeleteAgentbinariesError = DeleteAgentbinariesErrors[keyof DeleteAgentbinariesErrors];

export type DeleteAgentbinariesResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetAgentbinariesData = {
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
  url: '/api/v2/ui/agentbinaries';
};

export type GetAgentbinariesErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetAgentbinariesError = GetAgentbinariesErrors[keyof GetAgentbinariesErrors];

export type GetAgentbinariesResponses = {
  /**
   * successful operation
   */
  200: AgentBinaryListResponse;
};

export type GetAgentbinariesResponse = GetAgentbinariesResponses[keyof GetAgentbinariesResponses];

export type PatchAgentbinariesData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/agentbinaries';
};

export type PatchAgentbinariesErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PatchAgentbinariesError = PatchAgentbinariesErrors[keyof PatchAgentbinariesErrors];

export type PatchAgentbinariesResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type PostAgentbinariesData = {
  body: AgentBinaryCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/agentbinaries';
};

export type PostAgentbinariesErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PostAgentbinariesError = PostAgentbinariesErrors[keyof PostAgentbinariesErrors];

export type PostAgentbinariesResponses = {
  /**
   * successful operation
   */
  201: AgentBinaryPostPatchResponse;
};

export type PostAgentbinariesResponse = PostAgentbinariesResponses[keyof PostAgentbinariesResponses];

export type GetAgentbinariesCountData = {
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
  url: '/api/v2/ui/agentbinaries/count';
};

export type GetAgentbinariesCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetAgentbinariesCountError = GetAgentbinariesCountErrors[keyof GetAgentbinariesCountErrors];

export type GetAgentbinariesCountResponses = {
  /**
   * successful operation
   */
  200: AgentBinaryListResponse;
};

export type GetAgentbinariesCountResponse = GetAgentbinariesCountResponses[keyof GetAgentbinariesCountResponses];

export type DeleteAgentbinariesByIdData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agentbinaries/{id}';
};

export type DeleteAgentbinariesByIdErrors = {
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

export type DeleteAgentbinariesByIdError = DeleteAgentbinariesByIdErrors[keyof DeleteAgentbinariesByIdErrors];

export type DeleteAgentbinariesByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteAgentbinariesByIdResponse = DeleteAgentbinariesByIdResponses[keyof DeleteAgentbinariesByIdResponses];

export type GetAgentbinariesByIdData = {
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
  url: '/api/v2/ui/agentbinaries/{id}';
};

export type GetAgentbinariesByIdErrors = {
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

export type GetAgentbinariesByIdError = GetAgentbinariesByIdErrors[keyof GetAgentbinariesByIdErrors];

export type GetAgentbinariesByIdResponses = {
  /**
   * successful operation
   */
  200: AgentBinaryResponse;
};

export type GetAgentbinariesByIdResponse = GetAgentbinariesByIdResponses[keyof GetAgentbinariesByIdResponses];

export type PatchAgentbinariesByIdData = {
  body: AgentBinaryPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/agentbinaries/{id}';
};

export type PatchAgentbinariesByIdErrors = {
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

export type PatchAgentbinariesByIdError = PatchAgentbinariesByIdErrors[keyof PatchAgentbinariesByIdErrors];

export type PatchAgentbinariesByIdResponses = {
  /**
   * successful operation
   */
  200: AgentBinaryPostPatchResponse;
};

export type PatchAgentbinariesByIdResponse = PatchAgentbinariesByIdResponses[keyof PatchAgentbinariesByIdResponses];
