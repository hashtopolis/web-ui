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

  // getPretasks(id: number){
  //   const ref = this.modalService.open(ModalPretasksComponent, { centered: true, size: 'xl'  });
  //   const _filter = this.allsupertasks.filter(u=> u.supertaskId == id);
  //   this.pretasks = _filter[0]['pretasks'];
  //   ref.componentInstance.prep = _filter[0]['pretasks'];
  //   ref.componentInstance.supertaskid = id;
  //   ref.componentInstance.title = 'Edit Pretaks'
  // }
}
