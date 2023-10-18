import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from 'src/app/core/_services/shared/alert.service';
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
    private alert: AlertService,
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
        this.alert.okAlert('New Cracker created!','');
        this.createForm.reset(); // success, we reset form
        this.router.navigate(['/config/engine/crackers']);
        }
      );
    }
  }

}
