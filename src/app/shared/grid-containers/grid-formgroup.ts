import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'grid-form-input',
  template: `
    <div class="form-group">
      <div class="form-outline form-input-custom">
        <label class="form-label {{ labelclass }}" for="{{ name }}">{{ name }}</label>
        @if (tooltip) {
          <fa-icon
            placement="bottom"
            ngbTooltip="{{ tooltip }}"
            container="body"
            [icon]="faInfoCircle"
            aria-hidden="true"
            class="gray-light-ico display-col"
          >
          </fa-icon>
        }
        <div #content><ng-content></ng-content></div>
      </div>
    </div>
  `,
  standalone: false
})
export class GridFormInputComponent {
  faInfoCircle = faInfoCircle;

  @Input() name?: string;
  @Input() labelclass?: string;
  @Input() tooltip?: string;
}
