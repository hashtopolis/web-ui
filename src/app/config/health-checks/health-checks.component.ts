import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component, inject } from '@angular/core';

import { HealthCheckRoleService } from '@services/roles/config/healthcheck-role.service';

@Component({
  selector: 'app-health-checks',
  templateUrl: './health-checks.component.html',
  standalone: false
})
export class HealthChecksComponent {
  private titleService = inject(AutoTitleService);
  private roleService = inject(HealthCheckRoleService);

  protected showCreateButton = this.roleService.hasRole('create');

  constructor() {
    this.titleService.set(['Show Health Checks']);
  }
}
