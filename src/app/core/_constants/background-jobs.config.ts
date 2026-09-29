/**
 * Status of a background job, matching the `status` attribute.
 */
export const BackgroundJobStatus = {
  FAILED: -1,
  PENDING: 0,
  RUNNING: 1,
  DONE: 2
} as const;
export type BackgroundJobStatus = (typeof BackgroundJobStatus)[keyof typeof BackgroundJobStatus];

export const BackgroundJobStatusLabel: Record<BackgroundJobStatus, string> = {
  [BackgroundJobStatus.FAILED]: 'Failed',
  [BackgroundJobStatus.PENDING]: 'Pending',
  [BackgroundJobStatus.RUNNING]: 'Running',
  [BackgroundJobStatus.DONE]: 'Done'
};

/**
 * Job types known to the UI. Later backend versions add more types, which are shown with their raw name.
 */
export const BackgroundJobType = {
  RECOUNT_FILE: 'recount_file'
} as const;
export type BackgroundJobType = (typeof BackgroundJobType)[keyof typeof BackgroundJobType];

export const BackgroundJobTypeLabel: Record<string, string> = {
  [BackgroundJobType.RECOUNT_FILE]: 'Recount file lines'
};

export function formatBackgroundJobStatus(status: number): string {
  return BackgroundJobStatusLabel[status as BackgroundJobStatus] ?? String(status);
}

export function formatBackgroundJobType(jobType: string): string {
  return BackgroundJobTypeLabel[jobType] ?? jobType;
}

/**
 * Renders a job payload as `key: value` pairs, non-scalar values as JSON.
 */
export function formatBackgroundJobPayload(payload: Record<string, unknown> | null | undefined): string {
  if (!payload) {
    return '';
  }
  return Object.entries(payload)
    .map(
      ([key, value]) => `${key}: ${value !== null && typeof value === 'object' ? JSON.stringify(value) : String(value)}`
    )
    .join(', ');
}
