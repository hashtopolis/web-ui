import { faHomeAlt, faPlus, faTrash, faEdit, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { environment } from 'src/environments/environment';
import { SERV } from '../../core/_services/main.config';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

declare let $:any;

@Component({
  selector: 'app-globalpermissionsgroups',
  templateUrl: './globalpermissionsgroups.component.html'
})
/**
 * GlobalpermissionsgroupsComponent is a component that manages and displays Global Permissions data.
 *
 * It uses DataTables to display and interact with the Global Permissions data, including exporting, deleting, bulk actions
 * and refreshing the table.
 */
export class GlobalpermissionsgroupsComponent implements OnInit, OnDestroy {

  // Font Awesome icons
  faInfoCircle=faInfoCircle;
  faHome=faHomeAlt;
  faPlus=faPlus;
  faEdit=faEdit;
  faTrash=faTrash;

  // ViewChild reference to the DataTableDirective
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  // List of global permission groups
  public Allgpg:any = [];

  // Subscriptions to unsubscribe on component destruction
  subscriptions: Subscription[] = []

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private titleService: AutoTitleService,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    titleService.set(['Show Global Permissions'])
  }

  /**
 * Initializes DataTable and retrieves pretasks.
 */
  ngOnInit(): void {
    this.getGlobalPermissions();
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
   * Fetches Global Permissions Groups from the server.
   * Subscribes to the API response and updates the Global Permissions Groups list.
   */
  getGlobalPermissions(): void {
    // Set parameters for the API request
    const params = {'maxResults': this.maxResults , 'expand': 'user'};
    // Make an API call to get permissions data
    this.subscriptions.push(this.gs.getAll(SERV.ACCESS_PERMISSIONS_GROUPS,params).subscribe((response: any) => {
      this.Allgpg = response.values;
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
        destroy:true,
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

  // Refresh the table after a delete operation
  onRefreshTable() {
    setTimeout(() => {
      this.ngOnInit();
      this.rerender();  // Rerender the DataTable
    }, 2000);
  }

  /**
   * Handles Global Permission Group deletion.
   * Displays a confirmation dialog and deletes the Global Permission Group if confirmed.
   *
   * @param {number} id - The ID of the Global Permission Group to delete.
   * @param {string} name - The name of the Global Permission Group.
  */
  onDelete(id: number, name: string){
    this.alert.deleteConfirmation(name,'Global permissions').then((confirmed) => {
      if (confirmed) {
        // Deletion
        this.subscriptions.push(this.gs.delete(SERV.ACCESS_PERMISSIONS_GROUPS, id).subscribe(() => {
          // Successful deletion
          this.alert.okAlert(`Deleted Global permission ${name}`, '');
          this.onRefreshTable(); // Refresh the table
        }));
      } else {
        // Handle cancellation
        this.alert.okAlert(`Global permission ${name} is safe!`,'');
      }
    });
  }

  /**
   * BULK ACTIONS
   *
  */

  /**
   * Handles Global Permission Group selection.
   * On multi select grabs the ids to be used for bulk action
   *
  */
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

  /**
   * Handles bulk deletion
   * Delete the Global Permission Group showing a progress bar
   *
  */
  async onDeleteBulk() {
    const GlobalIds = this.onSelectedGroups();
    this.alert.bulkDeleteAlert(GlobalIds,'Global Group Permissions',SERV.ACCESS_PERMISSIONS_GROUPS);
    this.onRefreshTable();
  }

}
