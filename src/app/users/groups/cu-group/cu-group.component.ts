import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';

import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';

@Component({
  selector: 'app-cu-group',
  templateUrl: './cu-group.component.html'
})
@PageTitle(['Group'])
export class CUGroupComponent implements OnInit {
  // Loader
  isLoading = false;
  // Create or Edit Binary
  whichView: string;
  editMode = false;
  editedIndex: number;

  constructor(
    private route:ActivatedRoute,
    private gs: GlobalService,
    private router:Router
  ) { }

  Form = new FormGroup({
    'groupName': new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedIndex = +params['id'];
        this.editMode = params['id'] != null;
      }
    );

    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'new-access-groups':
          this.whichView = 'create';
        break;

        case 'edit-access-groups':
          this.whichView = 'edit';
          this.isLoading = true;
          this.initForm();
        break;

      }
    });

  }

  private initForm() {
    this.isLoading = true;
    if (this.editMode) {
    this.gs.get(SERV.ACCESS_GROUPS,this.editedIndex).subscribe((result)=>{
      this.Form = new FormGroup({
        'groupName': new FormControl(result['groupName']),
      });
      this.isLoading = false;
    });
  }
  }

  onSubmit(): void{
    if (this.Form.valid) {

    this.isLoading = true;

    switch (this.whichView) {

      case 'create':
        this.gs.create(SERV.ACCESS_GROUPS,this.Form.value).subscribe((agroup: any) => {
          this.isLoading = false;
          Swal.fire({
            title: "Success",
            text: "New Group created!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/users/access-groups']);
        }
      );
      break;

      case 'edit':
        this.gs.update(SERV.ACCESS_GROUPS,this.editedIndex,this.Form.value).subscribe((hasht: any) => {
          this.isLoading = false;
          Swal.fire({
            title: "Updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/users/access-groups']);
        });
      break;
    }
  }
}

}
