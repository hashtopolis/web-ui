import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { PageTitle } from 'src/app/core/_decorators/autotitle';

import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  standalone: false
})
@PageTitle(['Show Logs'])
export class LogComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
}