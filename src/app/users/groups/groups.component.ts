import { faHomeAlt, faPlus, faTrash, faEdit, faSave, faCancel } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';


import { AccessGroupsService } from '../../core/_services/access/accessgroups.service';
import { UsersService } from 'src/app/core/_services/users/users.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html'
})
export class GroupsComponent implements OnInit {
    // Loader
    isLoading = false;
    // Form attributtes
    signupForm: FormGroup;
    public isCollapsed = true;
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
      private accessgroupService: AccessGroupsService,
      private users: UsersService,
      private router: Router
      ) { }

    ngOnInit(): void {

      this.loadAccessGroups();

    }

    loadAccessGroups(){
      this.signupForm = new FormGroup({
        'groupName': new FormControl('', [Validators.required, Validators.minLength(1)]),
      });
      let params = {'maxResults': this.maxResults}
      this.accessgroupService.getAccessGroups(params).subscribe((agroups: any) => {
        this.agroups = agroups.values;
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

    onEdit(item: any){
      this.agroups.forEach(element => {
        element.isEdit = false;
      });
      item.isEdit = true;
    }

    onSave(item: any){
      console.log(item);
      this.accessgroupService.updateAccessGroups(item).subscribe((hasht: any) => {
        this.isLoading = false;
        this.ngOnInit();  // reload ngOnInit
        Swal.fire({
          title: "Updated!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });
      });
      this.rerender();  // Destroy and rerender table
      item.isEdit = false; //Change Edit status to false
    }

    onCancel(item: any){
      item.isEdit = false;

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

      this.accessgroupService.createAccessGroups(this.signupForm.value).subscribe((agroup: any) => {
        this.isLoading = false;
        Swal.fire({
          title: "Good job!",
          text: "New HashList created!",
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
          text: "Access Group was not created, please try again!",
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
      text: "If your Hashtype is being in a Hashlist/Task that could lead to issues!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#4B5563',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.accessgroupService.deleteAccessGroups(id).subscribe(() => {
          Swal.fire(
            "Access Group has been deleted!",
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
          'No worries, your Access Group is safe!',
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
