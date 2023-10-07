import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ACTIONARRAY, NOTIFARRAY } from '../../../core/_constants/notifications.config';
import { GlobalService } from 'src/app/core/_services/main.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SERV } from '../../../core/_services/main.config';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Filter } from '../notifications.component';
import { Notification } from 'src/app/core/_models/notifications';


@Component({
  selector: 'app-edit-notification',
  templateUrl: './new-notification.component.html'
})
export class EditNotificationComponent implements OnInit, OnDestroy {

  static readonly SUBMITLABEL = 'Save Changes'
  static readonly SUBTITLE = 'Edit Notification'

  editedIndex: number;
  editView = true;
  subscriptions: Subscription[] = []
  filters: Filter[];
  active = true;
  allowedActions = ACTIONARRAY;
  notifications = NOTIFARRAY;
  oldValue: boolean
  subTitle = EditNotificationComponent.SUBTITLE
  submitLabel = EditNotificationComponent.SUBMITLABEL

  form = new FormGroup({
    'action': new FormControl({ value: '', disabled: true }),
    'actionFilter': new FormControl({ value: '', disabled: true }),
    'notification': new FormControl({ value: '', disabled: true }),
    'receiver': new FormControl({ value: '', disabled: true }),
    'isActive': new FormControl(),
  });

  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService,
    private titleService: AutoTitleService,
    private router: Router
  ) {
    titleService.set(['Edit Notification'])
  }

  /**
   * Subscribes to route parameters and initializes the form.
   */
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.editedIndex = +params['id'];
      this.createForm();
    });
  }

  /**
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  changeAction(_action: string): void { }


  /**
   * Checks whether the form is valid for submission.
   * 
   * @returns {boolean} True if there is a change in the 'isActive' value; otherwise, false.
   */
  formIsValid(): boolean {
    return Boolean(this.oldValue).valueOf() !== Boolean(this.form.value.isActive).valueOf();
  }

  /**
   * Private method to create the form for editing a notification.
   * Subscribes to a service to fetch notification data and populate the form.
   */
  private createForm(): void {
    this.subscriptions.push(this.gs.get(SERV.NOTIFICATIONS, this.editedIndex).subscribe((result: Notification) => {
      const isActive = result.isActive
      this.oldValue = isActive
      this.form = new FormGroup({
        'action': new FormControl({ value: result.action, disabled: true }),
        'actionFilter': new FormControl({ value: result.objectId + '', disabled: true }),
        'notification': new FormControl({ value: result.notification, disabled: true }),
        'receiver': new FormControl({ value: result.receiver, disabled: true }),
        'isActive': new FormControl(isActive),
      });
    }));
  }

  /**
   * Handles the form submission when the user saves changes to a notification.
   * Sends an update request to the server and navigates to the notifications page on success.
   */
  onSubmit(): void {
    if (this.form.valid) {
      this.subscriptions.push(this.gs.update(SERV.NOTIFICATIONS, this.editedIndex, { 'isActive': this.form.value['isActive'] }).subscribe(() => {
        Swal.fire({
          position: 'top-end',
          backdrop: false,
          icon: 'success',
          title: 'Saved',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/account/notifications']);
      }));
    }
  }
}