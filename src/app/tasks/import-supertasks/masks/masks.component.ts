import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';

@Component({
  selector: 'app-import-supertasks',
  templateUrl: './masks.component.html'
})
@PageTitle(['Import SuperTask - Mask'])
export class MasksComponent implements OnInit {

  faLock=faLock;
  color = '#fff'

  crackertype: any;

  constructor(
    private gs: GlobalService,
    private router: Router,
  ) { }

  // Tooltips
  tasktip: any =[]

  createForm = new FormGroup({
    'name': new FormControl('ffgf', [Validators.required]),
    'isSmall': new FormControl(''),
    'isCPU': new FormControl('', [Validators.required]),
    'optFlag': new FormControl(''),
    'useBench': new FormControl(null || false),
    'crackerBinaryId': new FormControl(0),
    'masks': new FormControl('')
  });

  ngOnInit(): void {

    this.gs.getAll(SERV.CRACKERS_TYPES).subscribe((crackers: any) => {
      this.crackertype = crackers.values;
    });

  }

  onSubmit(){
    if (this.createForm.valid) {

      this.gs.create(SERV.TASKS,this.createForm.value).subscribe(() => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Success!",
            text: "New Supertask created!",
            showConfirmButton: false,
            timer: 1500
          })
          this.createForm.reset(); // success, we reset form
          this.router.navigate(['tasks/show-tasks']);
        }
      );
    }
  }

}
