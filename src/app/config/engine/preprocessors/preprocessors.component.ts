import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { faHomeAlt, faPlus, faTrash, faEdit} from '@fortawesome/free-solid-svg-icons';
import { PreprocessorService } from '../../../core/_services/config/preprocessors.service';
import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-preprocessors',
  templateUrl: './preprocessors.component.html'
})
export class PreprocessorsComponent implements OnInit {
  public isCollapsed = true;
  faHome=faHomeAlt;
  faPlus=faPlus;
  faTrash=faTrash;
  faEdit=faEdit;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  public preproc: {preprocessorId: number, name: string, url: string, binaryName: string, keyspaceCommand: string, skipCommand: string, limitCommand: string}[] = [];

  constructor(private preprocessorService: PreprocessorService,
    private route:ActivatedRoute, private router:Router) { }

  private maxResults = environment.config.prodApiMaxResults


    ngOnInit(): void {
      let params = {'maxResults': this.maxResults }
      this.preprocessorService.getPreprocessors(params).subscribe((pre: any) => {
        this.preproc = pre.values;
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
                  columns: [0, 1]
                },
              },
              {
                extend: 'print',
                exportOptions: {
                  columns: [0, 1]
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
                    data = "Preprocessors\n\n"+  dt;
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
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, it cannot be recover.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#4B5563',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.preprocessorService.deletePreprocessor(id).subscribe(() => {
            Swal.fire(
              "Preprocessor has been deleted!",
              {
              icon: "success",
              showConfirmButton: false,
              timer: 1500
            });
            this.ngOnInit();
            this.rerender();  // rerender datatables
          });
        } else {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'No worries, your Preprocessor is safe!',
            'error'
          )
        }
      });
    }

}
