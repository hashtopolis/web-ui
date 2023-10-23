import { faEdit, faTrash, faLock, faFileImport, faFileExport, faPlus, faHomeAlt, faArchive, faCopy, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from './../../../environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../core/_services/main.config';

declare let $:any;

@Component({
  selector: 'app-preconfigured-tasks',
  templateUrl: './preconfigured-tasks.component.html'
})
/**
 * PreconfiguredTasksComponent is a component that manages and displays preconfigured tasks data.
 *
 * It uses DataTables to display and interact with the preconfigured tasks data, including exporting, deleting, bulk actions
 * and refreshing the table.
 */
export class PreconfiguredTasksComponent implements OnInit, OnDestroy {

  // Font Awesome icons
  faFileImport = faFileImport;
  faFileExport = faFileExport;
  faBookmark = faBookmark;
  faArchive = faArchive;
  faHome = faHomeAlt;
  faTrash = faTrash;
  faEdit = faEdit;
  faLock = faLock;
  faPlus = faPlus;
  faCopy = faCopy;

  // ViewChild reference to the DataTableDirective
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  // List of pretasks
  allpretasks: any = [];

  // Subscriptions to unsubscribe on component destruction
  subscriptions: Subscription[] = []

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private titleService: AutoTitleService,
    private alert: AlertService,
    private gs: GlobalService,
  ) {
    titleService.set(['Show Preconfigured Task'])
  }

  /**
   * Initializes DataTable and retrieves pretasks.
   */

  ngOnInit(): void {
    this.getPretasks();
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
   * Fetches Pretasks from the server.
   * Subscribes to the API response and updates the Pretasks list.
   */
  getPretasks(): void {
    // Fetch preconfigured tasks data from the API
    const params = { 'maxResults': this.maxResults, 'expand': 'pretaskFiles' };
    this.subscriptions.push(this.gs.getAll(SERV.PRETASKS, params).subscribe((response: any) => {
      this.allpretasks = response.values;
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
                  columns: [0, 1, 2, 3, 4, 5]
                },
              },
              {
                extend: 'print',
                exportOptions: {
                  columns: [0, 1, 2, 3, 4, 5]
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
              {
                extend: 'copy',
              },
            ]
          },
          {
            extend: 'collection',
            text: 'Bulk Actions',
            buttons: [
                  {
                    text: 'Delete PreTask(s)',
                    autoClose: true,
                    action: function (e, dt, node, config) {
                      self.onDeleteBulk();
                    }
                  }
               ]
          },
          {
            extend: 'colvis',
            text: 'Column View',
            columns: [1, 2, 3, 4, 5],
          },
          {
            extend: 'pageLength',
            className: 'btn-sm',
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
   * Handles pretask deletion.
   * Displays a confirmation dialog and deletes the pretask if confirmed.
   *
   * @param {number} id - The ID of the pretask to delete.
   * @param {string} name - The name of the pretask.
   */
  onDelete(id: number, name: string) {
    this.alert.deleteConfirmation(name, 'Pretasks').then((confirmed) => {
      if (confirmed) {
        // Deletion
        this.subscriptions.push(this.gs.delete(SERV.PRETASKS, id).subscribe(() => {
        // Successful deletion
        this.alert.okAlert(`Deleted Pretask ${name}`, '');
        this.onRefreshTable(); // Refresh the table
        }));
      } else {
        // Handle cancellation
        this.alert.okAlert(`Pretask ${name} is safe!`, '');
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
  onSelectedPretasks(){
    $(".dt-button-background").trigger("click");
    const selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
    if(selection.length == 0) {
      this.alert.okAlert('You haven not selected any Group','');
      return;
    }
    const selectionnum = selection.map(i=>Number(i));

    return selectionnum;
  }

  /**
   * Handles bulk deletion
   * Delete the pretasks showing a progress bar
   *
  */
  async onDeleteBulk() {
    const PretasksIds = this.onSelectedPretasks();
    this.alert.bulkDeleteAlert(PretasksIds,'Pretasks',SERV.PRETASKS);
    this.onRefreshTable();
  }


}
