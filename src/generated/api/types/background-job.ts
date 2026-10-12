import type { ErrorResponse } from './common';

export type BackgroundJobDeleteMultiple = {
  data: Array<{
    id: number;
    type: 'backgroundJob';
  }>;
};

export type BackgroundJobResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: number;
    type: 'backgroundJob';
    attributes: {
      jobType: string;
      payload: {
        [key: string]: unknown;
      };
      status: -1 | 0 | 1 | 2;
      userId: number | null;
      createdAt: number;
      startedAt: number | null;
      finishedAt: number | null;
      exitCode: number | null;
      resultMessage: string | null;
    };
    links: {
      self: string;
    };
    relationships: {
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: number;
        } | null;
      };
    };
  };
  included?: Array<{
    id: number;
    type: 'user';
    attributes: {
      name: string;
      email?: string;
      isValid?: boolean;
      isComputedPassword?: boolean;
      lastLoginDate?: number;
      registeredSince?: number;
      sessionLifetime?: number;
      globalPermissionGroupId?: number;
    };
  }>;
};

export type BackgroundJobListResponse = {
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
    id: number;
    type: 'backgroundJob';
    attributes: {
      jobType: string;
      payload: {
        [key: string]: unknown;
      };
      status: -1 | 0 | 1 | 2;
      userId: number | null;
      createdAt: number;
      startedAt: number | null;
      finishedAt: number | null;
      exitCode: number | null;
      resultMessage: string | null;
    };
    links: {
      self: string;
    };
    relationships: {
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: number;
        } | null;
      };
    };
  }>;
  included?: Array<{
    id: number;
    type: 'user';
    attributes: {
      name: string;
      email?: string;
      isValid?: boolean;
      isComputedPassword?: boolean;
      lastLoginDate?: number;
      registeredSince?: number;
      sessionLifetime?: number;
      globalPermissionGroupId?: number;
    };
  }>;
};

export type BackgroundJobCountResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    /**
     * Number of objects accessible to the current user matching the given filters
     */
    count: number;
    /**
     * Number of objects accessible to the current user without any filter applied, only present when `include_total=true` was requested
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

export type BackgroundJobRelationUser = {
  data: {
    type: 'user';
    id: number;
  };
};

export type BackgroundJobRelationUserGetResponse = {
  data: {
    type: 'user';
    id: number;
  };
};

export type DeleteBackgroundJobsData = {
  body: BackgroundJobDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/backgroundJobs';
};

export type DeleteBackgroundJobsErrors = {
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

export type DeleteBackgroundJobsError = DeleteBackgroundJobsErrors[keyof DeleteBackgroundJobsErrors];

export type DeleteBackgroundJobsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteBackgroundJobsResponse = DeleteBackgroundJobsResponses[keyof DeleteBackgroundJobsResponses];

export type GetBackgroundJobsData = {
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
     * Example: `{"primary":{"backgroundJobId": 123}}` -> `eyJwcmltYXJ5Ijp7ImJhY2tncm91bmRKb2JJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"backgroundJobId": 123}}` -> `eyJwcmltYXJ5Ijp7ImJhY2tncm91bmRKb2JJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[backgroundJobId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: user
     */
    include?: Array<'user'>;
  };
  url: '/api/v2/ui/backgroundJobs';
};

export type GetBackgroundJobsErrors = {
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

export type GetBackgroundJobsError = GetBackgroundJobsErrors[keyof GetBackgroundJobsErrors];

export type GetBackgroundJobsResponses = {
  /**
   * successful operation
   */
  200: BackgroundJobListResponse;
};

export type GetBackgroundJobsResponse = GetBackgroundJobsResponses[keyof GetBackgroundJobsResponses];

export type GetBackgroundJobsCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[backgroundJobId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of accessible objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/backgroundJobs/count';
};

export type GetBackgroundJobsCountErrors = {
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

export type GetBackgroundJobsCountError = GetBackgroundJobsCountErrors[keyof GetBackgroundJobsCountErrors];

export type GetBackgroundJobsCountResponses = {
  /**
   * successful operation
   */
  200: BackgroundJobCountResponse;
};

export type GetBackgroundJobsCountResponse = GetBackgroundJobsCountResponses[keyof GetBackgroundJobsCountResponses];

export type GetBackgroundJobsByIdUserData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/backgroundJobs/{id}/user';
};

export type GetBackgroundJobsByIdUserErrors = {
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

export type GetBackgroundJobsByIdUserError = GetBackgroundJobsByIdUserErrors[keyof GetBackgroundJobsByIdUserErrors];

export type GetBackgroundJobsByIdUserResponses = {
  /**
   * successful operation
   */
  200: BackgroundJobRelationUserGetResponse;
};

export type GetBackgroundJobsByIdUserResponse =
  GetBackgroundJobsByIdUserResponses[keyof GetBackgroundJobsByIdUserResponses];

export type GetBackgroundJobsByIdRelationshipsUserData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/backgroundJobs/{id}/relationships/user';
};

export type GetBackgroundJobsByIdRelationshipsUserErrors = {
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

export type GetBackgroundJobsByIdRelationshipsUserError =
  GetBackgroundJobsByIdRelationshipsUserErrors[keyof GetBackgroundJobsByIdRelationshipsUserErrors];

export type GetBackgroundJobsByIdRelationshipsUserResponses = {
  /**
   * successful operation
   */
  200: BackgroundJobResponse;
};

export type GetBackgroundJobsByIdRelationshipsUserResponse =
  GetBackgroundJobsByIdRelationshipsUserResponses[keyof GetBackgroundJobsByIdRelationshipsUserResponses];

export type PatchBackgroundJobsByIdRelationshipsUserData = {
  body: BackgroundJobRelationUser;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/backgroundJobs/{id}/relationships/user';
};

export type PatchBackgroundJobsByIdRelationshipsUserErrors = {
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

export type PatchBackgroundJobsByIdRelationshipsUserError =
  PatchBackgroundJobsByIdRelationshipsUserErrors[keyof PatchBackgroundJobsByIdRelationshipsUserErrors];

export type PatchBackgroundJobsByIdRelationshipsUserResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchBackgroundJobsByIdRelationshipsUserResponse =
  PatchBackgroundJobsByIdRelationshipsUserResponses[keyof PatchBackgroundJobsByIdRelationshipsUserResponses];

export type DeleteBackgroundJobsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/backgroundJobs/{id}';
};

export type DeleteBackgroundJobsByIdErrors = {
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

export type DeleteBackgroundJobsByIdError = DeleteBackgroundJobsByIdErrors[keyof DeleteBackgroundJobsByIdErrors];

export type DeleteBackgroundJobsByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteBackgroundJobsByIdResponse =
  DeleteBackgroundJobsByIdResponses[keyof DeleteBackgroundJobsByIdResponses];

export type GetBackgroundJobsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options: user
     */
    include?: Array<'user'>;
  };
  url: '/api/v2/ui/backgroundJobs/{id}';
};

export type GetBackgroundJobsByIdErrors = {
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

export type GetBackgroundJobsByIdError = GetBackgroundJobsByIdErrors[keyof GetBackgroundJobsByIdErrors];

export type GetBackgroundJobsByIdResponses = {
  /**
   * successful operation
   */
  200: BackgroundJobResponse;
};

export type GetBackgroundJobsByIdResponse = GetBackgroundJobsByIdResponses[keyof GetBackgroundJobsByIdResponses];
