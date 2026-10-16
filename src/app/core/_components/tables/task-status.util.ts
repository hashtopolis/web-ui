import { TaskStatus } from '@models/task.model';

import { HTTableIcon } from '@components/tables/ht-table/ht-table.models';

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
 * Describes a task status for the card view. This is the single source of the status mapping:
 * {@link taskStatusIcon} and {@link taskStatusLabel} are derived from it. Unknown values get an
 * "Unknown" label here, since the badge is the only place the status is shown on a card.
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

/** Table-only styling of the status icon per tone; the icon name itself comes from the badge. */
const STATUS_ICON_STYLE: Record<Exclude<TaskStatusTone, 'unknown'>, Pick<HTTableIcon, 'cls' | 'tooltip'>> = {
  running: { cls: 'pulsing-progress', tooltip: 'In Progress' },
  waiting: { cls: 'text-warning', tooltip: 'Waiting' },
  skipped: { cls: 'text-warning', tooltip: 'Skipped' },
  completed: { cls: 'text-ok', tooltip: 'Completed' }
};

/**
 * Status icon for the table's status column, derived from {@link taskStatusBadge}. Unknown
 * statuses render no icon.
 *
 * @param status - the task status as returned by the `status` aggregate
 */
export function taskStatusIcon(status: number | undefined): HTTableIcon {
  const badge = taskStatusBadge(status);
  if (badge.tone === 'unknown') {
    return { name: '' };
  }
  return { name: badge.icon, ...STATUS_ICON_STYLE[badge.tone] };
}

/**
 * Status as plain text (e.g. for exports), derived from {@link taskStatusBadge}. Unknown statuses
 * yield an empty string, matching the table, which shows no icon for them.
 *
 * @param status - the task status as returned by the `status` aggregate
 */
export function taskStatusLabel(status: number | undefined): string {
  const badge = taskStatusBadge(status);
  return badge.tone === 'unknown' ? '' : badge.label;
}
