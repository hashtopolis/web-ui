import { TaskSupertaskSubtaskContextMenuService } from '@services/context-menu/tasks/task-supertask-subtask-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('TaskSupertaskSubtaskContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new TaskSupertaskSubtaskContextMenuService(permissionService),
      ['Edit Task', 'Copy to Task', 'Copy to Pretask', 'Delete Task'],
      []
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration(
      (permissionService) => new TaskSupertaskSubtaskContextMenuService(permissionService)
    );
  });
});
