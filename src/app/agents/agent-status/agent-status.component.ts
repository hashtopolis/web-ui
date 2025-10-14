import { Component, OnInit } from '@angular/core';

import { PageTitle } from '@src/app/core/_decorators/autotitle';
import { CookieService } from '@src/app/core/_services/shared/cookies.service';

@Component({
  selector: 'app-agent-status',
  templateUrl: './agent-status.component.html',
  standalone: false
})
@PageTitle(['Agent Status'])
export class AgentStatusComponent implements OnInit {
  pageTitle = 'Agents Status';
  view: string | number = 0;

  constructor(private cookieService: CookieService) {}

  getView() {
    return this.cookieService.getCookie('asview');
  }

  ngOnInit(): void {
    this.view = this.getView() || 0;
  }
}
