import { Component, OnInit } from '@angular/core';

import { PageTitle } from '@src/app/core/_decorators/autotitle';
import { JAgentStat } from '@src/app/core/_models/agent-stats.model';
import { JAgent } from '@src/app/core/_models/agent.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { GlobalService } from '@src/app/core/_services/main.service';
import { CookieService } from '@src/app/core/_services/shared/cookies.service';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-agent-status',
  templateUrl: './agent-status.component.html',
  standalone: false
})
@PageTitle(['Agent Status'])
export class AgentStatusComponent implements OnInit {
  pageTitle = 'Agents Status';
  showagents: JAgent[] = [];
  _filteresAgents: JAgent[] = [];
  pageSize = 20;

  // view menu
  view: string | number = 0;

  // Agents Stats
  statDevice: JAgentStat[] = [];
  statTemp: JAgentStat[] = [];
  statCpu: JAgentStat[] = [];

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private cookieService: CookieService,
    private gs: GlobalService,
    private serializer: JsonAPISerializer
  ) {}

  getView() {
    return this.cookieService.getCookie('asview');
  }

  ngOnInit(): void {
    this.view = this.getView() || 0;
  }
}
