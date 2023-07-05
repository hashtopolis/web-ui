import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HealthcheckService } from 'src/app/core/_services/config/healthcheck.service';
import { CrackerService } from 'src/app/core/_services/config/cracker.service';

@Component({
  selector: 'app-new-health-checks',
  templateUrl: './new-health-checks.component.html'
})
@PageTitle(['New Health Check'])
export class NewHealthChecksComponent implements OnInit {
  // Loader
  isLoading = false;
  // Form create Health Check
  createForm: FormGroup;

  constructor(
    private healthcheckService: HealthcheckService,
    private crackerService: CrackerService,
    private router:Router
  ) { }

  crackertype: any = [];
  crackerversions: any = [];

  ngOnInit(): void {

    this.crackerService.getCrackerType().subscribe((crackers: any) => {
      this.crackertype = crackers.values;
    });

    this.createForm = new FormGroup({
      'checkType': new FormControl(0),
      'hashtypeId': new FormControl(null || 0, [Validators.required]),
      'crackerBinaryId': new FormControl('', [Validators.required])
    });

  }

  onChangeBinary(id: string){
    let params = {'filter': 'crackerBinaryTypeId='+id+''};
    this.crackerService.getCrackerBinaries(params).subscribe((crackers: any) => {
      this.crackerversions = crackers.values;
    });
  }

  onSubmit(){
    if (this.createForm.valid) {

      this.isLoading = true;

      this.healthcheckService.createHealthCheck(this.createForm.value).subscribe((hasht: any) => {
        const response = hasht;
        this.isLoading = false;
          Swal.fire({
            title: "Success",
            text: "New Health Check created!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/config/health-checks']);
        }
      );
    }
  }

}
