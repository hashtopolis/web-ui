import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { Component } from '@angular/core';

@Component({
    selector: 'app-button-actions',
    template: `
  <div ngbDropdown container="body">
    <button type="button" class="navbar-toggler btn-actions remove-caret"  data-mdb-toggle="collapse" data-mdb-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
      aria-expanded="false"  ngbDropdownToggle>
      <fa-icon [icon]="faEllipsisH" aria-hidden="true"></fa-icon>
    </button>
    <div ngbDropdownMenu>
      <div #content><ng-content></ng-content></div>
    </div>
  </div>
  `,
    standalone: false
})
export class ButtonActionsComponent  {
  faEllipsisH=faEllipsisH;

  constructor() { }

}
