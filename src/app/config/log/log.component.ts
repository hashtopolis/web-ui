import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { faHomeAlt } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { LogentryService } from '../../core/_services/config/logentry.service';

declare var $: any;
declare var _fnReDraw;

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html'
})
export class LogComponent implements OnInit {
  faHome=faHomeAlt;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  uidateformat:any;
  localStable: string = 'DataTables_DataTables_Table_0_/config/log';
  localStablepage: string = 'DataTables_DataTables_Table_0_/config/log_lastpage';

  public logs: {logEntryId: number, issuer: string, issuerId: number, level: string, message: string, time: number}[] = [];

  private maxResults = environment.config.prodApiMaxResults;

  totalRecords:number = 0;
  pageSize:number = this.getLenghtMenu();
  isLast: boolean = false;
  showLabel: string;

  constructor(
    private logentryService: LogentryService,
    private uiService: UIConfigService,
    private route:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit(): void {

    this.loadLogs(this.geStartPage());
    this.uidateformat = this.uiService.getUIsettings('timefmt').value;

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
    let lengthM = JSON.parse(localStorage.getItem(this.localStable));
    if (!lengthM) {
      return 50;
    }else{
      return lengthM.length;
    }
  }

  geStartPage(){
    let startP = JSON.parse(localStorage.getItem(this.localStablepage));
    if (!startP) {
      let currentPage:any = {start: '1'};
      localStorage.setItem(this.localStablepage, currentPage);
    }else{
      return startP.start;
    }
  }

  saveCurrentPage(name: string, pagestart: number){
    let currentPage = {start: pagestart};
    localStorage.setItem(this.localStablepage, JSON.stringify(currentPage));
  }

  loadLogs(page: number){

    this.saveCurrentPage(this.localStable, page);

    var maxresults = this.getLenghtMenu();
    let params = {'maxResults': maxresults, 'startsAt': (page - 1) * this.pageSize};

    this.logentryService.getLogs(params).subscribe((log: any) => {
      this.logs = log.values;
      this.totalRecords = log.total;
      this.isLast = log.isLast;
      this.dtTrigger.next(null);
    });

    var self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      bStateSave:true,
      bPaginate: false,
      bLengthChange: false,
      bInfo: false,
      bSort: true,
      lengthMenu: [ [25, 50, 100, 200, 300, 500, 50000 ], [25, 50, 100, 200, 300, 500, 'All'] ],
      columnDefs: [
        {
            targets: 0,
            className: 'noVis'
        }
      ],
      stateSaveParams: function (settings, data) {
        for ( var i=0, ien=data.columns.length ; i<ien ; i++ ) {
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
            var myButton = this;
            var currentPageLen = dt.page.len();
            $.fn.dataTable.ext.buttons.collection.action.call(myButton, e, dt, node, config);
            self.onReload(maxresults,currentPageLen);
           }
          },
        ],
      }
    };

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
