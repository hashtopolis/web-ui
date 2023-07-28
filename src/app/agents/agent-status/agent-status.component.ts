import { faDigitalTachograph, faMicrochip, faHomeAlt, faPlus, faUserSecret,faEye, faTemperature0, faInfoCircle, faServer, faUsers, faChevronDown, faLock, faPauseCircle} from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { CookieService } from 'src/app/core/_services/shared/cookies.service';
import { FilterService } from 'src/app/core/_services/shared/filter.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { ASC } from '../../core/_constants/agentsc.config';
import { environment } from 'src/environments/environment';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-agent-status',
  templateUrl: './agent-status.component.html'
})
@PageTitle(['Agent Status'])
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
  filterText = '';

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
    private offcanvasService: NgbOffcanvas,
    private filterService: FilterService,
    private cookieService: CookieService,
    private uiService: UIConfigService,
    private modalService: NgbModal,
    private gs: GlobalService
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

    const self = this;
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
                  let data = "";
                  for (let i = 0; i < dt.length; i++) {
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

  onRefresh(){
    this.rerender();
    this.ngOnInit();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      setTimeout(() => {
        this.dtTrigger['new'].next();
      });
    });
  }


  pageChanged(page: number) {
    this.getAgentsPage(page);
  }

  getAgentsPage(page: number) {
    const params = {'maxResults': this.maxResults};
    this.gs.getAll(SERV.AGENTS,params).subscribe((a: any) => {
      const getAData = a.values;
      this.totalRecords = a.total;
      this.gs.getAll(SERV.CHUNKS,params).subscribe((c: any)=>{
        this.gs.getAll(SERV.TASKS,params).subscribe((t: any)=>{
          const map = getAData.map(mainObject => {
          const matchObjectAgents = c.values.find(e => e.agentId === mainObject.agentId)
          return { ...mainObject, ...matchObjectAgents}
          })
          this.showagents = this.filteredAgents = map.map(mainObject => {
            const matchObjectTask = t.values.find(e => e.taskId === mainObject.taskId)
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
    const paramsstat = {'maxResults': this.maxResults, 'filter': 'time>'+this.gettime()+''}
    this.gs.getAll(SERV.AGENTS_STATS,paramsstat).subscribe((stats: any) => {
      this.statTemp = stats.values.filter(u=> u.statType == ASC.GPU_TEMP); // filter Device Temperature
      this.statDevice = stats.values.filter(u=> u.statType == ASC.GPU_UTIL); // filter Device Utilization
      this.statCpu = stats.values.filter(u=> u.statType == ASC.CPU_UTIL); // filter CPU utilization
    });

  }

  gettime(){
    const time = (Date.now() - this.uiService.getUIsettings('agenttimeout').value)
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
