import { faHomeAlt, faPlus, faTrash, faEdit, faSave, faCancel, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { BulkService } from 'src/app/core/_services/shared/bulk.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

declare let $:any;
@Component({
  selector: 'app-hashtypes',
  templateUrl: './hashtypes.component.html'
})
@PageTitle(['Show Hashtypes'])
export class HashtypesComponent implements OnInit {

  faInfoCircle=faInfoCircle;
  faCancel=faCancel;
  faHome=faHomeAlt;
  faTrash=faTrash;
  faPlus=faPlus;
  faEdit=faEdit;
  faSave=faSave;

  private maxResults = environment.config.prodApiMaxResults;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private alert: AlertService,
    private bulk: BulkService,
    private gs: GlobalService
  ) { }

  public htypes: any;

  ngOnInit(): void {

    const params = {'maxResults': this.maxResults};

    this.gs.getAll(SERV.HASHTYPES,params).subscribe((htypes: any) => {
      this.htypes = htypes.values;
      this.dtTrigger.next(void 0);
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
                columns: [0, 1, 2, 3]
              },
            },
            {
              extend: 'print',
              exportOptions: {
                columns: [0, 1, 2, 3]
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
                  data = "Hashtypes\n\n"+  dt;
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
                    text: 'Delete Hashtypes',
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

  onRefresh(){
    this.rerender();
    this.ngOnInit();
  }

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

  onDelete(id: number, name: string){
    this.alert.deleteConfirmation(name,'Hashtypes').then((confirmed) => {
      if (confirmed) {
        // Deletion
        this.gs.delete(SERV.HASHTYPES, id).subscribe(() => {
          // Successful deletion
          this.alert.okAlert(`Deleted Hashtype ${name}`, '');
          this.onRefreshTable(); // Refresh the table
        });
      } else {
        // Handle cancellation
        this.alert.okAlert(`Hashtype ${name} is safe!`,'');
      }
    });
  }

  onSelectedHashtypes(){
    $(".dt-button-background").trigger("click");
    const selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
    if(selection.length == 0) {
      this.alert.okAlert('You haven not selected any Hashtype','');
      return;
    }
    const selectionnum = selection.map(i=>Number(i));

    return selectionnum;
  }

  async onDeleteBulk() {
    const HashtypesIds = this.onSelectedHashtypes();
    this.alert.bulkDeleteAlert(HashtypesIds,'Hashtypes',SERV.HASHTYPES);
    this.onRefreshTable();
  }

  onRefreshTable(){
    setTimeout(() => {
      this.ngOnInit();
      this.rerender();  // rerender datatables
    },2000);
  }

  // Add unsubscribe to detect changes
  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

}
