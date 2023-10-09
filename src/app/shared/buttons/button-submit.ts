import { Component, Input } from '@angular/core';

@Component({
  selector: 'button-submit',
  template: `
<button class="btn btn-gray-800" type="submit" [disabled]="disabled">{{name}}</button>
  `
})
export class ButtonSubmitComponent {
  @Input() name: string;
  @Input() disabled: boolean;
}
