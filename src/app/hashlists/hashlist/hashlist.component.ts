import { faEdit, faTrash, faLock, faFileImport, faFileExport, faArchive, faPlus, faHomeAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { SERV } from '../../core/_services/main.config';

declare let $:any;

@Component({
  selector: 'app-hashlist',
  templateUrl: './hashlist.component.html'
})
/**
 * HashlistComponent is a component that manages and displays all hashlist data.
 *
 * It uses DataTables to display and interact with the users hashlist data, including exporting, deleting, bulk actions
 * and refreshing the table.
 */
export class HashlistComponent implements OnInit, OnDestroy {

  // Font Awesome icons
  faCheckCircle=faCheckCircle;
  faFileImport=faFileImport;
  faFileExport=faFileExport;
  faArchive=faArchive;
  faHome=faHomeAlt;
  faTrash=faTrash;
  faLock=faLock;
  faPlus=faPlus;
  faEdit=faEdit;

  // ViewChild reference to the DataTableDirective
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  // List of hashlists ToDo. Change to interface
  public allhashlists: {
    hashlistId: number,
    name: string,
    format: number,
    hashTypeId: number,
    hashCount: number,
    saltSeparator: string,
    cracked: number,
    isSecret: boolean,
    isHexSalt: string,
    isSalted: string,
    accessGroupId: number,
    notes: string,
    useBrain: number,
    brainFeatures: number,
    isArchived: string,
    accessGroup: {accessGroupId: number, groupName: string}
    hashType: {description: string, hashTypeId: number, isSalted: string, isSlowHash: string}
  }[] = [];

  // Subscriptions to unsubscribe on component destruction
  subscriptions: Subscription[] = []

  private maxResults = environment.config.prodApiMaxResults;

  // View type and filter options
  isArchived: boolean;
  whichView: string;

  constructor(
    private titleService: AutoTitleService,
    private route:ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
    ) {
      titleService.set(['Show Hashlists'])
    }

  /**
   * Initializes DataTable and retrieves pretasks.
  */

  ngOnInit(): void {
    this.getHashlists();
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
   * Fetches Hashlists from the server filtering by live or archived
   * Subscribes to the API response and updates the Users list.
  */
  getHashlists(): void {
    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'hashlist':
          this.whichView = 'live';
          this.isArchived = false;
        break;

        case 'archived':
          this.whichView = 'archived';
          this.isArchived = true;
        break;

      }

    const params = {'maxResults': this.maxResults, 'expand': 'hashType,accessGroup', 'filter': 'isArchived='+this.isArchived+''}

    this.subscriptions.push(this.gs.getAll(SERV.HASHLISTS,params).subscribe((list: any) => {
      this.allhashlists = list.values.filter(u=> u.format != 3); // Exclude superhashlists
      this.dtTrigger.next(void 0);
    }));
   })
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
                columns: [0, 1, 2, 3, 4, 5]
              },
            },
            {
              extend: 'print',
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5]
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
                  data = "Hashlist\n\n"+  dt;
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
            drawCallback: function() {
              const hasRows = this.api().rows({ filter: 'applied' }).data().length > 0;
              $('.buttons-excel')[0].style.visibility = hasRows ? 'visible' : 'hidden'
            },
            buttons: [
                  {
                    text: 'Delete Hashlist(s)',
                    autoClose: true,
                    action: function (e, dt, node, config) {
                      self.onDeleteBulk();
                    }
                  },
                  {
                    text: 'Archive Hashlist(s)',
                    autoClose: true,
                    enabled: !this.isArchived,
                    action: function (e, dt, node, config) {
                      const edit = {isArchived: true};
                      self.onUpdateBulk(edit);
                    }
                  }
               ]
          },
          {
            text: !this.isArchived? 'Show Archived':'Show Live',
            action: function () {
              if(!self.isArchived) {
                self.router.navigate(['hashlists/archived']);
              }
              if(self.isArchived){
                self.router.navigate(['hashlists/hashlist']);
              }
            }
          },
          {
            extend: 'colvis',
            text: 'Column View',
            columns: [ 1,2,3,4,5],
          },
          {
            extend: "pageLength",
            className: "btn-sm"
          },
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
   * Archives a hashlist with the given ID.
   *
   * @param {number} id - The ID of the hashlist to archive.
  */
  onArchive(id: number){
    this.gs.archive(SERV.HASHLISTS,id).subscribe((list: any) => {
      this.alert.okAlert('Archived!','');
      this.ngOnInit();
      this.rerender();  // rerender datatables
    });
  }

  /**
   * Handles the deletion of a hashlist.
   * Displays a confirmation dialog and deletes the hashlist if confirmed.
   *
   * @param {number} id - The ID of the hashlist to delete.
   * @param {string} name - The name of the hashlist.
  */
  onDelete(id: number, name: string){
    this.alert.deleteConfirmation(name,'Hashlists').then((confirmed) => {
      if (confirmed) {
        // Deletion
        this.subscriptions.push(this.gs.delete(SERV.HASHLISTS, id).subscribe(() => {
          // Successful deletion
          this.alert.okAlert(`Deleted Hashlist ${name}`, '');
          this.onRefreshTable(); // Refresh the table
        }));
      } else {
        // Handle cancellation
        this.alert.okAlert(`Hashlist ${name} is safe!`,'');
      }
    });
  }

  // Bulk actions

  /**
   * Handles hashlist selection for bulk actions.
   *
   * @returns {number[]} - An array of selected hashlist IDs.
   */
  onSelectedHashlists(){
    $(".dt-button-background").trigger("click");
    const selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
    if(selection.length == 0) {
      this.alert.okAlert('You have not selected any Hashlist','');
      return;
    }
    const selectionnum = selection.map(i=>Number(i));

    return selectionnum;
  }

  /**
   * Handles bulk deletion
   * Delete the hashlists showing a progress bar
   *
  */
  async onDeleteBulk() {
    const HashlistIds = this.onSelectedHashlists();
    this.alert.bulkDeleteAlert(HashlistIds,'Hashlists',SERV.HASHLISTS);
    this.onRefreshTable();
  }

  /**
   * Updates the selected hashlists with the given value.
   *
   * @param {any} value - The value to update the selected hashlists with.
  */
  async onUpdateBulk(value: any) {
    const HashlistIds = this.onSelectedHashlists();
    this.alert.bulkUpdateAlert(HashlistIds,value,'Hashlists',SERV.HASHLISTS);
    this.onRefreshTable();
  }

}
