import { faHomeAlt, faPlus, faTrash, faEdit, faSave, faCancel } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

declare let $:any;

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html'
})
@PageTitle(['Show Groups'])
export class GroupsComponent implements OnInit {

    // Form attributtes
    faHome=faHomeAlt;
    faPlus=faPlus;
    faEdit=faEdit;
    faTrash=faTrash;
    faSave=faSave;
    faCancel=faCancel;

    private maxResults = environment.config.prodApiMaxResults;

    // Datatable
    @ViewChild(DataTableDirective, {static: false})
    dtElement: DataTableDirective;

    dtTrigger: Subject<any> = new Subject<any>();
    dtOptions: any = {};

    public agroups: {accessGroupId: number, groupName: string, isEdit: false }[] = [];

    constructor(
      private alert: AlertService,
      private gs: GlobalService,
      ) { }

    ngOnInit(): void {

      this.loadAccessGroups();

    }

    loadAccessGroups(){

      const params = {'maxResults': this.maxResults}
      this.gs.getAll(SERV.ACCESS_GROUPS,params).subscribe((agroups: any) => {
        this.agroups = agroups.values;
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
                  columns: [0,1]
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
                    data = "Agents\n\n"+  dt;
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
                      text: 'Delete Groups',
                      autoClose: true,
                      action: function (e, dt, node, config) {
                        self.onDeleteBulk();
                      }
                    }
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
      title: 'Remove '+ name +' from your groups?',
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonColor: this.alert.cancelButtonColor,
      confirmButtonColor: this.alert.confirmButtonColor,
      confirmButtonText: this.alert.delconfirmText
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.gs.delete(SERV.ACCESS_GROUPS,id).subscribe(() => {
          this.alert.okAlert('Deleted '+name+'','');
          this.ngOnInit();
          this.rerender();  // rerender datatables
        });
      } else {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your Access Group is safe!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

  onSelectedGroups(){
    $(".dt-button-background").trigger("click");
    const selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
    if(selection.length == 0) {
      this.alert.okAlert('You haven not selected any Group','');
      return;
    }
    const selectionnum = selection.map(i=>Number(i));

    return selectionnum;
  }

  onDeleteBulk(){
      const self = this;
      const selectionnum = this.onSelectedGroups();
      const sellen = selectionnum.length;
      const errors = [];
      selectionnum.forEach(function (value) {
        Swal.fire('Deleting...'+sellen+' Group(s)...Please wait')
        Swal.showLoading()
      self.gs.delete(SERV.ACCESS_GROUPS,value)
      .subscribe(
        err => {
          // console.log('HTTP Error', err)
          err = 1;
          errors.push(err);
        },
        );
      });
    self.onDone(sellen);
  }

  onDone(value?: any){
    setTimeout(() => {
      this.ngOnInit();
      this.rerender();  // rerender datatables
      Swal.close();
      this.alert.okAlert('Completed','');
    },3000);
  }

  // Add unsubscribe to detect changes
  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

}
