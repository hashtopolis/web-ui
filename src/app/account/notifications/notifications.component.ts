import { faTrash, faPlus, faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from './../../../environments/environment';
import { DataTableDirective } from 'angular-datatables';
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

declare let $:any;

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
            extend: 'collection',
            text: 'Bulk Actions',
            buttons: [
                  {
                    text: 'Delete Notification(s)',
                    autoClose: true,
                    action: function (e, dt, node, config) {
                      self.onDeleteBulk();
                    }
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

  // Refresh the table after a delete operation
  onRefreshTable() {
    setTimeout(() => {
      this.ngOnInit();
      this.rerender();  // Rerender the DataTable
    }, 2000);
  }

  /**
   * Handles notification deletion.
   * Displays a confirmation dialog and deletes the notification if confirmed.
   *
   * @param {number} id - The ID of the notification to delete.
   * @param {string} name - The name of the notification.
   */
  onDelete(id: number, name: string) {
    this.alert.deleteConfirmation(name,'Notifications').then((confirmed) => {
      if (confirmed) {
        // Deletion
        this.subscriptions.push(this.gs.delete(SERV.NOTIFICATIONS, id).subscribe(() => {
          // Successful deletion
          this.alert.okAlert(`Deleted notification ${name}`, '');
          this.onRefreshTable(); // Refresh the table
        }));
      } else {
        // Handle cancellation
        this.alert.okAlert(`Notification ${name} is safe!`,'');
      }
    });
  }

  // Bulk actions

  /**
   * Handles Notifications selection for bulk actions.
   *
   * @returns {number[]} - An array of selected hashlist IDs.
   */
  onSelectedNotifications(){
    $(".dt-button-background").trigger("click");
    const selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
    if(selection.length == 0) {
      this.alert.okAlert('You haven not selected any Notification','');
      return;
    }
    const selectionnum = selection.map(i=>Number(i));

    return selectionnum;
  }

  /**
   * Handles bulk deletion
   * Delete the Notifications showing a progress bar
   *
  */
  async onDeleteBulk() {
    const NotifIds = this.onSelectedNotifications();
    this.alert.bulkDeleteAlert(NotifIds,'Notifications',SERV.NOTIFICATIONS);
    this.onRefreshTable();
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
