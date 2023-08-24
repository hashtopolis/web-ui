import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-table',
  templateUrl: './modal-table.component.html'
})
export class ModalTableComponent  {

  @Input() title?: any;
  @Input() tableheaders?: any;
  @Input() tablerows?: any;

}
