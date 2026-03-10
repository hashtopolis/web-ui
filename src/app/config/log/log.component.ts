import { PageTitle } from 'src/app/core/_decorators/autotitle';

import { Component } from '@angular/core';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  standalone: false
})
@PageTitle(['Show Logs'])
export class LogComponent {
}