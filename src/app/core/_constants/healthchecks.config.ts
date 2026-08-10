/**
 * Attack mode a health check runs, matching the `checkType` attribute.
 */
export const HealthCheckType = {
  BRUTE_FORCE: 0
} as const;
export type HealthCheckType = (typeof HealthCheckType)[keyof typeof HealthCheckType];

/**
 * Hashcat modes a health check can be benchmarked against.
 */
export const HealthCheckHashType = {
  MD5: 0,
  BCRYPT: 3200
} as const;
export type HealthCheckHashType = (typeof HealthCheckHashType)[keyof typeof HealthCheckHashType];

export const attack = [{ id: HealthCheckType.BRUTE_FORCE, name: 'Brute-Force' }];

export const hashtype = [
  { id: HealthCheckHashType.MD5, name: 'MD5' },
  { id: HealthCheckHashType.BCRYPT, name: 'BCRYPT' }
];
