import { TasksTableComponent } from 'src/app/core/_components/tables/tasks-table/tasks-table.component';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component, ViewChild, inject } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { TasksRoleService } from '@services/roles/tasks/tasks-role.service';

@Component({
  selector: 'app-show-tasks',
  templateUrl: './show-tasks.component.html',
  styleUrls: ['./show-tasks.component.scss'],
  standalone: false
})
export class ShowTasksComponent {
  @ViewChild('table') table: TasksTableComponent;

  private titleService = inject(AutoTitleService);
  readonly roleService = inject(TasksRoleService);

  pageTitle = 'Tasks';
  showCreateButton: boolean = true;

  constructor() {
    this.titleService.set(['Tasks']);
    this.showCreateButton = this.roleService.hasRole('create');
  }

  toggleIsArchived(event: MatSlideToggleChange): void {
    this.table.setIsArchived(event.checked);
    this.pageTitle = event.checked ? 'Tasks (archived)' : 'Tasks';
  }
}
