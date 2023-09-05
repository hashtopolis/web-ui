import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';

import { ValidationService } from '../../../core/_services/shared/validation.service';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';
import { uiDatePipe } from 'src/app/core/_pipes/date.pipe';

function passwordMatchValidator(password: string): ValidatorFn {
  return (control: FormControl) => {
    if (!control || !control.parent) {
      return null;
    }
    return control.parent.get(password).value === control.value ? null : { mismatch: true };
  };
}

@Component({
  selector: 'app-acc-settings',
  templateUrl: './acc-settings.component.html',
  providers: [uiDatePipe]
})
@PageTitle(['Account Settings'])
export class AccountSettingsComponent implements OnInit {

  updateForm: FormGroup;

  constructor(
    private uiService: UIConfigService,
    private datePipe:uiDatePipe,
    private gs: GlobalService,
    private router: Router
  ) {
    this.formInit();
  }

  ngOnInit(): void {

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
      'registeredSince': new FormControl({value: this.datePipe.transform(result['registeredSince']), disabled: true} ),
      'email': new FormControl(result['email']),
      'oldpassword': new FormControl(),
      'newpassword': new FormControl(),
      'confirmpass': new FormControl(),
    });
  });
  }

}
