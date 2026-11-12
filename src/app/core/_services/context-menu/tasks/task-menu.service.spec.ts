import { TaskContextMenuService } from '@services/context-menu/tasks/task-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('TaskContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new TaskContextMenuService(permissionService),
      [
        'Edit Task',
        'Show Subtasks',
        'Copy to Task',
        'Copy to Pretask',
        'Archive Task',
        'Unarchive Task',
        'Delete Task'
      ],
      ['Archive Tasks', 'Delete Tasks']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new TaskContextMenuService(permissionService));
  });
});
