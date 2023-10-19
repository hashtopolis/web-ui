import { faEdit, faHomeAlt, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { UIConfigService } from '../../core/_services/shared/storage.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';
import { DataTableDirective } from 'angular-datatables';

declare let $:any;

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html'
})
@PageTitle(['Show Users'])
export class AllUsersComponent  implements OnInit, OnDestroy {

  faHome=faHomeAlt;
  faTrash=faTrash;
  faEdit=faEdit;
  faPlus=faPlus;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public allusers: {
    id: number,
    name: string,
    registeredSince: number,
    lastLoginDate: number,
    email: string,
    isValid: boolean,
    sessionLifetime:number,
    rightGroupId: string,
    globalPermissionGroup: {
      name: string,
      permissions: string
    }
  }[] = [];

  constructor(
    private uiService: UIConfigService,
    private route:ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router:Router
  ) { }

  private maxResults = environment.config.prodApiMaxResults

  ngOnInit(): void {

    const params = {'maxResults': this.maxResults, 'expand': 'globalPermissionGroup' }
    this.gs.getAll(SERV.USERS,params).subscribe((users: any) => {
      this.allusers = users.values;
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
      // "stateLoadParams": function (settings, data) {
      //   return false;
      // },
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
                    text: 'Delete Users',
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

  editButtonClick(){
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDelete(id: number, name: string){
    this.alert.deleteConfirmation(name,'Users').then((confirmed) => {
      if (confirmed) {
        // Deletion
        this.gs.delete(SERV.USERS, id).subscribe(() => {
          // Successful deletion
          this.alert.okAlert(`Deleted User ${name}`, '');
          this.onRefreshTable(); // Refresh the table
        });
      } else {
        // Handle cancellation
        this.alert.okAlert(`User ${name} is safe!`,'');
      }
    });
  }

  onRefreshTable(){
    setTimeout(() => {
      this.ngOnInit();
      this.rerender();  // rerender datatables
    },2000);
  }

  onSelectedUsers(){
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
    const UserIds = this.onSelectedUsers();
    this.alert.bulkDeleteAlert(UserIds,'Users',SERV.USERS);
    this.onRefreshTable();
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

