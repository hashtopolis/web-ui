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
 *
 * @param content - Reference to the content inside the component.
 *
 * @remarks
 * This component provides a structured layout for displaying buttons inside a grid row.
 */
@Component({
  selector: 'grid-buttons',
  template: `
    <mat-card-content>
      <ng-content></ng-content>
    </mat-card-content>
  `
})
export class GridButtonsComponent {}
