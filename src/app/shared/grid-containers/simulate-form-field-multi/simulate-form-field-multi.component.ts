import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'simulate-form-field-multi',
  templateUrl: './simulate-form-field-multi.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SimulateFormFieldMultiComponent {
  @Input() label: string;
  @Input() items: any;
  @Input() routerLink: string;

  isActive(): boolean {
    return false;
  }

  getLink(id: number, lastpath: string) {
    return this.routerLink + '/' + id + '/' + lastpath;
  }
}
