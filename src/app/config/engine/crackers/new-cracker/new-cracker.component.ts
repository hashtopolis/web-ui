import { PageTitle } from 'src/app/core/_decorators/autotitle';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../../../core/_services/main.config';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-cracker',
  templateUrl: './new-cracker.component.html'
})
@PageTitle(['New Cracker'])
export class NewCrackerComponent implements OnInit {

  createForm: FormGroup;

  constructor(
    private gs: GlobalService,
    private router:Router
  ) { }

  ngOnInit(): void {

    this.createForm = new FormGroup({
      'typeName': new FormControl(''),
      'isChunkingAvailable': new FormControl(''),
    });

  }

  onSubmit(){
    if (this.createForm.valid) {

      this.gs.create(SERV.CRACKERS_TYPES, this.createForm.value).subscribe(() => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Success!",
            text: "New Cracker created!",
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
