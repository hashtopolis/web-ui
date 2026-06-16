import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'grid-main',
  template: `
    <mat-card class="grid-main" appearance="outlined">
      <mat-card-content>
        <ng-container #content><ng-content></ng-content></ng-container>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./grid-main.scss'],
  standalone: false
})
export class GridMainComponent {
  @Input() narrow = false;

  @HostBinding('class.grid-main--narrow') get narrowClass(): boolean {
    return this.narrow;
  }
}
