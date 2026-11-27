import { TaskStatus } from '@models/task.model';

import { HTTableIcon } from '@components/tables/ht-table/ht-table.models';
import { taskStatusIcon, taskStatusLabel } from '@components/tables/task-status.util';

describe('task-status.util', () => {
  describe('taskStatusIcon', () => {
    it.each<[string, number, HTTableIcon]>([
      [
        'RUNNING',
        TaskStatus.RUNNING,
        { name: 'radio_button_checked', cls: 'pulsing-progress', tooltip: 'In Progress' }
      ],
      ['IDLE', TaskStatus.IDLE, { name: 'schedule', cls: 'text-warning', tooltip: 'Waiting' }],
      ['SKIPPED', TaskStatus.SKIPPED, { name: 'fast_forward', cls: 'text-warning', tooltip: 'Skipped' }],
      ['COMPLETED', TaskStatus.COMPLETED, { name: 'check_circle', cls: 'text-ok', tooltip: 'Completed' }]
    ])('should return the icon for status %s', (_label, status, expected) => {
      const icon = taskStatusIcon(status);

      expect(icon).toStrictEqual(expected);
    });

    it.each([undefined, 0, 5, -1])('should return an empty icon for undefined or unknown status %d', (status) => {
      const icon = taskStatusIcon(status);

      expect(icon).toStrictEqual({ name: '' });
    });
  });

  describe('taskStatusLabel', () => {
    it.each<[string, number, string]>([
      ['RUNNING', TaskStatus.RUNNING, 'Running'],
      ['SKIPPED', TaskStatus.SKIPPED, 'Skipped'],
      ['COMPLETED', TaskStatus.COMPLETED, 'Completed']
    ])('should return the label for status %s', (_label, status, expected) => {
      const label = taskStatusLabel(status);

      expect(label).toBe(expected);
    });

    it.each([undefined, 0, 5, -1])('should return an empty label for undefined or unknown status %d', (status) => {
      const label = taskStatusLabel(status);

      expect(label).toBe('');
    });
  });
});
