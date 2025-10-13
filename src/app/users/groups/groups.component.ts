import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    standalone: false
})
export class GroupsComponent {
  constructor(private titleService: AutoTitleService) {
    titleService.set(['Show Groups']);
  }
}
