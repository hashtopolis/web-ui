import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  template: `
<div class="card shadow">
  <div [ngClass]="getResizeTable()" class="btn-overflow">
      <div #content><ng-content ></ng-content></div>
  </div>
</div>
`,
host: {
  "(window:resize)":"onWindowResize($event)"
}
})
export class TableComponent  {

  constructor(
    private router: Router
  ) { }

  public getResizeTable(){

   return 'card-body table-responsive';

  }


}
