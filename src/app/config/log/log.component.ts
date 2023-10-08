import { Component, OnInit, ViewChild } from '@angular/core';
import { faHomeAlt } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

declare let $: any;
declare let _fnReDraw;

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html'
})
@PageTitle(['Show Logs'])
export class LogComponent implements OnInit {

  faHome=faHomeAlt;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  localStable = 'DataTables_DataTables_Table_0_/config/log';
  localStablepage = 'DataTables_DataTables_Table_0_/config/log_lastpage';

  public logs: {logEntryId: number, issuer: string, issuerId: number, level: string, message: string, time: number}[] = [];

  private maxResults = environment.config.prodApiMaxResults;

  totalRecords = 0;
  pageSize:number = this.getLenghtMenu();
  isLast = false;
  showLabel: string;

  constructor(
    private uiService: UIConfigService,
    private gs: GlobalService
  ) { }

  ngOnInit(): void {

    this.loadLogs(this.geStartPage());

  }

  pageChanged(page: number) {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the current table instance
      dtInstance.destroy();
      // Get new objects using pagination
      this.loadLogs(page);
    });
  }

  getLenghtMenu(){
    const lengthM = JSON.parse(localStorage.getItem(this.localStable));
    if (!lengthM) {
      return 50;
    }else{
      return lengthM.length;
    }
  }

  geStartPage(){
    const startP = JSON.parse(localStorage.getItem(this.localStablepage));
    if (!startP) {
      const currentPage:any = {start: '1'};
      localStorage.setItem(this.localStablepage, currentPage);
    }else{
      return startP.start;
    }
  }

  saveCurrentPage(name: string, pagestart: number){
    const currentPage = {start: pagestart};
    localStorage.setItem(this.localStablepage, JSON.stringify(currentPage));
  }

  loadLogs(page: number){

    this.saveCurrentPage(this.localStable, page);

    const maxresults = this.getLenghtMenu();
    const params = {'maxResults': maxresults, 'startsAt': (page - 1) * this.pageSize};

    this.gs.getAll(SERV.LOGS,params).subscribe((log: any) => {
      this.logs = log.values;
      this.totalRecords = log.total;
      this.isLast = log.isLast;
      this.dtTrigger.next(null);
    });

    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 25,
      lengthMenu: [
          [10, 25, 50, 100, 250, -1],
          [10, 25, 50, 100, 250, 'All']
      ],
      bStateSave:true,
      bPaginate: false,
      bLengthChange: false,
      bInfo: false,
      bSort: true,
      columnDefs: [
        {
            targets: 0,
            className: 'noVis'
        }
      ],
      stateSaveParams: function (settings, data) {
        for ( let i=0, ien=data.columns.length ; i<ien ; i++ ) {
          // delete data.columns[i].visible;
        }
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
            columns: [ 1,2,3,4 ],
          },
          {
            extend: "pageLength",
            className: "btn-sm",
            action: function ( e, dt, node, config ) {
            const myButton = this;
            const currentPageLen = dt.page.len();
            $.fn.dataTable.ext.buttons.collection.action.call(myButton, e, dt, node, config);
            self.onReload(maxresults,currentPageLen);
           }
          },
        ],
      }
    };

  }

  onRefresh(){
    this.rerender();
    this.ngOnInit();
  }

  onReload(mresults: number, cresults:number){
    if(mresults == cresults){
      setTimeout(() => {
        // location.reload();
      },3000);
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    const currentPage = {start: 0};
    localStorage.setItem(this.localStablepage, JSON.stringify(currentPage));
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      setTimeout(() => {
        this.dtTrigger['new'].next();
      });
    });
  }

}
