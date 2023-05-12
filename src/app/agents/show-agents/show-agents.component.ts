
import { faEdit, faLock, faPauseCircle,faHomeAlt, faPlus, faFileText, faTrash, faCheckCircle, faArrowCircleDown} from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {Subject} from 'rxjs';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { AgentsService } from '../../core/_services/agents/agents.service';
import { UsersService } from 'src/app/core/_services/users/users.service';

declare let $:any;

@Component({
  selector: 'app-show-agents',
  templateUrl: './show-agents.component.html'
})
export class ShowAgentsComponent implements OnInit, OnDestroy {

  faArrowCircleDown=faArrowCircleDown;
  faCheckCircle=faCheckCircle;
  faPauseCircle=faPauseCircle;
  faFileText=faFileText;
  faHome=faHomeAlt;
  faTrash=faTrash;
  faEdit=faEdit;
  faLock=faLock;
  faPlus=faPlus;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  uidateformat:any;
  isChecked:boolean =false;

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // ToDo add model
  showagents: any = [];

  private maxResults = environment.config.prodApiMaxResults

  constructor(
    private agentsService: AgentsService,
    private uiService: UIConfigService,
    private users: UsersService
  ) { }

  ngOnInit(): void {

    this.setAccessPermissions();

    let params = {'maxResults': this.maxResults}

    this.agentsService.getAgents(params).subscribe((agents: any) => {
      this.showagents = agents.values;
      // this.showagents.forEach(f => (f.checked = false));
      this.dtTrigger.next(void 0);
    });

    this.uidateformat = this.uiService.getUIsettings('timefmt').value;

    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      stateSave: true,
      destroy: true,
      select: {
        style: 'multi',
        },
      columnDefs: [ {
        width: "10% !important;",
        targets: 0,
        searchable: false,
        orderable: false,
      } ],
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
                columns: [1, 2, 3, 4, 5]
              },
            },
            {
              extend: 'print',
              exportOptions: {
                columns: [1, 2, 3, 4, 5]
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
                self.onSelectedAgents();
                var data = "";
                for (var i = 0; i < dt.length; i++) {
                  data = "Agents\n\n"+  dt;
                }
                return data;
             }
            },
            {
              extend: 'copy',
            }
             ]
        },
        {
          extend: 'collection',
          text: 'Bulk Actions',
          className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
          buttons: [
                {
                  text: 'Delete Agents',
                  autoClose: true,
                  action: function (e, dt, node, config) {
                    self.onDeleteBulk();
                  }
                },
                {
                  text: 'Activate Agents',
                  autoClose: true,
                  action: function ( e, dt, node, config ) {
                    const edit = {isActive: true};
                    self.onUpdateBulk(edit);
                  }
                },
                {
                  text: 'Deactivate Agents',
                  autoClose: true,
                  action: function ( e, dt, node, config ) {
                    const edit = {isActive: false};
                    self.onUpdateBulk(edit);
                  }
                },
                {
                  text: 'Edit Rack',
                  autoClose: true,
                  action: function ( e, dt, node, config ) {
                    const title = 'Update Rack (Missing Field)'
                    self.onModal(title)
                  }
                },
             ]
          },
          {
            extend: 'colvis',
            text: 'Column View',
            columns: [ 1,2,3,4,5 ],
          },
          {
            extend: "pageLength",
            className: "btn-sm"
          }
        ],
      }
    };
  }

  // Set permissions
  manageAgentAccess: any;

  setAccessPermissions(){
    this.users.getUser(this.users.userId,{'expand':'globalPermissionGroup'}).subscribe((perm: any) => {
        this.manageAgentAccess = perm.globalPermissionGroup.permissions.manageAgentAccess;
    });
  }

  setCheckAll(){
    let chkBoxlength = $(".checkboxCls:checked").length;
    if (this.isChecked == true) {
      $(".checkboxCls").prop("checked", false);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.rows(  ).deselect();
        this.isChecked = false;
      });
    } else {
      $(".checkboxCls").prop("checked", true);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.rows(  ).select();
        this.isChecked = true;
      });
    }
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

  onDone(value?: any){
    setTimeout(() => {
      this.ngOnInit();
      this.rerender();  // rerender datatables
      Swal.close();
      Swal.fire({
        title: 'Done!',
        type: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    },3000);
  }

  onSelectedAgents(){
    $(".dt-button-background").trigger("click");
    let selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
    if(selection.length == 0) {
      Swal.fire({
        title: "You haven't selected any Agent",
        type: 'success',
        timer: 1500,
        showConfirmButton: false
      })
      return;
    }
    let selectionnum = selection.map(i=>Number(i));

    return selectionnum;
  }

  onDeleteBulk(){
    if(this.manageAgentAccess || typeof this.manageAgentAccess == 'undefined'){
      const self = this;
      let selectionnum = this.onSelectedAgents();
      let sellen = selectionnum.length;
      let errors = [];
      selectionnum.forEach(function (value) {
        Swal.fire('Deleting...'+sellen+' Agent(s)...Please wait')
        Swal.showLoading()
      self.agentsService.deleteAgent(value)
      .subscribe(
        err => {
          console.log('HTTP Error', err)
          err = 1;
          errors.push(err);
        },
        );
      });
    self.onDone(sellen);
    }else{
      Swal.fire({
        title: "ACTION DENIED",
        text: "Please contact your Administrator.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  onUpdateBulk(value: any){
    if(this.manageAgentAccess || typeof this.manageAgentAccess == 'undefined'){
        const self = this;
        let selectionnum = this.onSelectedAgents();
        let sellen = selectionnum.length;
        let errors = [];
        selectionnum.forEach(function (id) {
          Swal.fire('Updating...'+sellen+' Agents...Please wait')
          Swal.showLoading()
        self.agentsService.updateAgent(id, value).subscribe(
          err => {
            console.log('HTTP Error', err)
            err = 1;
            errors.push(err);
          },
        );
      });
      self.onDone(sellen);
    }else{
      Swal.fire({
        title: "ACTION DENIED",
        text: "Please contact your Administrator.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  onModal(title: string){
    (async () => {

      $(".dt-button-background").trigger("click");
      let selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
      if(selection.length == 0) {
        Swal.fire({
          title: "You haven't selected any Agent",
          type: 'success',
          timer: 1500,
          showConfirmButton: false
        })
        return;
      }

      const { value: formValues } = await Swal.fire({
        title: title,
        html:
          '<input id="agent-input" class="swal2-input">',
        focusConfirm: false,
        confirmButtonColor: '#4B5563',
        preConfirm: () => {
          return [
            (<HTMLInputElement>document.getElementById('agent-input')).value,
          ]
        }
      })

      let rack = []
      if (formValues) {
        rack.push({rack: formValues})
        // we need to send pus
        // this.onUpdateBulk(formValues);
        Swal.fire(JSON.stringify(rack))

      }

      })()
  }

  onDelete(id: number){
    if(this.manageAgentAccess || typeof this.manageAgentAccess == 'undefined'){
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, it cannot be recover.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#4B5563',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.agentsService.deleteAgent(id).subscribe(() => {
            Swal.fire(
              "Agent has been deleted!",
              {
              icon: "success",
              showConfirmButton: false,
              timer: 1500
            });
            this.ngOnInit();
            this.rerender();  // rerender datatables
          });
        } else {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'No worries, your Agent is safe!',
            'error'
          )
        }
      });
    }else{
      Swal.fire({
        title: "ACTION DENIED",
        text: "Please contact your Administrator.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      })
    }
  }


}
