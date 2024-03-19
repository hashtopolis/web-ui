import { Component } from '@angular/core';

import { ModalPretasksComponent } from './modal-pretasks/modal-pretasks.component';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

@Component({
  selector: 'app-supertasks',
  templateUrl: './supertasks.component.html'
})
export class SupertasksComponent {
  constructor(private titleService: AutoTitleService) {
    titleService.set(['Show Preconfigured Task']);
  }
}
