import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { Component } from '@angular/core';

@Component({
  selector: 'app-button-actions',
  template: `
  <div ngbDropdown container="body">
    <button type="button" class="navbar-toggler btn-actions"  data-mdb-toggle="collapse" data-mdb-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
      aria-expanded="false" aria-label="Toggle navigation" ngbDropdownToggle>
      <fa-icon [icon]="faEllipsisH" aria-hidden="true"></fa-icon>
    </button>
    <div ngbDropdownMenu>
      <div #content><ng-content></ng-content></div>
    </div>
  </div>
  `
})
export class ButtonActionsComponent  {
  faEllipsisH=faEllipsisH;

  constructor() { }

}
