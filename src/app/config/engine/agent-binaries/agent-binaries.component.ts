import { faHomeAlt, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { environment } from './../../../../environments/environment';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';

@Component({
  selector: 'app-agent-binaries',
  templateUrl: './agent-binaries.component.html'
})
@PageTitle(['Show Agent Binaries'])
export class AgentBinariesComponent implements OnInit {

  public isCollapsed = true;
  faHome=faHomeAlt;
  faPlus=faPlus;
  faTrash=faTrash;
  faEdit=faEdit;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  public binaries: {agentBinaryId: number, type: string, version: string, operatingSystems: string, filename: string, updateTrack: string, updateAvailable: string}[] = [];

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private alert: AlertService,
    private gs: GlobalService,
  ) { }

  ngOnInit(): void {

    const params = {'maxResults': this.maxResults}
    this.gs.getAll(SERV.AGENT_BINARY,params).subscribe((bin: any) => {
      this.binaries = bin.values;
      this.dtTrigger.next(void 0);
    });
    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 25,
      lengthMenu: [
          [10, 25, 50, 100, 250, -1],
          [10, 25, 50, 100, 250, 'All']
      ],
      stateSave: true,
      select: true,
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
                columns: [0, 1]
              },
            },
            {
              extend: 'print',
              exportOptions: {
                columns: [0, 1]
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
                  data = "Agent Binaries\n\n"+  dt;
                }
                return data;
             }
            },
              'copy'
            ]
          }
        ],
      }
    };

  }

  onRefresh(){
    this.rerender();
    this.ngOnInit();
  }

  onSubmit(){
    this.alert.okAlert('New Binary created!','');
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

  onDelete(id: number, name: string){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: 'Remove '+ name +' from your Binaries?',
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonColor: this.alert.cancelButtonColor,
      confirmButtonColor: this.alert.confirmButtonColor,
      confirmButtonText: this.alert.delconfirmText
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.gs.delete(SERV.AGENT_BINARY,id).subscribe(() => {
          this.alert.okAlert('Deleted '+name+'','');
          this.ngOnInit();
          this.rerender();  // rerender datatables
        });
      } else {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your Binary is safe!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }


}
