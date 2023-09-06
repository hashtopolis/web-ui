import { faTrash, faPlus, faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
import { environment } from './../../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { ACTION } from '../../core/_constants/notifications.config';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
@PageTitle(['Notifications'])
export class NotificationsComponent implements OnInit {

  faTrash=faTrash;
  faPlus=faPlus;
  faEdit=faEdit;
  faEye=faEye;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private gs: GlobalService,
  ) {  }

  Allnotif: any;

  private maxResults = environment.config.prodApiMaxResults;

  ngOnInit(): void {

    const params = {'maxResults': this.maxResults};

    this.gs.getAll(SERV.NOTIFICATIONS,params).subscribe((notf: any) => {
      this.Allnotif = notf.values;
      this.dtTrigger.next(void 0);
    });
    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 10,
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
                  data = "Notifications\n\n"+  dt;
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
            extend: "pageLength",
            className: "btn-sm"
          }
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  onDelete(id: number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, it can not be recovered!",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonColor: '#8A8584',
      confirmButtonColor: '#C53819',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.gs.delete(SERV.NOTIFICATIONS,id).subscribe(() => {
          Swal.fire({
            title: "Success",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.ngOnInit();
          this.rerender();  // rerender datatables
        });
      } else {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your Notification is safe!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

checkPath(filter: string, type?: boolean){

    let path;
    let title;
    switch (filter) {

      case ACTION.AGENT_ERROR:
      case ACTION.OWN_AGENT_ERROR:
      case ACTION.DELETE_AGENT:
        title = 'Agent:'
        path = '/agents/show-agents/';
      break;

      case ACTION.NEW_TASK:
      case ACTION.TASK_COMPLETE:
      case ACTION.DELETE_TASK:
        title = 'Task:'
        path = '/tasks/show-tasks/';
      break;

      case ACTION.DELETE_HASHLIST:
      case ACTION.HASHLIST_ALL_CRACKED:
      case ACTION.HASHLIST_CRACKED_HASH:
        title = 'Hashlist:'
        path = '/hashlists/hashlist/';
      break;

      case ACTION.USER_CREATED:
      case ACTION.USER_DELETED:
      case ACTION.USER_LOGIN_FAILED:
        title = 'User:'
        path = '/users/';
      break;

      default:
        title = ''
        path = 'none';

    }
    if(type){return path;}else{return title;}

  }

}
