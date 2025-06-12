import { Component } from '@angular/core';

import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-crackers',
  templateUrl: './crackers.component.html',
  standalone: false
})
export class CrackersComponent {
  constructor(private titleService: AutoTitleService) {
    this.titleService.set(['Show Crackers']);
  }
}
