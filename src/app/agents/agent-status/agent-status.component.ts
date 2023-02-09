import { Component, OnInit, ComponentRef, Input } from '@angular/core';
import { faDigitalTachograph, faMicrochip, faHomeAlt, faPlus, faUserSecret,faEye, faTemperature0, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AgentsService } from '../../core/_services/agents/agents.service';
import { FilterService } from 'src/app/core/_services/filter.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-agent-status',
  templateUrl: './agent-status.component.html'
})
export class AgentStatusComponent implements OnInit {
  public isCollapsed = true;

  faDigitalTachograph=faDigitalTachograph;
  faMicrochip=faMicrochip;
  faHomeAlt=faHomeAlt;
  faPlus=faPlus;
  faUserSecret=faUserSecret;
  faEdit=faEye;
  faTemperature0=faTemperature0;
  faInfoCircle=faInfoCircle;

  public statusOrderBy = environment.config.agents.statusOrderBy;
  public statusOrderByName = environment.config.agents.statusOrderByName;

  showagents: any[] = [];
  _filteredCustomers: any[] = [];
  filterText: string = '';

  totalRecords = 0;
  pageSize = 20;

  constructor(
    private agentsService: AgentsService,
    private modalService: NgbModal,
    private filterService: FilterService
  ) { }

  get filteredCustomers() {
    return this._filteredCustomers;
  }

  set filteredCustomers(value: any[]) {
    this._filteredCustomers = value;
  }

  ngOnInit(): void {
    this.getAgentsPage(1);
  }

  pageChanged(page: number) {
    this.getAgentsPage(page);
  }

  getAgentsPage(page: number) {
    this.agentsService.getAgents().subscribe((agents: any) => {
      this.showagents = this.filteredCustomers = agents.values;
      this.totalRecords = agents.total;
      console.log(this.totalRecords)
    });
  }

  // Filter

  filterChanged(data: string) {
    if (data && this.showagents) {
        data = data.toUpperCase();
        const props = ['agentName', 'agentId'];
        this._filteredCustomers = this.filterService.filter<any>(this.showagents, data, props);
        console.log(this._filteredCustomers)
    } else {
      this._filteredCustomers = this.showagents;
    }
  }

  // Modal Agent utilisation
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



}
