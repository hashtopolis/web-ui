import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { CrackerService } from '../../../../core/_services/config/cracker.service';

@Component({
  selector: 'app-edit-crackers',
  templateUrl: './edit-crackers.component.html'
})
export class EditCrackersComponent implements OnInit {
  editMode = false;
  editedCrackervIndex: number;
  crackerV: any // Change to Model

  isLoading = false;
  faDownload=faDownload;

  constructor(
    private route:ActivatedRoute,
    private router: Router,
    private crackerService: CrackerService
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

      this.isLoading = true;

      this.crackerService.updateCrackerBinary(this.editedCrackervIndex,this.updateForm.value).subscribe((ck: any) => {
        const response = ck;
        console.log(response);
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "Agent updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset(); // success, we reset form
          this.router.navigate(['config/engine/crackers']);
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "Agent was not created, please try again!",
            icon: "warning",
            showConfirmButton: true
          });
        }
      );
    }
  }

  onDelete(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, it can not be recovered!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#4B5563',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.crackerService.deleteCrackerBinary(this.editedCrackervIndex).subscribe(() => {
          Swal.fire(
            "Voucher has been deleted!",
            {
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['config/engine/crackers']);
        });
      } else {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'No worries, your Version is safe!',
          'error'
        )
      }
    });
  }

  private initForm() {
    this.isLoading = true;
    if (this.editMode) {
    this.crackerService.getCrackerBinary(this.editedCrackervIndex).subscribe((result)=>{
      this.crackerV = result;
      this.updateForm = new FormGroup({
        'binaryName': new FormControl(result['binaryName']),
        'version': new FormControl(result['version'], [Validators.required, Validators.minLength(1)]),
        'downloadUrl': new FormControl(result['downloadUrl'], [Validators.required, Validators.minLength(1)]),
      });
      this.isLoading = false;
    });
   }
  }


}
