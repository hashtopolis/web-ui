import type { ErrorResponse, NotFoundResponse } from './common';

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

export type VoucherResponse = {
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
    type: 'voucher';
    attributes: {
      voucher: string;
      time: number;
    };
  };
  relationships?: {
    [key: string]: unknown;
  };
  included?: Array<unknown>;
};

export type VoucherPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  data: {
    id: number;
    type: 'voucher';
    attributes: {
      voucher: string;
      time: number;
    };
  };
};

export type VoucherListResponse = {
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
    type: 'voucher';
    attributes: {
      voucher: string;
      time: number;
    };
  }>;
  relationships?: {
    [key: string]: unknown;
  };
  included?: Array<unknown>;
};

export type DeleteVouchersData = {
  body?: never;
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
};

export type DeleteVouchersError = DeleteVouchersErrors[keyof DeleteVouchersErrors];

export type DeleteVouchersResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetVouchersData = {
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
  body?: never;
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
};

export type PatchVouchersError = PatchVouchersErrors[keyof PatchVouchersErrors];

export type PatchVouchersResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

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
};

export type GetVouchersCountError = GetVouchersCountErrors[keyof GetVouchersCountErrors];

export type GetVouchersCountResponses = {
  /**
   * successful operation
   */
  200: VoucherListResponse;
};

export type GetVouchersCountResponse = GetVouchersCountResponses[keyof GetVouchersCountResponses];

export type DeleteVouchersByIdData = {
  body: {
    [key: string]: unknown;
  };
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
   * Not Found
   */
  404: NotFoundResponse;
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
     * Items to include. Comma seperated
     */
    include?: string;
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
   * Not Found
   */
  404: NotFoundResponse;
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
   * Not Found
   */
  404: NotFoundResponse;
};

export type PatchVouchersByIdError = PatchVouchersByIdErrors[keyof PatchVouchersByIdErrors];

export type PatchVouchersByIdResponses = {
  /**
   * successful operation
   */
  200: VoucherPostPatchResponse;
};

export type PatchVouchersByIdResponse = PatchVouchersByIdResponses[keyof PatchVouchersByIdResponses];
