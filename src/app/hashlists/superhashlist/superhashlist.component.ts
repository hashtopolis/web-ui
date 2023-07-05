import { faEdit, faTrash,faFileImport, faFileExport, faPlus, faLock } from '@fortawesome/free-solid-svg-icons';
import { environment } from './../../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { SuperHashlistService } from 'src/app/core/_services/hashlist/superhashlist.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';

@Component({
  selector: 'app-superhashlist',
  templateUrl: './superhashlist.component.html'
})
@PageTitle(['Show SuperHashlist'])
export class SuperhashlistComponent implements OnInit {

  // Title Page
  pTitle = "SuperHashList";
  buttontitle = "New SuperHashList";
  buttonlink = "/hashlists/new-superhashlist";
  subbutton = true;

  faEdit=faEdit;
  faLock=faLock;
  faTrash=faTrash;
  faFileImport=faFileImport;
  faFileExport=faFileExport;
  faPlus=faPlus;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
  private superHashlist: SuperHashlistService
  ) { }

  allsuperhashlisth: any
  private maxResults = environment.config.prodApiMaxResults

  ngOnInit(): void {

    let params = {'maxResults': this.maxResults, 'expand': 'pretaskFiles'}

    this.superHashlist.getAllsuperhashlists(params).subscribe((sh: any) => {
      this.allsuperhashlisth = sh.values;
      this.dtTrigger.next(void 0);
    });

    this.dtOptions = {
      dom: 'Bfrtip',
      pageLength: 10,
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
                  data = "SuperHashlist\n\n"+  dt;
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
        this.superHashlist.deleteSuperhashlist(id).subscribe(() => {
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
          text: "Your SuperHashlist is safe!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }
  // Add unsubscribe to detect changes
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


}
