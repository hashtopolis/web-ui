import {
  BackgroundJobStatus,
  formatBackgroundJobPayload,
  formatBackgroundJobStatus,
  formatBackgroundJobType
} from '@constants/background-jobs.config';

describe('background-jobs.config', () => {
  describe('formatBackgroundJobStatus', () => {
    it('labels all known statuses', () => {
      expect(formatBackgroundJobStatus(BackgroundJobStatus.FAILED)).toBe('Failed');
      expect(formatBackgroundJobStatus(BackgroundJobStatus.PENDING)).toBe('Pending');
      expect(formatBackgroundJobStatus(BackgroundJobStatus.RUNNING)).toBe('Running');
      expect(formatBackgroundJobStatus(BackgroundJobStatus.DONE)).toBe('Done');
    });

    it('falls back to the raw value for unknown statuses', () => {
      expect(formatBackgroundJobStatus(7)).toBe('7');
    });
  });

  describe('formatBackgroundJobType', () => {
    it('labels recount_file and scan_cracker', () => {
      expect(formatBackgroundJobType('recount_file')).toBe('Recount file lines');
      expect(formatBackgroundJobType('scan_cracker')).toBe('Scan cracker binary');
    });

    it('falls back to the raw type for types added by later backend versions', () => {
      expect(formatBackgroundJobType('future_job')).toBe('future_job');
    });
  });

  describe('formatBackgroundJobPayload', () => {
    it('renders scalar values as key: value pairs', () => {
      expect(formatBackgroundJobPayload({ fileId: 7 })).toBe('fileId: 7');
      expect(formatBackgroundJobPayload({ a: 'x', b: true })).toBe('a: x, b: true');
    });

    it('renders nested values as JSON', () => {
      expect(formatBackgroundJobPayload({ ids: [1, 2] })).toBe('ids: [1,2]');
    });

    it('renders empty, null and undefined payloads as an empty string', () => {
      expect(formatBackgroundJobPayload({})).toBe('');
      expect(formatBackgroundJobPayload(null)).toBe('');
      expect(formatBackgroundJobPayload(undefined)).toBe('');
    });
  });
});
