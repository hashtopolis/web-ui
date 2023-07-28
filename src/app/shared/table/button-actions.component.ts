import { Component } from '@angular/core';

@Component({
  selector: 'app-button-actions',
  template: `
  <td class="overflow-hidden align-center">
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

  constructor() { }

}
