import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';
import { Filetype } from '../../core/_models/files';

@Component({
  selector: 'app-files-edit',
  templateUrl: './files-edit.component.html'
})
@PageTitle(['Edit File'])
export class FilesEditComponent implements OnInit {

  editMode = false;
  editedFileIndex: number;
  editedFile: any // Change to Model

  filterType: number
  whichView: string;

  // accessgroup: AccessGroup; //Use models when data structure is reliable
  updateForm: FormGroup;
  accessgroup: any[]
  allfiles: any[]
  filetype: any[]

  constructor(
    private route:ActivatedRoute,
    private gs: GlobalService,
    private router: Router
    ) { }

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedFileIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );

    this.updateForm = new FormGroup({
      'fileId': new FormControl({value: '', disabled: true}),
      'updateData': new FormGroup({
        'filename': new FormControl('', [Validators.required, Validators.minLength(1)]),
        'fileType': new FormControl(null),
        'accessGroupId': new FormControl(null),
        'isSecret': new FormControl(null),
      })
    });

    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'wordlist':
          this.whichView = 'wordlist-edit';
        break;

        case 'rules':
          this.whichView = 'rules-edit';
        break;

        case 'other':
          this.whichView = 'other-edit';
        break;

      }

      this.filetype = [{fileType: 0, fileName: 'Wordlist'},{fileType: 1, fileName: 'Rules'},{fileType: 2, fileName: 'Other'}];

      this.gs.getAll(SERV.ACCESS_GROUPS).subscribe((agroups: any) => {
        this.accessgroup = agroups.values;
      });

      this.gs.get(SERV.FILES,this.editedFileIndex).subscribe((files: any) => {
        this.allfiles = files;
      });

    });
  }

  onSubmit(): void{
    this.gs.update(SERV.FILES,this.editedFileIndex,this.updateForm.value['updateData']).subscribe(() => {
      Swal.fire({
        position: 'top-end',
        backdrop: false,
        icon: 'success',
        title: "Saved",
        showConfirmButton: false,
        timer: 1500
      })
      this.route.data.subscribe(data => {
        switch (data['kind']) {

          case 'wordlist-edit':
            this.whichView = 'wordlist';
          break;

          case 'rules-edit':
            this.whichView = 'rules';
          break;

          case 'other-edit':
            this.whichView = 'other';
          break;

        }
      this.router.navigate(['../files/'+this.whichView+'']);
      })
    },
    errorMessage => {
      // check error status code is 500, if so, do some action
      Swal.fire({
        position: 'top-end',
        backdrop: false,
        icon: "warning",
        title: "Oppss! Error",
        text: "File was not updated, please try again!",
        showConfirmButton: false,
        timer: 1500
      })
      this.ngOnInit();
    }
  );
  this.updateForm.reset(); // success, we reset form
}

private initForm() {
  if (this.editMode) {
  this.gs.get(SERV.FILES,this.editedFileIndex).subscribe((result)=>{
    this.updateForm = new FormGroup({
      'fileId': new FormControl({value: result['fileId'], disabled: true}),
      'updateData': new FormGroup({
        'filename': new FormControl(result['filename'], Validators.required),
        'fileType': new FormControl(result['fileType'], Validators.required),
        'accessGroupId': new FormControl(result['accessGroupId'], Validators.required),
        'isSecret': new FormControl(result['isSecret']),
      })
    });
  });
 }
}

}
