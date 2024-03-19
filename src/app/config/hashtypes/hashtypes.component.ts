import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hashtypes',
  templateUrl: './hashtypes.component.html'
})
export class HashtypesComponent {
  constructor(private titleService: AutoTitleService) {
    titleService.set(['Show Hashtypes']);
  }
}
