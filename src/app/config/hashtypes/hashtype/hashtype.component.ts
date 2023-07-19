import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';

import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';

@Component({
  selector: 'app-hashtype',
  templateUrl: './hashtype.component.html'
})
@PageTitle(['Hashtype'])
export class HashtypeComponent implements OnInit {
  // Loader
  isLoading = false;
  // Create or Edit Hashtype
  whichView: string;
  editMode = false;
  editedIndex: number;

  constructor(
    private gs: GlobalService,
    private route:ActivatedRoute,
    private router:Router
  ) { }

  // Create Hashtype
  Form = new FormGroup({
    'hashTypeId': new FormControl('', [Validators.required,Validators.pattern("^[0-9]*$"), Validators.minLength(1)]),
    'description': new FormControl('', [Validators.required, Validators.minLength(1)]),
    'isSalted': new FormControl(false),
    'isSlowHash': new FormControl(false)
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

        case 'new-hashtype':
          this.whichView = 'create';
        break;

        case 'edit-hashtype':
          this.whichView = 'edit';
          this.isLoading = true;
          this.initForm();
          const id = +this.route.snapshot.params['id'];
        break;

      }
    });

  }

  private initForm() {
    this.isLoading = true;
    if (this.editMode) {
    this.gs.get(SERV.HASHTYPES,this.editedIndex).subscribe((result)=>{
      this.Form = new FormGroup({
        'hashTypeId': new FormControl({value: result['hashTypeId'], disabled: true} ),
        'description': new FormControl(result['description']),
        'isSalted': new FormControl(result['isSalted']),
        'isSlowHash': new FormControl(result['isSlowHash']),
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
      this.gs.create(SERV.HASHTYPES,this.Form.value).subscribe((hasht: any) => {
        const response = hasht;
        this.isLoading = false;
          Swal.fire({
            title: "Success",
            text: "New Hashtype created!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/config/hashtypes']);
        }
      );
      break;

      case 'edit':
        const id = +this.route.snapshot.params['id'];
        this.gs.update(SERV.HASHTYPES,id,this.Form.value).subscribe((hasht: any) => {
          this.isLoading = false;
          Swal.fire({
            title: "Updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/config/hashtypes']);
        });
      break;
    }
  }
}

}
