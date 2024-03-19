import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-show-cracks',
  templateUrl: './show-cracks.component.html'
})
export class ShowCracksComponent {
  constructor(private titleService: AutoTitleService) {
    titleService.set(['Show Cracks']);
  }
}
