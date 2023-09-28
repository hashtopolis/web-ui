import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../../core/_services/main.config';

@Component({
  selector: 'app-edit-crackers',
  templateUrl: './edit-crackers.component.html'
})
@PageTitle(['Edit Crackers'])
export class EditCrackersComponent implements OnInit {

  editMode = false;
  editedCrackervIndex: number;
  crackerV: any // Change to Model

  faDownload=faDownload;

  constructor(
    private route:ActivatedRoute,
    private gs: GlobalService,
    private router: Router
  ) { }

  updateForm = new FormGroup({
    'binaryName': new FormControl(''),
    'version': new FormControl(''),
    'downloadUrl': new FormControl(''),
  });

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedCrackervIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );

  }

  onSubmit(){
    if (this.updateForm.valid) {

      this.gs.update(SERV.CRACKERS,this.editedCrackervIndex,this.updateForm.value).subscribe(() => {
          Swal.fire({
            position: 'top-end',
            backdrop: false,
            icon: 'success',
            title: "Saved",
            showConfirmButton: false,
            timer: 1500
          })
          this.updateForm.reset(); // success, we reset form
          this.router.navigate(['config/engine/crackers']);
        }
      );
    }
  }

  onDelete(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: 'Remove from your crackers?',
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonColor: '#8A8584',
      confirmButtonColor: '#C53819',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.gs.delete(SERV.CRACKERS,this.editedCrackervIndex).subscribe(() => {
          Swal.fire({
            position: 'top-end',
            backdrop: false,
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          })
          this.router.navigate(['config/engine/crackers']);
        });
      } else {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your Cracker is safe!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

  private initForm() {
    if (this.editMode) {
    this.gs.get(SERV.CRACKERS,this.editedCrackervIndex).subscribe((result)=>{
      this.crackerV = result;
      this.updateForm = new FormGroup({
        'binaryName': new FormControl(result['binaryName']),
        'version': new FormControl(result['version'], [Validators.required, Validators.minLength(1)]),
        'downloadUrl': new FormControl(result['downloadUrl'], [Validators.required, Validators.minLength(1)]),
      });
    });
   }
  }


}
