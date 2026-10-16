import { TaskStatus } from '@models/task.model';

import { taskStatusBadge, taskStatusIcon, taskStatusLabel } from '@components/tables/task-status.util';

describe('task-status.util', () => {
  const knownStatuses = [TaskStatus.RUNNING, TaskStatus.IDLE, TaskStatus.SKIPPED, TaskStatus.COMPLETED];

  it('should derive the label from the badge for every known status', () => {
    for (const status of knownStatuses) {
      expect(taskStatusLabel(status)).toBe(taskStatusBadge(status).label);
    }
  });

  it('should label idle tasks as "Waiting"', () => {
    expect(taskStatusLabel(TaskStatus.IDLE)).toBe('Waiting');
  });

  it('should derive the icon name from the badge for every known status', () => {
    for (const status of knownStatuses) {
      expect(taskStatusIcon(status).name).toBe(taskStatusBadge(status).icon);
    }
  });

  it('should render no label and no icon for an unknown status', () => {
    expect(taskStatusLabel(undefined)).toBe('');
    expect(taskStatusIcon(undefined)).toEqual({ name: '' });
    expect(taskStatusBadge(undefined).label).toBe('Unknown');
  });
});
