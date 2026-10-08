import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component, inject } from '@angular/core';

/**
 * Global list of the hashtypes. Hashtypes are not created here: hashcat versions get them from the background scan,
 * generic versions create them on their edit page.
 */
@Component({
  selector: 'app-hashtypes',
  templateUrl: './hashtypes.component.html',
  standalone: false
})
export class HashtypesComponent {
  private titleService = inject(AutoTitleService);

  constructor() {
    this.titleService.set(['Show Hashtypes']);
  }
}
