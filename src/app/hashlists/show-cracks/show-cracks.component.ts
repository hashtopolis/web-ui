import { environment } from './../../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-show-cracks',
  templateUrl: './show-cracks.component.html'
})
@PageTitle(['Show Cracks'])
export class ShowCracksComponent implements OnInit {

  faPlus=faPlus;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private uiService: UIConfigService,
    private gs: GlobalService,
  ) { }

  allhashes: any = [];
  private maxResults = environment.config.prodApiMaxResults;

  ngOnInit(): void {

    const params = {'maxResults': this.maxResults, 'filter': 'isCracked=1', 'expand':'hashlist,chunk'}

    this.gs.getAll(SERV.HASHES,params).subscribe((hashes: any) => {
      this.allhashes = hashes.values;
      this.dtTrigger.next(void 0);
    });
    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 10,
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

  onRefresh(){
    this.rerender();
    this.ngOnInit();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      setTimeout(() => {
        this.dtTrigger['new'].next();
      });
    });
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


}
