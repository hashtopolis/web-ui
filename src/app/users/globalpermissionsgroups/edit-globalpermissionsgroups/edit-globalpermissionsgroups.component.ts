import { faAlignJustify, faIdBadge, faComputer, faKey, faInfoCircle, faEye } from '@fortawesome/free-solid-svg-icons';
import { faLinux, faWindows, faApple } from '@fortawesome/free-brands-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from './../../../../environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { AccessPermissionGroupsService } from 'src/app/core/_services/access/accesspermissiongroups.service';

@Component({
  selector: 'app-edit-globalpermissionsgroups',
  templateUrl: './edit-globalpermissionsgroups.component.html'
})
export class EditGlobalpermissionsgroupsComponent implements OnInit {
  editMode = false;
  editedGPGIndex: number;
  editedGPG: any // Change to Model
  active= 1;

  isLoading = false;
  faEye=faEye;

  constructor(
    private gpg: AccessPermissionGroupsService,
    private route:ActivatedRoute,
    private router: Router
  ) { }

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  updateForm: FormGroup

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedGPGIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );

    this.updateForm = new FormGroup({
      'name': new FormControl(''),
      'permissions': new FormGroup({
      'viewHashlistAccess': new FormControl(''),
      'manageHashlistAccess': new FormControl(''),
      'createHashlistAccess': new FormControl(''),
      'createSuperhashlistAccess': new FormControl(''),
      'viewHashesAccess': new FormControl(''),
      'viewAgentsAccess': new FormControl(''),
      'manageAgentAccess': new FormControl(''),
      'createAgentAccess': new FormControl(''),
      'viewTaskAccess': new FormControl(''),
      'runTaskAccess': new FormControl(''),
      'createTaskAccess': new FormControl(''),
      'manageTaskAccess': new FormControl(''),
      'viewPretaskAccess': new FormControl(''),
      'createPretaskAccess': new FormControl(''),
      'managePretaskAccess': new FormControl(''),
      'viewSupertaskAccess': new FormControl(''),
      'createSupertaskAccess': new FormControl(''),
      'manageSupertaskAccess': new FormControl(''),
      'viewFileAccess': new FormControl(''),
      'manageFileAccess': new FormControl(''),
      'addFileAccess': new FormControl(''),
      'serverConfigAccess': new FormControl(''),
      'userConfigAccess': new FormControl(''),
      'manageAccessGroupAccess': new FormControl('')
      })
    });

  }

  onSubmit(){
    if (this.updateForm.valid) {

      this.isLoading = true;

      this.gpg.updateAccP(this.editedGPGIndex, this.updateForm.value).subscribe((hasht: any) => {
        const response = hasht;
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "Permission Updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset();
          this.router.navigate(['/users/global-permissions-groups']);
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "Permission not created, please try again!",
            icon: "warning",
            showConfirmButton: true
          });
        }
      );
    }
  }

  private initForm() {
    this.isLoading = true;
    let params = {'expand': 'user'};
    if (this.editMode) {
      this.gpg.getAccPGroup(this.editedGPGIndex, params).subscribe((res)=>{
      this.editedGPG = res;
      var result = res['permissions'];
      this.updateForm = new FormGroup({
        'name': new FormControl(res['name']),
        'permissions': new FormGroup({
        'viewHashlistAccess': new FormControl(result['viewHashlistAccess']),
        'manageHashlistAccess': new FormControl(result['manageHashlistAccess']),
        'createHashlistAccess': new FormControl(result['createHashlistAccess']),
        'createSuperhashlistAccess': new FormControl(result['createSuperhashlistAccess']),
        'viewHashesAccess': new FormControl(result['viewHashesAccess']),
        'viewAgentsAccess': new FormControl(result['viewAgentsAccess']),
        'manageAgentAccess': new FormControl(result['manageAgentAccess']),
        'createAgentAccess': new FormControl(result['createAgentAccess']),
        'viewTaskAccess': new FormControl(result['viewTaskAccess']),
        'runTaskAccess': new FormControl(result['runTaskAccess']),
        'createTaskAccess': new FormControl(result['createTaskAccess']),
        'manageTaskAccess': new FormControl(result['manageTaskAccess']),
        'viewPretaskAccess': new FormControl(result['viewPretaskAccess']),
        'createPretaskAccess': new FormControl(result['createPretaskAccess']),
        'managePretaskAccess': new FormControl(result['managePretaskAccess']),
        'viewSupertaskAccess': new FormControl(result['viewSupertaskAccess']),
        'createSupertaskAccess': new FormControl(result['createSupertaskAccess']),
        'manageSupertaskAccess': new FormControl(result['manageSupertaskAccess']),
        'viewFileAccess': new FormControl(result['viewFileAccess']),
        'manageFileAccess': new FormControl(result['manageFileAccess']),
        'addFileAccess': new FormControl(result['addFileAccess']),
        'serverConfigAccess': new FormControl(result['serverConfigAccess']),
        'userConfigAccess': new FormControl(result['userConfigAccess']),
        'manageAccessGroupAccess': new FormControl(result['manageAccessGroupAccess'])
        })
      });
      this.isLoading = false;
    });
   }
  }

}
