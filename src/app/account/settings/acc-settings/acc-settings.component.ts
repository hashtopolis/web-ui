import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { passwordMatchValidator } from 'src/app/core/_validators/password.validator';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../../core/_services/main.config';
import { uiDatePipe } from 'src/app/core/_pipes/date.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-acc-settings',
  templateUrl: './acc-settings.component.html',
  providers: [uiDatePipe]
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  static readonly PWD_MIN = 4;
  static readonly PWD_MAX = 12;

  pageTitle = 'Account Settings';
  pageSubtitlePassword = 'Password Update';

  /** Form group for main form. */
  form: FormGroup;
  passform: FormGroup;

  /** On form update show a spinner loading */
  isUpdatingLoading = false;
  isUpdatingPassLoading = false;

  strongPassword = false;
  subscriptions: Subscription[] = [];

  constructor(
    private titleService: AutoTitleService,
    private datePipe: uiDatePipe,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.titleService.set(['Account Settings']);
  }

  /**
   * Initializes the form, loads user settings, and sets up initial data.
   */
  ngOnInit(): void {
    this.createForm();
    this.loadUserSettings();
    this.updatePassForm();
  }

  /**
   * Unsubscribes from all active subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  /**
   * Creates and configures basic controls
   *
   * @param {string} name - Account type name.
   * @param {string} registeredSince - Account registration date.
   * @param {string} email - The user's email.
   */
  createForm(name = '', registeredSince = '', email = ''): void {
    this.form = new FormGroup({
      name: new FormControl({
        value: name,
        disabled: true
      }),
      registeredSince: new FormControl({
        value: registeredSince,
        disabled: true
      }),
      email: new FormControl(email, [Validators.required, Validators.email])
    });
  }

  /**
   * Creates and password update
   *
   */
  updatePassForm() {
    // this.passform = new FormGroup(
    //   {
    //     oldpassword: new FormControl(''),
    //     newpassword: new FormControl('', [
    //       Validators.required,
    //       Validators.minLength(AccountSettingsComponent.PWD_MIN),
    //       Validators.maxLength(AccountSettingsComponent.PWD_MAX)
    //     ]),
    //     confirmpass: new FormControl('', [
    //       Validators.required,
    //       Validators.minLength(AccountSettingsComponent.PWD_MIN),
    //       Validators.maxLength(AccountSettingsComponent.PWD_MAX)
    //     ])
    //   },
    //   passwordMatchValidator
    // );
    this.passform = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(AccountSettingsComponent.PWD_MIN),
        Validators.maxLength(AccountSettingsComponent.PWD_MAX)
      ])
    });
  }

  /**
   * Handles form basic form submission
   */
  onSubmit() {
    if (this.form.valid) {
      this.isUpdatingLoading = true;
      this.subscriptions.push(
        this.gs
          .update(SERV.USERS, this.gs.userId, this.form.value)
          .subscribe(() => {
            this.alert.okAlert('User saved!', '');
            this.isUpdatingLoading = false;
            this.router.navigate(['users/all-users']);
          })
      );
    }
  }

  /**
   * Handles password submission
   */
  onSubmitPass() {
    if (this.passform.valid) {
      this.isUpdatingPassLoading = true;
      const payload = {
        userId: this.gs.userId,
        password: this.passform.value['password']
      };
      console.log(payload);
      this.subscriptions.push(
        this.gs
          .chelper(SERV.HELPER, 'setUserPassword', payload)
          .subscribe(() => {
            this.alert.okAlert('User password updated!', '');
            this.isUpdatingPassLoading = false;
            this.router.navigate(['users/all-users']);
          })
      );
    }
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  onPasswordMatchChanged(event: boolean) {
    this.strongPassword = event;
  }

  /**
   * Loads user settings from the server and populates the form with initial data.
   */
  private loadUserSettings() {
    this.subscriptions.push(
      this.gs
        .get(SERV.USERS, this.gs.userId, { expand: 'globalPermissionGroup' })
        .subscribe((result) => {
          this.createForm(
            result.globalPermissionGroup['name'],
            this.datePipe.transform(result['registeredSince']),
            result['email']
          );
        })
    );
  }
}
