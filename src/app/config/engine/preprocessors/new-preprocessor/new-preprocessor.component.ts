import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { PreprocessorService } from '../../../../core/_services/config/preprocessors.service';

@Component({
  selector: 'app-new-preprocessor',
  templateUrl: './new-preprocessor.component.html'
})
export class NewPreprocessorComponent implements OnInit {

  editMode = false;
  editedPreprocessorIndex: number;
  Preprocessor: any // Change to Model

  // Loader
  isLoading = false;

  constructor(
    private preprocessorService:PreprocessorService,
    private route:ActivatedRoute,
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
          this.isLoading = true;
          this.initForm();

          const id = +this.route.snapshot.params['id'];
          this.preprocessorService.getPreprocessor(id).subscribe((prep: any) => {
            this.prep = prep;
            this.isLoading = false;
          });
        break;

      }
    });

  }
  swap:any
  onSubmit(): void{
    if (this.updateForm.valid) {

      this.isLoading = true;

      switch (this.whichView) {

        case 'create':
          this.preprocessorService.createPreprocessor(this.updateForm.value)
          .subscribe((prep: any) => {
            const response = prep;
            console.log(response);
            this.isLoading = false;
              Swal.fire({
                title: "Good job!",
                text: "New Preprocessor created!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
              });
              this.router.navigate(['config/engine/preprocessors']);
            },
            errorMessage => {
              // check error status code is 500, if so, do some action
              Swal.fire({
                title: "Error!",
                text: "Preprocessor was not created, please try again!",
                icon: "warning",
                showConfirmButton: true
              });
            }
          );
        break;

        case 'edit':
          const id = +this.route.snapshot.params['id'];
          this.preprocessorService.updateHashType(id,this.updateForm.value)
          .subscribe((prep: any) => {
            const response = prep;
            console.log(response);
            this.isLoading = false;
              Swal.fire({
                title: "Good job!",
                text: "New Preprocessor created!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
              });
              this.router.navigate(['config/engine/preprocessors']);
            },
            errorMessage => {
              // check error status code is 500, if so, do some action
              Swal.fire({
                title: "Error!",
                text: "Preprocessor was not created, please try again!",
                icon: "warning",
                showConfirmButton: true
              });
            }
          );
        break;

      }
    }

  }

  private initForm() {
    this.isLoading = true;
    if (this.editMode) {
    this.preprocessorService.getPreprocessor(this.editedPreprocessorIndex).subscribe((result)=>{
      this.updateForm = new FormGroup({
        'name': new FormControl(result['name'], [Validators.required, Validators.minLength(1)]),
        'url': new FormControl(result['url'], [Validators.required, Validators.minLength(1)]),
        'keyspaceCommand': new FormControl(result['keyspaceCommand'], Validators.required),
        'binaryName': new FormControl(result['binaryName'], Validators.required),
        'skipCommand': new FormControl(result['skipCommand'], Validators.required),
        'limitCommand': new FormControl(result['limitCommand'], Validators.required),
      });
      this.isLoading = false;
    });
   }
  }

}

