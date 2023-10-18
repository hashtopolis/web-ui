import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';

@Component({
  selector: 'app-new-health-checks',
  templateUrl: './new-health-checks.component.html'
})
@PageTitle(['New Health Check'])
export class NewHealthChecksComponent implements OnInit {

  // Form create Health Check
  createForm: FormGroup;

  constructor(
    private alert: AlertService,
    private gs: GlobalService,
    private router:Router
  ) { }

  crackertype: any = [];
  crackerversions: any = [];

  ngOnInit(): void {

    this.gs.getAll(SERV.CRACKERS_TYPES).subscribe((crackers: any) => {
      this.crackertype = crackers.values;
    });

    this.createForm = new FormGroup({
      'checkType': new FormControl(0),
      'hashtypeId': new FormControl(null || 0, [Validators.required]),
      'crackerBinaryId': new FormControl('', [Validators.required])
    });

  }

  onChangeBinary(id: string){
    const params = {'filter': 'crackerBinaryTypeId='+id+''};
    this.gs.getAll(SERV.CRACKERS,params).subscribe((crackers: any) => {
      this.crackerversions = crackers.values;
    });
  }

  onSubmit(){
    if (this.createForm.valid) {

      this.gs.create(SERV.HEALTH_CHECKS,this.createForm.value).subscribe(() => {
        this.alert.okAlert('New Health Check created!','');
        this.router.navigate(['/config/health-checks']);
        }
      );
    }
  }

}
