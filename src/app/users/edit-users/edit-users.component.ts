import { faCalendar,faLock, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { environment } from 'src/environments/environment';
import { uiDatePipe } from 'src/app/core/_pipes/date.pipe';
import { SERV } from '../../core/_services/main.config';
import { User } from '../user.model';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  providers: [uiDatePipe]
})
@PageTitle(['Edit User'])
export class EditUsersComponent implements OnInit {

  editMode = false;
  editedUserIndex: number;
  strongPassword = false;
  editedUser: any // Change to Model

  faCalendar=faCalendar;
  faEnvelope=faEnvelope;
  faLock=faLock;
  faUser=faUser;

  user: any[];
  agp:any;

  allowEdit = false;

  constructor(
    private uiService: UIConfigService,
    private route:ActivatedRoute,
    private datePipe:uiDatePipe,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
    ) { }

  private maxResults = environment.config.prodApiMaxResults;

  updateForm = new FormGroup({
      'id': new FormControl({value: '', disabled: true}),
      'name': new FormControl({value: '', disabled: true}),
      'email': new FormControl({value: '', disabled: true}),
      'registered': new FormControl({value: '', disabled: true}),
      'lastLogin': new FormControl({value: '', disabled: true}),
      'globalPermissionGroup': new FormControl({value: '', disabled: true}),
      'updateData': new FormGroup({
        'globalPermissionGroupId': new FormControl(''),
        'isValid': new FormControl('')
      })
  });

  updatePassForm = new FormGroup({
    'password': new FormControl(),
  })

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedUserIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.allowEdit = params['allowEdit'] === '1' ? true : false;
        this.initForm();
      }
    );

    const id = +this.route.snapshot.params['id'];
    this.gs.get(SERV.USERS,id,{'expand':'accessGroups'}).subscribe((user: any) => {
      this.user = user;
    });

    const params = {'maxResults': this.maxResults};
    this.gs.getAll(SERV.ACCESS_PERMISSIONS_GROUPS,params).subscribe((agp: any) => {
      this.agp = agp.values;
    });

 }

  onDelete(){
    this.alert.deleteConfirmation('','Hashtypes').then((confirmed) => {
      if (confirmed) {
        // Deletion
        this.gs.delete(SERV.USERS, this.editedUserIndex).subscribe(() => {
          // Successful deletion
          this.alert.okAlert(`Deleted User`, '');
          this.router.navigate(['/users/all-users']);
        });
      } else {
        // Handle cancellation
        this.alert.okAlert(`User is safe!`,'');
      }
    });
  }

  onSubmit(){
    if (this.updateForm.valid) {

      this.onUpdatePass(this.updatePassForm.value);

      this.gs.update(SERV.USERS,this.editedUserIndex, this.updateForm.value.updateData).subscribe(() => {
          this.alert.okAlert('User saved!','');
          this.updateForm.reset(); // success, we reset form
          this.updatePassForm.reset();
          this.router.navigate(['users/all-users']);
        }
      );
    }
  }

  onUpdatePass(val: any){
    const setpass = String(val['password']).length;
    if(val['password']){
      const payload = {"password": val['password'], "userId": this.editedUserIndex};
      this.gs.chelper(SERV.HELPER,'setUserPassword', payload).subscribe();
    }
  }

  private initForm() {

    if (this.editMode) {
      this.gs.get(SERV.USERS,this.editedUserIndex).subscribe((result)=>{
      this.updateForm = new FormGroup({
        'id': new FormControl({value: result['id'], disabled: true}),
        'name': new FormControl({value: result['name'], disabled: true}),
        'email': new FormControl({value: result['email'], disabled: true}),
        'registered': new FormControl({value: this.datePipe.transform(result['registeredSince']), disabled: true}),
        'lastLogin': new FormControl({value: this.datePipe.transform(result['lastLoginDate']), disabled: true} ),
        'globalPermissionGroup': new FormControl({value: result['globalPermissionGroup'], disabled: true}) ,
        'updateData': new FormGroup({
          'globalPermissionGroupId': new FormControl(result['globalPermissionGroupId']),
          'isValid': new FormControl(result['isValid']),
        })
      });
    });
   }
  }

}
