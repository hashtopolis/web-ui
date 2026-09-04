/**
 * Attack mode a health check runs, matching the `checkType` attribute.
 */
export const HealthCheckType = {
  BRUTE_FORCE: 0
} as const;
export type HealthCheckType = (typeof HealthCheckType)[keyof typeof HealthCheckType];

export const HealthCheckTypeLabels: Record<HealthCheckType, string> = {
  [HealthCheckType.BRUTE_FORCE]: 'Brute-Force'
};

/**
 * Hashcat modes a health check can be benchmarked against.
 */
export const HealthCheckHashType = {
  MD5: 0,
  BCRYPT: 3200
} as const;
export type HealthCheckHashType = (typeof HealthCheckHashType)[keyof typeof HealthCheckHashType];

export const HealthCheckHashTypeLabels: Record<HealthCheckHashType, string> = {
  [HealthCheckHashType.MD5]: 'MD5',
  [HealthCheckHashType.BCRYPT]: 'BCRYPT'
};

export const attack = [{ id: HealthCheckType.BRUTE_FORCE, name: HealthCheckTypeLabels[HealthCheckType.BRUTE_FORCE] }];

export const hashtype = [
  { id: HealthCheckHashType.MD5, name: HealthCheckHashTypeLabels[HealthCheckHashType.MD5] },
  { id: HealthCheckHashType.BCRYPT, name: HealthCheckHashTypeLabels[HealthCheckHashType.BCRYPT] }
];
