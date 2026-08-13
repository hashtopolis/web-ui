import type { ErrorResponse } from './common';

export type ConfigPatch = {
  data: {
    type: 'config';
    attributes: {
      item?: string;
      value?: string;
    };
  };
};

export type ConfigPatchMultiple = {
  data: Array<{
    id: string;
    type: 'config';
    attributes: {
      item?: string;
      value?: string;
    };
  }>;
};

export type ConfigResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'config';
    attributes:
      | {
          configSectionId: string;
          item: 'serverLogLevel';
          value: '0' | '10' | '20' | '30' | '40' | '50';
        }
      | {
          configSectionId: string;
          item: 'notificationsProxyType';
          value: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
        }
      | {
          configSectionId: string;
          item: string;
          value: string;
        };
    links: {
      self: string;
    };
    relationships: {
      configSection: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'configSection';
          id: string;
        } | null;
      };
    };
  };
  included?: Array<{
    id: string;
    type: 'configSection';
    attributes: {
      sectionName: string;
    };
  }>;
};

export type ConfigSingleResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'config';
    attributes:
      | {
          configSectionId: string;
          item: 'serverLogLevel';
          value: '0' | '10' | '20' | '30' | '40' | '50';
        }
      | {
          configSectionId: string;
          item: 'notificationsProxyType';
          value: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
        }
      | {
          configSectionId: string;
          item: string;
          value: string;
        };
    links: {
      self: string;
    };
    relationships: {
      configSection: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'configSection';
          id: string;
        } | null;
      };
    };
  };
  included?: Array<{
    id: string;
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
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'config';
    attributes:
      | {
          configSectionId: string;
          item: 'serverLogLevel';
          value: '0' | '10' | '20' | '30' | '40' | '50';
        }
      | {
          configSectionId: string;
          item: 'notificationsProxyType';
          value: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
        }
      | {
          configSectionId: string;
          item: string;
          value: string;
        };
    links: {
      self: string;
    };
    relationships: {
      configSection: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'configSection';
          id: string;
        } | null;
      };
    };
  };
  included?: Array<{
    id: string;
    type: 'configSection';
    attributes: {
      sectionName: string;
    };
  }>;
};

export type ConfigListResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
    first: string;
    last: string | null;
    next: string | null;
    prev: string | null;
  };
  meta: {
    page: {
      total_elements: number;
    };
  };
  data: Array<{
    id: string;
    type: 'config';
    attributes:
      | {
          configSectionId: string;
          item: 'serverLogLevel';
          value: '0' | '10' | '20' | '30' | '40' | '50';
        }
      | {
          configSectionId: string;
          item: 'notificationsProxyType';
          value: 'HTTP' | 'HTTPS' | 'SOCKS4' | 'SOCKS5';
        }
      | {
          configSectionId: string;
          item: string;
          value: string;
        };
    links: {
      self: string;
    };
    relationships: {
      configSection: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'configSection';
          id: string;
        } | null;
      };
    };
  }>;
  included?: Array<{
    id: string;
    type: 'configSection';
    attributes: {
      sectionName: string;
    };
  }>;
};

export type ConfigCountResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    /**
     * Number of objects matching the given filters
     */
    count: number;
    /**
     * Number of objects without any filter applied, only present when `include_total=true` was requested
     */
    total_count?: number;
  };
  /**
   * Always empty: the count is reported under meta.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type ConfigRelationConfigSection = {
  data: {
    type: 'configSection';
    id: string;
  };
};

export type ConfigRelationConfigSectionGetResponse = {
  data: {
    type: 'configSection';
    id: string;
  };
};

export type GetConfigsData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Pointer to paginate to retrieve the data after the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"configId": 123}}` -> `eyJwcmltYXJ5Ijp7ImNvbmZpZ0lkIjogMTIzfX0=`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"configId": 123}}` -> `eyJwcmltYXJ5Ijp7ImNvbmZpZ0lkIjogMTIzfX0=`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[configId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: configSection
     */
    include?: Array<'configSection'>;
    /**
     * Aggregated fields to include by type (comma separated values). Possible options: config: valueBoundaries
     */
    aggregate?: {
      [key: string]: string;
    };
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
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
  body: ConfigPatchMultiple;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
};

export type PatchConfigsError = PatchConfigsErrors[keyof PatchConfigsErrors];

export type PatchConfigsResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchConfigsResponse = PatchConfigsResponses[keyof PatchConfigsResponses];

export type GetConfigsCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[configId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetConfigsCountError = GetConfigsCountErrors[keyof GetConfigsCountErrors];

export type GetConfigsCountResponses = {
  /**
   * successful operation
   */
  200: ConfigCountResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
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
     * Relationships to include in the response, comma seperated. Possible options: configSection
     */
    include?: Array<'configSection'>;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
};

export type PatchConfigsByIdError = PatchConfigsByIdErrors[keyof PatchConfigsByIdErrors];

export type PatchConfigsByIdResponses = {
  /**
   * successful operation
   */
  200: ConfigPostPatchResponse;
};

export type PatchConfigsByIdResponse = PatchConfigsByIdResponses[keyof PatchConfigsByIdResponses];
