import { Component } from '@angular/core';

/**
 * Component for displaying a row with buttons in a grid layout.
 *
 * @example
 * <grid-buttons>
 *   <!-- Your button content goes here -->
 *   <button (click)="doSomething()">Button 1</button>
 *   <button (click)="doSomethingElse()">Button 2</button>
 * </grid-buttons>
 *
 * @selector grid-buttons
 */
@Component({
  selector: 'grid-buttons',
  template: `
    <mat-card-actions class="grid-buttons">
      <ng-content></ng-content>
    </mat-card-actions>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .grid-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
        padding: 0;
        margin-top: 16px;
      }
    `
  ],
  standalone: false
})
export class GridButtonsComponent {}
