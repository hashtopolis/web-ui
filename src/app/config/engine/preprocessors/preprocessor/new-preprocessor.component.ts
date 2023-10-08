import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../../core/_services/main.config';

@Component({
  selector: 'app-new-preprocessor',
  templateUrl: './new-preprocessor.component.html'
})
@PageTitle(['Preprocessor'])
export class NewPreprocessorComponent implements OnInit {

  editMode = false;
  editedPreprocessorIndex: number;
  Preprocessor: any // Change to Model

  constructor(
    private route:ActivatedRoute,
    private gs: GlobalService,
    private router: Router,
  ) { }

  // Create or Edit Preprocessor
  whichView: string;

  prep: any[];

  updateForm = new FormGroup({
    'name': new FormControl(''),
    'url': new FormControl(''),
    'binaryName': new FormControl(''),
    'keyspaceCommand': new FormControl('--keyspace' || ''),
    'skipCommand': new FormControl('--skip' || ''),
    'limitCommand': new FormControl('--limit' || '')
  });


  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedPreprocessorIndex = +params['id'];
        this.editMode = params['id'] != null;
      }
    );

    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'new-preprocessor':
          this.whichView = 'create';
        break;

        case 'edit-preprocessor':
          this.whichView = 'edit';

          this.initForm();

          const id = +this.route.snapshot.params['id'];
          this.gs.get(SERV.PREPROCESSORS,id).subscribe((prep: any) => {
            this.prep = prep;
          });
        break;

      }
    });

  }
  swap:any
  onSubmit(): void{
    if (this.updateForm.valid) {

      switch (this.whichView) {

        case 'create':
          this.gs.create(SERV.PREPROCESSORS,this.updateForm.value)
          .subscribe((prep: any) => {
            const response = prep;
              Swal.fire({
                position: 'top-end',
                backdrop: false,
                icon: 'success',
                title: "Success!",
                text: "New Preprocessor created!",
                showConfirmButton: false,
                timer: 1500
              })
              this.router.navigate(['config/engine/preprocessors']);
            }
          );
        break;

        case 'edit':
          const id = +this.route.snapshot.params['id'];
          this.gs.update(SERV.PREPROCESSORS,id,this.updateForm.value)
          .subscribe((prep: any) => {
            const response = prep;
              Swal.fire({
                position: 'top-end',
                backdrop: false,
                icon: 'success',
                title: "Saved",
                showConfirmButton: false,
                timer: 1500
              })
              this.router.navigate(['config/engine/preprocessors']);
            }
          );
        break;

      }
    }

  }

  private initForm() {
    if (this.editMode) {
    this.gs.get(SERV.PREPROCESSORS,this.editedPreprocessorIndex).subscribe((result)=>{
      this.updateForm = new FormGroup({
        'name': new FormControl(result['name'], [Validators.required, Validators.minLength(1)]),
        'url': new FormControl(result['url'], [Validators.required, Validators.minLength(1)]),
        'keyspaceCommand': new FormControl(result['keyspaceCommand'], Validators.required),
        'binaryName': new FormControl(result['binaryName'], Validators.required),
        'skipCommand': new FormControl(result['skipCommand'], Validators.required),
        'limitCommand': new FormControl(result['limitCommand'], Validators.required),
      });
    });
   }
  }

}

