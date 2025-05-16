import { Component } from '@angular/core';

import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-show-cracks',
  templateUrl: './show-cracks.component.html',
  standalone: false
})
export class ShowCracksComponent {
  constructor(private titleService: AutoTitleService) {
    titleService.set(['Show Cracks']);
  }
}
