import { BaseModel } from '@models/base.model';
import { UserId } from '@models/id.types';
import { JUser } from '@models/user.model';

/**
 * Interface definition for a JWT API token.
 *
 * The `token` field is only populated on the response of a POST (creation);
 * subsequent reads do not return it. UI flows must capture and surface it
 * exactly once.
 *
 * Scopes are intentionally absent: they are write-only at creation and baked
 * into the signed JWT payload, never persisted server-side. Detail views must
 * show the matrix structure without a true selection state.
 *
 * `user` is the included creator relationship (populated when the request
 * uses `?include=user`).
 *
 * @extends BaseModel
 */
export interface JApiToken extends BaseModel {
  startValid: number;
  endValid: number;
  userId: UserId;
  isRevoked: boolean;
  token?: string | undefined;
  user?: JUser | null;
}

/** Lifecycle state of a token, derived from its attributes plus the current time. */
export const ApiTokenStatus = {
  ACTIVE: 'active',
  REVOKED: 'revoked',
  EXPIRED: 'expired'
} as const;
export type ApiTokenStatus = (typeof ApiTokenStatus)[keyof typeof ApiTokenStatus];

/**
 * Compute a token's lifecycle state. `nowSec` is the current unix timestamp in
 * seconds; injectable for deterministic tests, otherwise sampled from the
 * system clock at call time. Revoked beats expired so a token revoked after
 * expiry still reads as "Revoked" — closer to user intent than the raw clock
 * comparison.
 */
export function computeApiTokenStatus(token: JApiToken, nowSec?: number): ApiTokenStatus {
  if (token.isRevoked) {
    return ApiTokenStatus.REVOKED;
  }
  const now = nowSec ?? Math.floor(Date.now() / 1000);
  return now >= token.endValid ? ApiTokenStatus.EXPIRED : ApiTokenStatus.ACTIVE;
}
