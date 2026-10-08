import { TaskStatus } from '@models/task.model';

import { HTTableIcon } from '@components/tables/ht-table/ht-table.models';

export function taskStatusIcon(status: number | undefined): HTTableIcon {
  switch (status) {
    case TaskStatus.RUNNING:
      return { name: 'radio_button_checked', cls: 'pulsing-progress', tooltip: 'In Progress' };
    case TaskStatus.IDLE:
      return { name: 'schedule', cls: 'text-warning', tooltip: 'Waiting' };
    case TaskStatus.SKIPPED:
      return { name: 'fast_forward', cls: 'text-warning', tooltip: 'Skipped' };
    case TaskStatus.COMPLETED:
      return { name: 'check_circle', cls: 'text-ok', tooltip: 'Completed' };
    default:
      return { name: '' };
  }
}

export function taskStatusLabel(status: number | undefined): string {
  switch (status) {
    case TaskStatus.RUNNING:
      return 'Running';
    case TaskStatus.SKIPPED:
      return 'Skipped';
    case TaskStatus.COMPLETED:
      return 'Completed';
    default:
      return '';
  }
}

/** Visual tone a task status maps to; drives the colour of the card view's status badge. */
export type TaskStatusTone = 'running' | 'waiting' | 'completed' | 'skipped' | 'unknown';

/**
 * Status rendered as a single badge: label, icon and tone in one object.
 * Used by the task card view, where the badge replaces the table's status column.
 */
export interface TaskStatusBadge {
  label: string;
  icon: string;
  tone: TaskStatusTone;
}

/**
 * Describes a task status for the card view. Unlike {@link taskStatusLabel}, every status —
 * including `IDLE` and unknown values — gets a human-readable label, since the badge is the
 * only place the status is shown on a card.
 *
 * @param status - the task status as returned by the `status` aggregate
 */
export function taskStatusBadge(status: number | undefined): TaskStatusBadge {
  switch (status) {
    case TaskStatus.RUNNING:
      return { label: 'Running', icon: 'radio_button_checked', tone: 'running' };
    case TaskStatus.IDLE:
      return { label: 'Waiting', icon: 'schedule', tone: 'waiting' };
    case TaskStatus.SKIPPED:
      return { label: 'Skipped', icon: 'fast_forward', tone: 'skipped' };
    case TaskStatus.COMPLETED:
      return { label: 'Completed', icon: 'check_circle', tone: 'completed' };
    default:
      return { label: 'Unknown', icon: 'help_outline', tone: 'unknown' };
  }
}
