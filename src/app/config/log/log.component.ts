import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageTitle } from '@src/app/core/_decorators/autotitle';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
@PageTitle(['Show Logs'])
export class LogComponent {}
