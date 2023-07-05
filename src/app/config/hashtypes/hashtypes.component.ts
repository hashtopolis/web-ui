import { faHomeAlt, faPlus, faTrash, faEdit, faSave, faCancel, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { HashtypeService } from '../../core/_services/config/hashtype.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';

@Component({
  selector: 'app-hashtypes',
  templateUrl: './hashtypes.component.html'
})
@PageTitle(['Show Hashtypes'])
export class HashtypesComponent implements OnInit {
  // Loader
  isLoading = false;

  faHome=faHomeAlt;
  faPlus=faPlus;
  faTrash=faTrash;
  faEdit=faEdit;
  faSave=faSave;
  faCancel=faCancel;
  faInfoCircle=faInfoCircle;

  private maxResults = environment.config.prodApiMaxResults;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private hashtypeService: HashtypeService
  ) { }

  public htypes: {hashTypeId: number, description: string, isSalted: number, isSlowHash: number}[] = [];

  ngOnInit(): void {

    let params = {'maxResults': this.maxResults};

    this.hashtypeService.getHashTypes(params).subscribe((htypes: any) => {
      this.htypes = htypes.values;
      this.dtTrigger.next(void 0);
    });
    this.dtOptions = {
      dom: 'Bfrtip',
      pageLength: 10,
      select: true,
      processing: true,  // Error loading
      deferRender: true,
      destroy:true,
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
                var data = "";
                for (var i = 0; i < dt.length; i++) {
                  data = "Hashtypes\n\n"+  dt;
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

  onDelete(id: number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, it can not be recovered!",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonColor: '#8A8584',
      confirmButtonColor: '#C53819',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.hashtypeService.deleteHashType(id).subscribe(() => {
          Swal.fire({
            title: "Success",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.ngOnInit();
          this.rerender();  // rerender datatables
        });
      } else {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your Hashtype is safe!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }
  // Add unsubscribe to detect changes
  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

}
