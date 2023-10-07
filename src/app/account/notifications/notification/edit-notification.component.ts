import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { ACTIONARRAY, NOTIFARRAY } from '../../../core/_constants/notifications.config';
import { GlobalService } from 'src/app/core/_services/main.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SERV } from '../../../core/_services/main.config';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';


@Component({
  selector: 'app-edit-notification',
  templateUrl: './new-notification.component.html'
})
export class EditNotificationComponent implements OnInit, OnDestroy {

  editedIndex: number;
  editView = true;
  subscriptions: Subscription[] = []
  value: any;
  active = true;
  allowedActions = ACTIONARRAY;
  notifications = NOTIFARRAY;
  submitLabel = 'Save Changes'
  subTitle = 'Edit Notification'
  oldValue: boolean

  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService,
    private titleService: AutoTitleService,
    private router: Router
  ) {
    titleService.set(['Edit Notification'])
  }

  form = new FormGroup({
    'action': new FormControl({ value: '', disabled: true }),
    'actionFilter': new FormControl({ value: '', disabled: true }),
    'notification': new FormControl({ value: '', disabled: true }),
    'receiver': new FormControl({ value: '', disabled: true }),
    'isActive': new FormControl(),
  });

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.editedIndex = +params['id'];
      this.createForm();
    });
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  changeAction(_action: string): void { }

  formIsValid(): boolean {
    const oldVal = !this.oldValue ? false : this.oldValue
    const newVal = !this.form.value.isActive ? false : this.form.value.isActive

    return oldVal !== newVal
  }

  private createForm() {
    this.subscriptions.push(this.gs.get(SERV.NOTIFICATIONS, this.editedIndex).subscribe((result) => {
      const isActive = result['isActive']
      this.oldValue = isActive
      this.form = new FormGroup({
        'action': new FormControl({ value: result['action'], disabled: true }),
        'actionFilter': new FormControl({ value: result['objectId'], disabled: true }),
        'notification': new FormControl({ value: result['notification'], disabled: true }),
        'receiver': new FormControl({ value: result['receiver'], disabled: true }),
        'isActive': new FormControl(isActive),
      });
    }));

  }

  onSubmit() {
    if (this.form.valid) {
      this.subscriptions.push(this.gs.update(SERV.NOTIFICATIONS, this.editedIndex, { 'isActive': this.form.value['isActive'] }).subscribe(() => {
        Swal.fire({
          position: 'top-end',
          backdrop: false,
          icon: 'success',
          title: "Saved",
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/account/notifications']);
      }));
    }
  }
}