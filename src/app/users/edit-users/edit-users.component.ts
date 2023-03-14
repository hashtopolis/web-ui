import { faCalendar,faLock, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { User } from '../user.model';
import { environment } from 'src/environments/environment';
import { UsersService } from '../../core/_services/users/users.service';
import { ValidationService } from '../../core/_services/validation.service';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { AccessPermissionGroupsService } from 'src/app/core/_services/accesspermissiongroups.service';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  providers: [DatePipe]
})
export class EditUsersComponent implements OnInit {
  editMode = false;
  editedUserIndex: number;
  editedUser: any // Change to Model

  faCalendar=faCalendar;
  faLock=faLock;
  faUser=faUser;
  faEnvelope=faEnvelope;
  isLoading = false;

  agp:any;
  // ToDo checknames before.
  usedUserNames = ['Admin', 'Guest'];

  user: any[];
  uidateformat:any;

  allowEdit = false;

  constructor(
    private router: Router,
    private datePipe:DatePipe,
    private route:ActivatedRoute,
    private usersService: UsersService,
    private uiService: UIConfigService,
    private apgService:AccessPermissionGroupsService
    ) { }

  private maxResults = environment.config.prodApiMaxResults;

  updateForm = new FormGroup({
      'userid': new FormControl({value: '', disabled: true}),
      'username': new FormControl({value: '', disabled: true}),
      'email': new FormControl({value: '', disabled: true}),
      'registered': new FormControl({value: '', disabled: true}),
      'lastLogin': new FormControl({value: '', disabled: true}),
      'groups': new FormControl({value: '', disabled: true}),
      'updateData': new FormGroup({
        'rightGroupId': new FormControl(''),
        'setPassword': new FormControl('',ValidationService.passwordValidator),
        'isValid': new FormControl('')
      })
  });

  ngOnInit(): void {

    this.uidateformat = this.uiService.getUIsettings('timefmt').value;

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedUserIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.allowEdit = params['allowEdit'] === '1' ? true : false;
        this.initForm();
      }
    );

    this.isLoading = true;

    const id = +this.route.snapshot.params['id'];
    this.usersService.getUser(id).subscribe((user: any) => {
      this.user = user;
      this.isLoading = false;
      console.log(this.user);
    });

    let params = {'maxResults': this.maxResults};
    this.apgService.getAccPGroups(params).subscribe((agp: any) => {
      this.agp = agp.values;
    });



    // This options bind the params in the same (it is a better option but depends on the API structure)
    // const id = +this.route.snapshot.params['id'];
    // this.userdata = this.usersService.getUser(id);
    // this.route.params
    //   .subscribe(
    //     (params: Params) => {
    //       this.usersService.getUser(params['id']);
    //     }
    //   );
}
  onUpdateUser(index: number): void{
    if (this.updateForm.valid) {
      console.log(this.updateForm);
      this.updateForm.reset();
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
        this.usersService.deleteUser(id).subscribe(() => {
          Swal.fire(
            "Users has been deleted!",
            {
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.ngOnInit();
        });
      } else {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'No worries, your User is safe!',
          'error'
        )
      }
    });
  }

  onSubmit(){
    if (this.updateForm.valid) {

      this.isLoading = true;

      this.usersService.updateUser(this.updateForm.value, this.editedUserIndex).subscribe((agent: any) => {
        const response = agent;
        console.log(response);
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "User updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset(); // success, we reset form
          this.router.navigate(['users/all-users']);
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "User was not created, please try again!",
            icon: "warning",
            showConfirmButton: true
          });
        }
      );
    }
  }

  private initForm() {
    this.isLoading = true;

    if (this.editMode) {
      this.usersService.getUser(this.editedUserIndex).subscribe((result)=>{
      this.updateForm = new FormGroup({
        'userid': new FormControl(result['userId']),
        'username': new FormControl(result['username']),
        'email': new FormControl(result['email']),
        'registered': new FormControl(this.datePipe.transform(result['registeredSince'],this.uidateformat)),
        'lastLogin': new FormControl(this.datePipe.transform(result['lastLoginDate'],this.uidateformat)),
        'groups': new FormControl(result['groups']),
        'updateData': new FormGroup({
          'rightGroupId': new FormControl(result['rightGroupId']),
          'setPassword': new FormControl(result['setPassword']),
          'isValid': new FormControl(result['isValid']),
        })
      });
      this.isLoading = false;
    });
   }
  }

}
