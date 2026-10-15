import { PageTitle } from 'src/app/core/_decorators/autotitle';

import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
@PageTitle(['Show Logs'])
export class LogComponent {}
