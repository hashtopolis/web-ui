import { faEdit, faTrash, faHomeAlt, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { environment } from './../../../../environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-crackers',
  templateUrl: './crackers.component.html'
})
@PageTitle(['Show Crackers'])
export class CrackersComponent implements OnInit, OnDestroy {

  faEdit=faEdit;
  faTrash=faTrash;
  faHome=faHomeAlt;
  faPlus=faPlus;
  faEye=faEye;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  crackerType: any = [];

  constructor(
    private gs: GlobalService,
    ) { }

  private maxResults = environment.config.prodApiMaxResults

  ngOnInit(): void {
    const params = {'maxResults': this.maxResults, 'expand': 'crackerVersions'}

    this.gs.getAll(SERV.CRACKERS_TYPES,params).subscribe((type: any) => {
      this.crackerType = type.values;
      this.dtTrigger.next(void 0);
    });
    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 25,
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
                columns: [0, 1, 2]
              },
            },
            {
              extend: 'print',
              exportOptions: {
                columns: [0, 1, 2]
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
                  data = "Crackers\n\n"+  dt;
                }
                return data;
             }
            },
              'copy'
            ]
          }
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

  onDelete(id: number){
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this cracker!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this.gs.delete(SERV.CRACKERS_TYPES,id).subscribe(() => {
          Swal.fire({
            title: "Success",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
        });
      } else {
        Swal.fire("Your Cracker is safe!")
      }
    });
  }

}
