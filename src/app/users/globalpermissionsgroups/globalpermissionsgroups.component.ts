import { faHomeAlt, faPlus, faTrash, faEdit, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AccessPermissionGroupsService } from 'src/app/core/_services/access/accesspermissiongroups.service';
import { UsersService } from 'src/app/core/_services/users/users.service';
import { environment } from 'src/environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';

@Component({
  selector: 'app-globalpermissionsgroups',
  templateUrl: './globalpermissionsgroups.component.html'
})
@PageTitle(['Show Global Permissions'])
export class GlobalpermissionsgroupsComponent implements OnInit {
    // Loader
    isLoading = false;
    // Form attributtes
    faInfoCircle=faInfoCircle;
    faHome=faHomeAlt;
    faPlus=faPlus;
    faEdit=faEdit;
    faTrash=faTrash;

    private maxResults = environment.config.prodApiMaxResults;

    // Datatable
    @ViewChild(DataTableDirective, {static: false})
    dtElement: DataTableDirective;

    dtTrigger: Subject<any> = new Subject<any>();
    dtOptions: any = {};

    public Allgpg: {id: number, name: string , user:[]}[] = [];

    constructor(
      private gpg: AccessPermissionGroupsService,
      private users: UsersService,
      private router: Router
    ) { }

    ngOnInit(): void {

      this.setAccessPermissions();

      let params = {'maxResults': this.maxResults , 'expand': 'user'}
      this.gpg.getAccPGroups(params).subscribe((gpg: any) => {
        this.Allgpg = gpg.values;
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
                  var data = "";
                  for (var i = 0; i < dt.length; i++) {
                    data = "Agents\n\n"+  dt;
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

    setAccessPermissions(){
      this.users.getUser(this.users.userId,{'expand':'globalPermissionGroup'}).subscribe((perm: any) => {

      });
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
        this.gpg.deleteAccP(id).subscribe(() => {
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
          text: "Your Global Permission is safe!",
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
