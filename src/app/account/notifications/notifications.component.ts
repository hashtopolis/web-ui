import { faTrash, faPlus, faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from './../../../environments/environment';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject, Subscription } from 'rxjs';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { NotificationListResponse } from 'src/app/core/_models/notifications';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { ACTION } from '../../core/_constants/notifications.config';
import { GlobalService } from 'src/app/core/_services/main.service';
import { Notification } from 'src/app/core/_models/notifications';
import { SERV } from '../../core/_services/main.config';

export interface Filter {
  id: number,
  name: string
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit, OnDestroy {

  faTrash = faTrash;
  faPlus = faPlus;
  faEdit = faEdit;
  faEye = faEye;

  @ViewChild(DataTableDirective, { static: false })

  // DataTable properties
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  // List of notifications
  notifications: Notification[];

  // Subscriptions to unsubscribe on component destruction
  subscriptions: Subscription[] = []

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private titleService: AutoTitleService,
    private alert: AlertService,
    private gs: GlobalService
  ) {
    titleService.set(['Notifications'])
  }

  /**
   * Initializes DataTable and retrieves notifications.
   */
  ngOnInit(): void {
    this.getNotifications();
    this.setupTable();
  }

  /**
   * Unsubscribes from active subscriptions.
   */
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  /**
   * Refreshes the data table by re-rendering it.
   * Fetches notifications and sets up the table again.
   */
  onRefresh() {
    this.rerender();
    this.getNotifications();
    this.setupTable();
  }

  /**
   * Rerenders the DataTable instance.
   * Destroys and recreates the DataTable to reflect changes.
   */
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      setTimeout(() => {
        if (this.dtTrigger['new']) {
          this.dtTrigger['new'].next();
        }
      });
    });
  }

  /**
   * Fetches notifications from the server.
   * Subscribes to the API response and updates the notifications list.
   */
  getNotifications(): void {
    const params = { 'maxResults': this.maxResults };

    this.subscriptions.push(this.gs.getAll(SERV.NOTIFICATIONS, params).subscribe((response: NotificationListResponse) => {
      this.notifications = response.values;
      this.dtTrigger.next(void 0);
    }));
  }

  /**
   * Sets up the DataTable options and buttons.
   * Customizes DataTable appearance and behavior.
   */
  setupTable(): void {
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
                  columns: [0, 1, 2, 3, 4]
                },
              },
              {
                extend: 'print',
                exportOptions: {
                  columns: [0, 1, 2, 3, 4]
                },
                customize: function (win) {
                  $(win.document.body)
                    .css('font-size', '10pt')
                  $(win.document.body).find('table')
                    .addClass('compact')
                    .css('font-size', 'inherit');
                }
              },
              {
                extend: 'csvHtml5',
                exportOptions: { modifier: { selected: true } },
                select: true,
                customize: function (dt, csv) {
                  let data = '';
                  for (let i = 0; i < dt.length; i++) {
                    data = 'Notifications\n\n' + dt;
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
            extend: 'pageLength',
            className: 'btn-sm'
          }
        ],
      }
    }
  }

  /**
   * Handles notification deletion.
   * Displays a confirmation dialog and deletes the notification if confirmed.
   *
   * @param {number} id - The ID of the notification to delete.
   * @param {string} name - The name of the notification.
   */
  onDelete(id: number, name: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn'
      },
      buttonsStyling: false
    })
    Swal
      .fire({
        title: `Remove ${name} from your notifications?`,
        icon: 'warning',
        reverseButtons: true,
        showCancelButton: true,
        cancelButtonColor: this.alert.cancelButtonColor,
        confirmButtonColor: this.alert.confirmButtonColor,
        confirmButtonText: this.alert.delconfirmText
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.deleteNotification(id,name)
        } else {
          swalWithBootstrapButtons.fire({
            title: 'Cancelled',
            text: 'Your Notification is safe!',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          })
        }
      });
  }

  /**
   * Handles the deletion of a notification.
   * Sends an delete request to the backend and displays a success alert and rebuilds
   * the datatable on success.
   *
   * @param {number} id - The ID of the notification to delete.
   */
  deleteNotification(id: number, name: string): void {
    this.subscriptions.push(this.gs.delete(SERV.NOTIFICATIONS, id).subscribe(() => {
      this.alert.okAlert('Deleted '+name+'','');
      this.getNotifications();
      this.rerender();
      this.setupTable();
    }));
  }

  /**
   * Determines the path or title based on the provided filter.
   *
   * @param {string} filter - The filter used to determine the path or title.
   * @param {boolean} [type] - If true, returns the path; otherwise, returns the title.
   * @returns {string} The path or title based on the filter.
   */
  checkPath(filter: string, type?: boolean): string {
    let path: string;
    let title: string;

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
    if (type) { return path; } else { return title; }
  }
}
