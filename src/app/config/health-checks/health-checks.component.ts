import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';

@Component({
    selector: 'app-health-checks',
    templateUrl: './health-checks.component.html',
    standalone: false
})
export class HealthChecksComponent {
  constructor(private titleService: AutoTitleService) {
    this.titleService.set(['Show Health Checks']);
  }
}
