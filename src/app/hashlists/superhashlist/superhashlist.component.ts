import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-superhashlist',
  templateUrl: './superhashlist.component.html'
})
export class SuperhashlistComponent {
  constructor(private titleService: AutoTitleService) {
    this.titleService.set(['Show SuperHashlist']);
  }
}
