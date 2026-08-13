import type { ErrorResponse } from './common';

export type VoucherCreate = {
  data: {
    type: 'voucher';
    attributes: {
      voucher: string;
    };
  };
};

export type VoucherPatch = {
  data: {
    type: 'voucher';
    attributes: {
      voucher?: string;
    };
  };
};

export type VoucherPatchMultiple = {
  data: Array<{
    id: string;
    type: 'voucher';
    attributes: {
      voucher?: string;
    };
  }>;
};

export type VoucherDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'voucher';
  }>;
};

export type VoucherResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'voucher';
    attributes: {
      voucher: string;
      time: number;
    };
    links: {
      self: string;
    };
  };
};

export type VoucherPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'voucher';
    attributes: {
      voucher: string;
      time: number;
    };
    links: {
      self: string;
    };
  };
};

export type VoucherListResponse = {
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
    type: 'voucher';
    attributes: {
      voucher: string;
      time: number;
    };
    links: {
      self: string;
    };
  }>;
};

export type VoucherCountResponse = {
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

export type DeleteVouchersData = {
  body: VoucherDeleteMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/vouchers';
};

export type DeleteVouchersErrors = {
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

export type DeleteVouchersError = DeleteVouchersErrors[keyof DeleteVouchersErrors];

export type DeleteVouchersResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteVouchersResponse = DeleteVouchersResponses[keyof DeleteVouchersResponses];

export type GetVouchersData = {
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
     * Example: `{"primary":{"regVoucherId": 123}}` -> `eyJwcmltYXJ5Ijp7InJlZ1ZvdWNoZXJJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"regVoucherId": 123}}` -> `eyJwcmltYXJ5Ijp7InJlZ1ZvdWNoZXJJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[regVoucherId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options:
     */
    include?: Array<string>;
  };
  url: '/api/v2/ui/vouchers';
};

export type GetVouchersErrors = {
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

export type GetVouchersError = GetVouchersErrors[keyof GetVouchersErrors];

export type GetVouchersResponses = {
  /**
   * successful operation
   */
  200: VoucherListResponse;
};

export type GetVouchersResponse = GetVouchersResponses[keyof GetVouchersResponses];

export type PatchVouchersData = {
  body: VoucherPatchMultiple;
  path?: never;
  query?: never;
  url: '/api/v2/ui/vouchers';
};

export type PatchVouchersErrors = {
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

export type PatchVouchersError = PatchVouchersErrors[keyof PatchVouchersErrors];

export type PatchVouchersResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchVouchersResponse = PatchVouchersResponses[keyof PatchVouchersResponses];

export type PostVouchersData = {
  body: VoucherCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/vouchers';
};

export type PostVouchersErrors = {
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

export type PostVouchersError = PostVouchersErrors[keyof PostVouchersErrors];

export type PostVouchersResponses = {
  /**
   * successful operation
   */
  201: VoucherPostPatchResponse;
};

export type PostVouchersResponse = PostVouchersResponses[keyof PostVouchersResponses];

export type GetVouchersCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[regVoucherId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/vouchers/count';
};

export type GetVouchersCountErrors = {
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

export type GetVouchersCountError = GetVouchersCountErrors[keyof GetVouchersCountErrors];

export type GetVouchersCountResponses = {
  /**
   * successful operation
   */
  200: VoucherCountResponse;
};

export type GetVouchersCountResponse = GetVouchersCountResponses[keyof GetVouchersCountResponses];

export type DeleteVouchersByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/vouchers/{id}';
};

export type DeleteVouchersByIdErrors = {
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

export type DeleteVouchersByIdError = DeleteVouchersByIdErrors[keyof DeleteVouchersByIdErrors];

export type DeleteVouchersByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteVouchersByIdResponse = DeleteVouchersByIdResponses[keyof DeleteVouchersByIdResponses];

export type GetVouchersByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options:
     */
    include?: Array<string>;
  };
  url: '/api/v2/ui/vouchers/{id}';
};

export type GetVouchersByIdErrors = {
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

export type GetVouchersByIdError = GetVouchersByIdErrors[keyof GetVouchersByIdErrors];

export type GetVouchersByIdResponses = {
  /**
   * successful operation
   */
  200: VoucherResponse;
};

export type GetVouchersByIdResponse = GetVouchersByIdResponses[keyof GetVouchersByIdResponses];

export type PatchVouchersByIdData = {
  body: VoucherPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/vouchers/{id}';
};

export type PatchVouchersByIdErrors = {
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

export type PatchVouchersByIdError = PatchVouchersByIdErrors[keyof PatchVouchersByIdErrors];

export type PatchVouchersByIdResponses = {
  /**
   * successful operation
   */
  200: VoucherPostPatchResponse;
};

export type PatchVouchersByIdResponse = PatchVouchersByIdResponses[keyof PatchVouchersByIdResponses];
