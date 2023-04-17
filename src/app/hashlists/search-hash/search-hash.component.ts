import { Component, OnInit, ChangeDetectionStrategy ,ChangeDetectorRef  } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { HashesService } from 'src/app/core/_services/hashlist/hashes.service';

@Component({
  selector: 'app-search-hash',
  templateUrl: './search-hash.component.html'
})
export class SearchHashComponent implements OnInit {
  isLoading = false;
  faMagnifyingGlass=faMagnifyingGlass;

  constructor(
    private router: Router,
    private hashesService: HashesService
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

      let params = {'maxResults': this.maxResults}

      this.hashesService.getAllhashes(params).subscribe((hasht: any) => {

        var index = hasht.findIndex(obj => obj.hash === this.createForm['hashlists']);

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
