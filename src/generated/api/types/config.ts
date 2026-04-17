import type { ErrorResponse, NotFoundResponse } from './common';

export type ConfigPatch = {
  data: {
    type: 'config';
    attributes: {
      item?: string;
      value?: string;
    };
  };
};

export type ConfigResponse = {
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
    type: 'config';
    attributes: {
      configSectionId: number;
      item: string;
      value: string;
    };
  };
  relationships?: {
    configSection: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'configSection';
        id: number;
      } | null;
    };
  };
  included?: Array<{
    id: number;
    type: 'configSection';
    attributes: {
      sectionName: string;
    };
  }>;
};

export type ConfigPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  data: {
    id: number;
    type: 'config';
    attributes: {
      configSectionId: number;
      item: string;
      value: string;
    };
  };
};

export type ConfigListResponse = {
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
    type: 'config';
    attributes: {
      configSectionId: number;
      item: string;
      value: string;
    };
  }>;
  relationships?: {
    configSection: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'configSection';
        id: number;
      } | null;
    };
  };
  included?: Array<{
    id: number;
    type: 'configSection';
    attributes: {
      sectionName: string;
    };
  }>;
};

export type ConfigRelationConfigSection = {
  data: {
    type: 'configSection';
    id: number;
  };
};

export type ConfigRelationConfigSectionGetResponse = {
  data: {
    type: 'configSection';
    id: number;
  };
};

export type GetConfigsData = {
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
  url: '/api/v2/ui/configs';
};

export type GetConfigsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetConfigsError = GetConfigsErrors[keyof GetConfigsErrors];

export type GetConfigsResponses = {
  /**
   * successful operation
   */
  200: ConfigListResponse;
};

export type GetConfigsResponse = GetConfigsResponses[keyof GetConfigsResponses];

export type PatchConfigsData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/configs';
};

export type PatchConfigsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PatchConfigsError = PatchConfigsErrors[keyof PatchConfigsErrors];

export type PatchConfigsResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetConfigsCountData = {
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
  url: '/api/v2/ui/configs/count';
};

export type GetConfigsCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetConfigsCountError = GetConfigsCountErrors[keyof GetConfigsCountErrors];

export type GetConfigsCountResponses = {
  /**
   * successful operation
   */
  200: ConfigListResponse;
};

export type GetConfigsCountResponse = GetConfigsCountResponses[keyof GetConfigsCountResponses];

export type GetConfigsByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/configs/{id}/{relation}';
};

export type GetConfigsByIdByRelationErrors = {
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

export type GetConfigsByIdByRelationError = GetConfigsByIdByRelationErrors[keyof GetConfigsByIdByRelationErrors];

export type GetConfigsByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: ConfigRelationConfigSectionGetResponse;
};

export type GetConfigsByIdByRelationResponse =
  GetConfigsByIdByRelationResponses[keyof GetConfigsByIdByRelationResponses];

export type GetConfigsByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/configs/{id}/relationships/{relation}';
};

export type GetConfigsByIdRelationshipsByRelationErrors = {
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

export type GetConfigsByIdRelationshipsByRelationError =
  GetConfigsByIdRelationshipsByRelationErrors[keyof GetConfigsByIdRelationshipsByRelationErrors];

export type GetConfigsByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: ConfigResponse;
};

export type GetConfigsByIdRelationshipsByRelationResponse =
  GetConfigsByIdRelationshipsByRelationResponses[keyof GetConfigsByIdRelationshipsByRelationResponses];

export type PatchConfigsByIdRelationshipsByRelationData = {
  body: ConfigRelationConfigSection;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/configs/{id}/relationships/{relation}';
};

export type PatchConfigsByIdRelationshipsByRelationErrors = {
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

export type PatchConfigsByIdRelationshipsByRelationError =
  PatchConfigsByIdRelationshipsByRelationErrors[keyof PatchConfigsByIdRelationshipsByRelationErrors];

export type PatchConfigsByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchConfigsByIdRelationshipsByRelationResponse =
  PatchConfigsByIdRelationshipsByRelationResponses[keyof PatchConfigsByIdRelationshipsByRelationResponses];

export type GetConfigsByIdData = {
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
  url: '/api/v2/ui/configs/{id}';
};

export type GetConfigsByIdErrors = {
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

export type GetConfigsByIdError = GetConfigsByIdErrors[keyof GetConfigsByIdErrors];

export type GetConfigsByIdResponses = {
  /**
   * successful operation
   */
  200: ConfigResponse;
};

export type GetConfigsByIdResponse = GetConfigsByIdResponses[keyof GetConfigsByIdResponses];

export type PatchConfigsByIdData = {
  body: ConfigPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/configs/{id}';
};

export type PatchConfigsByIdErrors = {
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

export type PatchConfigsByIdError = PatchConfigsByIdErrors[keyof PatchConfigsByIdErrors];

export type PatchConfigsByIdResponses = {
  /**
   * successful operation
   */
  200: ConfigPostPatchResponse;
};

export type PatchConfigsByIdResponse = PatchConfigsByIdResponses[keyof PatchConfigsByIdResponses];
