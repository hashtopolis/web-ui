import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { TaskContextMenuService } from '@services/context-menu/tasks/task-menu.service';

describe('TaskContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
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
});
