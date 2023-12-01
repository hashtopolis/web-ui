import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';

export interface Filter {
  _id: number;
  name: string;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent {
  constructor(private titleService: AutoTitleService) {
    titleService.set(['Notifications']);
  }
}
