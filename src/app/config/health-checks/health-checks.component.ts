import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component } from '@angular/core';

import { HealthCheckRoleService } from '@services/roles/config/healthcheck-role.service';

@Component({
  selector: 'app-health-checks',
  templateUrl: './health-checks.component.html',
  standalone: false
})
export class HealthChecksComponent {
  protected showCreateButton: boolean;
  constructor(
    private titleService: AutoTitleService,
    private roleService: HealthCheckRoleService
  ) {
    this.titleService.set(['Show Health Checks']);
    this.showCreateButton = this.roleService.hasRole('create');
  }
}
