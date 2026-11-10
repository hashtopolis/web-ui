import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { TaskSupertaskSubtaskContextMenuService } from '@services/context-menu/tasks/task-supertask-subtask-menu.service';

describe('TaskSupertaskSubtaskContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new TaskSupertaskSubtaskContextMenuService(permissionService),
      ['Edit Task', 'Copy to Task', 'Copy to Pretask', 'Delete Task'],
      []
    );
  });
});
