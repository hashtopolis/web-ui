import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-show-cracks',
  templateUrl: './show-cracks.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ShowCracksComponent {
  private titleService = inject(AutoTitleService);

  constructor() {
    this.titleService.set(['Show Cracks']);
  }
}
