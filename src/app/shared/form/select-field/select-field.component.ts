import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select-field',
  templateUrl: 'select-field.component.html'
})
export class SelectFieldComponent {
  @Input() fieldName: string;
  @Input() selectOptions: any[];
  @Input() isLoading: boolean;
}
