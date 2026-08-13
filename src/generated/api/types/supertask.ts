import type { ErrorResponse } from './common';

export type SupertaskCreate = {
  data: {
    type: 'supertask';
    attributes: {
      pretasks: Array<number>;
      supertaskName: string;
    };
  };
};

export type SupertaskPatch = {
  data: {
    type: 'supertask';
    attributes: {
      supertaskName?: string;
    };
  };
};

export type SupertaskPatchMultiple = {
  data: Array<{
    id: string;
    type: 'supertask';
    attributes: {
      supertaskName?: string;
    };
  }>;
};

export type SupertaskDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'supertask';
  }>;
};

export type SupertaskResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'supertask';
    attributes: {
      supertaskName: string;
    };
    links: {
      self: string;
    };
    relationships: {
      pretasks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'preTask';
          id: string;
        }>;
      };
    };
  };
  included?: Array<{
    id: string;
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
      crackerBinaryTypeId: string;
    };
  }>;
};

export type SupertaskSingleResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'supertask';
    attributes: {
      supertaskName: string;
    };
    links: {
      self: string;
    };
    relationships: {
      pretasks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'preTask';
          id: string;
        }>;
      };
    };
  };
  included?: Array<{
    id: string;
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
      crackerBinaryTypeId: string;
    };
  }>;
};

export type SupertaskPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'supertask';
    attributes: {
      supertaskName: string;
    };
    links: {
      self: string;
    };
    relationships: {
      pretasks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'preTask';
          id: string;
        }>;
      };
    };
  };
  included?: Array<{
    id: string;
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
      crackerBinaryTypeId: string;
    };
  }>;
};

export type SupertaskListResponse = {
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
    type: 'supertask';
    attributes: {
      supertaskName: string;
    };
    links: {
      self: string;
    };
    relationships: {
      pretasks: {
        links: {
          self: string;
          related: string;
        };
        data?: Array<{
          type: 'preTask';
          id: string;
        }>;
      };
    };
  }>;
  included?: Array<{
    id: string;
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
      crackerBinaryTypeId: string;
    };
  }>;
};

