import { TasksTableComponent } from 'src/app/core/_components/tables/tasks-table/tasks-table.component';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component, ViewChild } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-show-tasks',
  templateUrl: './show-tasks.component.html',
  standalone: false
})
export class ShowTasksComponent {
  @ViewChild('table') table: TasksTableComponent;

  pageTitle = 'Tasks';

  constructor(private titleService: AutoTitleService) {
    titleService.set(['Tasks']);
  }

  toggleIsArchived(event: MatSlideToggleChange): void {
    this.table.setIsArchived(event.checked);
    this.pageTitle = event.checked ? 'Tasks (archived)' : 'Tasks';
    this.table.reload();
  }
}
