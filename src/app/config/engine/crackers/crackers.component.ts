import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';
import { PageTitle } from 'src/app/core/_decorators/autotitle';

@Component({
  selector: 'app-crackers',
  templateUrl: './crackers.component.html'
})
export class CrackersComponent {
  constructor(private titleService: AutoTitleService) {
    this.titleService.set(['Show Crackers']);
  }
}
