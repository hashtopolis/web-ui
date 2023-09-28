import { faEdit, faTrash, faPlus, faAdd, faChevronRight, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { ModalPretasksComponent } from './modal-pretasks/modal-pretasks.component';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-supertasks',
  templateUrl: './supertasks.component.html'
})
@PageTitle(['Show SuperTasks'])
export class SupertasksComponent implements OnInit {

  faChevronRight=faChevronRight;
  faChevronUp=faChevronUp;
  faTrash=faTrash;
  faEdit=faEdit;
  faPlus=faPlus;
  faAdd=faAdd;

  allsupertasks: any = [];
  pretasks: any = [];

  constructor(
    private modalService: NgbModal,
    private gs: GlobalService
  ) { }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private maxResults = environment.config.prodApiMaxResults;

  ngOnInit(): void {

    this.gs.getAll(SERV.SUPER_TASKS,{'maxResults': this.maxResults, 'expand': 'pretasks' }).subscribe((stasks: any) => {
      this.allsupertasks = stasks.values;
      this.dtTrigger.next(void 0);
    });

    const self = this;
    this.dtOptions[0] = {
      dom: 'Bfrtip',
      bStateSave:true,
      destroy: true,
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
                let data = "";
                for (let i = 0; i < dt.length; i++) {
                  data = "Show SuperTasks\n\n"+  dt;
                }
                return data;
             }
            },
            {
              extend: 'copy',
            }
            ]
          },
        {
          extend: "pageLength",
          className: "btn-sm"
        }
        ],
      }
    };

  }

  getPretasks(id: number){
    const ref = this.modalService.open(ModalPretasksComponent, { centered: true, size: 'xl'  });
    const _filter = this.allsupertasks.filter(u=> u.supertaskId == id);
    this.pretasks = _filter[0]['pretasks'];
    ref.componentInstance.prep = _filter[0]['pretasks'];
    ref.componentInstance.supertaskid = id;
    ref.componentInstance.title = 'Edit Pretaks'
  }

  onRefresh(){
    this.ngOnInit();
    this.rerender();  // rerender datatables
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
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: 'Remove '+ name +' from your supertasks?',
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonColor: '#8A8584',
      confirmButtonColor: '#C53819',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.gs.delete(SERV.SUPER_TASKS,id).subscribe(() => {
          Swal.fire({
            position: 'top-end',
            backdrop: false,
            icon: 'success',
            title: "Success",
            showConfirmButton: false,
            timer: 1500
          })
          this.ngOnInit();
          this.rerender();  // rerender datatables
        });
      } else {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your SuperTask is safe!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }



}
