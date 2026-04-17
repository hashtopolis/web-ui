export type ClientOptions = {
  baseUrl: `${string}://${string}` | (string & {});
};

export type ErrorResponse = {
  title?: string;
  type?: string;
  status: number;
};

export type NotFoundResponse = {
  message: string;
  exception?: {
    type?: string;
    code?: number;
    message?: string;
    file?: string;
    line?: number;
  };
};

export type Token = {
  token: string;
  expires: number;
};

export type TokenRequest = Array<string>;
