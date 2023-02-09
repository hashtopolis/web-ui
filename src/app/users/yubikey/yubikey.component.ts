import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faHomeAlt} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { UsersService } from '../../core/_services/users/users.service';

@Component({
  selector: 'app-yubikey',
  templateUrl: './yubikey.component.html'
})
export class YubikeyComponent implements OnInit {
  editMode = false;
  editedUserIndex: number;
  editedUser: any // Change to Model

  faHome=faHomeAlt;
  isLoading = false;

  constructor(
    private usersService: UsersService,
    private route:ActivatedRoute,
    private router: Router,
  ) { }

  user: any[];

  updateForm = new FormGroup({
    'yubikey': new FormControl(''),
    'otp1': new FormControl(''),
    'otp2': new FormControl(''),
  });

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedUserIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );

    this.isLoading = true;

    this.usersService.getCurrentUserID().subscribe((cuser: any) => {
      this.user = cuser.values;
      this.isLoading = false;
    });
  }

  onSubmit(id: number){
    if (this.updateForm.valid) {

      this.isLoading = true;

      this.usersService.updateUser(this.updateForm.value, id).subscribe((agent: any) => {
        const response = agent;
        console.log(response);
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "Yubikey updated!",
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
            text: "Yubikey was not saved, please try again!",
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
        'yubikey': new FormControl(result['yubikey']),
        'otp1': new FormControl(result['otp1']),
        'otp2': new FormControl(result['otp2']),
      });
      this.isLoading = false;
    });
   }
  }

}
