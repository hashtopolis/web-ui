import type { ErrorResponse, NotFoundResponse, Token, TokenRequest } from './common';

export type PostTokenData = {
  body: TokenRequest;
  path?: never;
  query?: never;
  url: '/api/v2/auth/token';
};

export type PostTokenErrors = {
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Not Found
   */
  404: NotFoundResponse;
};

export type PostTokenError = PostTokenErrors[keyof PostTokenErrors];

export type PostTokenResponses = {
  /**
   * Success
   */
  200: Token;
};

export type PostTokenResponse = PostTokenResponses[keyof PostTokenResponses];
