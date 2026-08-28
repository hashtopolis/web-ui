export type ClientOptions = {
  baseUrl: `${string}://${string}` | (string & {});
};

/**
 * RFC 7807 problem document
 */
export type ErrorResponse = {
  title?: string;
  type?: string;
  status: number;
};

export type Token = {
  token: string;
  expires: number;
};

export type TokenRequest = Array<string>;
