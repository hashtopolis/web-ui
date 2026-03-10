import { Component } from '@angular/core';

@Component({
  selector: 'app-table',
  template: `
    <div class="card shadow">
      <div [ngClass]="getResizeTable()" class="btn-overflow" style="overflow-y: visible;">
        <div #content><ng-content></ng-content></div>
      </div>
    </div>
  `,
  standalone: false
})
export class TableComponent {
  public getResizeTable() {
    return 'card-body table-responsive';
  }
}
