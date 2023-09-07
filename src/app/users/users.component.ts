import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';

import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { environment } from 'src/environments/environment';
import { SERV } from '../core/_services/main.config';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
@PageTitle(['New User'])
export class UsersComponent implements OnInit {

  createForm: FormGroup;
  agp:any;
  usedUserNames = [];

  constructor(
     private route:ActivatedRoute,
     private gs: GlobalService,
     private router: Router
     ){}

  private maxResults = environment.config.prodApiMaxResults;

  ngOnInit(): void {

    const params = {'maxResults': this.maxResults};
    this.gs.getAll(SERV.ACCESS_PERMISSIONS_GROUPS,params).subscribe((agp: any) => {
      this.agp = agp.values;
    });

    this.gs.getAll(SERV.USERS,params).subscribe((res: any) => {
      const arrNames = [];
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

      this.gs.create(SERV.USERS,this.createForm.value).subscribe(() => {
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
