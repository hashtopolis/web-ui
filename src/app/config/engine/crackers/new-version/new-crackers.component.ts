import { faDownload, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../../core/_services/main.config';

@Component({
  selector: 'app-new-crackers',
  templateUrl: './new-crackers.component.html'
})
@PageTitle(['New Crackers'])
export class NewCrackersComponent implements OnInit {

  faInfoCircle=faInfoCircle;
  faDownload=faDownload;

  editMode = false;
  editedTypeIndex: number;
  createForm: FormGroup;

  constructor(
    private route:ActivatedRoute,
    private gs: GlobalService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedTypeIndex = +params['id'];
        this.editMode = params['id'] != null;
      }
    );

    this.createForm = new FormGroup({
      'binaryName': new FormControl('', [Validators.required]),
      'version': new FormControl('', [Validators.required]),
      'downloadUrl': new FormControl('', [Validators.required]),
      'crackerBinaryTypeId': new FormControl(this.editedTypeIndex),
    });
  }

  onSubmit(){
    if (this.createForm.valid) {

      this.gs.create(SERV.CRACKERS, this.createForm.value).subscribe(() => {
          Swal.fire({
            position: 'top-end',
            backdrop: false,
            icon: 'success',
            title: "Success!",
            text: "New Version created!",
            showConfirmButton: false,
            timer: 1500
          })
          this.createForm.reset(); // success, we reset form
          this.router.navigate(['/config/engine/crackers']);
        }
      );
    }
  }


}
