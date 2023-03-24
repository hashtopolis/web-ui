import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { faTrash, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { NotifService } from '../../core/_services/users/notifications.service';
import { AgentsService } from '../../core/_services/agents/agents.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  // Loader
  isLoading = false;
  // Form attributtes
  public isCollapsed = true;
  faTrash=faTrash;
  faPlus=faPlus
  faEye=faEye;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private notifService: NotifService,
    private agentsService: AgentsService
  ) { }

  createForm: FormGroup;
  Allnotif: any;
  showagents: any;

  allowedActions = [
    '',
    'agentError',
    'deleteTask',
    'deleteHashlist',
    'deleteAgent',
    'hashlistAllCracked',
    'hashlistCrackedHash',
    'logWarn',
    'logFatal',
    'logError',
    'ownAgentError',
    'newAgent',
    'newTask',
    'newHashlist',
    'taskComplete',
    'userCreated',
    'userDeleted',
    'userLoginFailed'
  ];

  private maxResults = environment.config.prodApiMaxResults;

  ngOnInit(): void {

    this.createForm = new FormGroup({
      'action': new FormControl('', [Validators.required]),
      'actionFilter': new FormControl('', [Validators.required]),
      'notification': new FormControl('', [Validators.required]),
      'receiver': new FormControl('', [Validators.required]),
      'isActive': new FormControl(true),
    });

    this.agentsService.getAgents().subscribe((agents: any) => {
      this.showagents = agents.values;
    });

    let params = {'maxResults': this.maxResults};

    this.notifService.getAllnotif(params).subscribe((notf: any) => {
      this.Allnotif = notf.values;
      this.dtTrigger.next(void 0);
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
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, it can not be recovered!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#4B5563',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.notifService.deleteNotif(id).subscribe(() => {
          Swal.fire(
            "Notification has been deleted!",
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
          'No worries, your Notification is safe!',
          'error'
        )
      }
    });
  }

  onSubmit(){
    if (this.createForm.valid) {

      this.isLoading = true;

      this.notifService.createNotif(this.createForm.value).subscribe((hasht: any) => {
        const response = hasht;
        console.log(response);
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "New Notification created!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.ngOnInit();
          this.rerender();  // rerender datatables
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "Notification was not created, please try again!",
            icon: "warning",
            showConfirmButton: true
          });
        }
      );
    }
  }

}
