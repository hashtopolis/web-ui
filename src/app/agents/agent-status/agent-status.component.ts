import { faDigitalTachograph, faMicrochip, faHomeAlt, faPlus, faUserSecret,faEye, faTemperature0, faInfoCircle, faServer, faUsers, faChevronDown, faLock, faPauseCircle} from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { ASC } from '../../core/_constants/agentsc.config';
import { environment } from 'src/environments/environment';
import { TasksService } from 'src/app/core/_services/tasks/tasks.sevice';
import { FilterService } from 'src/app/core/_services/shared/filter.service';
import { ChunkService } from 'src/app/core/_services/tasks/chunks.service';
import { AgentsService } from '../../core/_services/agents/agents.service';
import { CookieService } from 'src/app/core/_services/shared/cookies.service';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { AgentStatService } from 'src/app/core/_services/agents/agentstats.service';

@Component({
  selector: 'app-agent-status',
  templateUrl: './agent-status.component.html'
})
export class AgentStatusComponent implements OnInit {
  public isCollapsed = true;

  faServer=faServer;
  faUsers=faUsers;
  faChevronDown=faChevronDown;
  faDigitalTachograph=faDigitalTachograph;
  faMicrochip=faMicrochip;
  faHomeAlt=faHomeAlt;
  faPlus=faPlus;
  faUserSecret=faUserSecret;
  faEye=faEye;
  faTemperature0=faTemperature0;
  faPauseCircle=faPauseCircle;
  faLock=faLock;
  faInfoCircle=faInfoCircle;

  public statusOrderBy = environment.config.agents.statusOrderBy;
  public statusOrderByName = environment.config.agents.statusOrderByName;

  showagents: any[] = [];
  _filteresAgents: any[] = [];
  filterText: string = '';

  totalRecords = 0;
  pageSize = 20;

  private maxResults = environment.config.prodApiMaxResults

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  uidateformat:any;

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  constructor(
    private astatService: AgentStatService,
    private offcanvasService: NgbOffcanvas,
    private agentsService: AgentsService,
    private filterService: FilterService,
    private cookieService: CookieService,
    private tasksService: TasksService,
    private chunkService: ChunkService,
    private uiService: UIConfigService,
    private modalService: NgbModal
  ) { }

  // View Menu
  view: any;

  setView(value: string){
    this.cookieService.setCookie('asview', value, 365);
    this.ngOnInit();
  }

  getView(){
    return this.cookieService.getCookie('asview');
  }

  get filteredAgents() {
    return this._filteresAgents;
  }

  set filteredAgents(value: any[]) {
    this._filteresAgents = value;
  }

  ngOnInit(): void {
    this.uidateformat = this.uiService.getUIsettings('timefmt').value;
    this.view = this.getView() || 0;
    this.getAgentsPage(1);
    this.getAgentStats();

    this.dtOptions = {
      dom: 'Bfrtip',
      scrollY: true,
      bDestroy: true,
      columnDefs: [
        {
            targets: 0,
            className: 'noVis'
        }
      ],
      order: [[0, 'desc']],
      bStateSave:true,
      select: {
        style: 'multi',
        },
        buttons: {
          dom: {
            button: {
              className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
            }
          },
        buttons: [
          {
            extend: 'collection',
            text: 'Export',
            buttons: [
              {
                extend: 'excelHtml5',
                exportOptions: {
                  columns: [0, 1, 2, 3, 4]
                },
              },
              {
                extend: 'print',
                exportOptions: {
                  columns: [0, 1, 2, 3, 4]
                },
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
                  var data = "";
                  for (var i = 0; i < dt.length; i++) {
                    data = "Agent Status\n\n"+  dt;
                  }
                  return data;
               }
              },
                'copy'
              ]
            },
            {
              extend: 'colvis',
              text: 'Column View',
              columns: [ 1,2,3,4 ],
            },
            {
              extend: "pageLength",
              className: "btn-sm"
            },
          ],
        }
      }
  }

  pageChanged(page: number) {
    this.getAgentsPage(page);
  }

  getAgentsPage(page: number) {
    let params = {'maxResults': this.maxResults}
    this.agentsService.getAgents(params).subscribe((a: any) => {
      var getAData = a.values;
      this.totalRecords = a.total;
      this.chunkService.getChunks(params).subscribe((c: any)=>{
        this.tasksService.getAlltasks(params).subscribe((t: any)=>{
          var map = getAData.map(mainObject => {
          let matchObjectAgents = c.values.find(e => e.agentId === mainObject.agentId)
          return { ...mainObject, ...matchObjectAgents}
          })
          this.showagents = this.filteredAgents = map.map(mainObject => {
            let matchObjectTask = t.values.find(e => e.taskId === mainObject.taskId)
            return { ...mainObject, ...matchObjectTask}
          })
          this.dtTrigger.next(void 0);
        })
      })
    });
  }

  // Agents Stats
  statDevice: any[] = [];
  statTemp: any[] = [];
  statCpu: any[] = [];

  getAgentStats(){
    let paramsstat = {'maxResults': this.maxResults, 'filter': 'time>'+this.gettime()+''}
    this.astatService.getAstats(paramsstat).subscribe((stats: any) => {
      this.statTemp = stats.values.filter(u=> u.statType == ASC.GPU_TEMP); // filter Device Temperature
      this.statDevice = stats.values.filter(u=> u.statType == ASC.GPU_UTIL); // filter Device Utilization
      this.statCpu = stats.values.filter(u=> u.statType == ASC.CPU_UTIL); // filter CPU utilization
    });

  }

  gettime(){
    let time = (Date.now() - this.uiService.getUIsettings('agenttimeout').value)
    return time;
  }

  // On change filter

  filterChanged(data: string) {
    if (data && this.showagents) {
        data = data.toUpperCase();
        const props = ['agentName', 'agentId'];
        this._filteresAgents = this.filterService.filter<any>(this.showagents, data, props);
    } else {
      this._filteresAgents = this.showagents;
    }
  }

  // Modal Agent utilisation and OffCanvas menu

  getTemp1(){  // Temperature Config Setting
    return this.uiService.getUIsettings('agentTempThreshold1').value;
  }

  getTemp2(){  // Temperature 2 Config Setting
    return this.uiService.getUIsettings('agentTempThreshold2').value;
  }

  getUtil1(){  // CPU Config Setting
    return this.uiService.getUIsettings('agentUtilThreshold1').value;
  }

  getUtil2(){  // CPU 2 Config Setting
    return this.uiService.getUIsettings('agentUtilThreshold2').value;
  }

  closeResult = '';
  open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

  openEnd(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'end' });
	}


}
