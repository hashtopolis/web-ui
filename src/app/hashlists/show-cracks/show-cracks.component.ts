import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from './../../../environments/environment';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-show-cracks',
  templateUrl: './show-cracks.component.html'
})
/**
 * ShowCracksComponent is a component that manages and displays all groups data.
 *
 * It uses DataTables to display and interact with the groups data, including exporting, deleting, bulk actions
 * and refreshing the table.
*/
export class ShowCracksComponent implements OnInit, OnDestroy {

  // Font Awesome icons
  faPlus=faPlus;

  // ViewChild reference to the DataTableDirective
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  // List of hashes ToDo. Change Interface
  allhashes: any = [];

  // Subscriptions to unsubscribe on component destruction
  subscriptions: Subscription[] = []

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private titleService: AutoTitleService,
    private gs: GlobalService,
  ) {
    titleService.set(['Show Cracks'])
  }

  /**
   * Initializes DataTable and retrieves groups.
  */
  ngOnInit(): void {
    this.loadCracks();
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
   * Fetches Hashes from the server.
   * Subscribes to the API response and updates the Groups list.
  */
  loadCracks() {

    const params = {'maxResults': this.maxResults, 'filter': 'isCracked=1', 'expand':'hashlist,chunk'}

    this.gs.getAll(SERV.HASHES,params).subscribe((response: any) => {
      this.allhashes = response.values;
      this.dtTrigger.next(void 0);
    });

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
      order: [[0, 'desc']],
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
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
              },
            },
            {
              extend: 'print',
              exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
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
                  data = "Logs\n\n"+  dt;
                }
                return data;
            }
            },
              'copy'
            ]
          },
          {
            extend: 'colvis',
            text: 'Column View',
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
          },
          {
            extend: "pageLength",
            className: "btn-sm"
          },
        ],
      }
    };
  }
}
