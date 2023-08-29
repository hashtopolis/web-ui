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

  faMagnifyingGlass=faMagnifyingGlass;

  constructor(
    private gs: GlobalService,
    private router: Router
  ) { }

  createForm: FormGroup;
  searh: any;
  private maxResults = environment.config.prodApiMaxResults;

  ngOnInit(): void {

    this.createForm = new FormGroup({
      hashes: new FormControl('', [Validators.required]),
    });

  }

  onSubmit(){
    if (this.createForm.valid) {

      const params = {'maxResults': this.maxResults}

      this.gs.getAll(SERV.HASHES,params).subscribe((hasht: any) => {
        console.log(hasht);
        const index = hasht.findIndex(obj => obj.hash === this.createForm['hashlists'])},
      );
    }
  }

}
