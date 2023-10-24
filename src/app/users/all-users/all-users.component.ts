import { faEdit, faHomeAlt, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { SERV } from '../../core/_services/main.config';
import { DataTableDirective } from 'angular-datatables';

declare let $:any;

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html'
})
/**
 * AllUsersComponent is a component that manages and displays all users data.
 *
 * It uses DataTables to display and interact with the users tasks data, including exporting, deleting, bulk actions
 * and refreshing the table.
 */
export class AllUsersComponent implements OnInit, OnDestroy {

  // Font Awesome icons
  faHome = faHomeAlt;
  faTrash = faTrash;
  faEdit = faEdit;
  faPlus = faPlus;

  // ViewChild reference to the DataTableDirective
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  // List of users ToDo. Change to interface
  public allusers: {
    id: number,
    name: string,
    registeredSince: number,
    lastLoginDate: number,
    email: string,
    isValid: boolean,
    sessionLifetime: number,
    rightGroupId: string,
    globalPermissionGroup: {
      name: string,
      permissions: string
    }
  }[] = [];

  // Subscriptions to unsubscribe on component destruction
  subscriptions: Subscription[] = []

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    titleService.set(['Show Users'])
  }

  /**
   * Initializes DataTable and retrieves pretasks.
   */

  ngOnInit(): void {
    this.getUsers();
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

  // Refresh the data and the DataTable
  onRefresh() {
    this.rerender();
    this.ngOnInit();
  }

  /**
   * Rerender the DataTable.
  */
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      setTimeout(() => {
        this.dtTrigger['new'].next();
      });
    });
  }

  /**
   * Fetches Users from the server.
   * Subscribes to the API response and updates the Users list.
  */
  getUsers(): void {
    // Set parameters for the API request
    const params = { 'maxResults': this.maxResults, 'expand': 'globalPermissionGroup' };

    // Make an API call to get users data
    this.subscriptions.push(this.gs.getAll(SERV.USERS, params).subscribe((response: any) => {
      this.allusers = response.values;
      this.dtTrigger.next(void 0);
    }));
  }

  /**
   * Sets up the DataTable options and buttons.
   * Customizes DataTable appearance and behavior.
   */
  setupTable(): void {
    // DataTables options
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
                customize: function (win) {
                  $(win.document.body)
                    .css('font-size', '10pt');
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
                    data = 'Agents\n\n' + dt;
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

  // Refresh the table after a delete operation
  onRefreshTable() {
    setTimeout(() => {
      this.ngOnInit();
      this.rerender();  // Rerender the DataTable
    }, 2000);
  }

  /**
   * Navigate to the edit page.
   */
  editButtonClick() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  /**
   * Handles user deletion.
   * Displays a confirmation dialog and deletes the user if confirmed.
   *
   * @param {number} id - The ID of the user to delete.
   * @param {string} name - The name of the user.
   */
  onDelete(id: number, name: string) {
    this.alert.deleteConfirmation(name, 'Users').then((confirmed) => {
      if (confirmed) {
        // Deletion
        this.subscriptions.push(this.gs.delete(SERV.USERS, id).subscribe(() => {
          // Successful deletion
          this.alert.okAlert(`Deleted User ${name}`, '');
          this.onRefreshTable(); // Refresh the table
        }));
      } else {
        // Handle cancellation
        this.alert.okAlert(`User ${name} is safe!`, '');
      }
    });
  }

  /**
   * BULK ACTIONS
   *
  */

  /**
   * Handles pretask selection.
   * On multi select grabs the ids to be used for bulk action
   *
  */
  onSelectedUsers() {
    $(".dt-button-background").trigger("click");
    const selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true }).data().pluck(0).toArray();
    if (selection.length == 0) {
      this.alert.okAlert('You have not selected any User', '');
      return;
    }
    const selectionnum = selection.map(i => Number(i));

    return selectionnum;
  }

  /**
   * Handles bulk deletion
   * Delete the pretasks showing a progress bar
   *
  */
  async onDeleteBulk() {
    const UserIds = this.onSelectedUsers();
    this.alert.bulkDeleteAlert(UserIds, 'Users', SERV.USERS);
    this.onRefreshTable();
  }

}
