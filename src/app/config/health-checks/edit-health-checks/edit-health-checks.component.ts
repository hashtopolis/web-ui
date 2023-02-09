import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { HealthcheckService } from '../../../core/_services/config/healthcheck.service';
import { AgentsService } from '../../../core/_services/agents/agents.service';

@Component({
  selector: 'app-edit-health-checks',
  templateUrl: './edit-health-checks.component.html'
})
export class EditHealthChecksComponent implements OnInit {
  isLoading = false;
  faEye=faEye;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private healthcheckService: HealthcheckService,
    private agentsService: AgentsService,
    private route:ActivatedRoute) { }

  public healthc: {
    attackCmd: string,
    checkType: number,
    crackerBinaryId: number,
    expectedCracks: number,
    hashtypeId: number,
    hashtypeName: string,
    healthCheckId: number,
    status: number,
    time: number
  }[] = [];

  public healthca: {
    healthCheckAgentId: number;
    healthCheckId: number;
    agentId: number;
    status: number;
    cracked: number;
    numGpus: number;
    start: number;
    end: number;
    errors: string;
  }[] = [];

  // healthca: []

  ngOnInit(): void {
    this.isLoading = true;

    const id = +this.route.snapshot.params['id'];

    this.healthcheckService.getHealthCheck(id).subscribe((hc: any) => {
      this.healthc = hc;
    });

    this.healthcheckService.getHealthCheckedAgents(id).subscribe((hc: any) => {
      this.healthca = hc;
      this.isLoading = false;
    });

    this.dtOptions = {
      dom: 'Bfrtip',
      pageLength: 10,
      stateSave: true,
      select: true,
      buttons: {
        dom: {
          button: {
            className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
          }
        },
      buttons: ['copy', 'excel', 'csv', 'edit']
      }
    };

  }

}
