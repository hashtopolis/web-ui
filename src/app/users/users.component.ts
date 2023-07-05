import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { AccessPermissionGroupsService } from '../core/_services/access/accesspermissiongroups.service';
import { ValidationService } from '../core/_services/shared/validation.service';
import { UsersService } from '../core/_services/users/users.service';
import { environment } from 'src/environments/environment';
import { PageTitle } from '../core/_decorators/autotitle';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
@PageTitle(['New User'])
export class UsersComponent implements OnInit {
  isLoading = false;

  createForm: FormGroup;
  agp:any;
  usedUserNames = [];

  constructor(
     private route:ActivatedRoute,
     private router: Router,
     private usersService: UsersService,
     private apgService:AccessPermissionGroupsService
     ){}

  private maxResults = environment.config.prodApiMaxResults;

  ngOnInit(): void {

    let params = {'maxResults': this.maxResults};
    this.apgService.getAccPGroups(params).subscribe((agp: any) => {
      this.agp = agp.values;
    });

    this.usersService.getAllusers(params).subscribe((res: any) => {
      var arrNames = [];
      for(let i=0; i < res.values.length; i++){
        arrNames.push(res.values[i]['name']);
      }
      this.usedUserNames = arrNames;
    });

    this.createForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, this.checkUserNameExist.bind(this)]),
      'email': new FormControl(null, [Validators.required, Validators.email]), //Check ValidationService.emailValidator
      'isValid': new FormControl(true),
      'globalPermissionGroupId': new FormControl()
    });

  }

  onSubmit(){
    if (this.createForm.valid) {

      this.isLoading = true;

      this.usersService.createUser(this.createForm.value).subscribe((user: any) => {
        const response = user;
        this.isLoading = false;
          Swal.fire({
            title: "Success",
            text: "New User created!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['users/all-users']);
        }
      );
    }
  }

  // Connect this with the
  checkUserNameExist(control: FormControl): {[s: string]: boolean}{
    if(this.usedUserNames.indexOf(control.value) !== -1){
      return {'nameIsUsed': true};
    }
    return null as any;
  }


}
