import { faEdit, faCopy, faBookmark, faArchive, faTrash  }  from '@fortawesome/free-solid-svg-icons';
import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-actions',
  template: `
  <td class="overflow-hidden">
    <div ngbDropdown container="body">
      <button type="button" class="btn btn-sm btn-gray-800 btn-sm btn-actions" ngbDropdownToggle>Actions</button>
      <div ngbDropdownMenu>
        <div #content><ng-content></ng-content></div>
      </div>
    </div>
  </td>
  `
})
export class ButtonActionsComponent  {

  constructor(
    private router: Router
  ) { }

}
