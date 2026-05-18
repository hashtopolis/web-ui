import { TasksTableComponent } from 'src/app/core/_components/tables/tasks-table/tasks-table.component';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component, ViewChild } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { TasksRoleService } from '@services/roles/tasks/tasks-role.service';

@Component({
  selector: 'app-show-tasks',
  templateUrl: './show-tasks.component.html',
  standalone: false
})
export class ShowTasksComponent {
  @ViewChild('table') table: TasksTableComponent;

  pageTitle = 'Tasks';
  showCreateButton: boolean = true;

  constructor(
    private titleService: AutoTitleService,
    readonly roleService: TasksRoleService
  ) {
    titleService.set(['Tasks']);
    this.showCreateButton = this.roleService.hasRole('create');
  }

  toggleIsArchived(event: MatSlideToggleChange): void {
    this.table.setIsArchived(event.checked);
    this.pageTitle = event.checked ? 'Tasks (archived)' : 'Tasks';
  }
}
