import { faHomeAlt, faPlus, faTrash, faEdit, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AccessPermissionGroupsService } from 'src/app/core/_services/access/accesspermissiongroups.service';
import { UsersService } from 'src/app/core/_services/users/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-globalpermissionsgroups',
  templateUrl: './globalpermissionsgroups.component.html'
})
export class GlobalpermissionsgroupsComponent implements OnInit {
    // Loader
    isLoading = false;
    // Form attributtes
    signupForm: FormGroup;
    public isCollapsed = true;
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

      this.signupForm = new FormGroup({
        'name': new FormControl('', [Validators.required, Validators.minLength(1)]),
      });
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
         console.log(perm.globalPermissionGroup)
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

    onSubmit(): void{
      if (this.signupForm.valid) {
      console.log(this.signupForm.value);

      this.isLoading = true;

      this.gpg.createAccP(this.signupForm.value).subscribe((agroup: any) => {
        this.isLoading = false;
        Swal.fire({
          title: "Good job!",
          text: "Global Permission Group created!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });
        this.ngOnInit();
        this.rerender();  // rerender datatables
        this.isCollapsed = true; //Close button
      },
      errorMessage => {
        // check error status code is 500, if so, do some action
        Swal.fire({
          title: "Oppss! Error",
          text: "Global Permission Group was not created, please try again!",
          icon: "warning",
          showConfirmButton: true
        });
        this.ngOnInit();
      }
    );
    this.signupForm.reset(); // success, we reset form
    }
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
        this.gpg.deleteAccP(id).subscribe(() => {
          Swal.fire(
            "Global Permission Group has been deleted!",
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
          'No worries, your Global Permission Group is safe!',
          'error'
        )
      }
    });
  }
  // Add unsubscribe to detect changes
  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

}
