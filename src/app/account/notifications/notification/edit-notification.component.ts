import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { ACTIONARRAY, NOTIFARRAY } from '../../../core/_constants/notifications.config';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';


@Component({
  selector: 'app-edit-notification',
  templateUrl: './new-notification.component.html'
})
@PageTitle(['Edit Notification'])
export class EditNotificationComponent implements OnInit {

  editedIndex: number;
  editView = true;

  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService,
    private router: Router
  ) { }

  value: any;
  active = true;

  allowedActions = ACTIONARRAY;

  notifications = NOTIFARRAY;

  private maxResults = environment.config.prodApiMaxResults;

  form = new FormGroup({
    'action': new FormControl({ value: '', disabled: true }),
    'actionFilter': new FormControl({ value: '', disabled: true }),
    'notification': new FormControl({ value: '', disabled: true }),
    'receiver': new FormControl({ value: '', disabled: true }),
    'isActive': new FormControl(),
  });

  ngOnInit(): void {

    this.route.params
      .subscribe(
        (params: Params) => {
          this.editedIndex = +params['id'];
          this.initForm();
        }
      );

  }

  changeAction(action: string): void {
  }

  private initForm() {

    this.gs.get(SERV.NOTIFICATIONS, this.editedIndex).subscribe((result) => {
      this.form = new FormGroup({
        'action': new FormControl({ value: result['action'], disabled: true }),
        'actionFilter': new FormControl({ value: result['objectId'], disabled: true }),
        'notification': new FormControl({ value: result['notification'], disabled: true }),
        'receiver': new FormControl({ value: result['receiver'], disabled: true }),
        'isActive': new FormControl(result['isActive']),
      });
    });

  }

  onQueryp(val) { }

  onSubmit() {
    if (this.form.valid) {

      this.gs.update(SERV.NOTIFICATIONS, this.editedIndex, { 'isActive': this.form.value['isActive'] }).subscribe(() => {
        Swal.fire({
          position: 'top-end',
          backdrop: false,
          icon: 'success',
          title: "Saved",
          showConfirmButton: false,
          timer: 1500
        })
        this.ngOnInit();
        this.router.navigate(['/account/notifications']);
      }
      );
    }
  }

}


