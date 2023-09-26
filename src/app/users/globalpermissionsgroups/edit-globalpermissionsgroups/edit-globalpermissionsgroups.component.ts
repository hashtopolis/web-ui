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
      'name': new FormControl(),
      'permissions': new FormGroup({
      'permAgentCreate': new FormControl(),
      'permAgentDelete': new FormControl(),
      'permAgentRead': new FormControl(),
      'permAgentUpdate': new FormControl(),
      'permAgentStatCreate': new FormControl(),
      'permAgentStatDelete': new FormControl(),
      'permAgentStatRead': new FormControl(),
      'permAgentStatUpdate': new FormControl(),
      'permRegVoucherCreate': new FormControl(),
      'permRegVoucherDelete': new FormControl(),
      'permRegVoucherRead': new FormControl(),
      'permRegVoucherUpdate': new FormControl(),
      'permTaskCreate': new FormControl(),
      'permTaskDelete': new FormControl(),
      'permTaskRead': new FormControl(),
      'permTaskUpdate': new FormControl(),
      'permPretaskCreate': new FormControl(),
      'permPretaskDelete': new FormControl(),
      'permPretaskRead': new FormControl(),
      'permPretaskUpdate': new FormControl(),
      'permSupertaskCreate': new FormControl(),
      'permSupertaskDelete': new FormControl(),
      'permSupertaskRead': new FormControl(),
      'permSupertaskUpdate': new FormControl(),
      'permChunkDelete': new FormControl(),
      'permChunkRead': new FormControl(),
      'permChunkUpdate': new FormControl(),
      'permHashlistCreate': new FormControl(),
      'permHashlistDelete': new FormControl(),
      'permHashlistRead': new FormControl(),
      'permHashlistUpdate': new FormControl(),
      'permHashlistHashlistCreate': new FormControl(),
      'permHashlistHashlistRead': new FormControl(),
      'permHashTypeCreate': new FormControl(),
      'permHashTypeDelete': new FormControl(),
      'permHashRead': new FormControl(),
      'permFileCreate': new FormControl(),
      'permFileDelete': new FormControl(),
      'permFileRead': new FormControl(),
      'permFileUpdate': new FormControl(),
      'permConfigCreate': new FormControl(),
      'permConfigDelete': new FormControl(),
      'permConfigRead': new FormControl(),
      'permConfigUpdate': new FormControl(),
      'permAgentBinaryCreate': new FormControl(),
      'permAgentBinaryDelete': new FormControl(),
      'permAgentBinaryRead': new FormControl(),
      'permAgentBinaryUpdate': new FormControl(),
      'permCrackerBinaryCreate': new FormControl(),
      'permCrackerBinaryDelete': new FormControl(),
      'permCrackerBinaryRead': new FormControl(),
      'permCrackerBinaryUpdate': new FormControl(),
      'permCrackerBinaryTypeCreate': new FormControl(),
      'permCrackerBinaryTypeDelete': new FormControl(),
      'permCrackerBinaryTypeRead': new FormControl(),
      'permCrackerBinaryTypeUpdate': new FormControl(),
      'permPreprocessorCreate': new FormControl(),
      'permPreprocessorDelete': new FormControl(),
      'permPreprocessorRead': new FormControl(),
      'permPreprocessorUpdate': new FormControl(),
      'permHealthCheckCreate': new FormControl(),
      'permHealthCheckDelete': new FormControl(),
      'permHealthCheckRead': new FormControl(),
      'permHealthCheckUpdate': new FormControl(),
      'permUserCreate': new FormControl(),
      'permUserDelete': new FormControl(),
      'permUserRead': new FormControl(),
      'permUserUpdate': new FormControl(),
      'permNotificationSettingCreate': new FormControl(),
      'permNotificationSettingDelete': new FormControl(),
      'permNotificationSettingRead': new FormControl(),
      'permNotificationSettingUpdate': new FormControl(),
      'permRightGroupCreate': new FormControl(),
      'permRightGroupDelete': new FormControl(),
      'permRightGroupRead': new FormControl(),
      'permRightGroupUpdate': new FormControl(),
      'permAccessGroupCreate': new FormControl(),
      'permAccessGroupDelete': new FormControl(),
      'permAccessGroupRead': new FormControl(),
      'permAccessGroupUpdate': new FormControl(),
      })
    });

  }

  onSubmit(){
    if (this.updateForm.valid) {
      this.gs.update(SERV.ACCESS_PERMISSIONS_GROUPS,this.editedGPGIndex, this.updateForm.value).subscribe(() => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Success",
            text: "Permission Updated!",
            showConfirmButton: false,
            timer: 1500
          })
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
        'permAgentCreate': new FormControl(result['permAgentCreate']),
        'permAgentDelete': new FormControl(result['permAgentDelete']),
        'permAgentRead': new FormControl(result['permAgentRead']),
        'permAgentUpdate': new FormControl(result['permAgentUpdate']),
        'permAgentStatCreate': new FormControl(result['permAgentStatCreate']),
        'permAgentStatDelete': new FormControl(result['permAgentStatDelete']),
        'permAgentStatRead': new FormControl(result['permAgentStatRead']),
        'permAgentStatUpdate': new FormControl(result['permAgentStatUpdate']),
        'permRegVoucherCreate': new FormControl(result['permRegVoucherCreate']),
        'permRegVoucherDelete': new FormControl(result['permRegVoucherDelete']),
        'permRegVoucherRead': new FormControl(result['permRegVoucherRead']),
        'permRegVoucherUpdate': new FormControl(result['permRegVoucherUpdate']),
        'permTaskCreate': new FormControl(result['permTaskCreate']),
        'permTaskDelete': new FormControl(result['permTaskDelete']),
        'permTaskRead': new FormControl(result['permTaskRead']),
        'permTaskUpdate': new FormControl(result['permTaskUpdate']),
        'permPretaskCreate': new FormControl(result['permPretaskCreate']),
        'permPretaskDelete': new FormControl(result['permPretaskDelete']),
        'permPretaskRead': new FormControl(result['permPretaskRead']),
        'permPretaskUpdate': new FormControl(result['permPretaskUpdate']),
        'permSupertaskCreate': new FormControl(result['permSupertaskCreate']),
        'permSupertaskDelete': new FormControl(result['permSupertaskDelete']),
        'permSupertaskRead': new FormControl(result['permSupertaskRead']),
        'permSupertaskUpdate': new FormControl(result['permSupertaskUpdate']),
        'permChunkDelete': new FormControl(result['permChunkDelete']),
        'permChunkRead': new FormControl(result['permChunkRead']),
        'permChunkUpdate': new FormControl(result['permChunkUpdate']),
        'permHashlistCreate': new FormControl(result['permHashlistCreate']),
        'permHashlistDelete': new FormControl(result['permHashlistDelete']),
        'permHashlistRead': new FormControl(result['permHashlistRead']),
        'permHashlistUpdate': new FormControl(result['permHashlistUpdate']),
        'permHashlistHashlistCreate': new FormControl(result['permHashlistHashlistCreate']),
        'permHashlistHashlistRead': new FormControl(result['permHashlistHashlistRead']),
        'permHashTypeCreate': new FormControl(result['permHashTypeCreate']),
        'permHashTypeDelete': new FormControl(result['permHashTypeDelete']),
        'permHashRead': new FormControl(result['permHashRead']),
        'permFileCreate': new FormControl(result['permFileCreate']),
        'permFileDelete': new FormControl(result['permFileDelete']),
        'permFileRead': new FormControl(result['permFileRead']),
        'permFileUpdate': new FormControl(result['permFileUpdate']),
        'permConfigCreate': new FormControl(result['permConfigCreate']),
        'permConfigDelete': new FormControl(result['permConfigDelete']),
        'permConfigRead': new FormControl(result['permConfigRead']),
        'permConfigUpdate': new FormControl(result['permConfigUpdate']),
        'permAgentBinaryCreate': new FormControl(result['permAgentBinaryCreate']),
        'permAgentBinaryDelete': new FormControl(result['permAgentBinaryDelete']),
        'permAgentBinaryRead': new FormControl(result['permAgentBinaryRead']),
        'permAgentBinaryUpdate': new FormControl(result['permAgentBinaryUpdate']),
        'permCrackerBinaryCreate': new FormControl(result['permCrackerBinaryCreate']),
        'permCrackerBinaryDelete': new FormControl(result['permCrackerBinaryDelete']),
        'permCrackerBinaryRead': new FormControl(result['permCrackerBinaryRead']),
        'permCrackerBinaryUpdate': new FormControl(result['permCrackerBinaryUpdate']),
        'permCrackerBinaryTypeCreate': new FormControl(result['permCrackerBinaryTypeCreate']),
        'permCrackerBinaryTypeDelete': new FormControl(result['permCrackerBinaryTypeDelete']),
        'permCrackerBinaryTypeRead': new FormControl(result['permCrackerBinaryTypeRead']),
        'permCrackerBinaryTypeUpdate': new FormControl(result['permCrackerBinaryTypeUpdate']),
        'permPreprocessorCreate': new FormControl(result['permPreprocessorCreate']),
        'permPreprocessorDelete': new FormControl(result['permPreprocessorDelete']),
        'permPreprocessorRead': new FormControl(result['permPreprocessorRead']),
        'permPreprocessorUpdate': new FormControl(result['permPreprocessorUpdate']),
        'permHealthCheckCreate': new FormControl(result['permHealthCheckCreate']),
        'permHealthCheckDelete': new FormControl(result['permHealthCheckDelete']),
        'permHealthCheckRead': new FormControl(result['permHealthCheckRead']),
        'permHealthCheckUpdate': new FormControl(result['permHealthCheckUpdate']),
        'permUserCreate': new FormControl(result['permUserCreate']),
        'permUserDelete': new FormControl(result['permUserDelete']),
        'permUserRead': new FormControl(result['permUserRead']),
        'permUserUpdate': new FormControl(result['permUserUpdate']),
        'permNotificationSettingCreate': new FormControl(result['permNotificationSettingCreate']),
        'permNotificationSettingDelete': new FormControl(result['permNotificationSettingDelete']),
        'permNotificationSettingRead': new FormControl(result['permNotificationSettingRead']),
        'permNotificationSettingUpdate': new FormControl(result['permNotificationSettingUpdate']),
        'permRightGroupCreate': new FormControl(result['permRightGroupCreate']),
        'permRightGroupDelete': new FormControl(result['permRightGroupDelete']),
        'permRightGroupRead': new FormControl(result['permRightGroupRead']),
        'permRightGroupUpdate': new FormControl(result['permRightGroupUpdate']),
        'permAccessGroupCreate': new FormControl(result['permAccessGroupCreate']),
        'permAccessGroupDelete': new FormControl(result['permAccessGroupDelete']),
        'permAccessGroupRead': new FormControl(result['permAccessGroupRead']),
        'permAccessGroupUpdate': new FormControl(result['permAccessGroupUpdate']),
        })
      });
    });
   }
  }

  selected = true;
  selectPerm(){
    this.updateForm.patchValue({
      'permissions': {
        'permAgentCreate': this.selected,
        'permAgentDelete': this.selected,
        'permAgentRead': this.selected,
        'permAgentUpdate': this.selected,
        'permAgentStatCreate': this.selected,
        'permAgentStatDelete': this.selected,
        'permAgentStatRead': this.selected,
        'permAgentStatUpdate': this.selected,
        'permRegVoucherCreate': this.selected,
        'permRegVoucherDelete': this.selected,
        'permRegVoucherRead': this.selected,
        'permRegVoucherUpdate': this.selected,
        'permTaskCreate': this.selected,
        'permTaskDelete': this.selected,
        'permTaskRead': this.selected,
        'permTaskUpdate': this.selected,
        'permPretaskCreate': this.selected,
        'permPretaskDelete': this.selected,
        'permPretaskRead': this.selected,
        'permPretaskUpdate': this.selected,
        'permSupertaskCreate': this.selected,
        'permSupertaskDelete': this.selected,
        'permSupertaskRead': this.selected,
        'permSupertaskUpdate': this.selected,
        'permChunkDelete': this.selected,
        'permChunkRead': this.selected,
        'permChunkUpdate': this.selected,
        'permHashlistCreate': this.selected,
        'permHashlistDelete': this.selected,
        'permHashlistRead': this.selected,
        'permHashlistUpdate': this.selected,
        'permHashlistHashlistCreate': this.selected,
        'permHashlistHashlistRead': this.selected,
        'permHashTypeCreate': this.selected,
        'permHashTypeDelete': this.selected,
        'permHashRead': this.selected,
        'permFileCreate': this.selected,
        'permFileDelete': this.selected,
        'permFileRead': this.selected,
        'permFileUpdate': this.selected,
        'permConfigCreate': this.selected,
        'permConfigDelete': this.selected,
        'permConfigRead': this.selected,
        'permConfigUpdate': this.selected,
        'permAgentBinaryCreate': this.selected,
        'permAgentBinaryDelete': this.selected,
        'permAgentBinaryRead': this.selected,
        'permAgentBinaryUpdate': this.selected,
        'permCrackerBinaryCreate': this.selected,
        'permCrackerBinaryDelete': this.selected,
        'permCrackerBinaryRead': this.selected,
        'permCrackerBinaryUpdate': this.selected,
        'permCrackerBinaryTypeCreate': this.selected,
        'permCrackerBinaryTypeDelete': this.selected,
        'permCrackerBinaryTypeRead': this.selected,
        'permCrackerBinaryTypeUpdate': this.selected,
        'permPreprocessorCreate': this.selected,
        'permPreprocessorDelete': this.selected,
        'permPreprocessorRead': this.selected,
        'permPreprocessorUpdate': this.selected,
        'permHealthCheckCreate': this.selected,
        'permHealthCheckDelete': this.selected,
        'permHealthCheckRead': this.selected,
        'permHealthCheckUpdate': this.selected,
        'permUserCreate': this.selected,
        'permUserDelete': this.selected,
        'permUserRead': this.selected,
        'permUserUpdate': this.selected,
        'permNotificationSettingCreate': this.selected,
        'permNotificationSettingDelete': this.selected,
        'permNotificationSettingRead': this.selected,
        'permNotificationSettingUpdate': this.selected,
        'permRightGroupCreate': this.selected,
        'permRightGroupDelete': this.selected,
        'permRightGroupRead': this.selected,
        'permRightGroupUpdate': this.selected,
        'permAccessGroupCreate': this.selected,
        'permAccessGroupDelete': this.selected,
        'permAccessGroupRead': this.selected,
        'permAccessGroupUpdate': this.selected,
      }
    });
    if(this.selected){this.selected = false;}else{this.selected = true;}
  }

}
