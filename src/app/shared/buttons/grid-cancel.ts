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
    <div class="row mt-4 py-3 border-top align-items-center">
      <div class="col-12 text-start">
        <div #content><ng-content></ng-content></div>
      </div>
    </div>
  `,
})
export class GridButtonsComponent {}

