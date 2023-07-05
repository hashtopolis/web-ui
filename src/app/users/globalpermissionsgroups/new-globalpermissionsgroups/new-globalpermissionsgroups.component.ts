import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccessPermissionGroupsService } from 'src/app/core/_services/access/accesspermissiongroups.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';

@Component({
  selector: 'app-new-globalpermissionsgroups',
  templateUrl: './new-globalpermissionsgroups.component.html'
})
@PageTitle(['New Global Permission Group'])
export class NewGlobalpermissionsgroupsComponent implements OnInit {
  // Loader
  isLoading = false;
  // Form
  createForm: FormGroup;
  public isCollapsed = true;

  constructor(
    private gpg: AccessPermissionGroupsService,
    private router:Router
  ) { }

  ngOnInit(): void {

    this.createForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(1)]),
    });

  }

  onSubmit(): void{
    if (this.createForm.valid) {

    this.isLoading = true;

    this.gpg.createAccP(this.createForm.value).subscribe((agroup: any) => {
      this.isLoading = false;
      Swal.fire({
        title: "Success",
        text: "Global Permission Group created!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      });
      this.router.navigate(['/users/global-permissions-groups']);
    }
  );
  this.createForm.reset(); // success, we reset form
  }
}

}
