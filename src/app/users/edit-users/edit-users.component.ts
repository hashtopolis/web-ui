import { faCalendar,faLock, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ValidationService } from '../../core/_services/shared/validation.service';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { environment } from 'src/environments/environment';
import { SERV } from '../../core/_services/main.config';
import { User } from '../user.model';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  providers: [DatePipe]
})
@PageTitle(['Edit User'])
export class EditUsersComponent implements OnInit {
  editMode = false;
  editedUserIndex: number;
  editedUser: any // Change to Model

  faCalendar=faCalendar;
  faEnvelope=faEnvelope;
  faLock=faLock;
  faUser=faUser;

  uidateformat:any;
  user: any[];
  agp:any;

  allowEdit = false;

  constructor(
    private uiService: UIConfigService,
    private route:ActivatedRoute,
    private gs: GlobalService,
    private datePipe:DatePipe,
    private router: Router
    ) { }

  private maxResults = environment.config.prodApiMaxResults;

  updateForm = new FormGroup({
      'id': new FormControl({value: '', disabled: true}),
      'name': new FormControl({value: '', disabled: true}),
      'email': new FormControl({value: '', disabled: true}),
      'registered': new FormControl({value: '', disabled: true}),
      'lastLogin': new FormControl({value: '', disabled: true}),
      'globalPermissionGroup': new FormControl({value: '', disabled: true}),
      'updateData': new FormGroup({
        'globalPermissionGroupId': new FormControl(''),
        // 'setPassword': new FormControl('',ValidationService.passwordValidator),
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

    const id = +this.route.snapshot.params['id'];
    this.gs.get(SERV.USERS,id,{'expand':'accessGroups'}).subscribe((user: any) => {
      this.user = user;
    });

    const params = {'maxResults': this.maxResults};
    this.gs.getAll(SERV.ACCESS_PERMISSIONS_GROUPS,params).subscribe((agp: any) => {
      this.agp = agp.values;
    });

}

  onDelete(){
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
        this.gs.delete(SERV.USERS,this.editedUserIndex).subscribe(() => {
          Swal.fire({
            title: "Success",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/users/all-users']);
        });
      } else {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your User is safe!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

  onSubmit(){
    if (this.updateForm.valid) {
      this.gs.update(SERV.USERS,this.editedUserIndex, this.updateForm.value.updateData).subscribe(() => {
          Swal.fire({
            title: "Success",
            text: "User updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset(); // success, we reset form
          this.router.navigate(['users/all-users']);
        }
      );
    }
  }

  private initForm() {

    if (this.editMode) {
      this.gs.get(SERV.USERS,this.editedUserIndex).subscribe((result)=>{
      this.updateForm = new FormGroup({
        'id': new FormControl({value: result['id'], disabled: true}),
        'name': new FormControl({value: result['name'], disabled: true}),
        'email': new FormControl({value: result['email'], disabled: true}),
        'registered': new FormControl({value: this.datePipe.transform(result['registeredSince'],this.uidateformat), disabled: true}),
        'lastLogin': new FormControl({value: this.datePipe.transform(result['lastLoginDate'],this.uidateformat), disabled: true} ),
        'globalPermissionGroup': new FormControl({value: result['globalPermissionGroup'], disabled: true}) ,
        'updateData': new FormGroup({
          'globalPermissionGroupId': new FormControl(result['globalPermissionGroupId']),
          // 'setPassword': new FormControl(),
          'isValid': new FormControl(result['isValid']),
        })
      });
    });
   }
  }

}
