import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-show-tasks',
  templateUrl: './show-tasks.component.html'
})
export class ShowTasksComponent {
  // View type,filter options
  isArchived: boolean;
  whichView: string;

  constructor(private titleService: AutoTitleService) {
    titleService.set(['Show Tasks']);
  }
}
