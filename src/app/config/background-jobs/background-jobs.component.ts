import { PageTitle } from 'src/app/core/_decorators/autotitle';

import { Component } from '@angular/core';

@Component({
  selector: 'app-background-jobs',
  templateUrl: './background-jobs.component.html',
  standalone: false
})
@PageTitle(['Background Jobs'])
export class BackgroundJobsComponent {}
