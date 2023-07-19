import { Component, OnInit, ChangeDetectionStrategy ,ChangeDetectorRef  } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';

import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-search-hash',
  templateUrl: './search-hash.component.html'
})
@PageTitle(['Search Hash'])
export class SearchHashComponent implements OnInit {
  isLoading = false;
  faMagnifyingGlass=faMagnifyingGlass;

  constructor(
    private gs: GlobalService,
    private router: Router
  ) { }

  createForm: FormGroup;
  private maxResults = environment.config.prodApiMaxResults;

  ngOnInit(): void {

    this.createForm = new FormGroup({
      hashlists: new FormControl('', [Validators.required]),
    });

  }

  onSubmit(){
    if (this.createForm.valid) {

      this.isLoading = true;

      const params = {'maxResults': this.maxResults}

      this.gs.getAll(SERV.HASHES,params).subscribe((hasht: any) => {

        const index = hasht.findIndex(obj => obj.hash === this.createForm['hashlists']);

        this.isLoading = false;
          Swal.fire({
            title: "We've got a match!",
            text: "Redirecting...",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.createForm.reset(); // success, we reset form
          this.router.navigate(['hashlists/search-hash']);
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "No Match!",
            icon: "warning",
            showConfirmButton: true
          });
          this.isLoading = false;
          this.createForm.reset(); // success, we reset form
        }
      );
    }
  }

}
