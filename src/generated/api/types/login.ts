import type { ErrorResponse, Token, TokenRequest } from './common';

export type PostTokenData = {
  body: TokenRequest;
  path?: never;
  query?: never;
  url: '/api/v2/auth/token';
};

export type PostTokenErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PostTokenError = PostTokenErrors[keyof PostTokenErrors];

export type PostTokenResponses = {
  /**
   * Success
   */
  201: Token;
};

export type PostTokenResponse = PostTokenResponses[keyof PostTokenResponses];
