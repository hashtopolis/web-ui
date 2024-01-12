import { Component, Input } from '@angular/core';

@Component({
  selector: 'grid-main',
  template: `
    <div class="grid-wrapper">
      <mat-card class="grid-main">
        <mat-card-content>
          <ng-container #content><ng-content></ng-content></ng-container>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class GridMainComponent {
  @Input() class: any;
  @Input() centered?: boolean;
}
