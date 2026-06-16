import { Component } from '@angular/core';

@Component({
  selector: 'app-table',
  template: `
    <mat-card appearance="outlined" class="app-table-card">
      <mat-card-content class="app-table-card__content">
        <ng-content></ng-content>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      /* The hover-card popover on task-name cells positions itself ABOVE the
         row via position:absolute. Every ancestor must allow vertical
         overflow or the popover gets clipped. Per CSS spec, mixing
         overflow-x: auto with overflow-y: visible silently re-computes to
         both being auto — so we have to drop horizontal scroll inside the
         card. Wide tables now scroll at the page level instead. */
      :host {
        display: block;
      }
      .app-table-card,
      .app-table-card .mdc-card,
      .app-table-card__content {
        overflow: visible !important;
      }
    `
  ],
  standalone: false
})
export class TableComponent {}
