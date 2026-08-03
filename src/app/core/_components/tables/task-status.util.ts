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