export type SupertaskCountResponse = {
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

export type SupertaskRelationPretasks = {
  data: Array<{
    type: 'pretasks';
    id: string;
  }>;
};

export type SupertaskRelationPretasksGetResponse = {
  data: Array<{
    type: 'pretasks';
    id: string;
  }>;
};

export type DeleteSupertasksData = {
  body: SupertaskDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/supertasks';
};

export type DeleteSupertasksErrors = {
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

export type DeleteSupertasksError = DeleteSupertasksErrors[keyof DeleteSupertasksErrors];

export type DeleteSupertasksResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteSupertasksResponse = DeleteSupertasksResponses[keyof DeleteSupertasksResponses];

export type GetSupertasksData = {
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
     * Example: `{"primary":{"supertaskId": 123}}` -> `eyJwcmltYXJ5Ijp7InN1cGVydGFza0lkIjogMTIzfX0=`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"supertaskId": 123}}` -> `eyJwcmltYXJ5Ijp7InN1cGVydGFza0lkIjogMTIzfX0=`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[supertaskId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: pretasks
     */
    include?: Array<'pretasks'>;
    /**
     * Aggregated fields to include by type (comma separated values). Possible options: supertask: amountPretasks
     */
    aggregate?: {
      [key: string]: string;
    };
  };
  url: '/api/v2/ui/supertasks';
};

export type GetSupertasksErrors = {
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

export type GetSupertasksError = GetSupertasksErrors[keyof GetSupertasksErrors];

export type GetSupertasksResponses = {
  /**
   * successful operation
   */
  200: SupertaskListResponse;
};

export type GetSupertasksResponse = GetSupertasksResponses[keyof GetSupertasksResponses];

export type PatchSupertasksData = {
  body: SupertaskPatchMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/supertasks';
};

export type PatchSupertasksErrors = {
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

export type PatchSupertasksError = PatchSupertasksErrors[keyof PatchSupertasksErrors];

export type PatchSupertasksResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchSupertasksResponse = PatchSupertasksResponses[keyof PatchSupertasksResponses];

export type PostSupertasksData = {
  body: SupertaskCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/supertasks';
};

export type PostSupertasksErrors = {
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
   * Resource already exists
   */
  409: ErrorResponse;
};

export type PostSupertasksError = PostSupertasksErrors[keyof PostSupertasksErrors];

export type PostSupertasksResponses = {
  /**
   * successful operation
   */
  201: SupertaskPostPatchResponse;
};

export type PostSupertasksResponse = PostSupertasksResponses[keyof PostSupertasksResponses];

export type GetSupertasksCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[supertaskId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/supertasks/count';
};

export type GetSupertasksCountErrors = {
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

export type GetSupertasksCountError = GetSupertasksCountErrors[keyof GetSupertasksCountErrors];

export type GetSupertasksCountResponses = {
  /**
   * successful operation
   */
  200: SupertaskCountResponse;
};

export type GetSupertasksCountResponse = GetSupertasksCountResponses[keyof GetSupertasksCountResponses];

export type GetSupertasksByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/supertasks/{id}/{relation}';
};

export type GetSupertasksByIdByRelationErrors = {
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

export type GetSupertasksByIdByRelationError =
  GetSupertasksByIdByRelationErrors[keyof GetSupertasksByIdByRelationErrors];

export type GetSupertasksByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: SupertaskRelationPretasksGetResponse;
};

export type GetSupertasksByIdByRelationResponse =
  GetSupertasksByIdByRelationResponses[keyof GetSupertasksByIdByRelationResponses];

export type DeleteSupertasksByIdRelationshipsByRelationData = {
  body: SupertaskRelationPretasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/supertasks/{id}/relationships/{relation}';
};

export type DeleteSupertasksByIdRelationshipsByRelationErrors = {
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

export type DeleteSupertasksByIdRelationshipsByRelationError =
  DeleteSupertasksByIdRelationshipsByRelationErrors[keyof DeleteSupertasksByIdRelationshipsByRelationErrors];

export type DeleteSupertasksByIdRelationshipsByRelationResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteSupertasksByIdRelationshipsByRelationResponse =
  DeleteSupertasksByIdRelationshipsByRelationResponses[keyof DeleteSupertasksByIdRelationshipsByRelationResponses];

export type GetSupertasksByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/supertasks/{id}/relationships/{relation}';
};

export type GetSupertasksByIdRelationshipsByRelationErrors = {
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

export type GetSupertasksByIdRelationshipsByRelationError =
  GetSupertasksByIdRelationshipsByRelationErrors[keyof GetSupertasksByIdRelationshipsByRelationErrors];

export type GetSupertasksByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: SupertaskResponse;
};

export type GetSupertasksByIdRelationshipsByRelationResponse =
  GetSupertasksByIdRelationshipsByRelationResponses[keyof GetSupertasksByIdRelationshipsByRelationResponses];

export type PatchSupertasksByIdRelationshipsByRelationData = {
  body: SupertaskRelationPretasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/supertasks/{id}/relationships/{relation}';
};

export type PatchSupertasksByIdRelationshipsByRelationErrors = {
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

export type PatchSupertasksByIdRelationshipsByRelationError =
  PatchSupertasksByIdRelationshipsByRelationErrors[keyof PatchSupertasksByIdRelationshipsByRelationErrors];

export type PatchSupertasksByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchSupertasksByIdRelationshipsByRelationResponse =
  PatchSupertasksByIdRelationshipsByRelationResponses[keyof PatchSupertasksByIdRelationshipsByRelationResponses];

export type PostSupertasksByIdRelationshipsByRelationData = {
  body: SupertaskRelationPretasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/supertasks/{id}/relationships/{relation}';
};

export type PostSupertasksByIdRelationshipsByRelationErrors = {
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

export type PostSupertasksByIdRelationshipsByRelationError =
  PostSupertasksByIdRelationshipsByRelationErrors[keyof PostSupertasksByIdRelationshipsByRelationErrors];

export type PostSupertasksByIdRelationshipsByRelationResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostSupertasksByIdRelationshipsByRelationResponse =
  PostSupertasksByIdRelationshipsByRelationResponses[keyof PostSupertasksByIdRelationshipsByRelationResponses];

export type DeleteSupertasksByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/supertasks/{id}';
};

export type DeleteSupertasksByIdErrors = {
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

export type DeleteSupertasksByIdError = DeleteSupertasksByIdErrors[keyof DeleteSupertasksByIdErrors];

export type DeleteSupertasksByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteSupertasksByIdResponse = DeleteSupertasksByIdResponses[keyof DeleteSupertasksByIdResponses];

export type GetSupertasksByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options: pretasks
     */
    include?: Array<'pretasks'>;
  };
  url: '/api/v2/ui/supertasks/{id}';
};

export type GetSupertasksByIdErrors = {
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

export type GetSupertasksByIdError = GetSupertasksByIdErrors[keyof GetSupertasksByIdErrors];

export type GetSupertasksByIdResponses = {
  /**
   * successful operation
   */
  200: SupertaskResponse;
};

export type GetSupertasksByIdResponse = GetSupertasksByIdResponses[keyof GetSupertasksByIdResponses];

export type PatchSupertasksByIdData = {
  body: SupertaskPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/supertasks/{id}';
};

export type PatchSupertasksByIdErrors = {
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

export type PatchSupertasksByIdError = PatchSupertasksByIdErrors[keyof PatchSupertasksByIdErrors];

export type PatchSupertasksByIdResponses = {
  /**
   * successful operation
   */
  200: SupertaskPostPatchResponse;
};

export type PatchSupertasksByIdResponse = PatchSupertasksByIdResponses[keyof PatchSupertasksByIdResponses];
