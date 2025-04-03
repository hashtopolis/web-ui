import { Component } from '@angular/core';

import { AutoTitleService } from '@services/shared/autotitle.service';

export interface Filter {
  id: number;
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
