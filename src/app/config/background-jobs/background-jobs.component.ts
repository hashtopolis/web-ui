import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageTitle } from '@src/app/core/_decorators/autotitle';

@Component({
  selector: 'app-background-jobs',
  templateUrl: './background-jobs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
@PageTitle(['Background Jobs'])
export class BackgroundJobsComponent {}
