import { Subscription } from 'rxjs';
import { uiDatePipe } from 'src/app/core/_pipes/date.pipe';
import { GlobalService } from 'src/app/core/_services/main.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SERV } from '@services/main.config';

import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { JUser } from '@src/app/core/_models/user.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { passwordMatchValidator } from '@src/app/core/_validators/password.validator';

export interface UpdateUserPassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
@Component({
  selector: 'app-acc-settings',
  templateUrl: './acc-settings.component.html',
  providers: [uiDatePipe],
  standalone: false
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  static readonly PWD_MIN = 4;
  static readonly PWD_MAX = 12;

  pwdMin = AccountSettingsComponent.PWD_MIN;
  pwdMax = AccountSettingsComponent.PWD_MAX;

  pageTitle = 'Account Settings';
  pageSubtitlePassword = 'Password Update';

  /** Form group for main form. */
  form: FormGroup;
  changepasswordFormGroup: FormGroup;

  /** On form update show a spinner loading */
  isUpdatingLoading = false;
  isUpdatingPassLoading = false;

  /**
   * Toggles for showing/hiding password fields in the form.
   * These are used to toggle visibility of the old, new, and confirm new password fields.
   * Hides the password input by default.
   * @type {boolean}
   */
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmNewPassword: boolean = false;

  /**
   * Array to hold subscriptions for cleanup on component destruction.
   * This prevents memory leaks by unsubscribing from observables when the component is destroyed.
   */
  subscriptions: Subscription[] = [];

  /**
   * FormControl reference for easier access to form controls.
   * This is used to access form controls in the template without needing to reference the entire form group.
   */
  protected readonly FormControl = FormControl;

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
    this.createUpdatePassForm();
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
  createForm(name: string = '', registeredSince: string = '', email: string = ''): void {
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

  createUpdatePassForm() {
    this.changepasswordFormGroup = new FormGroup(
      {
        oldPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(AccountSettingsComponent.PWD_MIN),
          Validators.maxLength(AccountSettingsComponent.PWD_MAX)
        ]),
        confirmNewPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(AccountSettingsComponent.PWD_MIN),
          Validators.maxLength(AccountSettingsComponent.PWD_MAX)
        ])
      },
      { validators: passwordMatchValidator() }
    );
  }

  get oldPasswordValueFromForm() {
    return this.changepasswordFormGroup.get('oldPassword').value;
  }
  get newPasswordValueFromForm() {
    return this.changepasswordFormGroup.get('newPassword').value;
  }
  get confirmNewPasswordValueFromForm() {
    return this.changepasswordFormGroup.get('confirmNewPassword').value;
  }

  resetPasswordForm() {
    this.changepasswordFormGroup.reset();
    this.changepasswordFormGroup.markAsPristine();
    this.changepasswordFormGroup.markAsUntouched();
    this.changepasswordFormGroup.updateValueAndValidity();
  }
  /**
   * Handles form basic form submission
   */
  onSubmit() {
    if (this.form.valid) {
      this.isUpdatingLoading = true;
      this.subscriptions.push(
        this.gs.update(SERV.USERS, this.gs.userId, this.form.value).subscribe(() => {
          this.alert.showSuccessMessage('User saved');
          this.isUpdatingLoading = false;
          void this.router.navigate(['users/all-users']);
        })
      );
    }
  }

  /**
   * Handles password submission
   */
  onSubmitPass() {
    if (this.changepasswordFormGroup.invalid || this.changepasswordFormGroup.pending) {
      return;
    }
    this.isUpdatingPassLoading = true;
    const payload: UpdateUserPassword = {
      oldPassword: this.oldPasswordValueFromForm,
      newPassword: this.newPasswordValueFromForm,
      confirmPassword: this.confirmNewPasswordValueFromForm
    };
    this.subscriptions.push(
      this.gs.chelper(SERV.HELPER, 'changeOwnPassword', payload).subscribe({
        next: (val) => {
          this.alert.showSuccessMessage(val.meta['Change password']);
          this.resetPasswordForm();
          this.isUpdatingPassLoading = false;
        },
        error: () => {
          this.isUpdatingPassLoading = false;
        }
      })
    );
  }

  /**
   * Loads user settings from the server and populates the form with initial data.
   */
  private loadUserSettings() {
    const params = new RequestParamBuilder().create();
    this.subscriptions.push(
      this.gs.get(SERV.USERS, this.gs.userId, params).subscribe((response: ResponseWrapper) => {
        const user = new JsonAPISerializer().deserialize<JUser>({ data: response.data, included: response.included });
        this.createForm(user.name, this.datePipe.transform(user.registeredSince), user.email);
      })
    );
  }
}
