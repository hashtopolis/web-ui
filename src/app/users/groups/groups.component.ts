import { faHomeAlt, faPlus, faTrash, faEdit, faSave, faCancel } from '@fortawesome/free-solid-svg-icons';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

declare let $:any;

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html'
})
/**
 * GroupsComponent is a component that manages and displays all groups data.
 *
 * It uses DataTables to display and interact with the groups data, including exporting, deleting, bulk actions
 * and refreshing the table.
 */
export class GroupsComponent implements OnInit, OnDestroy {

  // Font Awesome icons
  faHome = faHomeAlt;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faSave = faSave;
  faCancel = faCancel;

  // ViewChild reference to the DataTableDirective
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  // List of groups ToDo. Change Interface
  public agroups: { accessGroupId: number, groupName: string, isEdit: false }[] = [];

  // Subscriptions to unsubscribe on component destruction
  subscriptions: Subscription[] = []

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private titleService: AutoTitleService,
    private alert: AlertService,
    private gs: GlobalService,
  ) {
    titleService.set(['Show Groups'])
  }

  /**
   * Initializes DataTable and retrieves groups.
   */
  ngOnInit(): void {
    this.loadAccessGroups();
    this.setupTable();
  }

  /**
   * Unsubscribes from active subscriptions and DataTable.
   */
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  /**
   * Refreshes the data and the DataTable.
   */
  onRefresh() {
    this.rerender();
    this.ngOnInit();
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
        this.dtTrigger['new'].next();
      });
    });
  }

  /**
   * Fetches Groups from the server.
   * Subscribes to the API response and updates the Groups list.
   */
  loadAccessGroups() {
    // Set parameters for the API request
    const params = { 'maxResults': this.maxResults };
    // Make an API call to get groups data
    this.subscriptions.push(this.gs.getAll(SERV.ACCESS_GROUPS, params).subscribe((response: any) => {
      this.agroups = response.values;
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
      processing: true,  // Error loading
      deferRender: true,
      destroy: true,
      select: {
        style: 'multi',
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
                text: 'Delete Groups',
                autoClose: true,
                action: function (e, dt, node, config) {
                  self.onDeleteBulk();
                }
              }
            ]
          }
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
   * Handles Group deletion.
   * Displays a confirmation dialog and deletes the Group if confirmed.
   *
   * @param {number} id - The ID of the Group to delete.
   * @param {string} name - The name of the Group.
   */
  onDelete(id: number, name: string) {
    this.alert.deleteConfirmation(name, 'Groups').then((confirmed) => {
      if (confirmed) {
        // Deletion
        this.subscriptions.push(this.gs.delete(SERV.ACCESS_GROUPS, id).subscribe(() => {
          // Successful deletion
          this.alert.okAlert(`Deleted Group ${name}`, '');
          this.onRefreshTable(); // Refresh the table
        }));
      } else {
        // Handle cancellation
        this.alert.okAlert(`Group ${name} is safe!`, '');
      }
    });
  }

  /**
   * Handles Group selection for bulk actions.
   * On multi-select, retrieves the IDs to be used for bulk actions.
   *
   * @returns An array of selected Group IDs.
   */
  onSelectedGroups() {
    $(".dt-button-background").trigger("click");
    const selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true }).data().pluck(0).toArray();
    if (selection.length == 0) {
      this.alert.okAlert('You have not selected any Group', '');
      return;
    }
    const selectionnum = selection.map(i => Number(i));

    return selectionnum;
  }

  /**
   * Handles bulk deletion of selected Groups.
   * Deletes the selected Groups and shows a progress bar.
   */
  async onDeleteBulk() {
    const GroupsIds = this.onSelectedGroups();
    this.alert.bulkDeleteAlert(GroupsIds, 'Groups', SERV.ACCESS_GROUPS);
    this.onRefreshTable();
  }

}
