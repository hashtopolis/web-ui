import { Component, Input, ViewEncapsulation } from '@angular/core';

import { SelectOption } from '@src/app/shared/utils/forms';

@Component({
  selector: 'simulate-form-field-multi',
  templateUrl: './simulate-form-field-multi.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class SimulateFormFieldMultiComponent {
  @Input() label: string;
  @Input() items: SelectOption<number>[];
  @Input() routerLink: string;

  isActive(): boolean {
    return false;
  }

  getLink(id: number, lastpath: string) {
    return this.routerLink + '/' + id + '/' + lastpath;
  }
}
