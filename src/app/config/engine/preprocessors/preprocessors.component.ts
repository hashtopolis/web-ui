import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component } from '@angular/core';

import { PreprocessorRoleService } from '@services/roles/binaries/preprocessor-role.service';

@Component({
  selector: 'app-preprocessors',
  templateUrl: './preprocessors.component.html',
  standalone: false
})
export class PreprocessorsComponent {
  protected showCreateButton = false;

  constructor(
    private titleService: AutoTitleService,
    private preprocssesorRoleService: PreprocessorRoleService
  ) {
    this.titleService.set(['Show Preprocessors']);
    this.showCreateButton = this.preprocssesorRoleService.hasRole('create');
  }
}
