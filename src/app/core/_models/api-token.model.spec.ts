import { ApiTokenStatus, JApiToken, computeApiTokenStatus } from '@models/api-token.model';

describe('computeApiTokenStatus', () => {
  function token(overrides: Partial<JApiToken> = {}): JApiToken {
    return {
      id: 1,
      type: 'apiToken',
      startValid: 0,
      endValid: 1_000,
      userId: 1,
      isRevoked: false,
      ...overrides
    };
  }

  it('returns ACTIVE when nowSec is before endValid and not revoked', () => {
    expect(computeApiTokenStatus(token({ endValid: 2_000 }), 1_000)).toBe(ApiTokenStatus.ACTIVE);
  });

  it('returns EXPIRED when nowSec equals endValid and not revoked', () => {
    expect(computeApiTokenStatus(token({ endValid: 1_000 }), 1_000)).toBe(ApiTokenStatus.EXPIRED);
  });

  it('returns REVOKED when isRevoked is true even if the token is otherwise active', () => {
    expect(computeApiTokenStatus(token({ isRevoked: true, endValid: 2_000 }), 1_000)).toBe(ApiTokenStatus.REVOKED);
  });

  it('prefers REVOKED over EXPIRED when a revoked token has also expired', () => {
    expect(computeApiTokenStatus(token({ isRevoked: true, endValid: 500 }), 1_000)).toBe(ApiTokenStatus.REVOKED);
  });
});
