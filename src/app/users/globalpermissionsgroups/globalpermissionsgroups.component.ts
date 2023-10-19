import { faHomeAlt, faPlus, faTrash, faEdit, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { environment } from 'src/environments/environment';
import { SERV } from '../../core/_services/main.config';

declare let $:any;

@Component({
  selector: 'app-globalpermissionsgroups',
  templateUrl: './globalpermissionsgroups.component.html'
})
@PageTitle(['Show Global Permissions'])
export class GlobalpermissionsgroupsComponent implements OnInit {

    // Form attributtes
    faInfoCircle=faInfoCircle;
    faHome=faHomeAlt;
    faPlus=faPlus;
    faEdit=faEdit;
    faTrash=faTrash;

    private maxResults = environment.config.prodApiMaxResults;

    // Datatable
    @ViewChild(DataTableDirective, {static: false})
    dtElement: DataTableDirective;

    dtTrigger: Subject<any> = new Subject<any>();
    dtOptions: any = {};

    public Allgpg: {id: number, name: string , user:[]}[] = [];

    constructor(
      private alert: AlertService,
      private gs: GlobalService,
      private router: Router
    ) { }

    ngOnInit(): void {

      const params = {'maxResults': this.maxResults , 'expand': 'user'}
      this.gs.getAll(SERV.ACCESS_PERMISSIONS_GROUPS,params).subscribe((gpg: any) => {
        this.Allgpg = gpg.values;
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
        processing: true,  // Error loading
        deferRender: true,
        destroy:true,
        select: {
          style: 'multi',
          // selector: 'tr>td:nth-child(1)' //This only allows select the first row
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
                  columns: [0, 1]
                },
              },
              {
                extend: 'print',
                exportOptions: {
                  columns: [0,1]
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
                    data = "Agents\n\n"+  dt;
                  }
                  return data;
               }
              },
                'copy'
              ]
            },
            {
              extend: 'collection',
              text: 'Bulk Actions',
              className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
              buttons: [
                    {
                      text: 'Delete Groups',
                      autoClose: true,
                      action: function (e, dt, node, config) {
                        self.onDeleteBulk();
                      }
                    }
                 ]
              },
          ],
        }
      };

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

  onDelete(id: number, name: string){
    this.alert.deleteConfirmation(name,'Global permissions').then((confirmed) => {
      if (confirmed) {
        // Deletion
        this.gs.delete(SERV.ACCESS_PERMISSIONS_GROUPS, id).subscribe(() => {
          // Successful deletion
          this.alert.okAlert(`Deleted Global permission ${name}`, '');
          this.onRefreshTable(); // Refresh the table
        });
      } else {
        // Handle cancellation
        this.alert.okAlert(`Global permission ${name} is safe!`,'');
      }
    });
  }

  onRefreshTable(){
    setTimeout(() => {
      this.ngOnInit();
      this.rerender();  // rerender datatables
    },2000);
  }

  onSelectedGroups(){
    $(".dt-button-background").trigger("click");
    const selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
    if(selection.length == 0) {
      this.alert.okAlert('You haven not selected any Group','');
      return;
    }
    const selectionnum = selection.map(i=>Number(i));

    return selectionnum;
  }

  async onDeleteBulk() {
    const GlobalIds = this.onSelectedGroups();
    this.alert.bulkDeleteAlert(GlobalIds,'Global Group Permissions',SERV.ACCESS_PERMISSIONS_GROUPS);
    this.onRefreshTable();
  }

  // Add unsubscribe to detect changes
  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

}
