import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html'
})
export class AllUsersComponent {
  constructor(private titleService: AutoTitleService) {
    titleService.set(['Show Users']);
  }
}
