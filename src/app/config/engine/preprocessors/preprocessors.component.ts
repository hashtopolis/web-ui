import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PreprocessorRoleService } from '@services/roles/binaries/preprocessor-role.service';

import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';

@Component({
  selector: 'app-preprocessors',
  templateUrl: './preprocessors.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PreprocessorsComponent {
  private titleService = inject(AutoTitleService);
  private preprocssesorRoleService = inject(PreprocessorRoleService);

  protected showCreateButton = false;

  constructor() {
    this.titleService.set(['Show Preprocessors']);
    this.showCreateButton = this.preprocssesorRoleService.hasRole('create');
  }
}
