import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common';

import { ValidationService } from '../../core/_services/shared/validation.service';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

function passwordMatchValidator(password: string): ValidatorFn {
  return (control: FormControl) => {
    if (!control || !control.parent) {
      return null;
    }
    return control.parent.get(password).value === control.value ? null : { mismatch: true };
  };
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  providers: [DatePipe]
})
@PageTitle(['Account Settings'])
export class SettingsComponent implements OnInit {

  uidateformat:any;
  updateForm: FormGroup;

  constructor(
    private uiService: UIConfigService,
    private datePipe:DatePipe,
    private gs: GlobalService,
    private router: Router
  ) {
    this.formInit();
  }

  ngOnInit(): void {

    this.uidateformat = this.uiService.getUIsettings('temptime').value;

    this.initForm();

  }

  private formInit() {
    this.updateForm = new FormGroup({
      'name': new FormControl({value: '', disabled: true} ),
      'registeredSince': new FormControl({value: '', disabled: true} ),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'oldpassword': new FormControl(),
      'newpassword': new FormControl([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(12)
      ]),
      'confirmpass': new FormControl([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(12)
      ]),
    });
  }

  onSubmit(){
    if (this.updateForm.valid) {
      this.gs.create(SERV.USERS,this.updateForm.value).subscribe(() => {
          Swal.fire({
            title: "Success",
            text: "Updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['users/all-users']);
        }
      );
    }
  }

  private initForm() {
    this.gs.get(SERV.USERS,this.gs.userId, {'expand':'globalPermissionGroup'}).subscribe((result)=>{
    this.updateForm = new FormGroup({
      'name': new FormControl({value: result.globalPermissionGroup['name'], disabled: true} ),
      'registeredSince': new FormControl({value: this.datePipe.transform(result['registeredSince'],this.uidateformat), disabled: true} ),
      'email': new FormControl(result['email']),
      'oldpassword': new FormControl(),
      'newpassword': new FormControl(),
      'confirmpass': new FormControl(),
    });
  });
  }

}
