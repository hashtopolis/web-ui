import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-show-agents',
  templateUrl: './show-agents.component.html'
})
export class ShowAgentsComponent {
  constructor(private titleService: AutoTitleService) {
    this.titleService.set(['Show Agents']);
  }
}
