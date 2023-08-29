import { faInfoCircle  }  from '@fortawesome/free-solid-svg-icons';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'grid-form-input',
  template: `
<div class="form-group">
  <div class="form-outline form-input-custom">
      <label class="form-label {{labelclass}}" for={{name}} >{{name}}</label>
        <fa-icon
                placement="bottom"
                ngbTooltip='{{tooltip}}'
                container="body"
                [icon]="faInfoCircle"
                aria-hidden="true"
                class="gray-light-ico display-col"
                *ngIf="tooltip"
        >
        </fa-icon>
      <div #content><ng-content></ng-content></div>
  </div>
</div>
  `
})
export class GridFormInputComponent  {

  faInfoCircle=faInfoCircle;

  @Input() name?: any;
  @Input() labelclass?: any;
  @Input() tooltip?: any;

  tooltio: any;

  constructor(
    private router: Router
  ) { }

}


