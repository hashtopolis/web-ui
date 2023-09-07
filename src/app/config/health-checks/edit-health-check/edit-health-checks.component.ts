import { Component, OnInit, ViewChild } from '@angular/core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Params } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { environment } from 'src/environments/environment';
import { SERV } from '../../../core/_services/main.config';

@Component({
  selector: 'app-edit-health-checks',
  templateUrl: './edit-health-checks.component.html'
})
@PageTitle(['Edit Health Checks'])
export class EditHealthChecksComponent implements OnInit {
  editedHealthCIndex: number;

  faEye=faEye;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private uiService: UIConfigService,
    private route:ActivatedRoute,
    private gs: GlobalService
    ) { }

  private maxResults = environment.config.prodApiMaxResults;

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
    agentName: string;
  }[] = [];

  // healthca: []

  ngOnInit(): void {

    this.editedHealthCIndex = +this.route.snapshot.params['id'];

    this.gs.get(SERV.HEALTH_CHECKS,this.editedHealthCIndex).subscribe((hc: any) => {
      this.healthc = hc;
    });

    this.agentsInit();

  }

  agentsInit(){
    const paramshc = {'maxResults': this.maxResults, 'filter': 'healthCheckId='+this.editedHealthCIndex+''};
    const paramsa = {'maxResults': this.maxResults};
    this.gs.getAll(SERV.HEALTH_CHECKS_AGENTS,paramshc).subscribe((hc: any) => {
      this.gs.getAll(SERV.AGENTS,paramsa).subscribe((agents: any) => {
      this.healthca = hc.values.map(mainObject => {
        const matchAObject = agents.values.find(element => element.agentId === mainObject.agentId)
        return { ...mainObject, ...matchAObject }
      })
      this.dtTrigger.next(void 0);
      });
    });
    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 25,
      stateSave: true,
      select: true,
      buttons: {
        dom: {
          button: {
            className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt'
          }
        },
      buttons: [
        {
          text: '↻',
          autoClose: true,
          action: function (e, dt, node, config) {
            self.onRefresh();
          }
        },
        {
          extend: 'collection',
          text: 'Export',
          buttons: [
            {
              extend: 'excelHtml5',
            },
            {
              extend: 'print',
              customize: function ( win ) {
                $(win.document.body)
                    .css( 'font-size', '10pt' )
                $(win.document.body).find( 'table' )
                    .addClass( 'compact' )
                    .css( 'font-size', 'inherit' );
             }
            },
            {
              extend: 'csvHtml5',
              exportOptions: {modifier: {selected: true}},
              select: true,
              customize: function (dt, csv) {
                let data = "";
                for (let i = 0; i < dt.length; i++) {
                  data = "HealthChecks\n\n"+  dt;
                }
                return data;
             }
            },
            {
              extend: 'copy',
            }
            ]
          }
        ],
      }}


  }

  onRefresh(){
    this.rerender();
    this.ngOnInit();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      setTimeout(() => {
        this.dtTrigger['new'].next();
      });
    });
  }


}

