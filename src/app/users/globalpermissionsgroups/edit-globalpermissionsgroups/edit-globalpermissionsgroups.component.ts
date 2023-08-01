import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';

@Component({
  selector: 'app-edit-globalpermissionsgroups',
  templateUrl: './edit-globalpermissionsgroups.component.html'
})
@PageTitle(['Edit Global Permissions'])
export class EditGlobalpermissionsgroupsComponent implements OnInit {
  editMode = false;
  editedGPGIndex: number;
  editedGPG: any // Change to Model
  active= 1;

  faEye=faEye;

  constructor(
    private route:ActivatedRoute,
    private gs: GlobalService,
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

      this.gs.update(SERV.ACCESS_PERMISSIONS_GROUPS,this.editedGPGIndex, this.updateForm.value).subscribe(() => {
          Swal.fire({
            title: "Success",
            text: "Permission Updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset();
          this.router.navigate(['/users/global-permissions-groups']);
        }
      );
    }
  }

  private initForm() {
    const params = {'expand': 'user'};
    if (this.editMode) {
      this.gs.get(SERV.ACCESS_PERMISSIONS_GROUPS,this.editedGPGIndex, params).subscribe((res)=>{
      this.editedGPG = res;
      const result = res['permissions'];
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
    });
   }
  }

}
